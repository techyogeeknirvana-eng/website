import { NextRequest } from 'next/server';
import { db } from '@/lib/server/db/client';
import { apiSuccess, apiError } from '@/lib/server/utils/response';
import { LiveSession, LiveParticipant, LiveResponse } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim();

    if (!code) {
      return apiError('Session PIN code is required', 400);
    }

    const row = await db.queryOne('SELECT session_data FROM live_sessions WHERE code = ?', [code]);

    if (!row || !row.session_data) {
      return apiError('Session not found. Please verify the 6-digit PIN.', 404);
    }

    const session: LiveSession = typeof row.session_data === 'object' ? row.session_data : JSON.parse(row.session_data);
    return apiSuccess(session);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch live session', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, session, code, participant, selectedOption, textResponse, timeTaken = 5, status, nextSlideIndex } = body;
    const now = new Date().toISOString();

    // 1. Create or Full Sync
    if (action === 'create' || action === 'sync') {
      if (!session || !session.code) {
        return apiError('Valid session object with code is required', 400);
      }

      const sessionCode = session.code.trim();
      let validQuizId: string | null = null;
      if (session.quiz?.id) {
        const quizExists = await db.queryOne('SELECT id FROM quizzes WHERE id = ?', [session.quiz.id]);
        if (quizExists) validQuizId = session.quiz.id;
      }

      let validHostId: string | null = null;
      if (session.hostId) {
        const userExists = await db.queryOne('SELECT id FROM users WHERE id = ?', [session.hostId]);
        if (userExists) validHostId = session.hostId;
      }
      const existing = await db.queryOne('SELECT id FROM live_sessions WHERE code = ?', [sessionCode]);

      if (existing) {
        await db.execute(`
          UPDATE live_sessions 
          SET status = ?, current_slide_index = ?, session_data = ?, quiz_id = ?, host_id = ?
          WHERE code = ?
        `, [
          session.status || 'lobby',
          session.currentSlideIndex || 0,
          JSON.stringify(session),
          validQuizId,
          validHostId,
          sessionCode
        ]);
      } else {
        await db.execute(`
          INSERT INTO live_sessions (id, code, quiz_id, host_id, status, current_slide_index, session_data, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          session.id || 'session_' + Date.now(),
          sessionCode,
          validQuizId,
          validHostId,
          session.status || 'lobby',
          session.currentSlideIndex || 0,
          JSON.stringify(session),
          session.createdAt || now
        ]);
      }

      return apiSuccess({ success: true, session });
    }

    // 2. Join Session
    if (action === 'join') {
      if (!code || !participant || !participant.nickname) {
        return apiError('Code and participant nickname are required', 400);
      }

      const cleanCode = code.trim();
      const row = await db.queryOne('SELECT session_data FROM live_sessions WHERE code = ?', [cleanCode]);

      if (!row || !row.session_data) {
        return apiError('Invalid session code. Please verify the 6-digit PIN.', 404);
      }

      const sess: LiveSession = typeof row.session_data === 'object' ? row.session_data : JSON.parse(row.session_data);
      if (sess.status === 'ended') {
        return apiError('This live session has already concluded.', 400);
      }

      // Check if participant already joined
      const existingPartIndex = sess.participants.findIndex(
        p => p.id === participant.id || p.nickname.toLowerCase() === participant.nickname.toLowerCase().trim()
      );

      let savedParticipant: LiveParticipant;
      if (existingPartIndex >= 0) {
        savedParticipant = sess.participants[existingPartIndex];
      } else {
        savedParticipant = {
          id: participant.id || 'part_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          nickname: participant.nickname.trim(),
          avatar: participant.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(participant.nickname)}`,
          score: 0,
          streak: 0,
          joinedAt: now
        };
        sess.participants.push(savedParticipant);
      }

      await db.execute(`
        UPDATE live_sessions 
        SET session_data = ? 
        WHERE code = ?
      `, [JSON.stringify(sess), cleanCode]);

      return apiSuccess({ success: true, participant: savedParticipant, session: sess });
    }

    // 3. Submit Answer
    if (action === 'answer') {
      if (!code || !participant?.id) {
        return apiError('Code and participantId are required', 400);
      }

      const cleanCode = code.trim();
      const row = await db.queryOne('SELECT session_data FROM live_sessions WHERE code = ?', [cleanCode]);
      if (!row || !row.session_data) return apiError('Session not found', 404);

      const sess: LiveSession = typeof row.session_data === 'object' ? row.session_data : JSON.parse(row.session_data);
      const currentSlide = sess.quiz?.questions?.[sess.currentSlideIndex];
      if (!currentSlide) return apiError('Slide not found', 400);

      const part = sess.participants.find(p => p.id === participant.id);
      if (!part) return apiError('Participant not in session', 404);

      let isCorrect = false;
      let pointsEarned = 0;

      if (currentSlide.type === 'quiz' && currentSlide.correctAnswer !== undefined) {
        isCorrect = selectedOption === currentSlide.correctAnswer;
        if (isCorrect) {
          const timeFraction = Math.max(0.2, (currentSlide.timeLimitSeconds - timeTaken) / currentSlide.timeLimitSeconds);
          const streakBonus = Math.min(500, part.streak * 100);
          pointsEarned = Math.round(currentSlide.points * timeFraction + streakBonus);
          part.streak += 1;
          part.score += pointsEarned;
        } else {
          part.streak = 0;
        }
      } else {
        pointsEarned = 250;
        part.score += pointsEarned;
      }

      const resp: LiveResponse = {
        participantId: part.id,
        participantNickname: part.nickname,
        questionId: currentSlide.id,
        slideIndex: sess.currentSlideIndex,
        selectedOption,
        textResponse,
        timeTaken,
        isCorrect,
        pointsEarned
      };

      sess.responses.push(resp);

      await db.execute(`
        UPDATE live_sessions 
        SET session_data = ? 
        WHERE code = ?
      `, [JSON.stringify(sess), cleanCode]);

      return apiSuccess({ success: true, isCorrect, pointsEarned, session: sess });
    }

    // 4. Update Status or Slide
    if (action === 'status') {
      if (!code || !status) {
        return apiError('Code and status are required', 400);
      }

      const cleanCode = code.trim();
      const row = await db.queryOne('SELECT session_data FROM live_sessions WHERE code = ?', [cleanCode]);
      if (!row || !row.session_data) return apiError('Session not found', 404);

      const sess: LiveSession = typeof row.session_data === 'object' ? row.session_data : JSON.parse(row.session_data);
      sess.status = status;
      if (nextSlideIndex !== undefined) {
        sess.currentSlideIndex = nextSlideIndex;
      }
      if (status === 'ended') {
        sess.endedAt = now;
      }

      await db.execute(`
        UPDATE live_sessions 
        SET status = ?, current_slide_index = ?, session_data = ?, ended_at = ?
        WHERE code = ?
      `, [
        status,
        sess.currentSlideIndex,
        JSON.stringify(sess),
        sess.endedAt || null,
        cleanCode
      ]);

      return apiSuccess({ success: true, session: sess });
    }

    return apiError('Invalid action', 400);
  } catch (err: any) {
    return apiError(err.message || 'Live session operation failed', 500);
  }
}
