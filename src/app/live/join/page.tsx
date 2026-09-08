'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Radio, ArrowRight } from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

function JoinLiveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();

  const [pinCode, setPinCode] = useState(searchParams.get('code') || '');
  const [nickname, setNickname] = useState(searchParams.get('nickname') || currentUser?.name || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanCode = pinCode.trim().replace(/\s+/g, '');
    if (cleanCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit session PIN.');
      return;
    }
    if (!nickname.trim()) {
      setErrorMsg('Please choose a nickname.');
      return;
    }

    soundEffects.playClick();
    const result = await dbStore.joinLiveSessionAsync(cleanCode, nickname.trim(), currentUser?.avatar);
    if (!result.success) {
      setErrorMsg(result.message || 'Unable to join session.');
      return;
    }

    soundEffects.playSuccess();
    if (result.participant) {
      sessionStorage.setItem(`tygn_part_${cleanCode}`, JSON.stringify(result.participant));
    }
    router.push(`/live/play/${cleanCode}`);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card glow-border"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 32px',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'var(--gradient-nirvana)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            boxShadow: 'var(--shadow-cyan-glow)',
          }}
        >
          <Radio size={26} color="#fff" />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>Join Nirvana Live</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Enter the session PIN shown on the presenter&apos;s screen.
        </p>

        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
              6-DIGIT GAME PIN
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="000 000"
              value={pinCode}
              onChange={e => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="input-custom"
              style={{
                fontSize: '1.8rem',
                letterSpacing: '8px',
                textAlign: 'center',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                padding: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
              YOUR NICKNAME
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CodeNinja, Aarav"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="input-custom"
              style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}
            />
          </div>

          {errorMsg && (
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', borderRadius: 'var(--radius-md)', marginTop: '8px' }}
          >
            Enter Room <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function JoinLivePage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading live room...</div>}>
      <JoinLiveContent />
    </Suspense>
  );
}
