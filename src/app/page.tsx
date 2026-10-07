'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Briefcase, 
  Calendar, 
  Sparkles, 
  Gamepad2, 
  ArrowUpRight,
  ShieldCheck,
  Check,
  Lock,
  Users,
  FolderGit2,
  Trophy,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { CinematicLoader } from '@/components/home/CinematicLoader';
import { HeroCyberWarrior } from '@/components/home/HeroCyberWarrior';
import { PlatformDirectory } from '@/components/home/PlatformDirectory';
import { dbStore } from '@/lib/db/store';
import { Opportunity, CommunityEvent } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export default function HomePage() {
  const { isDark } = useThemeCustomizer();
  const { signInWithGoogle, isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    setOpportunities(dbStore.getOpportunities().slice(0, 3));
    setEvents(dbStore.getEvents().slice(0, 3));
  }, []);

  return (
    <div className="space-y-32 sm:space-y-44 pb-24 select-none">
      {/* 10. CINEMATIC 1-2s INTRO LOADER */}
      <CinematicLoader />

      {/* 9, 11, 12. HERO CYBER WARRIOR & SCROLL STORYTELLING */}
      <HeroCyberWarrior />

      {/* 15. SECTION 01 — TYGN IN ONE SENTENCE */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="editorial-eyebrow">
            01 — THE ESSENCE OF TYGN
          </div>
          <h2 className="editorial-title text-3xl sm:text-5xl md:text-6xl text-inherit leading-tight">
            An institutional-grade technology ecosystem engineered for ambitious B.Tech builders who refuse to wait until graduation to ship production software, assemble hackathon squads, and master executive presence.
          </h2>
          <div className="flex justify-center pt-2">
            <span className={`w-12 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
          </div>
        </div>
      </section>

      {/* 15. SECTION 02 — FULL PLATFORM DIRECTORY & ECOSYSTEM (ALL 4 PILLARS) */}
      <PlatformDirectory />

      {/* 15. SECTION 03 — LIVE EVENTS & COMPETITIONS */}
      <section className="container-custom space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              03 — LIVE TECH CALENDAR
            </div>
            <h2 className="editorial-title text-3xl sm:text-5xl mt-2">
              Competitions &amp; Events
            </h2>
          </div>
          <Link
            href="/events"
            onClick={() => soundEffects.playClick()}
            className="text-xs sm:text-sm font-semibold text-inherit hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 no-underline"
          >
            <span>View All Events</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#737373]">
                  <span className="font-mono">{evt.date}</span>
                  <span className="mono-badge text-[0.62rem] py-0.5 px-2">{evt.category}</span>
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-inherit">
                  {evt.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#737373] line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
                <span className="text-xs font-mono text-[#737373]">
                  {evt.participantsCount} Registered
                </span>
                <Link
                  href={isAuthenticated ? `/events?id=${evt.id}` : `/login?redirect=${encodeURIComponent(`/events?id=${evt.id}`)}`}
                  onClick={() => soundEffects.playClick()}
                  className="btn btn-outline text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 no-underline text-inherit"
                >
                  <span>{isAuthenticated ? 'Details' : 'Sign in to register'}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15. SECTION 04 — CURATED OPPORTUNITIES MARKETPLACE */}
      <section className="container-custom space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              04 — CAREER ACCELERATION
            </div>
            <h2 className="editorial-title text-3xl sm:text-5xl mt-2">
              Curated Opportunities
            </h2>
          </div>
          <Link
            href="/opportunities"
            onClick={() => soundEffects.playClick()}
            className="text-xs sm:text-sm font-semibold text-inherit hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 no-underline"
          >
            <span>Explore Opportunities</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#737373]">
                  <span className="font-semibold text-inherit">{opp.company}</span>
                  <span className="mono-badge text-[0.62rem] py-0.5 px-2">{opp.type}</span>
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-inherit">
                  {opp.title}
                </h3>
                <div className="text-xs text-[#737373]">
                  {opp.location} • {opp.stipendOrSalary}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-[0.68rem] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a3a3a3]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
                <span className="text-[0.72rem] font-mono text-[#737373]">
                  Verified Role
                </span>
                <Link
                  href={isAuthenticated ? `/opportunities?id=${opp.id}` : `/login?redirect=${encodeURIComponent(`/opportunities?id=${opp.id}`)}`}
                  onClick={() => soundEffects.playClick()}
                  className="btn btn-outline text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 no-underline text-inherit"
                >
                  <span>{isAuthenticated ? 'Apply Now' : 'Sign in to apply'}</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15. SECTION 05 — PERSONAL GROWTH HUB */}
      <section className="container-custom">
        <div className="mono-card p-8 sm:p-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div className="space-y-3 max-w-xl">
              <div className="editorial-eyebrow">
                05 — PROFESSIONAL ETIOUETTE &amp; MANNERS
              </div>
              <h2 className="editorial-title text-3xl sm:text-5xl">
                Become Better At More Than Code.
              </h2>
              <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
                Technical brilliance fails when paired with crude communication. Train with our signature 10-Question Diagnostic, tone rewrites, and interview simulations.
              </p>
            </div>

            <Link
              href={isAuthenticated ? '/growth' : '/login?redirect=/growth'}
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary text-xs sm:text-sm py-3 px-6 shrink-0 inline-flex items-center gap-2"
            >
              {!isAuthenticated && <Lock size={14} />}
              <span>{isAuthenticated ? 'Enter Growth Hub' : 'Sign in to unlock Growth Hub'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 space-y-2">
              <div className="font-display font-black text-2xl">10-Q Diagnostic</div>
              <p className="text-xs text-[#737373] leading-relaxed">
                Adaptive situational testing that detects communication blindspots and calculates weakness weights.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 space-y-2">
              <div className="font-display font-black text-2xl">Phrase Analyzer</div>
              <p className="text-xs text-[#737373] leading-relaxed">
                Instant translation of aggressive, blunt, or passive campus messages into executive clarity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 space-y-2">
              <div className="font-display font-black text-2xl">Daily Streak Engine</div>
              <p className="text-xs text-[#737373] leading-relaxed">
                30-second daily elevator pitch challenges designed to build permanent verbal confidence under pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. SECTION 06 — STUDENT BUILDERS SHOWCASE */}
      <section className="container-custom space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              06 — STUDENT CODE IN PRODUCTION
            </div>
            <h2 className="editorial-title text-3xl sm:text-5xl mt-2">
              Open Showcase Projects
            </h2>
          </div>
          <Link
            href="/projects"
            onClick={() => soundEffects.playClick()}
            className="text-xs sm:text-sm font-semibold text-inherit hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 no-underline"
          >
            <span>Browse All Repos</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'TYGN Next Core Engine',
              desc: 'High-performance React 18, Next.js, and SQLite architecture powering real-time student telemetry.',
              tags: ['Next.js', 'TypeScript', 'Tailwind', 'SQLite'],
              commits: '340 Commits',
            },
            {
              title: 'ATS Resume OCR Parser',
              desc: 'Client-side PDF and image resume parser evaluating formatting density and keyword compliance.',
              tags: ['Canvas OCR', 'PDF.js', 'Regex', 'NLP'],
              commits: '128 Commits',
            },
            {
              title: 'Live Quiz Synchronous Stage',
              desc: 'Real-time WebSocket multiplayer quiz room engine with PIN access and low-latency score ranking.',
              tags: ['WebSockets', 'Node.js', 'State Engine'],
              commits: '215 Commits',
            },
          ].map((repo, idx) => (
            <div key={idx} className="mono-card p-6 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#737373]">
                  <span className="font-mono">{repo.commits}</span>
                  <span className="mono-badge text-[0.62rem] py-0.5 px-2">PUBLIC REPO</span>
                </div>
                <h3 className="font-display font-bold text-lg text-inherit">
                  {repo.title}
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  {repo.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {repo.tags.map((tag, i) => (
                    <span key={i} className="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a3a3a3]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <Link
                  href="/projects"
                  onClick={() => soundEffects.playClick()}
                  className="text-xs font-semibold text-inherit inline-flex items-center gap-1 hover:opacity-70 no-underline"
                >
                  <span>Inspect Code</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15. SECTION 07 — COMMUNITY & COLLABORATION */}
      <section className="container-custom">
        <div className="mono-card p-8 sm:p-14 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-3 max-w-xl">
              <div className="editorial-eyebrow">
                07 — BUILDER MATCHMAKING
              </div>
              <h2 className="editorial-title text-3xl sm:text-5xl">
                Find Your Hackathon Teammates.
              </h2>
              <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
                Looking for a frontend specialist, Rust engineer, or pitch presenter? Post your project needs and match with committed builders across universities.
              </p>
            </div>

            <Link
              href="/collab-finder"
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary text-xs sm:text-sm py-3 px-6 shrink-0 inline-flex items-center gap-2"
            >
              <span>Explore Collab Finder</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="text-xs font-mono text-[#737373]">SQUAD FORMATION</div>
              <h4 className="font-display font-bold text-base text-inherit">Cross-Campus Teams</h4>
              <p className="text-xs text-[#737373]">Connect with students from other colleges with complementary skills.</p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="text-xs font-mono text-[#737373]">TOPIC CHANNELS</div>
              <h4 className="font-display font-bold text-base text-inherit">Real-time Discussions</h4>
              <p className="text-xs text-[#737373]">Ask for peer code reviews, share setup guides, and debug tricky bugs.</p>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="text-xs font-mono text-[#737373]">COMMUNITY FEED</div>
              <h4 className="font-display font-bold text-base text-inherit">Student Moments</h4>
              <p className="text-xs text-[#737373]">Drop milestone achievements and hackathon podium trophies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. SECTION 08 — FINAL CTA: ENTER NIRVANA */}
      <section className="container-custom">
        <div className="mono-card p-10 sm:p-20 text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="editorial-eyebrow">
              08 — ENTER NIRVANA
            </div>
            <h2 className="editorial-title text-4xl sm:text-6xl md:text-7xl">
              Build With Us.
            </h2>
            <p className="text-sm sm:text-lg text-[#737373] max-w-xl mx-auto leading-relaxed">
              Step into a community that demands technical execution, sharp communication, and real engineering standards.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isAuthenticated ? (
              <button
                onClick={() => signInWithGoogle()}
                className="btn btn-primary text-sm sm:text-base py-3.5 px-8 font-bold w-full sm:w-auto"
              >
                Join TechYOGeek Nirvana
              </button>
            ) : (
              <Link
                href="/dashboard"
                onClick={() => soundEffects.playClick()}
                className="btn btn-primary text-sm sm:text-base py-3.5 px-8 font-bold w-full sm:w-auto no-underline"
              >
                Launch Your Dashboard
              </Link>
            )}

            <Link
              href="/growth"
              onClick={() => soundEffects.playClick()}
              className="btn btn-secondary text-sm sm:text-base py-3.5 px-8 font-semibold w-full sm:w-auto no-underline"
            >
              Take Communication Diagnostic
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
