'use client';

import React, { useEffect, useRef, useState } from 'react';

const BOOT_STEPS = [
  '[ OK ] init.kernel  ............... TYGN.OS v4.2.0',
  '[ OK ] handshake    ............... auth.gateway → SECURE',
  '[ .. ] neural_net   ............... booting transformer cores',
  '[ OK ] neural_net   ............... 12 layers online',
  '[ .. ] datastream   ............... syncing community.shards',
  '[ OK ] datastream   ............... 0xA9F3 nodes verified',
  '[ .. ] cipher       ............... rotating quantum keys',
  '[ OK ] cipher       ............... AES-512 / RSA-4096',
  '[ OK ] resume.ai    ............... ATS engine warm',
  '[ OK ] mainframe    ............... welcome, operator',
];

interface LaunchScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function LaunchScreen({ onComplete, forceShow = false }: LaunchScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check sessionStorage if already shown in this session (unless forced)
  useEffect(() => {
    if (!forceShow && typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem('tygn_startup_shown');
      if (alreadyShown) {
        setVisible(false);
        if (onComplete) onComplete();
        return;
      }
    }
  }, [forceShow, onComplete]);

  // Step typing and progress
  useEffect(() => {
    if (!visible) return;

    if (stepIndex < BOOT_STEPS.length) {
      const stepTimer = setTimeout(() => {
        setStepIndex((prev) => prev + 1);
      }, 200);
      return () => clearTimeout(stepTimer);
    }

    // Finished all steps -> exit
    const exitTimer = setTimeout(() => {
      setIsClosing(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tygn_startup_shown', 'true');
      }
      setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 650);
    }, 550);

    return () => clearTimeout(exitTimer);
  }, [stepIndex, visible, onComplete]);

  // Smooth lerp progress calculation
  useEffect(() => {
    if (!visible) return;
    const progressInterval = setInterval(() => {
      setProgress((curr) => {
        const target = (stepIndex / BOOT_STEPS.length) * 100;
        return curr + (target - curr) * 0.22;
      });
    }, 40);
    return () => clearInterval(progressInterval);
  }, [stepIndex, visible]);

  // Matrix Digital Rain Canvas
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const glyphs = 'ァアイウエオカキクケコサシスセソタチツテトナニヌネノ01アイウエオ#$%&*+-=<>'.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const renderMatrix = () => {
      ctx.fillStyle = 'rgba(5, 7, 18, 0.09)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.97 ? '#a5b4fc' : 'rgba(56, 189, 248, 0.78)';
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(renderMatrix);
    };

    renderMatrix();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        overflow: 'hidden',
        backgroundColor: '#05070f',
        color: '#a5f3fc',
        fontFamily: "'JetBrains Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.65s ease, filter 0.65s ease',
        opacity: isClosing ? 0 : 1,
        filter: isClosing ? 'blur(22px)' : 'none',
        pointerEvents: isClosing ? 'none' : 'auto',
      }}
    >
      {/* Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />

      {/* CRT Scanline Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.18,
          mixBlendMode: 'overlay',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Vignette Radial Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(5,7,18,0.96) 100%)',
        }}
      />

      {/* Cyber Grid with Radial Fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.22,
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.18) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 80%)',
        }}
      />

      {/* 4 Cyber HUD Corner Brackets */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', width: '36px', height: '36px', borderLeft: '2px solid rgba(34,211,238,0.6)', borderTop: '2px solid rgba(34,211,238,0.6)' }} />
      <div style={{ position: 'absolute', top: '24px', right: '24px', width: '36px', height: '36px', borderRight: '2px solid rgba(34,211,238,0.6)', borderTop: '2px solid rgba(34,211,238,0.6)' }} />
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '36px', height: '36px', borderLeft: '2px solid rgba(34,211,238,0.6)', borderBottom: '2px solid rgba(34,211,238,0.6)' }} />
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '36px', height: '36px', borderRight: '2px solid rgba(34,211,238,0.6)', borderBottom: '2px solid rgba(34,211,238,0.6)' }} />

      {/* Main Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '680px',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Orbital Logo Container */}
        <div style={{ position: 'relative', marginBottom: '24px', width: '108px', height: '108px' }}>
          {/* Cyan blur glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '50%',
              background: 'rgba(34,211,238,0.4)',
              filter: 'blur(32px)',
            }}
          />
          {/* Indigo blur glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.3)',
              filter: 'blur(20px)',
            }}
          />

          {/* Core circular badge */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '1px solid rgba(34,211,238,0.6)',
              background: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(5,7,18,0.85) 50%, rgba(99,102,241,0.25) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(34,211,238,0.35)',
            }}
          >
            {/* Outer rotating dashed ring */}
            <div
              style={{
                position: 'absolute',
                inset: '4px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(125,211,252,0.55)',
                animation: 'spin 6s linear infinite',
              }}
            />
            {/* Inner reverse rotating dashed ring */}
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                border: '1px dashed rgba(165,180,252,0.45)',
                animation: 'spinReverse 9s linear infinite',
              }}
            />

            {/* Logo Image */}
            <img
              src="/assets/tygn-logo.png"
              alt="TYGN Logo"
              style={{
                width: '54px',
                height: '54px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 2,
                filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.8))',
              }}
            />
          </div>
        </div>

        {/* Glitch Chromatic Aberration Brand Title */}
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          {/* Red/Indigo offset layer */}
          <h1
            style={{
              position: 'absolute',
              top: 0,
              left: '-2px',
              width: '100%',
              fontSize: 'clamp(1.4rem, 3.8vw, 2.3rem)',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: 'rgba(129,140,248,0.6)',
              mixBlendMode: 'screen',
              margin: 0,
              userSelect: 'none',
            }}
          >
            TECHYOGEEK · NIRVANA
          </h1>
          {/* Cyan offset layer */}
          <h1
            style={{
              position: 'absolute',
              top: 0,
              left: '2px',
              width: '100%',
              fontSize: 'clamp(1.4rem, 3.8vw, 2.3rem)',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: 'rgba(56,189,248,0.6)',
              mixBlendMode: 'screen',
              margin: 0,
              userSelect: 'none',
            }}
          >
            TECHYOGEEK · NIRVANA
          </h1>
          {/* Main sharp layer */}
          <h1
            style={{
              position: 'relative',
              fontSize: 'clamp(1.4rem, 3.8vw, 2.3rem)',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#cffafe',
              margin: 0,
              textShadow: '0 0 20px rgba(34,211,238,0.6)',
            }}
          >
            TECHYOGEEK · NIRVANA
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(0.72rem, 1.8vw, 0.85rem)',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(34,211,238,0.85)',
            marginBottom: '28px',
            marginTop: '4px',
          }}
        >
          {'// initializing neural mainframe'}
        </p>

        {/* Terminal Window Box */}
        <div
          style={{
            width: '100%',
            maxWidth: '620px',
            borderRadius: '12px',
            border: '1px solid rgba(34,211,238,0.3)',
            backgroundColor: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 50px -10px rgba(34,211,238,0.45)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Window Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 14px',
              borderBottom: '1px solid rgba(34,211,238,0.18)',
              backgroundColor: 'rgba(5,7,18,0.75)',
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.85)' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(234,179,8,0.85)' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.85)' }} />
            <span
              style={{
                marginLeft: '12px',
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: 'rgba(103,232,249,0.75)',
              }}
            >
              tygn@mainframe ~ /boot
            </span>
          </div>

          {/* Terminal Output */}
          <div
            style={{
              padding: '16px 20px',
              height: '210px',
              overflowY: 'hidden',
              fontSize: 'clamp(11px, 1.8vw, 13px)',
              lineHeight: 1.8,
            }}
          >
            {BOOT_STEPS.slice(0, stepIndex).map((line, idx) => (
              <div
                key={idx}
                style={{
                  color: line.includes('[ OK ]') ? '#6ee7b7' : 'rgba(165,243,252,0.92)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'rgba(6,182,212,0.6)', marginRight: '8px' }}>›</span>
                <span>{line}</span>
              </div>
            ))}

            {stepIndex < BOOT_STEPS.length && (
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '14px',
                  backgroundColor: '#67e8f9',
                  verticalAlign: 'middle',
                  animation: 'pulse 1s infinite',
                }}
              />
            )}
          </div>
        </div>

        {/* Progress Bar & SYS.LOAD */}
        <div style={{ marginTop: '24px', width: '100%', maxWidth: '620px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              letterSpacing: '0.28em',
              color: 'rgba(103,232,249,0.75)',
              marginBottom: '8px',
            }}
          >
            <span>SYS.LOAD</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>

          <div
            style={{
              position: 'relative',
              height: '6px',
              width: '100%',
              backgroundColor: 'rgba(34,211,238,0.12)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #38bdf8 0%, #67e8f9 50%, #818cf8 100%)',
                boxShadow: '0 0 16px rgba(99,102,241,0.85)',
                transition: 'width 0.15s ease',
              }}
            />
          </div>
        </div>

        {/* Fast-forward Skip option */}
        <button
          onClick={() => {
            setIsClosing(true);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('tygn_startup_shown', 'true');
            }
            setTimeout(() => {
              setVisible(false);
              if (onComplete) onComplete();
            }, 300);
          }}
          style={{
            marginTop: '20px',
            background: 'transparent',
            border: '1px solid rgba(34,211,238,0.2)',
            borderRadius: '20px',
            padding: '4px 14px',
            color: 'rgba(103,232,249,0.6)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)';
            e.currentTarget.style.color = '#cffafe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)';
            e.currentTarget.style.color = 'rgba(103,232,249,0.6)';
          }}
        >
          [ SKIP INTRO → ]
        </button>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
