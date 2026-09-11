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
  const [isJoining, setIsJoining] = useState(false);

  const executeJoin = async (targetCode: string, targetNickname: string) => {
    const cleanCode = targetCode.trim().replace(/\s+/g, '');
    if (cleanCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit session PIN.');
      return;
    }
    const finalNickname = targetNickname.trim() || currentUser?.name || 'Player_' + Math.floor(100 + Math.random() * 900);

    soundEffects.playClick();
    setIsJoining(true);
    setErrorMsg('');

    try {
      const result = await dbStore.joinLiveSessionAsync(cleanCode, finalNickname, currentUser?.avatar);
      if (!result.success) {
        setErrorMsg(result.message || 'Unable to join session. Please verify the 6-digit PIN.');
        setIsJoining(false);
        return;
      }

      soundEffects.playSuccess();
      if (result.participant) {
        sessionStorage.setItem(`tygn_part_${cleanCode}`, JSON.stringify(result.participant));
      }
      router.push(`/live/play/${cleanCode}`);
    } catch {
      setErrorMsg('Failed to connect to live session.');
      setIsJoining(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeJoin(pinCode, nickname);
  };

  // Auto-join if both code and nickname were provided in search params
  React.useEffect(() => {
    const paramCode = searchParams.get('code');
    const paramNickname = searchParams.get('nickname');
    if (paramCode && paramCode.trim().length === 6 && (paramNickname || currentUser?.name)) {
      executeJoin(paramCode, paramNickname || currentUser?.name || '');
    }
  }, []);

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                6-DIGIT GAME PIN
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Active Rooms Online</span>
            </div>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="000 000"
              value={pinCode}
              onChange={e => {
                setPinCode(e.target.value.replace(/[^0-9]/g, ''));
                if (errorMsg) setErrorMsg('');
              }}
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

            {/* Demo Room Shortcuts */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setPinCode('447161');
                  setErrorMsg('');
                }}
                className="badge badge-cyan"
                style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem' }}
              >
                ⚡ Try Demo: 447161
              </button>
              <button
                type="button"
                onClick={() => {
                  setPinCode('749201');
                  setErrorMsg('');
                }}
                className="badge badge-indigo"
                style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem' }}
              >
                ⚡ DSA Arena: 749201
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
              YOUR NICKNAME
            </label>
            <input
              type="text"
              placeholder="e.g. CodeNinja, Aarav"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="input-custom"
              style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}
            />
          </div>

          {errorMsg && (
            <div style={{ fontSize: '0.84rem', color: 'var(--accent-rose)', fontWeight: 600, background: 'rgba(244, 63, 94, 0.1)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isJoining}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', borderRadius: 'var(--radius-md)', marginTop: '8px' }}
          >
            {isJoining ? 'Connecting to Room...' : 'Enter Room'} <ArrowRight size={18} />
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
