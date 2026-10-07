'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  Code, 
  Trophy, 
  Users, 
  Sparkles,
  Check
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

interface Pillar {
  id: string;
  num: string;
  name: string;
  title: string;
  summary: string;
  deliverables: string[];
  link: string;
  ctaText: string;
}

export function WhatIsTYGN() {
  const { isDark } = useThemeCustomizer();
  const [activeTab, setActiveTab] = useState<string>('learn');

  const pillars: Pillar[] = [
    {
      id: 'learn',
      num: '01',
      name: 'Learn',
      title: 'Real-world knowledge over theoretical drift.',
      summary: 'Curated B.Tech curriculum notes, role-based skill trees, industry radars, and practical workshops led by senior student engineers.',
      deliverables: [
        'Curated Semester & Branch Academic Notes Drive',
        'Full-Stack, Cloud & AI Engineering Roadmaps',
        '2026 Tech Radar: Industry-Vetted Frameworks',
        'Hands-on architecture workshops'
      ],
      link: '/notes',
      ctaText: 'Explore Academic Hub'
    },
    {
      id: 'build',
      num: '02',
      name: 'Build',
      title: 'Shipped software beats resume bullet points.',
      summary: 'Collaborative projects, student open-source repositories, and developer tools where students build production-grade applications.',
      deliverables: [
        'Student Portfolio & Open Source Showcase',
        'Multi-disciplinary build sprints',
        'AI Resume Lab & ATS Scoring tools',
        'Code review & architecture feedback'
      ],
      link: '/projects',
      ctaText: 'View Student Projects'
    },
    {
      id: 'compete',
      num: '03',
      name: 'Compete',
      title: 'Testing instincts under high-pressure constraints.',
      summary: 'Internal hackathons, code jams, Mentimeter-style live quiz rooms, and national tech competition squads.',
      deliverables: [
        'Live Interactive Presentation & Quiz Rooms',
        'Hackathon preparation bootcamps',
        'Collab Finder for hackathon squads',
        'Live leaderboards & platform recognition'
      ],
      link: '/events',
      ctaText: 'Browse Competitions'
    },
    {
      id: 'connect',
      num: '04',
      name: 'Connect',
      title: 'The network that accelerates your career trajectory.',
      summary: 'A verified student network spanning top engineering campuses, alumni in big tech, and early-stage startup founders.',
      deliverables: [
        'Discord-style technical topic channels',
        'Collab Finder for co-founders & project teammates',
        'Direct referral network for verified roles',
        'Cross-college developer networking'
      ],
      link: '/community',
      ctaText: 'Join Student Community'
    },
    {
      id: 'grow',
      num: '05',
      name: 'Grow',
      title: 'Mastering the skills code cannot teach.',
      summary: 'Our signature personal growth platform: verbal manners, executive presence, situational etiquette, and interview simulation.',
      deliverables: [
        '10-Question Adaptive Communication Diagnostic',
        'Flagship "Say It Better" tone refinement arena',
        'Real-world workplace dilemma scenarios',
        'Daily 30-second speaking challenges & streak engine'
      ],
      link: '/growth',
      ctaText: 'Enter Personal Growth Hub'
    }
  ];

  const activePillar = pillars.find(p => p.id === activeTab) || pillars[0];

  return (
    <div id="story" className="space-y-28 sm:space-y-36">
      {/* SECTION 02 — THE MANIFESTO */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="editorial-eyebrow">
            SECTION 02 — THE MANIFESTO
          </div>
          <h2 className="editorial-title text-4xl sm:text-6xl md:text-7xl">
            More Than A Community.
          </h2>
          <div className="space-y-6 text-base sm:text-xl text-[#737373] dark:text-[#a3a3a3] light:text-[#404040] leading-relaxed">
            <p>
              Engineering universities teach syntax, operating systems, and discrete math. But building real products, negotiating offers, presenting to executive stakeholders, winning hackathons, and developing professional presence happens outside the classroom.
            </p>
            <p className="text-inherit font-medium">
              TechYOGeek Nirvana was founded by students to solve that exact disconnect. We provide the ecosystem where technical ambition meets practical execution.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 03 — ONE ECOSYSTEM. MANY PATHS. */}
      <section className="container-custom">
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div>
              <div className="editorial-eyebrow">
                SECTION 03 — ARCHITECTURE
              </div>
              <h2 className="editorial-title text-3xl sm:text-5xl mt-2">
                One Ecosystem. Many Paths.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#737373] max-w-sm">
              Five core pillars designed to take you from first-year explorer to high-performing engineer.
            </p>
          </div>

          {/* Pillar Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] border border-white/10 dark:border-white/10 light:border-black/10">
            {pillars.map((pillar) => {
              const isSelected = activeTab === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveTab(pillar.id);
                  }}
                  className={`py-3 px-4 rounded-xl text-left transition-all flex flex-col gap-1 ${
                    isSelected
                      ? isDark
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-black text-white font-bold shadow-md'
                      : 'text-[#737373] hover:text-white dark:hover:text-white light:hover:text-black'
                  }`}
                >
                  <span className="text-[0.65rem] font-mono opacity-60">
                    {pillar.num}
                  </span>
                  <span className="text-sm sm:text-base font-display font-extrabold tracking-tight">
                    {pillar.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Card */}
          <div className="mono-card p-8 sm:p-14 space-y-8 animate-fadeIn">
            <div className="space-y-4 max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-widest text-[#737373]">
                Pillar {activePillar.num} {'//'} {activePillar.name}
              </div>
              <h3 className="font-display font-black text-2xl sm:text-4xl tracking-tight text-inherit">
                {activePillar.title}
              </h3>
              <p className="text-sm sm:text-base text-[#737373] dark:text-[#a3a3a3] light:text-[#404040] leading-relaxed">
                {activePillar.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
              {activePillar.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-inherit">
                  <div className="w-5 h-5 rounded-full border border-current/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href={activePillar.link}
                onClick={() => soundEffects.playClick()}
                className="btn btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-bold"
              >
                <span>{activePillar.ctaText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
