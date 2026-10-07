'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  Flame, 
  Compass,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DailyChallenge } from './DailyChallenge';
import { SkillRadar } from './SkillRadar';
import { soundEffects } from '@/lib/audio/soundEffects';

export function GrowthHubSection() {
  const modules = [
    { title: 'Verbal Manners Engine', desc: '10-question adaptive sessions with zero repeats and instant rationale reviews.', icon: MessageSquare, color: '#00e5ff' },
    { title: 'Communication Coach', desc: 'Real-time tone analyzer and executive rewrites for Slack, emails, and talks.', icon: Sparkles, color: '#6366f1' },
    { title: 'Conversation Simulator', desc: 'Branching dialogue simulations with professors, tech leads, and hiring managers.', icon: Compass, color: '#f59e0b' },
    { title: 'Daily Growth Streak', desc: 'Bite-sized verbal challenges to reinforce executive polish and build XP.', icon: Flame, color: '#ec4899' },
  ];

  return (
    <section className="relative z-20 py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp size={13} /> Personal Development Layer
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            TYGN Growth Hub
          </h2>
          <p className="text-slate-300/80 text-sm sm:text-base mt-2 max-w-xl">
            Where student engineers master verbal manners, professional etiquette, confidence, and leadership communication.
          </p>
        </div>

        <Link
          href="/growth"
          onClick={() => soundEffects.playClick()}
          className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <span>Open Full Growth Hub</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid: Daily Challenge + Skill Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7">
          <DailyChallenge />
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <SkillRadar />
        </div>
      </div>

      {/* 4 Feature Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m, i) => {
          const Icon = m.icon;
          return (
            <Link
              key={i}
              href="/growth"
              onClick={() => soundEffects.playClick()}
              className="glass-card p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md"
                  style={{ backgroundColor: `${m.color}20`, color: m.color }}
                >
                  <Icon size={18} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {m.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <span>Explore Feature</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
