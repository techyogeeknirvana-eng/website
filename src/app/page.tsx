'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Calendar, 
  Users, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  Award,
  Layers,
  Handshake,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { CommunityStatsStrip } from '@/components/home/CommunityStatsStrip';
import { WhatIsTYGN } from '@/components/home/WhatIsTYGN';
import { EcosystemVisualizer } from '@/components/home/EcosystemVisualizer';
import { TYGNJourney } from '@/components/home/TYGNJourney';
import { GrowthHubSection } from '@/components/growth/GrowthHubSection';
import { VerbalMannersQuiz } from '@/components/growth/VerbalMannersQuiz';
import { SayItBetterGame } from '@/components/games/SayItBetterGame';
import { dbStore } from '@/lib/db/store';
import { Opportunity, CommunityEvent, Project } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function HomePage() {
  const { isAuthenticated, currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [growthProgress, setGrowthProgress] = useState(growthProgressStore.getProgress());

  const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA';

  useEffect(() => {
    setOpportunities(dbStore.getOpportunities().slice(0, 3));
    setEvents(dbStore.getEvents().slice(0, 3));
    setProjects(dbStore.getProjects().slice(0, 3));
    setGrowthProgress(growthProgressStore.getProgress());
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const founder = {
    name: 'Prabh Ansh Jot Singh',
    role: 'Founder & Technology Enthusiast',
    image: '/team/prabh-ansh-jot-singh.png',
    bio: 'Technology enthusiast and founder of TYGN, focused on cybersecurity, cloud infrastructure, AI systems, and student builder platforms.',
    linkedin: 'https://www.linkedin.com/in/prabhanshjotsingh/?skipRedirect=true'
  };

  const coreTeam = [
    {
      name: 'Ishpreet',
      role: 'Co-Founder & Full Stack Developer',
      image: '/team/ishpreet.png',
      bio: 'Full Stack Developer passionate about scalable web architecture, clean frontend systems, and high-performance interactive tools.',
      linkedin: 'https://www.linkedin.com/in/ishpreet-singh-cse/'
    },
    {
      name: 'Harsh Vardhan Singh',
      role: 'Co-Founder & Data Analyst',
      image: '/team/harsh-vardhan-singh.jpg',
      bio: 'Data Analyst focused on telemetry insights, business intelligence, pattern recognition, and community growth modeling.',
      linkedin: 'https://www.linkedin.com/in/harshvardhan-singh-57812537a?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    }
  ];

  return (
    <div className="space-y-16 pb-16 overflow-hidden">
      {/* 1. PERSONALIZED LIVING PLATFORM BANNER (For Active / Returning Users) */}
      {isAuthenticated && currentUser && (
        <section className="max-w-6xl mx-auto px-4 pt-6">
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-400/30 bg-cyan-500/10 flex flex-wrap items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-300 font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {getTimeGreeting()}, {currentUser.name || 'Builder'}!
                </h4>
                <p className="text-xs text-slate-300">
                  Your communication score improved by 8% this week. Current focus area:{' '}
                  <span className="text-cyan-300 font-semibold">Professional Tone</span> &bull; Level {growthProgress.levelNumber} ({growthProgress.levelName}).
                </p>
              </div>
            </div>

            <Link
              href="/growth"
              onClick={() => soundEffects.playClick()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-xs hover:opacity-95 shadow-md inline-flex items-center gap-1.5"
            >
              <span>Continue Learning</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      )}

      {/* 2. HERO SECTION */}
      <HeroSection />

      {/* 3. LIVE COMMUNITY STATS STRIP */}
      <CommunityStatsStrip />

      {/* 4. WHAT IS TYGN? (5 Pillars) */}
      <WhatIsTYGN />

      {/* 5. TYGN ECOSYSTEM (Central Visualizer) */}
      <EcosystemVisualizer />

      {/* 6. THE TYGN JOURNEY (Signature 3-Step Interactive Experience) */}
      <TYGNJourney />

      {/* 7. UPCOMING EVENTS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar size={13} /> Hackathons &amp; Summits
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/events"
            onClick={() => soundEffects.playClick()}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <span>View All Events ({events.length}+)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map(evt => (
              <div 
                key={evt.id}
                className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-cyan-400/30 transition-all shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 font-bold uppercase text-[10px]">
                      {evt.category}
                    </span>
                    <span className="font-mono">{evt.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {evt.isOnline ? 'Online / Virtual' : evt.location}
                  </span>
                  <Link
                    href={`/events`}
                    className="text-xs font-bold text-cyan-400 hover:text-white inline-flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-slate-400 text-xs">
              Check out our upcoming campus summits and workshops on the Events page.
            </div>
          )}
        </div>
      </section>

      {/* 8. OPPORTUNITIES HUB */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Briefcase size={13} /> Internships &amp; Fellowships
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Opportunities Hub
            </h2>
          </div>
          <Link
            href="/opportunities"
            onClick={() => soundEffects.playClick()}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
          >
            <span>Browse All Opportunities</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.length > 0 ? (
            opportunities.map(opp => (
              <div 
                key={opp.id}
                className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-emerald-400/30 transition-all shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 font-bold uppercase text-[10px]">
                      {opp.type}
                    </span>
                    <span className="font-mono text-emerald-400">{opp.stipendOrSalary}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    {opp.title}
                  </h3>
                  <div className="text-xs text-slate-400 mb-3 font-medium">
                    {opp.company} &bull; {opp.location}
                  </div>
                  <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed mb-4">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Deadline: {opp.deadline}</span>
                  <Link
                    href={`/opportunities`}
                    className="text-xs font-bold text-emerald-400 hover:text-white inline-flex items-center gap-1"
                  >
                    <span>View Role</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-slate-400 text-xs">
              Explore verified developer internships and competitions on the Opportunities board.
            </div>
          )}
        </div>
      </section>

      {/* 9. GROWTH HUB SHOWCASE (with Daily Challenge & Skill Radar) */}
      <GrowthHubSection />

      {/* 10. VERBAL MANNERS & ETIQUETTE 10-Q DIAGNOSTIC PREVIEW */}
      <section className="max-w-6xl mx-auto px-4">
        <VerbalMannersQuiz />
      </section>

      {/* 11. FLAGSHIP GAME: "SAY IT BETTER" */}
      <section className="max-w-4xl mx-auto px-4">
        <SayItBetterGame />
      </section>

      {/* 12. ACADEMIC NOTES DRIVE & COMMUNITY MOMENTS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notes Drive Banner */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 shadow-md">
                <BookOpen size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Academic Knowledge Base
              </span>
              <h3 className="text-2xl font-bold text-white font-display mb-2">
                B.Tech Notes &amp; Curriculum Drive
              </h3>
              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed mb-6">
                Direct access to curated semester notes, previous year exam patterns, syllabus breakdowns, and lab manuals organized branch-wise by senior student toppers.
              </p>
            </div>

            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEffects.playClick()}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 inline-flex items-center gap-2 self-start transition-transform transform hover:-translate-y-0.5"
            >
              <span>Open Official Google Drive</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Collab Finder Banner */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 shadow-md">
                <Users size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Builder Matchmaking
              </span>
              <h3 className="text-2xl font-bold text-white font-display mb-2">
                Find Your Hackathon Teammates
              </h3>
              <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed mb-6">
                Looking for a frontend specialist, smart contract engineer, or pitch presenter? Post your project needs and match with ambitious builders across universities.
              </p>
            </div>

            <Link
              href="/collab-finder"
              onClick={() => soundEffects.playClick()}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 inline-flex items-center gap-2 self-start transition-transform transform hover:-translate-y-0.5"
            >
              <span>Explore Collab Finder</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 13. AUTHENTIC LEADERSHIP (REAL TEAM ONLY) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
            Student Leadership
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            The Builders Behind TYGN
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Real student developers and technology enthusiasts spearheading the TYGN ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Founder */}
          <div className="glass-card rounded-3xl p-6 border border-cyan-400/30 bg-cyan-500/[0.03] shadow-xl flex flex-col justify-between text-center">
            <div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 bg-white/5">
                <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-base font-bold text-white">{founder.name}</h4>
              <span className="text-xs text-cyan-400 font-semibold block mb-2">{founder.role}</span>
              <p className="text-xs text-slate-300/80 leading-relaxed mb-4">{founder.bio}</p>
            </div>
            <a
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-cyan-400 hover:text-white inline-flex items-center justify-center gap-1 pt-3 border-t border-white/10"
            >
              <span>LinkedIn Profile</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Co-Founders */}
          {coreTeam.map((m, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between text-center">
              <div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 border border-white/20 bg-white/5">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-base font-bold text-white">{m.name}</h4>
                <span className="text-xs text-indigo-400 font-semibold block mb-2">{m.role}</span>
                <p className="text-xs text-slate-300/80 leading-relaxed mb-4">{m.bio}</p>
              </div>
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-400 hover:text-white inline-flex items-center justify-center gap-1 pt-3 border-t border-white/10"
              >
                <span>LinkedIn Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 14. BUILD WITH TYGN (PARTNER / SPONSOR CTA) */}
      <section className="max-w-6xl mx-auto px-4">
        <div 
          className="glass-card rounded-3xl p-8 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15), transparent 70%), linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(5, 7, 13, 0.98) 100%)'
          }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Handshake size={14} /> Alliances &amp; Partnerships
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display mb-4">
            Build With TYGN
          </h2>
          <p className="text-slate-300/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
            Colleges, student communities, tech speakers, and companies: collaborate with TYGN to accelerate practical learning, co-host hackathons, and connect with top student talent.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:techyogeeknirvana@gmail.com?subject=Partnership%20with%20TYGN"
              onClick={() => soundEffects.playClick()}
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 inline-flex items-center gap-2"
            >
              <Mail size={16} />
              <span>Partner With Us</span>
            </a>

            <a
              href="https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEffects.playClick()}
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 inline-flex items-center gap-2"
            >
              <Users size={16} className="text-emerald-400" />
              <span>Join Community Network</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
