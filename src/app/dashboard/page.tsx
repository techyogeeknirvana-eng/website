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
  Compass,
  Radio,
  Bot,
  Users,
  Code2,
  GitBranch,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { dbStore } from '@/lib/db/store';
import { Opportunity, CommunityEvent } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { growthProgressStore } from '@/lib/growth/progressStore';

export default function DashboardPage() {
  const { currentUser, isAdmin } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [growthProgress, setGrowthProgress] = useState(growthProgressStore.getProgress());

  useEffect(() => {
    setOpportunities(dbStore.getOpportunities().slice(0, 3));
    setEvents(dbStore.getEvents().slice(0, 3));
    setGrowthProgress(growthProgressStore.getProgress());
  }, []);

  const rawName = currentUser?.name?.split(' ')[0] || 'BUILDER';
  const firstName = rawName.toUpperCase();

  // Determine time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  // Real skill percentages from radarScores
  const isDiagnosticCompleted = (growthProgress.totalQuizSessions || 0) > 0;
  const commPercent = growthProgress.radarScores?.communication || 78;
  const techPercent = growthProgress.radarScores?.technicalKnowledge || 90;
  const leaderPercent = growthProgress.radarScores?.leadership || 68;
  const critPercent = growthProgress.radarScores?.criticalThinking || 82;

  // Convert percentage to 10-block ASCII bar
  const renderAsciiBar = (pct: number) => {
    const filled = Math.round(pct / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  const userLevel = currentUser?.level || 'LEVEL 04';
  const userTitle = currentUser?.title || (currentUser?.role === 'ADMIN' ? 'LEAD ARCHITECT' : 'BUILDER');
  const userXp = currentUser?.xp || 2450;

  return (
    <ProtectedRoute>
      <div className="container-custom pt-24 sm:pt-28 pb-24 space-y-12 animate-fadeIn">
        {/* 1. COMMAND CENTER GREETING & STATUS HEADER */}
        <div className="mono-card p-8 sm:p-12 relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div className="space-y-2">
              <div className="editorial-eyebrow">
                PERSONAL COMMAND CENTER // {isAdmin ? 'LEAD ADMINISTRATOR' : 'STUDENT BUILDER'}
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-inherit tracking-tight">
                {getGreeting()}, {firstName}
              </h1>
              <p className="text-sm sm:text-base text-[#a3a3a3] font-normal">
                Ready to build something?
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-center">
                <span className="text-[0.62rem] font-mono text-[#737373] uppercase block">Standing</span>
                <span className="font-mono font-bold text-sm text-inherit">{userLevel}</span>
              </div>
              <div className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-center">
                <span className="text-[0.62rem] font-mono text-[#737373] uppercase block">Role</span>
                <span className="font-mono font-bold text-sm text-inherit">{userTitle}</span>
              </div>
              <div className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-center">
                <span className="text-[0.62rem] font-mono text-[#737373] uppercase block">Total XP</span>
                <span className="font-mono font-bold text-sm text-inherit">{userXp} XP</span>
              </div>
              <div className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-center">
                <span className="text-[0.62rem] font-mono text-[#737373] uppercase block">Streak</span>
                <span className="font-mono font-bold text-sm text-inherit">🔥 {growthProgress.currentStreak} Days</span>
              </div>
            </div>
          </div>

          {/* 2. YOUR PROGRESS: VERIFIED SKILL BARS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#737373]">
                VERIFIED SKILL READOUT
              </span>
              <span className="text-xs font-mono text-[#737373]">
                Updated via Diagnostic &amp; Commits
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>COMMUNICATION</span>
                  <span>{commPercent}%</span>
                </div>
                <div className="font-mono text-xs text-white tracking-widest">
                  {renderAsciiBar(commPercent)}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>TECHNICAL</span>
                  <span>{techPercent}%</span>
                </div>
                <div className="font-mono text-xs text-white tracking-widest">
                  {renderAsciiBar(techPercent)}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>LEADERSHIP</span>
                  <span>{leaderPercent}%</span>
                </div>
                <div className="font-mono text-xs text-white tracking-widest">
                  {renderAsciiBar(leaderPercent)}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>CRITICAL THINK</span>
                  <span>{critPercent}%</span>
                </div>
                <div className="font-mono text-xs text-white tracking-widest">
                  {renderAsciiBar(critPercent)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CONTINUE WHERE YOU LEFT OFF & TODAY'S CHALLENGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Continue Where You Left Off Card */}
          <div className="lg:col-span-7 mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                  CONTINUE WHERE YOU LEFT OFF
                </span>
                <span className="text-xs font-mono text-[#737373]">
                  {isDiagnosticCompleted ? 'Active Arena' : '70% Complete'}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit">
                  {isDiagnosticCompleted 
                    ? 'Say It Better: Round 04 Workplace Friction' 
                    : '10-Question Verbal Manners Diagnostic'}
                </h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                  {isDiagnosticCompleted
                    ? 'You have 2 practice scenarios pending review. Transform informal slack messages into polished executive communications.'
                    : 'You started the situational verbal diagnostic. 3 questions remaining to calibrate your weakness weighting and generate your radar.'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: isDiagnosticCompleted ? '85%' : '70%' }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#737373]">
                {isDiagnosticCompleted ? 'Practice XP: +40' : 'Unlock: Radar Badge'}
              </span>
              <Link
                href={isDiagnosticCompleted ? '/games' : '/growth'}
                onClick={() => soundEffects.playClick()}
                className="btn btn-primary text-xs py-2 px-5 font-bold inline-flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Today's Mission & Quick Action */}
          <div className="lg:col-span-5 mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                  DAILY MISSION
                </span>
                <span className="font-mono text-xs text-[#737373]">+50 XP</span>
              </div>

              <h3 className="font-display font-bold text-xl text-inherit">
                30-Second Elevator Pitch
              </h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Record or speak your 30-second introduction: name, tech stack, and recent project without verbal crutches or fillers.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#737373]">
                Growth Hub
              </span>
              <Link
                href="/growth"
                onClick={() => soundEffects.playClick()}
                className="btn btn-outline text-xs py-2 px-4 font-semibold inline-flex items-center gap-1.5"
              >
                <span>Start Timer</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. QUICK ACCESS GRID (ALL PLATFORM TOOLS) */}
        <div className="space-y-4">
          <div className="editorial-eyebrow">
            DIRECT TOOL ACCESS
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: 'B.Tech Notes', href: '/notes', icon: BookOpen, sub: 'Study Drive' },
              { label: 'Events', href: '/events', icon: Trophy, sub: 'Hackathons' },
              { label: 'Growth Hub', href: '/growth', icon: Sparkles, sub: 'Etiquette' },
              { label: 'Games Arena', href: '/games', icon: Gamepad2, sub: 'Say It Better' },
              { label: 'Opportunities', href: '/opportunities', icon: Briefcase, sub: 'Internships' },
              { label: 'AI Resume Lab', href: '/resume-lab', icon: FileText, sub: 'ATS Audit' },
              { label: 'AI Interview', href: '/ai-interview', icon: Bot, sub: 'Mock Room' },
              { label: 'AI Explainer', href: '/ai-code', icon: Code2, sub: 'Code Dissect' },
              { label: 'Collab Finder', href: '/collab-finder', icon: Users, sub: 'Teammates' },
              { label: 'Roadmaps', href: '/roadmaps', icon: GitBranch, sub: 'Career Paths' },
            ].map((tool, idx) => {
              const IconComponent = tool.icon;
              return (
                <Link
                  key={idx}
                  href={tool.href}
                  onClick={() => soundEffects.playClick()}
                  className="mono-card p-4 flex flex-col justify-between space-y-3 hover:border-white/40 transition-all no-underline text-inherit group"
                >
                  <div className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-inherit group-hover:scale-110 transition-transform">
                    <IconComponent size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-inherit group-hover:text-white transition-colors">
                      {tool.label}
                    </div>
                    <div className="text-[0.68rem] text-[#737373]">
                      {tool.sub}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 5. RECOMMENDED FOR YOU & UPCOMING ACTIVITIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="mono-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
              <div>
                <div className="editorial-eyebrow">SCHEDULE</div>
                <h3 className="font-display font-bold text-xl text-inherit">Upcoming Events &amp; Competitions</h3>
              </div>
              <Link
                href="/events"
                onClick={() => soundEffects.playClick()}
                className="text-xs font-mono text-inherit hover:opacity-70 no-underline"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
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

          {/* Recommended Opportunities */}
          <div className="mono-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
              <div>
                <div className="editorial-eyebrow">CAREERS</div>
                <h3 className="font-display font-bold text-xl text-inherit">Recommended Opportunities</h3>
              </div>
              <Link
                href="/opportunities"
                onClick={() => soundEffects.playClick()}
                className="text-xs font-mono text-inherit hover:opacity-70 no-underline"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
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
