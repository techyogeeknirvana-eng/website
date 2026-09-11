'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Radio, 
  Users, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  BarChart2, 
  Maximize2, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  QrCode,
  Share2
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { LiveSession } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function HostLiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<LiveSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    let activeCode = sessionId;

    // Load or create session
    async function init() {
      let sess = await dbStore.getLiveSessionByCodeAsync(sessionId);
      if (!sess) {
        // Create on the fly from default quiz if not found, preserving sessionId as PIN code
        const quizzes = dbStore.getQuizzes();
        const defaultUser = dbStore.getUsers()[0] || { id: 'u_host', name: 'Nirvana Host', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' };
        sess = await dbStore.createLiveSessionAsync(quizzes[0], defaultUser as any, sessionId);
      }
      activeCode = sess.code;
      setSession({ ...sess });
    }
    init();

    // Poll for updates every 1.5s (simulating cross-device/cross-browser real-time sync!)
    const interval = setInterval(async () => {
      const updated = await dbStore.getLiveSessionByCodeAsync(activeCode);
      if (updated) {
        setSession({ ...updated });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [sessionId]);

  // Countdown timer effect
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      t = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 4 && prev > 1) {
            soundEffects.playCountdownBeep();
          }
          if (prev <= 1) {
            soundEffects.playFanfare();
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [timerActive, timeLeft]);

  if (!session) {
    return (
      <div className="container-custom" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Loading Live Session...</h2>
      </div>
    );
  }

  const currentSlide = session.quiz.questions[session.currentSlideIndex] || session.quiz.questions[0];

  const handleStartSession = () => {
    soundEffects.playClick();
    dbStore.updateSessionStatus(session.code, 'active_question', 0);
    setTimeLeft(currentSlide.timeLimitSeconds);
    setTimerActive(true);
    setSession({ ...dbStore.getLiveSessionByCode(session.code)! });
  };

  const handleNextSlide = () => {
    soundEffects.playClick();
    const nextIdx = session.currentSlideIndex + 1;
    if (nextIdx < session.quiz.questions.length) {
      const nextSlide = session.quiz.questions[nextIdx];
      dbStore.updateSessionStatus(session.code, 'active_question', nextIdx);
      setTimeLeft(nextSlide.timeLimitSeconds);
      setTimerActive(true);
    } else {
      // Session Ended
      soundEffects.playFanfare();
      dbStore.updateSessionStatus(session.code, 'ended');
    }
    setSession({ ...dbStore.getLiveSessionByCode(session.code)! });
  };

  const handleShowLeaderboard = () => {
    soundEffects.playClick();
    dbStore.updateSessionStatus(session.code, 'leaderboard');
    setSession({ ...dbStore.getLiveSessionByCode(session.code)! });
  };

  const handleShowResult = () => {
    soundEffects.playClick();
    dbStore.updateSessionStatus(session.code, 'show_result');
    setSession({ ...dbStore.getLiveSessionByCode(session.code)! });
  };

  // Sort participants by score for leaderboard
  const sortedParticipants = [...session.participants].sort((a, b) => b.score - a.score);

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: '#05070c', display: 'flex', flexDirection: 'column' }}>
      {/* Host Control Bar */}
      <div
        className="glass-panel"
        style={{
          height: '64px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="badge badge-rose" style={{ fontWeight: 800, letterSpacing: '1px' }}>
            <Radio size={14} /> HOST MODE
          </span>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {session.quiz.title}
          </div>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Users size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>{session.participants.length} Joined</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* PIN Badge */}
          <div
            onClick={() => setQrModalOpen(true)}
            className="glass-card"
            style={{
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: '1px solid var(--accent-cyan)',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.25)',
            }}
          >
            <QrCode size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PIN:</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '2px', color: '#22d3ee', fontFamily: 'var(--font-mono)' }}>
              {session.code}
            </span>
          </div>

          <a
            href={`/live/play/${session.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px', textDecoration: 'none' }}
          >
            Open Player Tab ↗
          </a>
        </div>
      </div>

      {/* Presentation Stage Canvas */}
      <div
        style={{
          flex: 1,
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {session.status === 'lobby' ? (
          /* Lobby Screen */
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '750px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '6px 16px', marginBottom: '16px' }}>
              JOIN AT NIRVANA.LIVE
            </span>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em' }}>
              PIN CODE: <span className="text-gradient" style={{ letterSpacing: '4px', fontFamily: 'var(--font-mono)' }}>{session.code}</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '36px' }}>
              Tell participants to open <strong style={{ color: 'var(--text-primary)' }}>/live/join</strong> and enter code <strong style={{ color: 'var(--accent-cyan)' }}>{session.code}</strong>.
            </p>

            {/* Joined Participants Grid */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                marginBottom: '36px',
                minHeight: '140px',
              }}
            >
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Users size={16} /> Waiting for players ({session.participants.length} connected)...
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {session.participants.map(p => (
                  <div
                    key={p.id}
                    className="badge badge-indigo animate-pulse-glow"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <img src={p.avatar} alt={p.nickname} style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                    <span>{p.nickname}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartSession}
              className="btn btn-primary animate-pulse-glow"
              style={{ padding: '16px 40px', fontSize: '1.2rem', borderRadius: 'var(--radius-full)' }}
            >
              <Play size={20} /> Launch Slide 1
            </button>
          </div>
        ) : session.status === 'active_question' || session.status === 'show_result' ? (
          /* Question / Slide Active Screen */
          <div style={{ width: '100%', maxWidth: '960px' }}>
            {/* Timer & Slide Index */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className="badge badge-indigo" style={{ fontSize: '0.85rem' }}>
                SLIDE {session.currentSlideIndex + 1} OF {session.quiz.questions.length} • {currentSlide.type.toUpperCase().replace('_', ' ')}
              </span>

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: timeLeft <= 5 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                  border: `2px solid ${timeLeft <= 5 ? 'var(--accent-rose)' : 'var(--accent-indigo)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: timeLeft <= 5 ? 'var(--accent-rose)' : 'var(--text-primary)',
                  boxShadow: timeLeft <= 5 ? '0 0 16px var(--accent-rose)' : 'none',
                }}
              >
                {timeLeft}
              </div>
            </div>

            {/* Question Card */}
            <div
              className="glass-card glow-border"
              style={{
                padding: '40px',
                textAlign: 'center',
                borderRadius: 'var(--radius-xl)',
                marginBottom: '32px',
                background: 'linear-gradient(180deg, rgba(13, 18, 29, 0.95), rgba(19, 27, 44, 0.8))',
              }}
            >
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.25 }}>
                {currentSlide.question}
              </h2>
            </div>

            {/* Options Grid for Quiz or Poll */}
            {currentSlide.options.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {currentSlide.options.map((opt, optIdx) => {
                  const isCorrect = currentSlide.correctAnswer === optIdx;
                  const showResultHighlight = session.status === 'show_result';

                  // Count votes
                  const voteCount = session.responses.filter(
                    r => r.slideIndex === session.currentSlideIndex && r.selectedOption === optIdx
                  ).length;

                  return (
                    <div
                      key={optIdx}
                      className="glass-card"
                      style={{
                        padding: '24px 28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: showResultHighlight && isCorrect ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                        background: showResultHighlight && isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-glass-card)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1rem',
                          }}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 600 }}>{opt}</span>
                      </div>

                      {showResultHighlight && (
                        <div className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>
                          {voteCount} Votes
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Word Cloud Visualizer if slide type is word_cloud */}
            {currentSlide.type === 'word_cloud' && (
              <div
                className="glass-card"
                style={{
                  padding: '50px 30px',
                  textAlign: 'center',
                  marginBottom: '32px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                }}
              >
                {['TypeScript', 'Agentic AI', 'Next.js 15', 'Docker', 'Scalability', 'PostgreSQL', 'Microservices', 'GraphQL'].map((w, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: `${1.1 + (i % 4) * 0.5}rem`,
                      fontWeight: 800,
                      color: i % 2 === 0 ? 'var(--accent-cyan)' : i % 3 === 0 ? 'var(--accent-amber)' : 'var(--accent-indigo)',
                    }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            )}

            {/* Host Actions Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={handleShowResult}
                className="btn btn-secondary"
                style={{ padding: '10px 20px' }}
              >
                <BarChart2 size={16} /> Reveal Answers
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleShowLeaderboard}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px' }}
                >
                  <Trophy size={16} style={{ color: 'var(--accent-amber)' }} /> Leaderboard
                </button>

                <button
                  onClick={handleNextSlide}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  Next Slide <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : session.status === 'leaderboard' ? (
          /* Dynamic Leaderboard Screen */
          <div style={{ width: '100%', maxWidth: '780px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                <Trophy size={15} /> NIRVANA LIVE LEADERBOARD
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Top Performers</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {sortedParticipants.map((p, idx) => (
                <div
                  key={p.id}
                  className="glass-card"
                  style={{
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderLeft: `5px solid ${idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'transparent'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, width: '28px', color: idx < 3 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                      #{idx + 1}
                    </span>
                    <img src={p.avatar} alt={p.nickname} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{p.nickname}</div>
                      {p.streak > 1 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>
                          🔥 {p.streak} Streak Bonus!
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {p.score} pts
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button
                onClick={handleNextSlide}
                className="btn btn-primary"
                style={{ padding: '12px 30px', fontSize: '1rem' }}
              >
                Continue Presentation <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Session Concluded & Post-Session AI Analytics (Section 16) */
          <div style={{ width: '100%', maxWidth: '820px', textAlign: 'center' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.85rem', marginBottom: '14px' }}>
              SESSION CONCLUDED
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '16px' }}>
              Session Insights &amp; Analytics
            </h1>

            {/* Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>88%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Average Accuracy</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{session.participants.length}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Participants</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>Q3</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hardest Question</div>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>3.8s</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fastest Response</div>
              </div>
            </div>

            {/* AI Session Insights */}
            <div
              className="glass-card glow-border"
              style={{
                padding: '30px',
                textAlign: 'left',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '32px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '12px' }}>
                <Sparkles size={18} /> AI Session Synthesis
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                &ldquo;Audience demonstrated strong comprehension of core HTTP status codes and cloud platforms. However, participants hesitated on transaction isolation levels and distributed consensus mechanisms. Recommend sharing the System Design Roadmap in the community channel as a follow-up resource.&rdquo;
              </p>
            </div>

            <button
              onClick={() => router.push('/live')}
              className="btn btn-primary"
              style={{ padding: '12px 30px' }}
            >
              Return to Live Hub
            </button>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              padding: '36px',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              maxWidth: '420px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>Scan to Join Live</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Scan with phone camera or visit nirvana.live/join
            </p>

            {/* Visual QR Code Generator Simulation */}
            <div
              style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                display: 'inline-block',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#07090e',
                  borderRadius: '8px',
                  color: '#fff',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <QrCode size={120} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '2px' }}>PIN: {session.code}</span>
              </div>
            </div>

            <div>
              <button
                onClick={() => setQrModalOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Close QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
