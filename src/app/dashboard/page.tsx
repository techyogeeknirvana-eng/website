'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Briefcase, 
  Calendar, 
  ArrowRight,
  Zap, 
  Flame, 
  CheckCircle2, 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  FolderGit2, 
  User, 
  ExternalLink,
  ShieldCheck,
  Check,
  Share2
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { dbStore } from '@/lib/db/store';
import { Opportunity, CommunityEvent } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SkillRadar } from '@/components/growth/SkillRadar';
import { growthProgressStore } from '@/lib/growth/progressStore';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [growthProgress, setGrowthProgress] = useState(growthProgressStore.getProgress());

  useEffect(() => {
    setOpportunities(dbStore.getOpportunities().slice(0, 3));
    setEvents(dbStore.getEvents().slice(0, 3));
    setGrowthProgress(growthProgressStore.getProgress());
  }, []);

  const firstName = currentUser?.name?.split(' ')[0] || 'Student';

  return (
    <ProtectedRoute>
      <div className="container-custom pt-24 sm:pt-28 pb-24 space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="space-y-3">
            <div className="editorial-eyebrow">
              AUTHENTICATED WORKSPACE // {currentUser?.role === 'ADMIN' ? 'ADMINISTRATOR' : 'MEMBER'}
            </div>
            <h1 className="editorial-title text-4xl sm:text-6xl">
              Welcome back, {firstName}.
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Your TYGN platform overview. Track your learning, growth score, upcoming community events, and career opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="mono-card px-4 py-2.5 text-center">
              <div className="text-[0.62rem] font-mono text-[#737373] uppercase">XP Balance</div>
              <div className="font-display font-black text-xl text-inherit">{currentUser?.xp || 0}</div>
            </div>
            <div className="mono-card px-4 py-2.5 text-center">
              <div className="text-[0.62rem] font-mono text-[#737373] uppercase">Streak</div>
              <div className="font-display font-black text-xl text-inherit flex items-center justify-center gap-1">
                <span>🔥</span> {growthProgress.currentStreak}
              </div>
            </div>
            <Link
              href="/profile"
              onClick={() => soundEffects.playClick()}
              className="btn btn-secondary text-xs py-3 px-4 font-bold inline-flex items-center gap-1.5 no-underline text-inherit"
            >
              <User size={14} />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* SECTION 1: TODAY'S CHALLENGE & RAPID ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Challenge */}
          <div className="lg:col-span-2 mono-card p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
                <span className="mono-badge text-[0.62rem] py-0.5 px-2">TODAY&apos;S CHALLENGE</span>
                <span>+50 XP</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit">
                30-Second Elevator Pitch: State Your Engineering Domain
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Introduce yourself, your primary technology stack (e.g., Next.js, Rust, or Python ML), and the problem you are solving in 3 concise sentences without filler words.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#737373]">
                Communication Hub
              </span>
              <Link
                href="/growth"
                onClick={() => soundEffects.playClick()}
                className="btn btn-primary text-xs py-2 px-5 font-bold inline-flex items-center gap-2"
              >
                <span>Launch Practice</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Rapid Ecosystem Launchers */}
          <div className="mono-card p-6 sm:p-8 space-y-4">
            <div className="editorial-eyebrow">
              CONTINUE LEARNING
            </div>
            <div className="space-y-2.5">
              <Link
                href="/notes"
                onClick={() => soundEffects.playClick()}
                className="p-3 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] flex items-center justify-between text-xs font-semibold text-inherit no-underline transition-colors block"
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 size={15} />
                  <span>B.Tech Notes Drive</span>
                </div>
                <ArrowRight size={13} className="text-[#737373]" />
              </Link>

              <Link
                href="/growth"
                onClick={() => soundEffects.playClick()}
                className="p-3 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] flex items-center justify-between text-xs font-semibold text-inherit no-underline transition-colors block"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles size={15} />
                  <span>10-Q Verbal Diagnostic</span>
                </div>
                <ArrowRight size={13} className="text-[#737373]" />
              </Link>

              <Link
                href="/games"
                onClick={() => soundEffects.playClick()}
                className="p-3 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] flex items-center justify-between text-xs font-semibold text-inherit no-underline transition-colors block"
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad2 size={15} />
                  <span>Say It Better Arena</span>
                </div>
                <ArrowRight size={13} className="text-[#737373]" />
              </Link>

              <Link
                href="/opportunities"
                onClick={() => soundEffects.playClick()}
                className="p-3 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] flex items-center justify-between text-xs font-semibold text-inherit no-underline transition-colors block"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase size={15} />
                  <span>Jobs &amp; Internships</span>
                </div>
                <ArrowRight size={13} className="text-[#737373]" />
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 2: GROWTH PROGRESS (SKILL RADAR) */}
        <div className="mono-card p-6 sm:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div>
              <div className="editorial-eyebrow">
                GROWTH PROGRESS // VERIFIED COMPETENCIES
              </div>
              <h2 className="editorial-title text-2xl sm:text-4xl mt-1">
                Personal Growth Radar
              </h2>
            </div>
            <Link
              href="/growth"
              onClick={() => soundEffects.playClick()}
              className="text-xs font-mono text-inherit hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 no-underline"
            >
              <span>View Full Diagnostic</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="flex justify-center py-4">
            <SkillRadar />
          </div>
        </div>

        {/* SECTION 3: UPCOMING EVENTS & NEW OPPORTUNITIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="mono-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
              <div>
                <div className="editorial-eyebrow">SCHEDULE</div>
                <h3 className="font-display font-bold text-xl text-inherit">Upcoming Events</h3>
              </div>
              <Link
                href="/events"
                onClick={() => soundEffects.playClick()}
                className="text-xs font-mono text-inherit hover:opacity-70 no-underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div 
                  key={evt.id}
                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="mono-badge text-[0.62rem] py-0.5 px-2">{evt.category}</span>
                    <h4 className="font-display font-bold text-sm text-inherit">{evt.title}</h4>
                    <p className="text-xs text-[#737373]">{evt.date} • {evt.location}</p>
                  </div>
                  <Link
                    href={`/events?id=${evt.id}`}
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-outline text-xs py-1 px-3 shrink-0 no-underline text-inherit"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* New Opportunities */}
          <div className="mono-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
              <div>
                <div className="editorial-eyebrow">CAREERS</div>
                <h3 className="font-display font-bold text-xl text-inherit">New Opportunities</h3>
              </div>
              <Link
                href="/opportunities"
                onClick={() => soundEffects.playClick()}
                className="text-xs font-mono text-inherit hover:opacity-70 no-underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div 
                  key={opp.id}
                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-inherit">{opp.company}</span>
                      <span className="mono-badge text-[0.62rem] py-0.5 px-2">{opp.type}</span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-inherit">{opp.title}</h4>
                    <p className="text-xs text-[#737373]">{opp.location} • {opp.stipendOrSalary}</p>
                  </div>
                  <Link
                    href={`/opportunities?id=${opp.id}`}
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-primary text-xs py-1 px-3 shrink-0 no-underline"
                  >
                    Apply
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
