'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Layers, 
  Trophy, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';

interface Pillar {
  id: string;
  name: string;
  verb: string;
  tagline: string;
  desc: string;
  color: string;
  icon: any;
  deliverables: string[];
  link: string;
  ctaText: string;
}

export function WhatIsTYGN() {
  const [activeTab, setActiveTab] = useState<string>('learn');

  const pillars: Pillar[] = [
    {
      id: 'learn',
      name: 'Learn',
      verb: 'Acquire Knowledge that Matters',
      tagline: 'Moving beyond passive tutorials into high-yield engineering application.',
      desc: 'Access curated B.Tech academic notes, engineering roadmaps, industry tech radars, and specialized workshops led by experienced student mentors.',
      color: '#00e5ff',
      icon: BookOpen,
      deliverables: [
        'Curated B.Tech Semester & Branch Notes Drive',
        'Role-Based Engineering Skill Trees (Fullstack, AI, Cloud)',
        'Tech Radar 2026: Adopt, Trial & Assess Frameworks',
        'Hands-on interactive technical workshops'
      ],
      link: '/notes',
      ctaText: 'Access Notes & Resources'
    },
    {
      id: 'build',
      name: 'Build',
      verb: 'Turn Raw Ideas into Live Software',
      tagline: 'Where theoretical concepts become deployed open-source software.',
      desc: 'Form hackathon squads, contribute to student open-source repositories, showcase your portfolio projects, and build working software that employers actually evaluate.',
      color: '#6366f1',
      icon: Layers,
      deliverables: [
        'Open-Source Student Project Showcase',
        'Collab Finder: Pair with developers and designers',
        'AI Resume Lab: ATS formatting and tech audits',
        'Real-world portfolio incubators and review circles'
      ],
      link: '/projects',
      ctaText: 'Explore Projects Hub'
    },
    {
      id: 'compete',
      name: 'Compete',
      verb: 'Push Boundaries in Live Arenas',
      tagline: 'Pressure forges elite engineering problem solvers.',
      desc: 'Participate in inter-college hackathons, live interactive quiz rooms, cybersecurity CTF challenges, and algorithmic speed rounds designed to sharpen technical reflexes.',
      color: '#f59e0b',
      icon: Trophy,
      deliverables: [
        'Nirvana Live Room: Real-time PIN presentation quizzes',
        'College Hackathons and coding hack sprints',
        'CTFs and ethical hacking challenges',
        'National and regional tech competitions hub'
      ],
      link: '/events',
      ctaText: 'Browse Competitions'
    },
    {
      id: 'connect',
      name: 'Connect',
      verb: 'Build Your Lifetime Peer Network',
      tagline: 'Great careers are built on authentic peer networks.',
      desc: 'Surround yourself with ambitious student builders, hackathon co-founders, speakers, and industry alumni across 15+ university campuses.',
      color: '#a855f7',
      icon: Users,
      deliverables: [
        'Discord-style real-time channels with role badges',
        'Community Moments: Project milestones and hackathon wins',
        'College Tech Club partnerships and cross-campus links',
        'Verified internship, fellowship, and job referrals'
      ],
      link: '/community',
      ctaText: 'Join Community Channels'
    },
    {
      id: 'grow',
      name: 'Grow',
      verb: 'Master Professional Polish & Etiquette',
      tagline: 'Technical brilliance needs executive communication to thrive.',
      desc: 'Step into the TYGN Growth Hub to sharpen verbal manners, communication clarity, interview demeanor, and executive presence with interactive adaptive coaching.',
      color: '#10b981',
      icon: TrendingUp,
      deliverables: [
        'Verbal Manners & Professional Etiquette Quiz Engine',
        'Conversation Simulator: Multi-turn interview practice',
        'Say It Better: Flagship tone refactoring game',
        'Daily Growth Challenges and streak gamification'
      ],
      link: '/growth',
      ctaText: 'Enter Growth Hub'
    }
  ];

  const currentPillar = pillars.find(p => p.id === activeTab) || pillars[0];
  const CurrentIcon = currentPillar.icon;

  return (
    <section className="relative z-20 py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={13} /> The Philosophy
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mb-4">
          More Than a Community.
        </h2>
        <p className="text-slate-300/80 text-base sm:text-lg leading-relaxed">
          TYGN is a complete student technology ecosystem built on five interconnected pillars designed to turn ambitious engineering students into world-class builders.
        </p>
      </div>

      {/* Interactive Pillar Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        {pillars.map(pillar => {
          const Icon = pillar.icon;
          const isActive = activeTab === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveTab(pillar.id);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                isActive
                  ? 'border-white/20 bg-white/10 text-white shadow-lg'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              style={{
                borderColor: isActive ? pillar.color : undefined,
                boxShadow: isActive ? `0 0 20px ${pillar.color}25` : undefined
              }}
            >
              <Icon size={17} style={{ color: isActive ? pillar.color : 'inherit' }} />
              <span>{pillar.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Interactive Showcase Card */}
      <div 
        className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all"
        style={{
          background: `radial-gradient(ellipse at top right, ${currentPillar.color}10, transparent 65%), linear-gradient(180deg, rgba(13, 18, 29, 0.85) 0%, rgba(6, 9, 16, 0.95) 100%)`
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{
                  backgroundColor: `${currentPillar.color}20`,
                  border: `1px solid ${currentPillar.color}40`,
                }}
              >
                <CurrentIcon size={24} style={{ color: currentPillar.color }} />
              </div>
              <div>
                <span 
                  className="text-xs font-bold uppercase tracking-widest block"
                  style={{ color: currentPillar.color }}
                >
                  Pillar &bull; {currentPillar.name}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {currentPillar.verb}
                </h3>
              </div>
            </div>

            <p className="text-lg text-slate-200 font-medium mb-3 italic">
              &ldquo;{currentPillar.tagline}&rdquo;
            </p>

            <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed mb-6">
              {currentPillar.desc}
            </p>

            <Link
              href={currentPillar.link}
              onClick={() => soundEffects.playClick()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-transform transform hover:-translate-y-0.5"
              style={{
                backgroundColor: currentPillar.color,
                boxShadow: `0 8px 24px ${currentPillar.color}40`
              }}
            >
              <span>{currentPillar.ctaText}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Column: Key Deliverables Panel */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/10 shadow-inner">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentPillar.color }} />
                Platform Capabilities
              </div>

              <div className="space-y-3.5">
                {currentPillar.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 
                      size={18} 
                      className="shrink-0 mt-0.5" 
                      style={{ color: currentPillar.color }} 
                    />
                    <span className="text-xs sm:text-sm text-slate-200 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
