'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function LeftSideThemeToggle() {
  const { isDark, toggleTheme } = useThemeCustomizer();

  const handleToggle = () => {
    soundEffects.playClick();
    toggleTheme();
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
      }}
    >
      <button
        onClick={handleToggle}
        title={isDark ? 'Switch to Clean White Theme' : 'Switch to Cinematic Black Theme'}
        className="mono-card flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-lg transition-all"
        style={{
          background: isDark ? 'rgba(10, 10, 10, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
          color: isDark ? '#ffffff' : '#000000',
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
            <Moon size={15} className="text-white" />
          ) : (
            <Sun size={15} className="text-black" />
          )}
        </div>

        <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {isDark ? 'BLACK' : 'WHITE'}
        </span>
      </button>
    </div>
  );
}
