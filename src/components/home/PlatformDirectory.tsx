'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  MessageSquare, 
  Camera, 
  BookOpen, 
  Compass, 
  GitBranch, 
  FolderGit2, 
  Radio, 
  KeyRound, 
  Trophy, 
  Briefcase, 
  FileText, 
  Bot, 
  Code2, 
  Info,
  ArrowRight,
  Lock,
  Sparkles,
  ExternalLink,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge: string;
  ctaText: string;
  isPublic?: boolean;
}

interface DirectoryPillar {
  pillarId: string;
  number: string;
  title: string;
  tagline: string;
  items: DirectoryItem[];
}

export function PlatformDirectory() {
  const { isAuthenticated } = useAuth();
  const { isDark } = useThemeCustomizer();
  const [activeTab, setActiveTab] = useState<string>('all');

  const pillars: DirectoryPillar[] = [
    {
      pillarId: 'community',
      number: '01',
      title: 'COMMUNITY & CONNECTIONS',
      tagline: 'Peer network, builder matchmaking, channels, and student moments.',
      items: [
        {
          id: 'about',
          title: 'About TechYOGeek Nirvana (TYGN)',
          description: 'The story, core manifesto, student founders, and mission uniting ambitious B.Tech builders.',
          href: '/about',
          icon: Info,
          badge: 'PUBLIC ARCHIVE',
          ctaText: 'Read Manifesto',
          isPublic: true,
        },
        {
          id: 'community-hub',
          title: 'Community Hub & Channels',
          description: 'Topic-based channels for tech stacks, peer code reviews, and cross-campus engineering discussions.',
          href: '/community',
          icon: MessageSquare,
          badge: 'ACTIVE NETWORK',
          ctaText: 'Open Channels',
        },
        {
          id: 'collab-finder',
          title: 'Collab Finder',
          description: 'Form hackathon squads, match with specialized engineers, and build cross-disciplinary teams.',
          href: '/collab-finder',
          icon: Users,
          badge: 'TEAM BUILDER',
          ctaText: 'Find Teammates',
        },
        {
          id: 'moments',
          title: 'Community Moments',
          description: 'Student achievements, project launch drops, hackathon wins, and verified builder logs.',
          href: '/moments',
          icon: Camera,
          badge: 'LIVE FEED',
          ctaText: 'View Moments',
        },
      ],
    },
    {
      pillarId: 'academic',
      number: '02',
      title: 'ACADEMIC & KNOWLEDGE HUB',
      tagline: 'Curated semester archives, technology radars, roadmaps, and open source repositories.',
      items: [
        {
          id: 'notes',
          title: 'B.Tech Notes Drive',
          description: 'Official verified drive archive with branch notes, exam patterns, and syllabus breakdowns.',
          href: '/notes',
          icon: BookOpen,
          badge: 'ACADEMIC DRIVE',
          ctaText: 'Open Drive',
        },
        {
          id: 'tech-radar',
          title: 'Tech Radar',
          description: 'Evaluated industry technologies, libraries, and frameworks categorized for student adoption.',
          href: '/tech-radar',
          icon: Compass,
          badge: 'TREND INSIGHTS',
          ctaText: 'Explore Radar',
        },
        {
          id: 'roadmaps',
          title: 'Engineering Roadmaps',
          description: 'Step-by-step career tracks for Frontend, Backend, DevOps, AI/ML, and Security disciplines.',
          href: '/roadmaps',
          icon: GitBranch,
          badge: 'SKILL TREES',
          ctaText: 'View Tracks',
        },
        {
          id: 'projects',
          title: 'Open Showcase Projects',
          description: 'Inspect live production repositories, system architectures, and open source student builds.',
          href: '/projects',
          icon: FolderGit2,
          badge: 'PRODUCTION CODE',
          ctaText: 'Browse Repos',
        },
      ],
    },
    {
      pillarId: 'live',
      number: '03',
      title: 'INTERACTIVE LIVE HUB',
      tagline: 'Synchronous interactive rooms, room PINs, hackathons, and career opportunities.',
      items: [
        {
          id: 'live-room',
          title: 'Nirvana Live Room',
          description: 'Host and join real-time interactive quiz battles, tech trivia, and lightning feedback sessions.',
          href: '/live',
          icon: Radio,
          badge: 'SYNC ROOMS',
          ctaText: 'Enter Room',
        },
        {
          id: 'join-pin',
          title: 'Join Session PIN',
          description: 'Enter a 6-digit room PIN from anywhere to jump directly into a live host competition.',
          href: '/live/join',
          icon: KeyRound,
          badge: 'RAPID PIN ACCESS',
          ctaText: 'Enter PIN',
        },
        {
          id: 'competitions',
          title: 'Tech Competitions & Events',
          description: 'Explore upcoming hackathons, campus workshops, webinars, and national coding challenges.',
          href: '/events',
          icon: Trophy,
          badge: 'CALENDAR',
          ctaText: 'View Competitions',
        },
        {
          id: 'opportunities',
          title: 'Internships & Job Board',
          description: 'Curated tech internships, developer fellowships, and high-impact student job openings.',
          href: '/opportunities',
          icon: Briefcase,
          badge: 'VERIFIED ROLES',
          ctaText: 'Explore Roles',
        },
      ],
    },
    {
      pillarId: 'ai',
      number: '04',
      title: 'AI DEVELOPER SUITE',
      tagline: 'Autonomous developer tools, resume ATS auditing, and simulated mock interviews.',
      items: [
        {
          id: 'resume-lab',
          title: 'AI Resume Lab & OCR',
          description: 'Upload your PDF or image resume for instant ATS breakdown, keyword analysis, and score card.',
          href: '/resume-lab',
          icon: FileText,
          badge: 'ATS ENGINE',
          ctaText: 'Analyze Resume',
        },
        {
          id: 'ai-interview',
          title: 'AI Mock Interview Room',
          description: 'Simulate high-pressure technical and behavioral interviews with real-time speech evaluation.',
          href: '/ai-interview',
          icon: Bot,
          badge: 'SIMULATION',
          ctaText: 'Start Interview',
        },
        {
          id: 'ai-code',
          title: 'AI Code Explainer',
          description: 'Dissect complex data structures, trace runtime complexity, and receive line-by-line refactors.',
          href: '/ai-code',
          icon: Code2,
          badge: 'CODE INTELLIGENCE',
          ctaText: 'Dissect Code',
        },
      ],
    },
  ];

  const displayedPillars = activeTab === 'all' 
    ? pillars 
    : pillars.filter(p => p.pillarId === activeTab);

  return (
    <section id="directory" className="container-custom space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div className="space-y-3">
          <div className="editorial-eyebrow">
            ECOSYSTEM DIRECTORY // 4 CORE PILLARS
          </div>
          <h2 className="editorial-title text-3xl sm:text-5xl md:text-6xl text-inherit">
            Full Platform Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] max-w-2xl leading-relaxed">
            Every module in TechYOGeek Nirvana (TYGN) is built to solve a concrete engineering hurdle. Explore our verified directory of learning resources, live competitions, AI suites, and community matchmaking.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {[
            { id: 'all', label: 'All Pillars' },
            { id: 'community', label: 'Community' },
            { id: 'academic', label: 'Academic' },
            { id: 'live', label: 'Live Hub' },
            { id: 'ai', label: 'AI Suite' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveTab(tab.id);
              }}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border transition-all ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-black text-white border-black shadow-sm'
                  : isDark
                    ? 'bg-white/5 border-white/10 text-[#a3a3a3] hover:text-white hover:border-white/20'
                    : 'bg-black/5 border-black/10 text-[#52525b] hover:text-black hover:border-black/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="space-y-16">
        {displayedPillars.map(pillar => (
          <div key={pillar.pillarId} className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-bold text-[#737373] px-2.5 py-1 rounded border border-white/10 bg-white/5">
                {pillar.number}
              </span>
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight text-inherit">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#737373] mt-0.5">
                  {pillar.tagline}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillar.items.map(item => {
                const IconComponent = item.icon;
                const requiresAuth = !item.isPublic && !isAuthenticated;
                const targetHref = requiresAuth 
                  ? `/login?redirect=${encodeURIComponent(item.href)}`
                  : item.href;

                return (
                  <div
                    key={item.id}
                    className="mono-card p-6 flex flex-col justify-between space-y-5 hover:border-white/30 transition-all group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-inherit group-hover:scale-110 transition-transform ${
                          isDark ? 'border-white/15 bg-white/5' : 'border-black/10 bg-black/5'
                        }`}>
                          <IconComponent size={18} />
                        </div>
                        <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                          {item.badge}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-display font-bold text-base sm:text-lg text-inherit transition-colors ${
                          isDark ? 'group-hover:text-white' : 'group-hover:text-black'
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#737373] dark:text-[#a3a3a3] leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[0.68rem] font-mono text-[#737373] flex items-center gap-1">
                        {requiresAuth && <Lock size={11} />}
                        <span>{requiresAuth ? 'Requires Sign In' : 'Direct Access'}</span>
                      </span>

                      <Link
                        href={targetHref}
                        onClick={() => soundEffects.playClick()}
                        className={`btn btn-outline text-xs py-1.5 px-3 font-semibold inline-flex items-center gap-1.5 no-underline text-inherit transition-all ${
                          isDark ? 'group-hover:bg-white group-hover:text-black' : 'group-hover:bg-black group-hover:text-white'
                        }`}
                      >
                        <span>{item.ctaText}</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
