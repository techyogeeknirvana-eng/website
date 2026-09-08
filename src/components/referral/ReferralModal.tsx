'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Gift, Users, Sparkles, Share2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const { currentUser, wallet } = useAuth();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser || !mounted) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nirvana.community';
  const referralCode = currentUser.referralCode || `TYGN-${currentUser.username.toUpperCase()}`;
  const referralLink = `${origin}/?ref=${encodeURIComponent(referralCode)}`;
  const referralCount = currentUser.referralCount || 0;
  const creditsEarned = referralCount * 10;

  const handleCopy = () => {
    soundEffects.playSuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(2, 6, 23, 0.9)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fadeIn"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '36px 28px',
          borderRadius: '28px',
          background: '#090d19',
          backgroundImage: 'radial-gradient(ellipse at top, #141c33 0%, #080c16 100%)',
          border: '1px solid rgba(6, 182, 212, 0.45)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.98), 0 0 40px rgba(6, 182, 212, 0.2)',
          position: 'relative',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(244, 63, 94, 0.2))',
              border: '2px solid rgba(6, 182, 212, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              color: 'var(--accent-cyan)',
            }}
          >
            <Gift size={28} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Invite &amp; Earn Permanent Credits
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px', lineHeight: 1.5 }}>
            Share your unique referral link with classmates and fellow developers. You earn{' '}
            <strong style={{ color: 'var(--accent-cyan)' }}>10 Permanent Credits</strong> for each verified sign-up.
          </p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              FRIENDS JOINED
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {referralCount}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              PERMANENT EARNED
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
              +{creditsEarned} <span style={{ fontSize: '0.85rem' }}>pts</span>
            </div>
          </div>
        </div>

        {/* Referral Link Box */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            YOUR PERSONAL REFERRAL LINK
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 6px 6px 14px',
            }}
          >
            <input
              type="text"
              readOnly
              value={referralLink}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                flex: 1,
                fontFamily: 'monospace',
              }}
            />
            <button
              onClick={handleCopy}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          💡 <strong>How it works:</strong> Anyone who opens your link will land directly on the platform. When they sign in with Google, your account automatically receives 10 permanent credits added to your persistent balance.
        </div>
      </div>
    </div>,
    document.body
  );
}
