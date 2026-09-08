'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, RefreshCw, Zap, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { dbStore } from '@/lib/db/store';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';

interface AdminLiveStatusBarProps {
  onRefreshTriggered?: () => void;
}

export function AdminLiveStatusBar({ onRefreshTriggered }: AdminLiveStatusBarProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetMessage, setResetMessage] = useState<string>('');

  useEffect(() => {
    let triggeredMidnight = false;

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Calculate time until next midnight (12:00:00 AM local)
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const diffMs = nextMidnight.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      );

      // Midnight trigger: zero out daily credits and grant fresh 10
      if (hours === 0 && minutes === 0 && seconds <= 1 && !triggeredMidnight) {
        triggeredMidnight = true;
        api.credits.resetDaily(false).then(() => {
          dbStore.checkAndResetDailyCredits(false);
          if (onRefreshTriggered) onRefreshTriggered();
        }).catch(err => console.warn('Midnight rollover error:', err));

        setTimeout(() => {
          triggeredMidnight = false;
        }, 5000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onRefreshTriggered]);

  const handleManualCreditRefresh = async () => {
    soundEffects.playSuccess();
    setIsRefreshing(true);
    try {
      dbStore.checkAndResetDailyCredits(true);
      const res = await api.credits.resetDaily(true);
      if (res.data?.message) {
        setResetMessage(res.data.message);
        setTimeout(() => setResetMessage(''), 4000);
      }
      if (onRefreshTriggered) {
        onRefreshTriggered();
      }
    } catch (e) {
      console.error('Failed to trigger daily credit reset on server:', e);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    }
  };

  const dayOfWeek = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 22px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '28px',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(244, 63, 94, 0.05) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Live Date, Day & Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
          }}
        >
          <Calendar size={20} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {dayOfWeek}, {formattedDate}
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              LIVE CLOCK
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'monospace' }}>
              <Clock size={14} /> {formattedTime}
            </span>
            <span>•</span>
            <span style={{ color: 'var(--text-muted)' }}>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
        </div>
      </div>

      {/* Midnight Reset Status & Trigger Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Zap size={16} style={{ color: 'var(--accent-amber)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Daily 12:00 AM Reset
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'monospace' }}>
              {timeUntilReset || 'Calculating...'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {resetMessage && (
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> {resetMessage}
            </span>
          )}
          <button
            onClick={handleManualCreditRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary"
            style={{
              padding: '9px 16px',
              fontSize: '0.84rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: 'var(--accent-emerald)',
              fontWeight: 700,
            }}
            title="Force daily midnight credit refresh across all member accounts"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Credits Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
