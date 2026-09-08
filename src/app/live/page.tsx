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

  const quizzes = dbStore.getQuizzes();

  const handleJoinByPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPin = pinCode.trim().replace(/\s+/g, '');
    if (cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit session PIN.');
      return;
    }
    if (!nickname.trim()) {
      setErrorMessage('Please enter a nickname to join.');
      return;
    }

    soundEffects.playClick();
    router.push(`/live/join?code=${cleanPin}&nickname=${encodeURIComponent(nickname.trim())}`);
  };

  const handleLaunchSampleQuiz = (quizId: string) => {
    if (!currentUser) return;
    soundEffects.playClick();
    const quiz = dbStore.getQuiz(quizId);
    if (quiz) {
      const session = dbStore.createLiveSession(quiz, currentUser);
      router.push(`/live/host/${session.code}`);
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
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Session 6-Digit PIN
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 749201"
                value={pinCode}
                onChange={e => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
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
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Your Nickname
              </label>
              <input
                type="text"
                placeholder="Enter your screen name"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="input-custom"
              />
            </div>

            {errorMessage && (
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '6px' }}
            >
              Enter Room &amp; Join <ArrowRight size={16} />
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
              Launch in one click to generate a live 6-digit code and QR code for your audience.
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
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  By {quiz.creatorName}
                </div>
                <button
                  onClick={() => handleLaunchSampleQuiz(quiz.id)}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  <Play size={14} /> Start Live Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
