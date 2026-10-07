'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, ChevronDown, Lock, Zap, Flame, Shield, Hand } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { GoogleIcon } from '@/components/auth/GoogleAuthModal';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color?: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export function HeroCyberWarrior() {
  const { isAuthenticated, currentUser } = useAuth();
  const { isDark } = useThemeCustomizer();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const warriorBoxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parallax and sword tilt state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetAngle, setTargetAngle] = useState(-25); // base sword angle
  const [currentScene, setCurrentScene] = useState<number>(0);

  // Drag & drop physics state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [comboCount, setComboCount] = useState(0);
  const [isSlashing, setIsSlashing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Refs for tracking drag coordinates without stale closures
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentDragRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);

  // Scenes definition for scroll storytelling
  const scenes = [
    {
      id: 'intro',
      pillar: 'ECOSYSTEM',
      headline: 'TechYOGeek Nirvana (TYGN)',
      subline: 'THE B.TECH STUDENT COMMUNITY',
      description: 'An institutional-grade technology platform where ambition meets disciplined execution. Learn curriculum, build production software, compete under clock pressure, and master executive presence.',
    },
    {
      id: 'learn',
      pillar: 'PILLAR 01',
      headline: 'LEARN',
      subline: 'CURATED PEER KNOWLEDGE',
      description: 'Direct access to semester notes, exam patterns, verified B.Tech drive archives, tech radars, and engineering roadmaps across computer science domains.',
    },
    {
      id: 'build',
      pillar: 'PILLAR 02',
      headline: 'BUILD',
      subline: 'PRODUCTION CODE OVER ATTENDANCE',
      description: 'Ship production APIs, inspect open source repositories, and develop real software artifacts that carry weight in global hiring pipelines.',
    },
    {
      id: 'compete',
      pillar: 'PILLAR 03',
      headline: 'COMPETE',
      subline: 'HIGH-STAKES LIVE ARENAS',
      description: 'Synchronous live quiz battles, algorithmic challenges, and national hackathon sprints engineered to test decision-making under high friction.',
    },
    {
      id: 'connect',
      pillar: 'PILLAR 04',
      headline: 'CONNECT',
      subline: 'BUILDER MATCHMAKING',
      description: 'Find specialized hackathon teammates through Collab Finder, share milestone moments, and collaborate with ambitious engineers across universities.',
    },
    {
      id: 'grow',
      pillar: 'PILLAR 05',
      headline: 'GROW',
      subline: 'EXECUTIVE VERBAL POISE',
      description: 'Train verbal manners, diplomatic tone rewrites, and 10-Question situational diagnostics designed to eliminate communication blindspots.',
    },
  ];

  // Mouse move handler for container-wide parallax and sword aiming
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: normX, y: normY });

      if (!isDragging) {
        // Dynamic sword aim reacting smoothly to cursor position
        const newAngle = -25 + normX * 38 - normY * 18;
        setTargetAngle(newAngle);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging]);

  // Scroll listener to update storytelling scene
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const topOffset = -rect.top;
      const totalHeight = rect.height - window.innerHeight;

      if (totalHeight > 0) {
        const progress = Math.max(0, Math.min(1, topOffset / totalHeight));
        const sceneIndex = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
        setCurrentScene(sceneIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scenes.length]);

  // Drag and Drop Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setIsDragging(true);
    setHasInteracted(true);
    dragStartRef.current = {
      x: e.clientX - currentDragRef.current.x,
      y: e.clientY - currentDragRef.current.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      soundEffects.playClick();
      setIsDragging(true);
      setHasInteracted(true);
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX - currentDragRef.current.x,
        y: touch.clientY - currentDragRef.current.y,
      };
    }
  };

  // Drag Motion and Drop Impact Listener
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = Math.max(-160, Math.min(160, e.clientX - dragStartRef.current.x));
      const deltaY = Math.max(-140, Math.min(140, e.clientY - dragStartRef.current.y));
      currentDragRef.current = { x: deltaX, y: deltaY };
      setDragOffset({ x: deltaX, y: deltaY });

      // Dynamic tilt while dragging
      const dynamicAngle = -25 + (deltaX / 160) * 45;
      setTargetAngle(dynamicAngle);

      // Spawn extra drag particles
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const centerX = canvas.width * 0.55 + deltaX;
        const centerY = canvas.height * 0.65 + deltaY;
        const rad = (dynamicAngle * Math.PI) / 180;
        const tipX = centerX + Math.cos(rad) * 160;
        const tipY = centerY + Math.sin(rad) * 160;

        particlesRef.current.push({
          x: tipX + (Math.random() - 0.5) * 12,
          y: tipY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          alpha: 0.9,
          size: Math.random() * 3 + 2,
          color: isDark ? '#38bdf8' : '#0284c7',
        });
      }
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      soundEffects.playSuccess();
      setComboCount(prev => prev + 1);

      // Trigger Ground Shockwave Impact at drop position
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const impactX = canvas.width * 0.55 + currentDragRef.current.x;
        const impactY = canvas.height * 0.65 + currentDragRef.current.y;

        shockwavesRef.current.push({
          x: impactX,
          y: impactY,
          radius: 8,
          maxRadius: 110,
          alpha: 0.85,
          color: isDark ? '#38bdf8' : '#0284c7',
        });

        // Burst of impact sparks
        for (let i = 0; i < 28; i++) {
          const angle = (Math.PI * 2 * i) / 28;
          const speed = Math.random() * 4 + 2;
          particlesRef.current.push({
            x: impactX,
            y: impactY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            size: Math.random() * 3.5 + 1.5,
            color: i % 2 === 0 ? '#38bdf8' : '#ffffff',
          });
        }
      }

      // Smooth spring back to resting origin
      let currentX = currentDragRef.current.x;
      let currentY = currentDragRef.current.y;
      const springLoop = () => {
        currentX *= 0.82;
        currentY *= 0.82;
        currentDragRef.current = { x: currentX, y: currentY };
        setDragOffset({ x: currentX, y: currentY });

        if (Math.abs(currentX) > 0.5 || Math.abs(currentY) > 0.5) {
          requestAnimationFrame(springLoop);
        } else {
          currentDragRef.current = { x: 0, y: 0 };
          setDragOffset({ x: 0, y: 0 });
        }
      };
      requestAnimationFrame(springLoop);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isDark]);

  // Slash Trigger (Click attack)
  const triggerSlash = useCallback(() => {
    if (isSlashing) return;
    setIsSlashing(true);
    soundEffects.playSuccess();
    setComboCount(prev => prev + 1);

    // Dynamic sword slash swing
    setTargetAngle(65);
    setTimeout(() => {
      setTargetAngle(-45);
    }, 120);
    setTimeout(() => {
      setTargetAngle(-25);
      setIsSlashing(false);
    }, 320);

    // Slash spark wave
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const centerX = canvas.width * 0.55 + dragOffset.x;
      const centerY = canvas.height * 0.65 + dragOffset.y;
      for (let i = 0; i < 24; i++) {
        const spread = (Math.random() - 0.5) * 80;
        particlesRef.current.push({
          x: centerX + spread,
          y: centerY - 40 + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 5 - 2,
          alpha: 1,
          size: Math.random() * 4 + 2,
          color: isDark ? '#38bdf8' : '#0284c7',
        });
      }
    }
  }, [isSlashing, dragOffset, isDark]);

  // High-Performance HTML5 Canvas Animation Engine (Blade Trail, Sparks, Shockwaves)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sword tip coordinate relative to canvas center + drag offset
      const centerX = canvas.width * 0.55 + currentDragRef.current.x;
      const centerY = canvas.height * 0.65 + currentDragRef.current.y;
      const bladeLength = 160;
      const rad = (targetAngle * Math.PI) / 180;
      const tipX = centerX + Math.cos(rad) * bladeLength;
      const tipY = centerY + Math.sin(rad) * bladeLength;

      // Spawn ambient light trail particles from blade tip
      if (Math.random() < (isDragging ? 0.95 : 0.65)) {
        particlesRef.current.push({
          x: tipX + (Math.random() - 0.5) * 6,
          y: tipY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.8 - 0.4,
          alpha: 0.85,
          size: Math.random() * 2.8 + 1,
          color: isDark ? (Math.random() > 0.4 ? '#ffffff' : '#38bdf8') : (Math.random() > 0.4 ? '#0284c7' : '#0f172a'),
        });
      }

      // 1. Draw Shockwave Ripples
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 3.5;
        sw.alpha -= 0.025;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(sw.x, sw.y + 40, sw.radius, sw.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 3;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw Particles & Blade Trail
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= isDragging ? 0.02 : 0.015;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color || (isDark ? '#ffffff' : '#0284c7');
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color || (isDark ? '#ffffff' : '#0284c7');
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [targetAngle, isDragging, isDark]);

  const activeScene = scenes[currentScene];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[140vh] sm:min-h-[160vh]"
    >
      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 pt-20 sm:pt-24 pb-8 select-none">
        {/* Background Subtle Grid */}
        <div 
          className="absolute inset-0 subtle-grid opacity-25 pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          }}
        />

        {/* Ambient Radial Halo */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, transparent 70%)',
            opacity: 0.8,
          }}
        />

        {/* Scene Indicator Capsule */}
        <div className="relative z-20 flex justify-center pt-2">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[0.68rem] font-mono uppercase tracking-widest"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              color: isDark ? '#a3a3a3' : '#52525b',
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: isDark ? '#ffffff' : '#0284c7' }}
            />
            <span>{`${activeScene.pillar} • SCENE 0${currentScene + 1}`}</span>
          </div>
        </div>

        {/* Center Arena: Split Narrative & Futuristic Cyber Warrior */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
          {/* Left Column: Narrative Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <span 
                className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.25em] block"
                style={{ color: isDark ? '#737373' : '#6b7280' }}
              >
                {activeScene.subline}
              </span>
              <h1 className={`font-display font-black tracking-tight leading-[0.95] text-inherit transition-all duration-300 ${
                activeScene.headline.length > 15
                  ? 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
                  : 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
              }`}>
                {activeScene.headline}
              </h1>
            </div>

            <p 
              className="text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal transition-all duration-300"
              style={{ color: isDark ? '#a3a3a3' : '#4b5563' }}
            >
              {activeScene.description}
            </p>

            {/* Platform Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {!isAuthenticated || !currentUser ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-primary text-xs sm:text-sm py-3 px-8 font-bold flex items-center justify-center gap-2 no-underline w-full sm:w-auto"
                  >
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                      <GoogleIcon size={12} />
                    </div>
                    <span>Enter Nirvana</span>
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href="#directory"
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-secondary text-xs sm:text-sm py-3 px-6 font-semibold flex items-center justify-center gap-2 no-underline w-full sm:w-auto"
                  >
                    <span>Inspect Platform</span>
                    <ChevronDown size={14} />
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-primary text-xs sm:text-sm py-3 px-8 font-bold flex items-center justify-center gap-2 no-underline w-full sm:w-auto"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href="#directory"
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-secondary text-xs sm:text-sm py-3 px-6 font-semibold flex items-center justify-center gap-2 no-underline w-full sm:w-auto"
                  >
                    <span>Explore All Pillars</span>
                    <ChevronDown size={14} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Original Techno Cyber Warrior Silhouette & Blade */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-[360px] sm:h-[460px] lg:h-[520px]">
            {/* Interactive Tooltip & Combo Banner */}
            <div 
              className="absolute top-1 sm:top-4 z-30 flex items-center gap-2 px-3 py-1 rounded-full border shadow-lg backdrop-blur-md text-[0.68rem] font-mono font-bold transition-all"
              style={{
                borderColor: isDragging 
                  ? '#38bdf8' 
                  : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'),
                background: isDragging 
                  ? 'rgba(56, 189, 248, 0.18)' 
                  : (isDark ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                color: isDragging ? '#38bdf8' : (isDark ? '#e2e8f0' : '#1e293b'),
                transform: isDragging ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <Hand size={12} className={isDragging ? 'text-cyan-400 animate-bounce' : 'opacity-70'} />
              <span>{isDragging ? 'DRAGGING WARRIOR' : hasInteracted ? 'CLICK TO SLICE • DRAG TO THROW' : 'GRAB & DRAG WARRIOR'}</span>
              {comboCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-extrabold">
                  COMBO x{comboCount}
                </span>
              )}
            </div>

            {/* Particle Canvas for Sword Glow Trail & Shockwaves */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none z-20"
            />

            {/* Interactive Drag & Drop Warrior Container */}
            <div
              ref={warriorBoxRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={triggerSlash}
              className={`relative z-10 w-full h-full flex items-center justify-center select-none transition-transform duration-75 ease-out ${
                isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-[1.02]'
              }`}
              style={{
                transform: `translate3d(${mousePos.x * 12 + dragOffset.x}px, ${mousePos.y * 10 + dragOffset.y}px, 0)`,
              }}
              title="Click to slice sword • Drag with mouse to move warrior"
            >
              {/* Outer Geometric Frame / Holographic Reticle */}
              <div 
                className="absolute w-[280px] sm:w-[370px] h-[280px] sm:h-[370px] rounded-full border pointer-events-none transition-colors"
                style={{
                  borderColor: isDragging 
                    ? 'rgba(56, 189, 248, 0.4)' 
                    : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),
                  boxShadow: isDragging ? '0 0 35px rgba(56, 189, 248, 0.2)' : 'none',
                }}
              />
              <div 
                className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full border border-dashed pointer-events-none animate-spin-slow"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                }}
              />

              {/* Runic Holographic Compass Inner Ring */}
              <div 
                className="absolute w-[220px] sm:w-[290px] h-[220px] sm:h-[290px] rounded-full border border-dotted pointer-events-none"
                style={{
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                  transform: `rotate(${targetAngle * 1.5}deg)`,
                  transition: 'transform 0.1s ease-out',
                }}
              />

              {/* High-Contrast Vector SVG: Cyber Warrior Silhouette with Interactive Sword */}
              <svg
                viewBox="0 0 400 500"
                className="w-full h-full max-h-[470px] object-contain drop-shadow-[0_0_35px_rgba(56,189,248,0.25)] transition-all"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ambient Floor Shadow / Pedestal */}
                <ellipse 
                  cx="200" 
                  cy="470" 
                  rx="95" 
                  ry="13" 
                  fill={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.08)'} 
                />
                <ellipse 
                  cx="200" 
                  cy="470" 
                  rx="48" 
                  ry="7" 
                  fill={isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)'} 
                />

                {/* Torso & Techno-Coat Silhouette */}
                <path
                  d="M170 170 L230 170 L250 240 L260 410 L235 440 L200 425 L165 440 L140 410 L150 240 Z"
                  fill={isDark ? '#050505' : '#0f172a'}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.4)' : '#1e293b'}
                  strokeWidth="2.5"
                />

                {/* Inner Coat Contours / Geometric Panels */}
                <path 
                  d="M190 170 L185 360 L200 390 L215 360 L210 170" 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(56, 189, 248, 0.4)'} 
                  strokeWidth="1.5" 
                />
                <path 
                  d="M165 240 L200 280 L235 240" 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(56, 189, 248, 0.5)'} 
                  strokeWidth="1.5" 
                />

                {/* Left Arm (Relaxed) */}
                <path
                  d="M165 175 L135 240 L130 310 L140 330"
                  stroke={isDark ? 'rgba(255, 255, 255, 0.35)' : '#334155'}
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Cybernetic Neck & Collar */}
                <path 
                  d="M185 155 L215 155 L220 175 L180 175 Z" 
                  fill={isDark ? '#000000' : '#020617'} 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.45)' : '#1e293b'} 
                  strokeWidth="1.5" 
                />

                {/* Visor / Cyber Mask / Head */}
                <path
                  d="M185 110 L215 110 L225 135 L215 155 L185 155 L175 135 Z"
                  fill={isDark ? '#000000' : '#020617'}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.6)' : '#0f172a'}
                  strokeWidth="2"
                />

                {/* Chrome / Cyan Visor Glow Line */}
                <line 
                  x1="185" 
                  y1="130" 
                  x2="215" 
                  y2="130" 
                  stroke={isDark ? '#38bdf8' : '#0284c7'} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                />
                <circle cx="200" cy="130" r="2" fill={isDark ? '#ffffff' : '#0284c7'} />

                {/* Shoulder Armor Plates */}
                <path 
                  d="M150 170 L170 165 L175 190 L145 190 Z" 
                  fill={isDark ? '#111111' : '#1e293b'} 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.4)' : '#334155'} 
                  strokeWidth="1.5" 
                />
                <path 
                  d="M250 170 L230 165 L225 190 L255 190 Z" 
                  fill={isDark ? '#111111' : '#1e293b'} 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.4)' : '#334155'} 
                  strokeWidth="1.5" 
                />

                {/* Right Arm Holding Sword — Reacts to Cursor Target Angle & Drag Motion */}
                <g 
                  transform={`rotate(${targetAngle + 25}, 240, 200)`}
                  style={{ transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
                >
                  {/* Forearm */}
                  <path
                    d="M235 175 L255 240 L250 280"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.45)' : '#334155'}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Hand Grip */}
                  <circle 
                    cx="250" 
                    cy="285" 
                    r="6.5" 
                    fill={isDark ? '#ffffff' : '#0f172a'} 
                    stroke={isDark ? '#38bdf8' : '#0284c7'}
                    strokeWidth="1.5"
                  />

                  {/* Techno Katana Hilt */}
                  <line 
                    x1="250" 
                    y1="270" 
                    x2="250" 
                    y2="308" 
                    stroke={isDark ? '#ffffff' : '#0f172a'} 
                    strokeWidth="4.5" 
                    strokeLinecap="square" 
                  />
                  <line 
                    x1="241" 
                    y1="270" 
                    x2="259" 
                    y2="270" 
                    stroke={isDark ? '#38bdf8' : '#0284c7'} 
                    strokeWidth="3.5" 
                  />

                  {/* Katana Outer Glow / Electric Aura */}
                  <line
                    x1="250"
                    y1="270"
                    x2="250"
                    y2="76"
                    stroke={isDark ? '#38bdf8' : '#0284c7'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.35"
                    className="animate-pulse"
                  />

                  {/* Katana Sharp Blade Edge (Visible in both Black and White Themes) */}
                  <line
                    x1="250"
                    y1="270"
                    x2="250"
                    y2="76"
                    stroke={isDark ? '#ffffff' : '#0284c7'}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                  />

                  {/* Sharp Katana Spine */}
                  <line
                    x1="248.5"
                    y1="270"
                    x2="248.5"
                    y2="78"
                    stroke={isDark ? '#a3a3a3' : '#0f172a'}
                    strokeWidth="1.8"
                  />

                  {/* Energy Blade Core */}
                  <line
                    x1="250"
                    y1="262"
                    x2="250"
                    y2="86"
                    stroke={isDark ? '#38bdf8' : '#38bdf8'}
                    strokeWidth="1.6"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Scene Selector Pills */}
        <div className="relative z-20 flex justify-center items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                soundEffects.playClick();
                setCurrentScene(idx);
              }}
              className={`text-[0.68rem] font-mono font-bold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                currentScene === idx
                  ? isDark
                    ? 'bg-white text-black border-white shadow-[0_0_14px_rgba(255,255,255,0.3)]'
                    : 'bg-black text-white border-black shadow-[0_0_14px_rgba(0,0,0,0.2)]'
                  : isDark
                    ? 'bg-black/60 border-white/10 text-[#737373] hover:text-white hover:border-white/20'
                    : 'bg-white/80 border-black/10 text-[#52525b] hover:text-black hover:border-black/20'
              }`}
            >
              [ {s.id === 'intro' ? 'TYGN ECOSYSTEM' : s.headline} ]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
