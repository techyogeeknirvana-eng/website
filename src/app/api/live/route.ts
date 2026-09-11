import { NextRequest } from 'next/server';
import { db, ensureDbReady } from '@/lib/server/db/client';
import { apiSuccess, apiError } from '@/lib/server/utils/response';
import { LiveSession, LiveParticipant, LiveResponse } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await ensureDbReady();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim();

    // If no code provided or list requested, return active sessions
    if (!code || searchParams.get('list') === 'active') {
      try {
        const rows = await db.queryAll(
          "SELECT session_data FROM live_sessions WHERE status != 'ended' ORDER BY created_at DESC LIMIT 10"
        );
        const sessions: LiveSession[] = rows.map(r =>
          typeof r.session_data === 'object' ? r.session_data : JSON.parse(r.session_data)
        );
        return apiSuccess(sessions);
      } catch {
        return apiSuccess([]);
      }
    }

    const cleanCode = code.replace(/\s+/g, '');
    let row = await db.queryOne('SELECT session_data FROM live_sessions WHERE code = ?', [cleanCode]);

    // Auto-provision standard/demo session if requested PIN is a valid 6-digit PIN
    if ((!row || !row.session_data) && /^\d{6}$/.test(cleanCode)) {
      try {
        const { SEED_QUIZZES } = await import('@/lib/db/seedData');
        const fallbackQuiz = cleanCode === '749201' ? (SEED_QUIZZES[1] || SEED_QUIZZES[0]) : SEED_QUIZZES[0];
        const now = new Date().toISOString();
        let validQuizId: string | null = null;
        try {
          const quizRow = await db.queryOne('SELECT id FROM quizzes WHERE id = ?', [fallbackQuiz.id]);
          if (quizRow) {
            validQuizId = fallbackQuiz.id;
          } else {
            await db.execute(`
              INSERT INTO quizzes (id, title, topic, difficulty, description, creator_id, creator_name, plays_count, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [fallbackQuiz.id, fallbackQuiz.title, fallbackQuiz.topic, fallbackQuiz.difficulty, fallbackQuiz.description, 'user_lead_admin', 'TechYOGeek Nirvana (Host)', 100, now]);
            validQuizId = fallbackQuiz.id;
          }
        } catch {
          validQuizId = null;
        }

        const autoSession: LiveSession = {
          id: 'sess_' + cleanCode,
          code: cleanCode,
          quiz: fallbackQuiz,
          hostId: 'user_lead_admin',
          hostName: 'TechYOGeek Nirvana (Host)',
          status: 'lobby',
          currentSlideIndex: 0,
          participants: [
            {
              id: 'p_host',
              nickname: 'TechYOGeek Nirvana (Host)',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              score: 0,
              streak: 0,
              joinedAt: now
            }
          ],
          responses: [],
          createdAt: now
        };

        await db.execute(`
          INSERT INTO live_sessions (id, code, quiz_id, host_id, status, current_slide_index, session_data, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          autoSession.id,
          cleanCode,
          validQuizId,
          null,
          'lobby',
          0,
          JSON.stringify(autoSession),
          now
        ]);

        row = { session_data: JSON.stringify(autoSession) };
      } catch (autoErr) {
        console.warn('Auto-provisioning in GET live session deferred:', autoErr);
      }
    }

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
    await ensureDbReady();
    const body = await req.json();
    const { action, session, code, participant, selectedOption, textResponse, timeTaken = 5, status, nextSlideIndex } = body;
    const now = new Date().toISOString();

    // 1. Create or Full Sync
    if (action === 'create' || action === 'sync') {
      if (!session || !session.code) {
        return apiError('Valid session object with code is required', 400);
      }

      const sessionCode = session.code.trim().replace(/\s+/g, '');
      let validQuizId: string | null = null;
      if (session.quiz?.id) {
        try {
          const quizExists = await db.queryOne('SELECT id FROM quizzes WHERE id = ?', [session.quiz.id]);
          if (quizExists) validQuizId = session.quiz.id;
        } catch (_) {}
      }

      let validHostId: string | null = null;
      if (session.hostId) {
        try {
          const userExists = await db.queryOne('SELECT id FROM users WHERE id = ?', [session.hostId]);
          if (userExists) validHostId = session.hostId;
        } catch (_) {}
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

      const cleanCode = code.trim().replace(/\s+/g, '');
      let row = await db.queryOne('SELECT session_data FROM live_sessions WHERE code = ?', [cleanCode]);

      // Auto-provision if session row is missing but PIN is 6 digits
      if ((!row || !row.session_data) && /^\d{6}$/.test(cleanCode)) {
        try {
          const { SEED_QUIZZES } = await import('@/lib/db/seedData');
          const fallbackQuiz = cleanCode === '749201' ? (SEED_QUIZZES[1] || SEED_QUIZZES[0]) : SEED_QUIZZES[0];
          const autoSess: LiveSession = {
            id: 'sess_' + cleanCode,
            code: cleanCode,
            quiz: fallbackQuiz,
            hostId: 'user_lead_admin',
            hostName: 'TechYOGeek Nirvana (Host)',
            status: 'lobby',
            currentSlideIndex: 0,
            participants: [
              {
                id: 'p_host',
                nickname: 'TechYOGeek Nirvana (Host)',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                score: 0,
                streak: 0,
                joinedAt: now
              }
            ],
            responses: [],
            createdAt: now
          };

          let validQuizId: string | null = null;
          try {
            const quizRow = await db.queryOne('SELECT id FROM quizzes WHERE id = ?', [fallbackQuiz.id]);
            if (quizRow) {
              validQuizId = fallbackQuiz.id;
            } else {
              await db.execute(`
                INSERT INTO quizzes (id, title, topic, difficulty, description, creator_id, creator_name, plays_count, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [fallbackQuiz.id, fallbackQuiz.title, fallbackQuiz.topic, fallbackQuiz.difficulty, fallbackQuiz.description, 'user_lead_admin', 'TechYOGeek Nirvana (Host)', 100, now]);
              validQuizId = fallbackQuiz.id;
            }
          } catch {
            validQuizId = null;
          }

          await db.execute(`
            INSERT INTO live_sessions (id, code, quiz_id, host_id, status, current_slide_index, session_data, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            autoSess.id,
            cleanCode,
            validQuizId,
            null,
            'lobby',
            0,
            JSON.stringify(autoSess),
            now
          ]);

          row = { session_data: JSON.stringify(autoSess) };
        } catch (provErr) {
          console.warn('Auto-provisioning in join failed:', provErr);
        }
      }

      if (!row || !row.session_data) {
        return apiError('Invalid session code. Please verify the 6-digit PIN.', 404);
      }

      const sess: LiveSession = typeof row.session_data === 'object' ? row.session_data : JSON.parse(row.session_data);
      
      // If a demo session ended, reset it back to lobby so audience can replay
      if (sess.status === 'ended' && (cleanCode === '447161' || cleanCode === '749201')) {
        sess.status = 'lobby';
        sess.currentSlideIndex = 0;
        sess.endedAt = undefined;
      } else if (sess.status === 'ended') {
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
        SET session_data = ?, status = ?
        WHERE code = ?
      `, [JSON.stringify(sess), sess.status, cleanCode]);

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
