'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LayoutGrid, Home } from 'lucide-react';
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
    <div className="fixed top-16 sm:top-20 left-0 right-0 z-30 pointer-events-none flex justify-center px-4">
      <div className="w-full max-w-6xl pointer-events-auto flex items-center justify-between py-1.5 px-3 sm:px-4 rounded-full border border-white/10 dark:border-white/10 light:border-black/10 bg-black/75 dark:bg-black/75 light:bg-white/85 backdrop-blur-xl shadow-lg text-[0.72rem] font-mono text-[#a3a3a3]">
        {/* Left: Breadcrumbs Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 truncate">
          <Link
            href="/"
            onClick={() => soundEffects.playClick()}
            className="text-inherit hover:text-white transition-colors flex items-center gap-1 no-underline"
          >
            <Home size={12} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <ChevronRight size={11} className="text-[#525252] shrink-0" />

          {!isDashboardRoot && !isFeaturesRoot && (
            <>
              <Link
                href="/features"
                onClick={() => soundEffects.playClick()}
                className="text-inherit hover:text-white transition-colors flex items-center gap-1 no-underline"
              >
                <span className="hidden sm:inline">Features</span>
                <span className="sm:hidden">Dir</span>
              </Link>
              <ChevronRight size={11} className="text-[#525252] shrink-0" />
            </>
          )}

          {meta.category && (
            <>
              <span className="text-[#737373] hidden md:inline">
                {meta.category}
              </span>
              <ChevronRight size={11} className="text-[#525252] shrink-0 hidden md:inline" />
            </>
          )}

          {/* Current Active Page */}
          <span className="text-white font-bold flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse" />
            <span className="truncate">{meta.title}</span>
          </span>
        </nav>

        {/* Right: Quick Features Launcher Shortcut */}
        {!isFeaturesRoot && (
          <Link
            href="/features"
            onClick={() => soundEffects.playClick()}
            className="text-[0.68rem] font-mono font-semibold px-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all text-inherit inline-flex items-center gap-1.5 no-underline shrink-0 ml-2"
          >
            <LayoutGrid size={11} />
            <span className="hidden sm:inline">All Features</span>
          </Link>
        )}
      </div>
    </div>
  );
}
