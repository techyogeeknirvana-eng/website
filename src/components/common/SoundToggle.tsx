'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(soundEffects.isEnabled());
  }, []);

  const toggle = () => {
    const newState = soundEffects.toggleSound();
    setEnabled(newState);
  };

  return (
    <button
      onClick={toggle}
      className="btn-ghost"
      title={enabled ? 'Mute Interface Sounds' : 'Unmute Interface Sounds'}
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
      {enabled ? (
        <Volume2 size={18} style={{ color: 'var(--accent-cyan)' }} />
      ) : (
        <VolumeX size={18} style={{ color: 'var(--text-muted)' }} />
      )}
    </button>
  );
}
