'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LayoutGrid, Home, EyeOff, Eye } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface BreadcrumbRouteMeta {
  title: string;
  category?: string;
}

const ROUTE_META: Record<string, BreadcrumbRouteMeta> = {
  '/dashboard': { title: 'Personal Command Center' },
  '/features': { title: 'All Features & Capabilities' },
  '/about': { title: 'About TYGN', category: 'Community' },
  '/about-public': { title: 'About TYGN', category: 'Community' },
  '/community': { title: 'Community Hub & Channels', category: 'Community' },
  '/collab-finder': { title: 'Collab Finder', category: 'Community' },
  '/moments': { title: 'Community Moments', category: 'Community' },
  '/notes': { title: 'B.Tech Notes Drive', category: 'Academic' },
  '/tech-radar': { title: 'Tech Radar', category: 'Academic' },
  '/roadmaps': { title: 'Engineering Roadmaps', category: 'Academic' },
  '/projects': { title: 'Open Showcase Projects', category: 'Academic' },
  '/events': { title: 'Events & Competitions', category: 'Events' },
  '/events/submit': { title: 'Host / Submit Event', category: 'Events' },
  '/opportunities': { title: 'Curated Opportunities', category: 'Events' },
  '/growth': { title: 'Personal Growth Hub', category: 'Growth' },
  '/games': { title: 'Games Arena', category: 'Growth' },
  '/resume-lab': { title: 'AI Resume Lab & OCR', category: 'AI Suite' },
  '/ai-interview': { title: 'AI Mock Interview Room', category: 'AI Suite' },
  '/ai-code': { title: 'AI Code Explainer', category: 'AI Suite' },
  '/live': { title: 'Nirvana Live Room', category: 'Live Stage' },
  '/live/join': { title: 'Join Session by PIN', category: 'Live Stage' },
  '/live/create': { title: 'Host Live Session', category: 'Live Stage' },
  '/quizzes': { title: 'Technical Quizzes', category: 'Live Stage' },
  '/profile': { title: 'Student Profile' },
  '/admin': { title: 'System Administration' },
  '/login': { title: 'Sign In / Authentication' },
};

export function BreadcrumbBar() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [shakeToast, setShakeToast] = useState<string | null>(null);
  const historyRef = useRef<{ x: number; y: number; t: number; dir?: number }[]>([]);
  const lastToggleTimeRef = useRef<number>(0);

  // Mouse shake detection in the top zone of the screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only detect shake when mouse is in top portion of screen
      if (e.clientY > 250) return;

      const now = Date.now();
      const hist = historyRef.current;
      hist.push({ x: e.clientX, y: e.clientY, t: now });

      // Keep only points from last 450ms
      while (hist.length > 0 && now - hist[0].t > 450) {
        hist.shift();
      }

      if (hist.length < 5) return;

      // Count horizontal direction changes with high velocity
      let reversals = 0;
      let lastDir = 0;
      let totalDistance = 0;

      for (let i = 1; i < hist.length; i++) {
        const dx = hist[i].x - hist[i - 1].x;
        totalDistance += Math.abs(dx);
        const dir = dx > 8 ? 1 : dx < -8 ? -1 : 0;
        if (dir !== 0) {
          if (lastDir !== 0 && dir !== lastDir) {
            reversals++;
          }
          lastDir = dir;
        }
      }

      // If rapid left-right shakes detected (3+ reversals and travelled > 80px in < 450ms)
      if (reversals >= 3 && totalDistance > 80) {
        if (now - lastToggleTimeRef.current > 750) {
          lastToggleTimeRef.current = now;
          soundEffects.playClick();
          setIsHidden(prev => {
            const next = !prev;
            setShakeToast(next ? 'Bar Hidden — Shake mouse again or hover top to restore' : 'Bar Visible');
            setTimeout(() => setShakeToast(null), 2500);
            return next;
          });
          hist.length = 0;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Don't show breadcrumbs on the marketing landing page
  if (!pathname || pathname === '/') {
    return null;
  }

  // Find exact or parent match
  let meta = ROUTE_META[pathname];
  if (!meta) {
    const parentPath = Object.keys(ROUTE_META).find(p => p !== '/' && pathname.startsWith(p + '/'));
    if (parentPath) {
      meta = ROUTE_META[parentPath];
    } else {
      const segment = pathname.split('/').filter(Boolean)[0] || '';
      meta = { title: segment.toUpperCase().replace(/-/g, ' ') };
    }
  }

  const isFeaturesRoot = pathname === '/features';
  const isDashboardRoot = pathname === '/dashboard';

  return (
    <>
      {/* Toast Notification when shake toggles visibility */}
      {shakeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-fadeIn">
          <div className="px-3.5 py-1.5 rounded-full border border-white/20 bg-black/90 text-white font-mono text-[0.7rem] shadow-2xl backdrop-blur-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{shakeToast}</span>
          </div>
        </div>
      )}

      {/* Floating Reveal Trigger when hidden */}
      {isHidden && (
        <div className="w-full max-w-6xl mx-auto px-4 pt-16 sm:pt-20 pb-1 flex justify-center animate-fadeIn">
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsHidden(false);
            }}
            className="group px-3 py-1 rounded-full border shadow-sm font-mono text-[0.65rem] transition-all flex items-center gap-1.5"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--bg-glass)',
              color: 'var(--text-muted)',
            }}
            title="Click or shake mouse to restore breadcrumbs bar"
          >
            <Eye size={11} className="group-hover:scale-110 transition-transform text-[var(--text-primary)]" />
            <span>Show Breadcrumbs (or shake mouse)</span>
          </button>
        </div>
      )}

      {/* Main Breadcrumbs Container */}
      {!isHidden && (
        <div className="w-full max-w-6xl mx-auto px-4 pt-20 sm:pt-24 pb-2 flex justify-center transition-all duration-300 animate-fadeIn">
          <div
            className="w-full max-w-6xl flex items-center justify-between py-1.5 px-3 sm:px-4 rounded-full border shadow-lg text-[0.72rem] font-mono transition-colors"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              color: 'var(--text-muted)',
            }}
          >
        {/* Left: Breadcrumbs Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 truncate">
          <Link
            href="/"
            onClick={() => soundEffects.playClick()}
            className="text-inherit hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 no-underline"
          >
            <Home size={12} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <ChevronRight size={11} className="text-[var(--text-subtle)] shrink-0" />

          {!isDashboardRoot && !isFeaturesRoot && (
            <>
              <Link
                href="/features"
                onClick={() => soundEffects.playClick()}
                className="text-inherit hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 no-underline"
              >
                <span className="hidden sm:inline">Features</span>
                <span className="sm:hidden">Dir</span>
              </Link>
              <ChevronRight size={11} className="text-[var(--text-subtle)] shrink-0" />
            </>
          )}

          {meta.category && (
            <>
              <span className="text-[var(--text-subtle)] hidden md:inline">
                {meta.category}
              </span>
              <ChevronRight size={11} className="text-[var(--text-subtle)] shrink-0 hidden md:inline" />
            </>
          )}

          {/* Current Active Page */}
          <span className="text-[var(--text-primary)] font-bold flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] shrink-0 animate-pulse" />
            <span className="truncate">{meta.title}</span>
          </span>
        </nav>

        {/* Right Controls: Features Launcher & Hide Bar Toggle */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {!isFeaturesRoot && (
            <Link
              href="/features"
              onClick={() => soundEffects.playClick()}
              className="text-[0.68rem] font-mono font-semibold px-2.5 py-1 rounded-full border transition-all inline-flex items-center gap-1.5 no-underline shrink-0"
              style={{
                borderColor: 'var(--border-medium)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
              }}
            >
              <LayoutGrid size={11} />
              <span className="hidden sm:inline">All Features</span>
            </Link>
          )}

          {/* Hide / Minimize Bar button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsHidden(true);
              setShakeToast('Bar Hidden — Shake mouse to restore');
              setTimeout(() => setShakeToast(null), 2500);
            }}
            className="p-1.5 rounded-full border transition-all inline-flex items-center justify-center opacity-60 hover:opacity-100 hover:scale-105"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-muted)',
            }}
            title="Hide bar (Shake mouse anywhere near top to toggle)"
          >
            <EyeOff size={11} />
          </button>
        </div>
      </div>
    </div>
  )}
</>
);
}
