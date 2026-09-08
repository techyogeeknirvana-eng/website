'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

export function LeftSideThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('tygn_theme') || 'light';
    const isDarkMode = savedTheme === 'dark';
    setIsDark(isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    soundEffects.playClick();
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('tygn_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: '20px',
        bottom: '24px',
        zIndex: 998,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <button
        onClick={toggleTheme}
        className="glass-card glow-border"
        title={isDark ? 'Switch to White Theme' : 'Switch to Black Theme'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-full)',
          background: isDark ? 'rgba(13, 18, 29, 0.92)' : 'rgba(255, 255, 255, 0.95)',
          border: '1px solid var(--border-glow)',
          boxShadow: isDark ? '0 0 20px rgba(99, 102, 241, 0.35)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          color: isDark ? '#ffffff' : '#0f172a',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDark ? (
            <Moon size={17} style={{ color: 'var(--accent-indigo)' }} />
          ) : (
            <Sun size={17} style={{ color: 'var(--accent-amber)' }} />
          )}
        </div>

        <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          {isDark ? 'BLACK' : 'WHITE'}
        </span>
      </button>
    </div>
  );
}
