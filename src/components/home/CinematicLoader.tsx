'use client';

import React, { useState, useEffect } from 'react';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function CinematicLoader() {
  const { isDark } = useThemeCustomizer();
  const [phase, setPhase] = useState<'init' | 'zero' | 'one' | 'logo' | 'complete'>('init');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setVisible(false);
        return;
      }
    }

    const t0 = setTimeout(() => setPhase('zero'), 250);
    const t1 = setTimeout(() => setPhase('one'), 550);
    const t2 = setTimeout(() => setPhase('logo'), 850);
    const t3 = setTimeout(() => {
      setPhase('complete');
      setTimeout(() => setVisible(false), 300);
    }, 1400);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleSkip = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300 ${
        phase === 'complete' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: isDark ? '#000000' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
      }}
      title="Click anywhere to skip"
    >
      {/* Background subtle micro-grid */}
      <div 
        className="absolute inset-0 subtle-grid opacity-15 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center space-y-6 select-none">
        {/* Step Indicator */}
        <div className="h-16 flex items-center justify-center">
          {phase === 'zero' && (
            <span 
              className="font-mono font-black text-6xl animate-pulse tracking-widest"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }}
            >
              0
            </span>
          )}

          {phase === 'one' && (
            <span 
              className="font-mono font-black text-6xl animate-pulse tracking-widest"
              style={{ color: isDark ? '#ffffff' : '#000000' }}
            >
              1
            </span>
          )}

          {phase === 'logo' && (
            <div className="flex flex-col items-center animate-fadeIn space-y-3">
              <div className="w-14 h-14 rounded-full border border-white/30 bg-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <img
                  src="/assets/tygn-logo.png"
                  alt="TYGN"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-inherit leading-none flex items-center gap-2">
                  TechYOGeek Nirvana
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded border border-white/20 text-[#a3a3a3] font-normal tracking-wider">(TYGN)</span>
                </span>
                <span className="text-[0.62rem] font-mono uppercase tracking-[0.3em] text-[#737373] mt-2">
                  STUDENT TECHNOLOGY ECOSYSTEM
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Skip Tip */}
        <div className="text-[0.65rem] font-mono text-neutral-600 uppercase tracking-widest">
          [ Click anywhere to enter ]
        </div>
      </div>
    </div>
  );
}
