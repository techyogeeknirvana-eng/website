'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  X, 
  Search, 
  BookOpen, 
  Compass, 
  GitBranch, 
  FolderGit2, 
  Calendar, 
  Trophy, 
  Briefcase, 
  Sparkles, 
  Gamepad2, 
  Bot, 
  FileText, 
  Code2, 
  Radio, 
  KeyRound, 
  Users, 
  MessageSquare, 
  Camera, 
  Info, 
  Sun, 
  Moon, 
  Sliders, 
  ArrowRight,
  Lock,
  ExternalLink,
  Shield,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { SoundToggle } from '@/components/common/SoundToggle';

export interface FeatureItem {
  id: string;
  name: string;
  desc: string;
  href: string;
  icon: any;
  category: string;
  badge?: string;
  isPublic?: boolean;
  isAction?: boolean;
}

export const ALL_PLATFORM_FEATURES: { category: string; description: string; items: FeatureItem[] }[] = [
  {
    category: 'Community & Connections',
    description: 'Peer network, student channels, builder matching, and milestone moments.',
    items: [
      {
        id: 'about',
        name: 'About TYGN & Our Story',
        desc: 'The founding story, core manifesto, team, and B.Tech mission.',
        href: '/about',
        icon: Info,
        category: 'Community & Connections',
        badge: 'PUBLIC',
        isPublic: true,
      },
      {
        id: 'community-hub',
        name: 'Community Hub & Channels',
        desc: 'Real-time topic channels for web dev, AI, security, and peer reviews.',
        href: '/community',
        icon: MessageSquare,
        category: 'Community & Connections',
        badge: 'ACTIVE',
      },
      {
        id: 'collab-finder',
        name: 'Collab Finder',
        desc: 'Match with hackathon teammates, designers, and specialized developers.',
        href: '/collab-finder',
        icon: Users,
        category: 'Community & Connections',
        badge: 'SQUAD BUILDER',
      },
      {
        id: 'moments',
        name: 'Community Moments',
        desc: 'Verified student launches, hackathon podium wins, and dev achievements.',
        href: '/moments',
        icon: Camera,
        category: 'Community & Connections',
        badge: 'FEED',
      },
    ],
  },
  {
    category: 'Academic & Knowledge',
    description: 'B.Tech semester drives, tech radars, roadmaps, and open source code.',
    items: [
      {
        id: 'notes',
        name: 'B.Tech Notes & Curriculum Drive',
        desc: 'Verified semester notes, previous year exams, and syllabus breakdowns.',
        href: '/notes',
        icon: BookOpen,
        category: 'Academic & Knowledge',
        badge: 'CURATED DRIVE',
      },
      {
        id: 'tech-radar',
        name: 'Tech Radar',
        desc: 'Evaluated tools, frameworks, and modern technologies for engineers.',
        href: '/tech-radar',
        icon: Compass,
        category: 'Academic & Knowledge',
        badge: 'TRENDS',
      },
      {
        id: 'roadmaps',
        name: 'Engineering Roadmaps',
        desc: 'Step-by-step career tracks for Frontend, Backend, DevOps, and AI.',
        href: '/roadmaps',
        icon: GitBranch,
        category: 'Academic & Knowledge',
        badge: 'SKILL PATHS',
      },
      {
        id: 'projects',
        name: 'Open Showcase Projects',
        desc: 'Inspect real student production code repositories and architectures.',
        href: '/projects',
        icon: FolderGit2,
        category: 'Academic & Knowledge',
        badge: 'REPOS',
      },
    ],
  },
  {
    category: 'Events & Opportunities',
    description: 'Hackathons, competitions, internships, and verified job postings.',
    items: [
      {
        id: 'events-calendar',
        name: 'Events & Competitions',
        desc: 'Upcoming coding challenges, university summits, and campus workshops.',
        href: '/events',
        icon: Calendar,
        category: 'Events & Opportunities',
        badge: 'CALENDAR',
      },
      {
        id: 'hackathons',
        name: 'Hackathons & Sprints',
        desc: 'High-impact 24–48 hour collaborative hack sprints with mentors and prizes.',
        href: '/events?category=Hackathons',
        icon: Trophy,
        category: 'Events & Opportunities',
        badge: 'PRIZES',
      },
      {
        id: 'workshops',
        name: 'Workshops & Masterclasses',
        desc: 'Live interactive technical workshops led by seasoned student engineers.',
        href: '/events?category=Workshops',
        icon: Zap,
        category: 'Events & Opportunities',
      },
      {
        id: 'internships',
        name: 'Internships & Fellowships',
        desc: 'Verified paid student internships, open-source stipends, and cohorts.',
        href: '/opportunities?type=internship',
        icon: Briefcase,
        category: 'Events & Opportunities',
        badge: 'STIPEND',
      },
      {
        id: 'jobs',
        name: 'Job Board & Roles',
        desc: 'Junior engineering positions and full-time early career software roles.',
        href: '/opportunities?type=job',
        icon: Award,
        category: 'Events & Opportunities',
      },
    ],
  },
  {
    category: 'Growth & Career',
    description: 'Personal development, verbal manners, tone coaching, and daily streaks.',
    items: [
      {
        id: 'growth-hub',
        name: 'Personal Growth Hub',
        desc: 'Verbal communication, workplace etiquette, and executive presence training.',
        href: '/growth',
        icon: Sparkles,
        category: 'Growth & Career',
        badge: 'SIGNATURE',
      },
      {
        id: 'diagnostic',
        name: '10-Q Verbal Diagnostic',
        desc: 'Adaptive assessment evaluating communication blindspots and tone poise.',
        href: '/growth',
        icon: Flame,
        category: 'Growth & Career',
        badge: 'ADAPTIVE',
      },
      {
        id: 'phrase-analyzer',
        name: 'Phrase Tone Analyzer',
        desc: 'Instant translation of blunt campus messages into polished executive clarity.',
        href: '/growth',
        icon: MessageSquare,
        category: 'Growth & Career',
      },
      {
        id: 'daily-streak',
        name: 'Daily 30-Second Challenge',
        desc: 'Practice elevator pitches against a live countdown to build verbal confidence.',
        href: '/growth',
        icon: Zap,
        category: 'Growth & Career',
        badge: 'DAILY XP',
      },
    ],
  },
  {
    category: 'AI Developer Suite',
    description: 'ATS resume scoring, AI mock interviews, and automated code explainers.',
    items: [
      {
        id: 'resume-lab',
        name: 'AI Resume Lab & OCR',
        desc: 'Upload PDF or image resumes for instant ATS keyword audit and density score.',
        href: '/resume-lab',
        icon: FileText,
        category: 'AI Developer Suite',
        badge: 'ATS ENGINE',
      },
      {
        id: 'ai-interview',
        name: 'AI Mock Interview Room',
        desc: 'Simulate high-pressure technical and behavioral interviews with real-time feedback.',
        href: '/ai-interview',
        icon: Bot,
        category: 'AI Developer Suite',
        badge: 'SPEECH AI',
      },
      {
        id: 'ai-code',
        name: 'AI Code Explainer',
        desc: 'Dissect complex data structures, trace runtime complexity, and get refactors.',
        href: '/ai-code',
        icon: Code2,
        category: 'AI Developer Suite',
      },
    ],
  },
  {
    category: 'Interactive / Live Hub',
    description: 'Synchronous live rooms, session PIN access, and interactive quizzes.',
    items: [
      {
        id: 'live-room',
        name: 'Nirvana Live Room',
        desc: 'Real-time multiplayer stage for hosting and joining technical quiz battles.',
        href: '/live',
        icon: Radio,
        category: 'Interactive / Live Hub',
        badge: 'LIVE STAGE',
      },
      {
        id: 'join-pin',
        name: 'Join Session by PIN',
        desc: 'Enter a 6-digit room code to join an active host competition instantly.',
        href: '/live/join',
        icon: KeyRound,
        category: 'Interactive / Live Hub',
        badge: 'PIN ACCESS',
      },
      {
        id: 'host-session',
        name: 'Host Live Session',
        desc: 'Create and broadcast an interactive technical quiz room for your campus.',
        href: '/live/create',
        icon: Zap,
        category: 'Interactive / Live Hub',
      },
      {
        id: 'quizzes',
        name: 'Technical Quizzes',
        desc: 'Self-paced and competitive quizzes testing web tech, algorithms, and systems.',
        href: '/quizzes',
        icon: Trophy,
        category: 'Interactive / Live Hub',
      },
    ],
  },
  {
    category: 'Games Arena',
    description: 'Fast-paced scenario challenges, vocabulary precision, and decision games.',
    items: [
      {
        id: 'games-arena',
        name: 'Games Arena',
        desc: 'Bite-sized replayable games designed to build communication instinct under pressure.',
        href: '/games',
        icon: Gamepad2,
        category: 'Games Arena',
        badge: 'ARENA',
      },
      {
        id: 'say-it-better',
        name: 'Say It Better Game',
        desc: 'Flagship game: Rewrite crude everyday statements into diplomatic executive tone.',
        href: '/games',
        icon: Sparkles,
        category: 'Games Arena',
        badge: 'FLAGSHIP',
      },
      {
        id: 'etiquette-dilemma',
        name: 'Etiquette Dilemmas',
        desc: 'Make the optimal ethical and political decisions during high-friction workplace events.',
        href: '/games',
        icon: Shield,
        category: 'Games Arena',
      },
      {
        id: 'vocab-precision',
        name: 'Vocabulary Precision',
        desc: 'Replace informal filler words with high-impact, precise professional terminology.',
        href: '/games',
        icon: Award,
        category: 'Games Arena',
      },
    ],
  },
];

interface FeaturesDirectoryProps {
  isOpen?: boolean;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export function FeaturesDirectoryModal({
  isOpen = true,
  onClose,
  isStandalonePage = false,
}: FeaturesDirectoryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme, setIsCustomizerOpen } = useThemeCustomizer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Lock body scroll when opened as modal
  useEffect(() => {
    if (!isStandalonePage && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isStandalonePage]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen && !isStandalonePage) return null;

  // Filter features
  const filteredCategories = ALL_PLATFORM_FEATURES.map(cat => {
    if (selectedCategory !== 'All' && cat.category !== selectedCategory) {
      return null;
    }
    const matchingItems = cat.items.filter(item => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    });
    if (matchingItems.length === 0) return null;
    return { ...cat, items: matchingItems };
  }).filter(Boolean) as typeof ALL_PLATFORM_FEATURES;

  const content = (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[0.68rem] font-mono uppercase tracking-widest text-[#a3a3a3]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>PLATFORM DIRECTORY // CENTRAL COMMAND</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-inherit tracking-tight">
            All Features &amp; Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] max-w-xl">
            Click any feature to launch its dedicated environment. Access learning resources, live rooms, AI developer tools, and personal growth coaching.
          </p>
        </div>

        {/* Header Quick Controls & Close (if modal) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Toggle Pill */}
          <button
            onClick={() => {
              soundEffects.playClick();
              toggleTheme();
            }}
            className="btn btn-outline text-xs py-2 px-3.5 inline-flex items-center gap-2 text-inherit"
            title="Toggle Black / White Mode"
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            <span className="font-mono text-[0.72rem] uppercase">{isDark ? 'WHITE' : 'BLACK'}</span>
          </button>

          {/* Sound Toggle */}
          <SoundToggle />

          {/* Customize Typography / Layout */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsCustomizerOpen(true);
            }}
            className="btn btn-outline text-xs py-2 px-3.5 inline-flex items-center gap-1.5 text-inherit"
            title="Customize Typography and Appearance"
          >
            <Sliders size={13} />
            <span className="font-mono text-[0.72rem]">CUSTOMIZE</span>
          </button>

          {/* Close Modal Trigger */}
          {onClose && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-2 rounded-full border border-white/20 hover:border-white text-inherit hover:bg-white/10 transition-colors ml-2"
              title="Close Features Directory"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Community & Connections', 'Academic & Knowledge', 'Events & Opportunities', 'Growth & Career', 'AI Developer Suite', 'Interactive / Live Hub', 'Games Arena'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                soundEffects.playClick();
                setSelectedCategory(cat);
              }}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-[#a3a3a3] hover:text-white hover:border-white/20'
              }`}
            >
              {cat === 'All' ? 'All (25+)' : cat.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72 shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Filter features..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-inherit placeholder:text-[#737373] focus:outline-none focus:border-white/30 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737373] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categories & Cards Grid */}
      <div className="space-y-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-[#737373] space-y-2">
            <p className="font-mono text-sm">No features found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn btn-outline text-xs py-1.5 px-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCategories.map(cat => (
            <div key={cat.category} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#a3a3a3]">
                  {cat.category}
                </h3>
                <span className="text-[0.68rem] font-mono text-[#737373]">
                  • {cat.items.length} {cat.items.length === 1 ? 'Feature' : 'Features'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.items.map(item => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
                  const requiresAuth = !item.isPublic && !isAuthenticated;
                  const targetHref = requiresAuth 
                    ? `/login?redirect=${encodeURIComponent(item.href)}`
                    : item.href;

                  return (
                    <Link
                      key={item.id}
                      href={targetHref}
                      onClick={() => {
                        soundEffects.playClick();
                        if (onClose) onClose();
                      }}
                      className={`mono-card p-5 flex flex-col justify-between space-y-4 transition-all no-underline text-inherit group ${
                        isActive
                          ? 'border-white bg-white/10 ring-1 ring-white/40'
                          : 'hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-inherit group-hover:scale-110 transition-transform">
                            <IconComponent size={16} />
                          </div>
                          {item.badge && (
                            <span className="mono-badge text-[0.6rem] py-0.5 px-2">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm sm:text-base text-inherit group-hover:text-white transition-colors">
                              {item.name}
                            </h4>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] leading-relaxed mt-1 line-clamp-2">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-[0.68rem] font-mono text-[#737373]">
                          {isActive ? 'CURRENT PAGE' : requiresAuth ? '🔒 Sign In' : 'Direct'}
                        </span>
                        <div className="font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Launch</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Standalone page rendering (inside container)
  if (isStandalonePage) {
    return <div className="container-custom pt-24 sm:pt-28 pb-24">{content}</div>;
  }

  // Full-page slide-down modal rendering
  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto backdrop-blur-2xl p-4 sm:p-8 pt-20 animate-fadeIn transition-colors"
      style={{
        background: isDark ? 'rgba(5, 5, 5, 0.96)' : 'rgba(255, 255, 255, 0.97)',
        color: isDark ? '#ffffff' : '#050505',
      }}
    >
      {content}
    </div>
  );
}
