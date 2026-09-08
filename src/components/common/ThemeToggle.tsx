'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

type Theme = 'dark' | 'light' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('tygn_theme') as Theme) || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = localStorage.getItem('tygn_theme') as Theme;
      if (current === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', t);
    }
  };

  const handleSelect = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('tygn_theme', t);
    applyTheme(t);
    setIsOpen(false);
    soundEffects.playClick();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost"
        title="Toggle Theme"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
        }}
      >
        {theme === 'light' ? (
          <Sun size={18} style={{ color: 'var(--accent-amber)' }} />
        ) : theme === 'dark' ? (
          <Moon size={18} style={{ color: 'var(--accent-indigo)' }} />
        ) : (
          <Laptop size={18} style={{ color: 'var(--accent-cyan)' }} />
        )}
      </button>

      {isOpen && (
        <>
          {/* Click-outside dismiss backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              backgroundColor: 'transparent',
            }}
          />
          <div
            className="animate-fadeIn"
            style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              zIndex: 9999,
              padding: '6px',
              minWidth: '130px',
              borderRadius: '12px',
              background: '#090d19',
              backgroundImage: 'linear-gradient(180deg, #0f1629 0%, #080c16 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 20px rgba(99, 102, 241, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <button
              onClick={() => handleSelect('dark')}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                justifyContent: 'flex-start',
                width: '100%',
                backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: theme === 'dark' ? '#818cf8' : '#e2e8f0',
              }}
            >
              <Moon size={15} /> Dark
            </button>
            <button
              onClick={() => handleSelect('light')}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                justifyContent: 'flex-start',
                width: '100%',
                backgroundColor: theme === 'light' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                color: theme === 'light' ? 'var(--accent-amber)' : '#e2e8f0',
              }}
            >
              <Sun size={15} /> Light
            </button>
            <button
              onClick={() => handleSelect('system')}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                justifyContent: 'flex-start',
                width: '100%',
                backgroundColor: theme === 'system' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: theme === 'system' ? 'var(--accent-cyan)' : '#e2e8f0',
              }}
            >
              <Laptop size={15} /> System
            </button>
          </div>
        </>
      )}
    </div>
  );
}
