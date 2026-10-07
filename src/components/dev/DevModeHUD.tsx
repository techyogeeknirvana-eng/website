'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Terminal, 
  X, 
  Activity, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Eye, 
  RefreshCw, 
  Shield, 
  User as UserIcon,
  Palette,
  Layers,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

export function DevModeHUD() {
  const pathname = usePathname();
  const { preferences, isDark, toggleTheme, setDevMode, setIsCustomizerOpen } = useThemeCustomizer();
  const { currentUser, isAdmin } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [fps, setFps] = useState(60);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0, bp: 'desktop' });
  const [showOutlines, setShowOutlines] = useState(false);

  // FPS Counter tracking loop
  useEffect(() => {
    if (!preferences.devMode) return;
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [preferences.devMode]);

  // Window size & breakpoint tracker
  useEffect(() => {
    if (!preferences.devMode) return;
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let bp = 'xs';
      if (w >= 1536) bp = '2xl';
      else if (w >= 1280) bp = 'xl';
      else if (w >= 1024) bp = 'lg';
      else if (w >= 768) bp = 'md';
      else if (w >= 640) bp = 'sm';

      setWindowSize({ width: w, height: h, bp });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [preferences.devMode]);

  // Outlines toggle effect
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (showOutlines && preferences.devMode) {
      document.documentElement.setAttribute('data-dev-outlines', 'true');
    } else {
      document.documentElement.removeAttribute('data-dev-outlines');
    }
  }, [showOutlines, preferences.devMode]);

  if (!preferences.devMode) return null;

  return (
    <aside 
      aria-label="Developer Mode HUD"
      className="fixed bottom-5 right-5 z-[9990] select-none font-mono text-xs transition-all duration-300"
    >
      {collapsed ? (
        <button
          onClick={() => {
            soundEffects.playClick();
            setCollapsed(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-2xl backdrop-blur-xl transition-transform hover:scale-105"
          style={{
            background: isDark ? 'rgba(5, 5, 5, 0.92)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: '#10b981',
            color: isDark ? '#ffffff' : '#050505',
          }}
          title="Expand Dev Mode HUD"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Terminal size={13} className="text-emerald-400" />
          <span className="font-bold text-[0.72rem] tracking-wider text-emerald-400">DEV HUD</span>
          <span className="text-[0.65rem] opacity-70">[{fps} FPS]</span>
          <ChevronUp size={13} />
        </button>
      ) : (
        <div 
          className="w-80 rounded-2xl border shadow-2xl backdrop-blur-2xl p-4 space-y-3.5 animate-fadeIn"
          style={{
            background: isDark ? 'rgba(8, 8, 8, 0.94)' : 'rgba(255, 255, 255, 0.96)',
            borderColor: isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.5)',
            color: isDark ? '#ffffff' : '#050505',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="font-bold text-xs tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Terminal size={14} />
                <span>DEV DIAGNOSTICS</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCollapsed(true);
                }}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Minimize HUD"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setDevMode(false);
                }}
                className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                title="Disable Dev Mode"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Real-time Diagnostics Grid */}
          <div className="grid grid-cols-2 gap-2 text-[0.68rem]">
            <div 
              className="p-2 rounded-lg border flex flex-col gap-0.5"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <span className="text-[0.6rem] text-zinc-400 uppercase tracking-wider">Route</span>
              <span className="font-bold truncate text-emerald-400" title={pathname}>{pathname}</span>
            </div>

            <div 
              className="p-2 rounded-lg border flex flex-col gap-0.5"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <span className="text-[0.6rem] text-zinc-400 uppercase tracking-wider">Render / FPS</span>
              <span className={`font-bold ${fps >= 55 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-rose-400'}`}>
                {fps} FPS (Smooth)
              </span>
            </div>

            <div 
              className="p-2 rounded-lg border flex flex-col gap-0.5"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <span className="text-[0.6rem] text-zinc-400 uppercase tracking-wider">Theme / Font</span>
              <span className="font-bold flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full border" style={{ background: preferences.fontColor && preferences.fontColor !== 'default' ? preferences.fontColor : (isDark ? '#fff' : '#000') }} />
                <span>{isDark ? 'Dark' : 'Light'} • {preferences.fontColor || 'Auto'}</span>
              </span>
            </div>

            <div 
              className="p-2 rounded-lg border flex flex-col gap-0.5"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <span className="text-[0.6rem] text-zinc-400 uppercase tracking-wider">Viewport</span>
              <span className="font-bold">
                {windowSize.width} × {windowSize.height} ({windowSize.bp})
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[0.62rem] text-zinc-400 uppercase tracking-wider block">
              Quick Debug Tools
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {/* Toggle Outlines */}
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowOutlines(!showOutlines);
                }}
                className={`flex items-center justify-center gap-1.5 p-1.5 rounded-lg border text-[0.68rem] font-bold transition-all ${
                  showOutlines 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                    : (isDark ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-black/5 border-black/10 text-zinc-700 hover:bg-black/10')
                }`}
              >
                <Layers size={12} />
                <span>{showOutlines ? 'Outlines ON' : 'Outlines OFF'}</span>
              </button>

              {/* Open Theme Customizer */}
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsCustomizerOpen(true);
                }}
                className={`flex items-center justify-center gap-1.5 p-1.5 rounded-lg border text-[0.68rem] font-bold transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-black/5 border-black/10 text-zinc-700 hover:bg-black/10'
                }`}
              >
                <Palette size={12} />
                <span>Font &amp; Colors</span>
              </button>
            </div>

            {/* User status */}
            <div 
              className="p-2 rounded-lg border text-[0.68rem] flex items-center justify-between"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Shield size={12} className={isAdmin ? 'text-amber-400' : 'text-blue-400'} />
                <span className="truncate">{currentUser ? currentUser.name : 'Guest User'}</span>
              </div>
              <span className="font-bold text-[0.62rem] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {isAdmin ? 'ADMIN' : currentUser ? 'MEMBER' : 'PUBLIC'}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
