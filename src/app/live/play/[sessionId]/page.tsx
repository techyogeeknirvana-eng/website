'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  Radio, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Flame, 
  Trophy, 
  Sparkles, 
  Send,
  HelpCircle,
  Play,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { LiveSession, LiveParticipant } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function ParticipantPlayPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<LiveSession | null>(null);
  const [participant, setParticipant] = useState<LiveParticipant | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [wordInput, setWordInput] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ isCorrect?: boolean; pointsEarned: number } | null>(null);
  const [lastSlideIndex, setLastSlideIndex] = useState<number>(-1);
  const [loadFailed, setLoadFailed] = useState(false);
  const [qaInput, setQaInput] = useState('');
  const [submittingQa, setSubmittingQa] = useState(false);
  const [upvotedQas, setUpvotedQas] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!session) setLoadFailed(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    // Retrieve participant profile from sessionStorage or create guest
    const stored = sessionStorage.getItem(`tygn_part_${sessionId}`);
    if (stored) {
      setParticipant(JSON.parse(stored));
    } else {
      const guestPart: LiveParticipant = {
        id: 'p_guest_' + Date.now(),
        nickname: 'Player_' + Math.floor(100 + Math.random() * 900),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        score: 0,
        streak: 0,
        joinedAt: new Date().toISOString()
      };
      setParticipant(guestPart);
      // Auto join
      dbStore.joinLiveSessionAsync(sessionId, guestPart.nickname, guestPart.avatar);
    }

    // Polling loop to sync with host (cross-browser / cross-device)
    const sync = async () => {
      const sess = await dbStore.getLiveSessionByCodeAsync(sessionId);
      if (sess) {
        setSession({ ...sess });
        setLoadFailed(false);

        // Reset state on slide transition
        if (sess.currentSlideIndex !== lastSlideIndex) {
          setLastSlideIndex(sess.currentSlideIndex);
          setSelectedOption(null);
          setHasSubmitted(false);
          setSubmissionResult(null);
          setWordInput('');
        }
      }
    };

    sync();
    const interval = setInterval(sync, 1200);
    return () => clearInterval(interval);
  }, [sessionId, lastSlideIndex]);

  const handleSubmitAnswer = (optionIdx?: number, customText?: string) => {
    if (!session || !participant || hasSubmitted) return;

    soundEffects.playClick();
    if (optionIdx !== undefined) setSelectedOption(optionIdx);
    setHasSubmitted(true);

    const result = dbStore.submitLiveAnswer(
      session.code,
      participant.id,
      optionIdx,
      customText || wordInput,
      4
    );

    setSubmissionResult(result);

    if (result.isCorrect) {
      soundEffects.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleQaSubmit = () => {
    if (!qaInput.trim() || !session || !participant) return;
    soundEffects.playClick();
    setSubmittingQa(true);
    dbStore.submitLiveQAQuestion(session.code, participant.id, participant.nickname, qaInput.trim(), participant.avatar);
    setQaInput('');
    setSubmittingQa(false);
    const updated = dbStore.getLiveSessionByCode(session.code);
    if (updated) setSession({ ...updated });
  };

  const handleUpvoteQa = (questionId: string) => {
    if (upvotedQas.includes(questionId) || !session || !participant) return;
    soundEffects.playClick();
    dbStore.upvoteLiveQAQuestion(session.code, questionId, participant.id);
    setUpvotedQas(prev => [...prev, questionId]);
    const updated = dbStore.getLiveSessionByCode(session.code);
    if (updated) setSession({ ...updated });
  };

  if (!session) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="glass-card glow-border" style={{ padding: '36px', maxWidth: '420px', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
          <Radio size={40} className="animate-pulse" color="var(--accent-cyan)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
            {loadFailed ? 'Session Connecting...' : `Connecting to PIN ${sessionId}...`}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
            {loadFailed
              ? 'Could not connect to this room yet. You can launch it now or return to the Live Lobby.'
              : 'Connecting with live room cluster...'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={async () => {
                const quizzes = dbStore.getQuizzes();
                const auto = await dbStore.createLiveSessionAsync(quizzes[0], undefined, sessionId);
                dbStore.updateSessionStatus(auto.code, 'active_question', 0);
                setSession({ ...auto, status: 'active_question' });
                setLoadFailed(false);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
            >
              <Play size={15} /> Start Interactive Deck
            </button>
            <button
              onClick={() => router.push('/live')}
              className="btn btn-ghost"
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
            >
              Return to Live Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSlide = session.quiz.questions[session.currentSlideIndex] || session.quiz.questions[0];

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.12) 0%, #06080e 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Participant Top Status Bar */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{participant?.nickname}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {participant && participant.streak > 1 && (
            <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
              <Flame size={13} /> {participant.streak} STREAK
            </span>
          )}
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {participant?.score || 0} pts
          </span>
        </div>
      </div>

      {/* Main Game Screen */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        {session.status === 'lobby' ? (
          /* Lobby Waiting State */
          <div
            className="glass-card glow-border"
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '2px solid var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <Clock size={32} style={{ color: 'var(--accent-indigo)' }} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>You&apos;re in!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              See your name on the presenter&apos;s screen? The host will start shortly.
            </p>

            <div className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '6px 16px', marginBottom: '16px' }}>
              SESSION PIN: {session.code}
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  dbStore.updateSessionStatus(session.code, 'active_question', 0);
                  setSession({ ...session, status: 'active_question', currentSlideIndex: 0 });
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
              >
                <Play size={16} /> Start Quiz Now
              </button>
            </div>
          </div>
        ) : session.status === 'active_question' ? (
          /* Active Question Pad */
          <div>
            <div
              className="glass-card"
              style={{
                padding: '24px',
                textAlign: 'center',
                marginBottom: '20px',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <span className="badge badge-indigo" style={{ marginBottom: '8px', fontSize: '0.72rem' }}>
                QUESTION {session.currentSlideIndex + 1} OF {session.quiz.questions.length}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.35 }}>
                {currentSlide.question}
              </h3>
            </div>

            {hasSubmitted ? (
              <div
                className="glass-card"
                style={{
                  padding: '40px 24px',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                  }}
                >
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
                  Response Locked In!
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Your answer has been registered in the live room.
                </p>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    const nextIdx = session.currentSlideIndex + 1;
                    if (nextIdx < session.quiz.questions.length) {
                      dbStore.updateSessionStatus(session.code, 'active_question', nextIdx);
                      setLastSlideIndex(nextIdx);
                      setSelectedOption(null);
                      setHasSubmitted(false);
                      setSubmissionResult(null);
                      setWordInput('');
                      setSession({ ...session, currentSlideIndex: nextIdx, status: 'active_question' });
                    } else {
                      dbStore.updateSessionStatus(session.code, 'leaderboard');
                      setSession({ ...session, status: 'leaderboard' });
                    }
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
                >
                  {session.currentSlideIndex + 1 < session.quiz.questions.length ? 'Next Question ➔' : 'View Final Leaderboard 🏆'}
                </button>
              </div>
            ) : currentSlide.type === 'word_cloud' ? (
              /* Word Cloud Input */
              <div className="glass-card" style={{ padding: '30px 24px', textAlign: 'center' }}>
                <input
                  type="text"
                  placeholder="Type your word here..."
                  value={wordInput}
                  onChange={e => setWordInput(e.target.value)}
                  className="input-custom"
                  style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '16px' }}
                />
                <button
                  onClick={() => handleSubmitAnswer(undefined, wordInput)}
                  disabled={!wordInput.trim()}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  Submit Word <Send size={16} />
                </button>
              </div>
            ) : currentSlide.type === 'qa' ? (
              /* Q&A Interactive Screen */
              <div>
                <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Ask Presenter a Question</span>
                  </h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={qaInput}
                      onChange={e => setQaInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && qaInput.trim()) {
                          handleQaSubmit();
                        }
                      }}
                      className="input-custom"
                      style={{ flex: 1, fontSize: '0.9rem' }}
                    />
                    <button
                      onClick={handleQaSubmit}
                      disabled={!qaInput.trim() || submittingQa}
                      className="btn btn-primary"
                      style={{ padding: '10px 16px', fontSize: '0.88rem' }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', padding: '0 4px' }}>
                    Audience Questions ({(session.qaQuestions || []).length}) • Tap to Upvote
                  </div>
                  {(!session.qaQuestions || session.qaQuestions.length === 0) ? (
                    <div className="glass-card" style={{ padding: '28px 16px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No questions yet. Be the first to ask!
                      </p>
                    </div>
                  ) : (
                    [...session.qaQuestions]
                      .sort((a, b) => b.upvotes - a.upvotes)
                      .map(q => {
                        const hasUpvoted = upvotedQas.includes(q.id);
                        return (
                          <div
                            key={q.id}
                            className="glass-card"
                            style={{
                              padding: '14px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              borderLeft: q.isAnswered ? '4px solid #10b981' : '4px solid var(--accent-cyan)',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{q.authorName || q.participantName}</span>
                                {q.isAnswered && (
                                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                                    Answered
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                                {q.question}
                              </div>
                            </div>

                            <button
                              onClick={() => handleUpvoteQa(q.id)}
                              disabled={hasUpvoted}
                              className={hasUpvoted ? 'btn btn-secondary text-xs' : 'btn btn-primary text-xs'}
                              style={{
                                padding: '6px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                opacity: hasUpvoted ? 0.6 : 1,
                              }}
                            >
                              <ThumbsUp size={13} />
                              <span>{q.upvotes}</span>
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            ) : (
              /* High-Contrast Interactive Option Pads */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {currentSlide.options.map((opt, optIdx) => {
                  const colors = [
                    { bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4', text: '#22d3ee' },
                    { bg: 'rgba(99, 102, 241, 0.15)', border: '#6366f1', text: '#a5b4fc' },
                    { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fcd34d' },
                    { bg: 'rgba(244, 63, 94, 0.15)', border: '#f43f5e', text: '#fda4af' },
                  ];
                  const c = colors[optIdx % colors.length];

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSubmitAnswer(optIdx)}
                      style={{
                        padding: '24px 18px',
                        borderRadius: 'var(--radius-lg)',
                        background: c.bg,
                        border: `2px solid ${c.border}`,
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: c.text,
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : session.status === 'show_result' ? (
          /* Result Feedback Screen */
          <div
            className="glass-card glow-border"
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            {submissionResult?.isCorrect ? (
              <div>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 14px auto' }} />
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                  CORRECT!
                </h2>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px' }}>
                  +{submissionResult.pointsEarned} Points
                </div>
              </div>
            ) : submissionResult?.isCorrect === false ? (
              <div>
                <XCircle size={54} color="#f43f5e" style={{ margin: '0 auto 14px auto' }} />
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)', marginBottom: '8px' }}>
                  INCORRECT
                </h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Keep going! Next question starts soon.
                </div>
              </div>
            ) : (
              <div>
                <Sparkles size={48} style={{ color: 'var(--accent-cyan)', margin: '0 auto 14px auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                  Response Recorded!
                </h3>
              </div>
            )}

            {currentSlide.explanation && (
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  textAlign: 'left',
                  marginTop: '16px',
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Explanation:</strong> {currentSlide.explanation}
              </div>
            )}
          </div>
        ) : session.status === 'leaderboard' ? (
          /* Leaderboard Check-in */
          <div
            className="glass-card"
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <Trophy size={48} style={{ color: 'var(--accent-amber)', margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
              Check the Big Screen!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              The leaderboard is currently displayed on the presenter screen.
            </p>
          </div>
        ) : (
          /* Session Finished */
          <div
            className="glass-card"
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <Sparkles size={48} style={{ color: 'var(--accent-indigo)', margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '8px' }}>
              Game Over!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Great performance! You earned XP points toward your community rank.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-primary"
              style={{ padding: '12px 28px' }}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Session Paused Overlay */}
      {session.isPaused && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div className="glass-card glow-border" style={{ padding: '36px', maxWidth: '420px', width: '100%' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '2px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <span style={{ fontSize: '24px' }}>⏸️</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Session Paused</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              The presenter has temporarily paused the session. It will resume automatically in a moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
