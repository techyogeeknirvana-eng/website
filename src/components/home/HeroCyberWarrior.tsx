'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, ChevronDown, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { GoogleIcon } from '@/components/auth/GoogleAuthModal';

export function HeroCyberWarrior() {
  const { isAuthenticated, currentUser } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse coordinates for reactive parallax and sword tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetAngle, setTargetAngle] = useState(-25); // base sword angle in degrees
  const [currentScene, setCurrentScene] = useState<number>(0);

  // Scenes definition for scroll storytelling
  const scenes = [
    {
      id: 'intro',
      pillar: 'ECOSYSTEM',
      headline: 'TYGN NIRVANA',
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

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x: normX, y: normY });

      // Sword tilt reacts smoothly to horizontal mouse offset
      const newAngle = -25 + normX * 28;
      setTargetAngle(newAngle);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll listener to update scene
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

  // Sword Light Trail Animation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; alpha: number; size: number }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    resize();
    window.addEventListener('resize', resize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sword tip coordinate relative to canvas center
      const centerX = canvas.width * 0.55;
      const centerY = canvas.height * 0.65;
      const bladeLength = 160;
      const rad = (targetAngle * Math.PI) / 180;
      const tipX = centerX + Math.cos(rad) * bladeLength;
      const tipY = centerY + Math.sin(rad) * bladeLength;

      // Spawn light trail particle
      if (Math.random() < 0.6) {
        particles.push({
          x: tipX + (Math.random() - 0.5) * 6,
          y: tipY + (Math.random() - 0.5) * 6,
          alpha: 0.7,
          size: Math.random() * 2.5 + 1,
        });
      }

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= 0.02;
        p.y -= 0.4; // subtle rise
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [targetAngle]);

  const activeScene = scenes[currentScene];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[140vh] sm:min-h-[160vh]"
    >
      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 pt-20 sm:pt-24 pb-8 select-none">
        {/* Background Subtle Monochrome Grid */}
        <div 
          className="absolute inset-0 subtle-grid opacity-25 pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          }}
        />

        {/* Ambient Radial Monochrome Halo */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, transparent 70%)',
          }}
        />

        {/* Scene Indicator Capsule */}
        <div className="relative z-20 flex justify-center pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-[0.68rem] font-mono uppercase tracking-widest text-[#a3a3a3]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{`${activeScene.pillar} • SCENE 0${currentScene + 1}`}</span>
          </div>
        </div>

        {/* Center Arena: Split Narrative & Futuristic Cyber Warrior */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
          {/* Left Column: Narrative Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.25em] text-[#737373] block">
                {activeScene.subline}
              </span>
              <h1 className="font-display font-black tracking-tight leading-[0.9] text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white transition-all duration-300">
                {activeScene.headline}
              </h1>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-[#a3a3a3] max-w-xl leading-relaxed font-normal transition-all duration-300">
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
                    className="btn btn-secondary text-xs sm:text-sm py-3 px-8 font-semibold flex items-center justify-center gap-2 no-underline text-inherit w-full sm:w-auto"
                  >
                    <span>Explore TYGN</span>
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
                    <span>Launch Command Center</span>
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href="#directory"
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-secondary text-xs sm:text-sm py-3 px-8 font-semibold flex items-center justify-center gap-2 no-underline text-inherit w-full sm:w-auto"
                  >
                    <span>Platform Directory</span>
                    <ChevronDown size={14} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Original Techno Cyber Warrior Silhouette & Blade */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-[340px] sm:h-[440px] lg:h-[500px]">
            {/* Particle Canvas for Sword Glow Trail */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none z-20"
            />

            {/* Parallax Wrapper */}
            <div
              className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
              style={{
                transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * 14}px, 0)`,
              }}
            >
              {/* Outer Geometric Frame / Holographic Reticle */}
              <div className="absolute w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] rounded-full border border-white/10 dark:border-white/10 pointer-events-none" />
              <div className="absolute w-[320px] sm:w-[410px] h-[320px] sm:h-[410px] rounded-full border border-dashed border-white/5 pointer-events-none animate-spin-slow" />

              {/* High-Contrast Vector SVG: Cyber Warrior Silhouette with Interactive Sword */}
              <svg
                viewBox="0 0 400 500"
                className="w-full h-full max-h-[460px] object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ambient Floor Shadow / Pedestal */}
                <ellipse cx="200" cy="470" rx="90" ry="12" fill="rgba(255, 255, 255, 0.05)" />
                <ellipse cx="200" cy="470" rx="45" ry="6" fill="rgba(255, 255, 255, 0.1)" />

                {/* Torso & Techno-Coat Silhouette */}
                <path
                  d="M170 170 L230 170 L250 240 L260 410 L235 440 L200 425 L165 440 L140 410 L150 240 Z"
                  fill="#050505"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="2"
                />

                {/* Inner Coat Contours / Geometric Panels */}
                <path d="M190 170 L185 360 L200 390 L215 360 L210 170" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                <path d="M165 240 L200 280 L235 240" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />

                {/* Left Arm (Relaxed) */}
                <path
                  d="M165 175 L135 240 L130 310 L140 330"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Cybernetic Neck & Collar */}
                <path d="M185 155 L215 155 L220 175 L180 175 Z" fill="#000000" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />

                {/* Visor / Cyber Mask / Head */}
                <path
                  d="M185 110 L215 110 L225 135 L215 155 L185 155 L175 135 Z"
                  fill="#000000"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="2"
                />

                {/* Chrome Visor Glow Line */}
                <line x1="185" y1="130" x2="215" y2="130" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="200" cy="130" r="1.5" fill="#ffffff" />

                {/* Shoulder Armor Plates */}
                <path d="M150 170 L170 165 L175 190 L145 190 Z" fill="#111111" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
                <path d="M250 170 L230 165 L225 190 L255 190 Z" fill="#111111" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />

                {/* Right Arm Holding Sword — Reacts to Cursor Target Angle */}
                <g transform={`rotate(${targetAngle + 25}, 240, 200)`}>
                  {/* Forearm */}
                  <path
                    d="M235 175 L255 240 L250 280"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Hand Grip */}
                  <circle cx="250" cy="285" r="6" fill="#ffffff" />

                  {/* Techno Katana Hilt */}
                  <line x1="250" y1="270" x2="250" y2="305" stroke="#ffffff" strokeWidth="4" strokeLinecap="square" />
                  <line x1="242" y1="270" x2="258" y2="270" stroke="#ffffff" strokeWidth="3" />

                  {/* Ethereal Katana Blade */}
                  <line
                    x1="250"
                    y1="270"
                    x2="250"
                    y2="80"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                  />
                  {/* Sharp Katana Spine */}
                  <line
                    x1="249"
                    y1="270"
                    x2="249"
                    y2="82"
                    stroke="#a3a3a3"
                    strokeWidth="1.5"
                  />
                  {/* Energy Blade Core */}
                  <line
                    x1="250"
                    y1="260"
                    x2="250"
                    y2="90"
                    stroke="#ffffff"
                    strokeWidth="1.5"
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
              className={`text-[0.68rem] font-mono font-bold px-3 py-1.5 rounded-full border transition-all ${
                currentScene === idx
                  ? 'bg-white text-black border-white shadow-[0_0_14px_rgba(255,255,255,0.3)]'
                  : 'bg-black/60 border-white/10 text-[#737373] hover:text-white hover:border-white/20'
              }`}
            >
              [ {s.headline} ]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
