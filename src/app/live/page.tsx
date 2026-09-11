'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Radio, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Play, 
  Users, 
  Trophy, 
  BarChart3, 
  HelpCircle,
  QrCode
} from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function NirvanaLiveLobby() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [pinCode, setPinCode] = useState('');
  const [nickname, setNickname] = useState(currentUser?.name || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const quizzes = dbStore.getQuizzes();

  const handleJoinByPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPin = pinCode.trim().replace(/\s+/g, '');
    if (cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit session PIN.');
      return;
    }

    const finalNickname = nickname.trim() || currentUser?.name || 'Player_' + Math.floor(100 + Math.random() * 900);

    soundEffects.playClick();
    setIsJoining(true);

    try {
      const result = await dbStore.joinLiveSessionAsync(cleanPin, finalNickname, currentUser?.avatar);
      if (!result.success) {
        setErrorMessage(result.message || 'Unable to join session. Please verify the 6-digit PIN.');
        setIsJoining(false);
        return;
      }

      soundEffects.playSuccess();
      if (result.participant) {
        sessionStorage.setItem(`tygn_part_${cleanPin}`, JSON.stringify(result.participant));
      }
      router.push(`/live/play/${cleanPin}`);
    } catch {
      setErrorMessage('Network error connecting to live session.');
      setIsJoining(false);
    }
  };

  const handleLaunchSampleQuiz = async (quizId: string) => {
    soundEffects.playClick();
    const quiz = dbStore.getQuiz(quizId);
    if (quiz) {
      const session = await dbStore.createLiveSessionAsync(quiz, currentUser || undefined);
      router.push(`/live/host/${session.code}`);
    }
  };

  const handlePlaySolo = async (quizId: string) => {
    soundEffects.playClick();
    const quiz = dbStore.getQuiz(quizId);
    if (quiz) {
      const hostUser = currentUser || {
        id: 'u_solo_' + Date.now(),
        name: 'Solo Player',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        username: 'soloplayer',
        email: 'player@tygn.dev',
        role: 'USER' as const,
        title: 'Challenger',
        collegeOrCompany: 'Community',
        education: '',
        skills: [],
        interests: [],
        xp: 100,
        level: 'Novice',
        badges: [],
        isSuspended: false,
        isEmailVerified: true,
        createdAt: new Date().toISOString()
      };

      const session = await dbStore.createLiveSessionAsync(quiz, hostUser as any);
      dbStore.updateSessionStatus(session.code, 'active_question', 0);
      const participant = {
        id: 'p_solo_' + Date.now(),
        nickname: currentUser?.name || 'Solo Challenger',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        score: 0,
        streak: 0,
        joinedAt: new Date().toISOString()
      };
      sessionStorage.setItem(`tygn_part_${session.code}`, JSON.stringify(participant));
      router.push(`/live/play/${session.code}?mode=solo`);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '40px 20px 80px 20px' }}>
      {/* Hero Banner */}
      <div
        className="glass-card glow-border"
        style={{
          padding: 'clamp(30px, 5vw, 54px)',
          marginBottom: '40px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(13, 18, 29, 0.95), rgba(244, 63, 94, 0.12))',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'center',
        }}
      >
        <div>
          <span className="badge badge-rose" style={{ marginBottom: '12px' }}>
            <Radio size={14} /> Realtime Audience Platform
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '14px' }}>
            NIRVANA <span className="text-gradient">LIVE</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Host high-energy live quizzes, interactive presentations, real-time word clouds, and audience polls with Mentimeter-style elegance and Kahoot-style excitement.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="/live/create"
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <Sparkles size={17} /> AI Presentation &amp; Quiz Builder
            </a>
          </div>
        </div>

        {/* Quick Join Card */}
        <div
          className="glass-card"
          style={{
            padding: '30px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glow)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--gradient-nirvana)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Join Live Session</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Enter the 6-digit presenter PIN</div>
            </div>
          </div>

          <form onSubmit={handleJoinByPin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Session 6-Digit PIN
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Active Rooms Available</span>
                </div>
              </div>

              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 447161"
                value={pinCode}
                onChange={e => {
                  setPinCode(e.target.value.replace(/[^0-9]/g, ''));
                  if (errorMessage) setErrorMessage('');
                }}
                className="input-custom"
                style={{
                  fontSize: '1.4rem',
                  letterSpacing: '6px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-cyan)',
                }}
              />

              {/* Quick Demo PIN Shortcuts */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Demo PINs:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPinCode('447161');
                    setErrorMessage('');
                  }}
                  className="badge badge-cyan"
                  style={{ cursor: 'pointer', border: 'none', fontSize: '0.72rem' }}
                >
                  ⚡ 447161 (Tech)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPinCode('749201');
                    setErrorMessage('');
                  }}
                  className="badge badge-indigo"
                  style={{ cursor: 'pointer', border: 'none', fontSize: '0.72rem' }}
                >
                  ⚡ 749201 (DSA)
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Your Nickname
              </label>
              <input
                type="text"
                placeholder="Enter screen name (or leave for auto)"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="input-custom"
              />
            </div>

            {errorMessage && (
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-rose)', fontWeight: 600, background: 'rgba(244, 63, 94, 0.1)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isJoining}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '4px' }}
            >
              {isJoining ? 'Joining Room...' : 'Enter Room & Join'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Featured Ready-to-Host Quizzes */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Ready-to-Host Interactive Decks</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Play solo for practice or host live to generate a 6-digit multiplayer room code.
            </p>
          </div>
          <a
            href="/live/create"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={15} /> Create Custom Deck
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {quizzes.map(quiz => (
            <div
              key={quiz.id}
              className="glass-card glass-card-interactive"
              style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-indigo">
                    {quiz.difficulty.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {quiz.questions.length} Slides &amp; Questions
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>
                  {quiz.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  {quiz.description}
                </p>
              </div>

              <div
                style={{
                  paddingTop: '18px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  By {quiz.creatorName}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handlePlaySolo(quiz.id)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                    title="Play this quiz solo in practice mode"
                  >
                    <Sparkles size={14} /> Solo Play
                  </button>
                  <button
                    onClick={() => handleLaunchSampleQuiz(quiz.id)}
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                    title="Host a multiplayer room with 6-digit PIN and QR code"
                  >
                    <Radio size={14} /> Host Live
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
