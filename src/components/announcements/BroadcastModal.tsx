'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, X, Check, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

export function BroadcastModal() {
  const { currentUser, activeAnnouncements, dismissAnnouncement } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!currentUser || !activeAnnouncements || activeAnnouncements.length === 0) {
    return null;
  }

  const announcement = activeAnnouncements[currentIdx] || activeAnnouncements[0];
  if (!announcement) return null;

  const handleDismiss = () => {
    soundEffects.playClick();
    dismissAnnouncement(announcement.id);
    if (currentIdx >= activeAnnouncements.length - 1) {
      setCurrentIdx(0);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(5, 6, 15, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card glow-border"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '32px 28px',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, rgba(14, 18, 30, 0.95) 0%, rgba(20, 24, 45, 0.95) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(6, 182, 212, 0.2)',
          position: 'relative',
          animation: 'fadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
          title="Dismiss Announcement"
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(244, 63, 94, 0.2))',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
            }}
          >
            <Megaphone size={22} />
          </div>

          <div>
            <span
              className="badge badge-cyan"
              style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              {announcement.badge || 'System Announcement'}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Broadcast from {announcement.createdBy || 'Administrator'}
            </div>
          </div>
        </div>

        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '12px',
          }}
        >
          {announcement.title}
        </h2>

        <p
          style={{
            fontSize: '0.94rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '28px',
            whiteSpace: 'pre-line',
          }}
        >
          {announcement.message}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {activeAnnouncements.length > 1
              ? `Notice ${currentIdx + 1} of ${activeAnnouncements.length}`
              : 'Official Community Update'}
          </div>

          <button
            onClick={handleDismiss}
            className="btn btn-primary"
            style={{ padding: '9px 24px', fontSize: '0.88rem' }}
          >
            <Check size={16} style={{ marginRight: '6px' }} /> Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
