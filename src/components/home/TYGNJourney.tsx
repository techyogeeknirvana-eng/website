'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Sparkles, 
  Check, 
  ArrowRight, 
  RotateCcw,
  Trophy,
  Layers,
  MessageSquare
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

interface IdentityOption {
  id: string;
  label: string;
  subtitle: string;
}

interface GoalOption {
  id: string;
  label: string;
  icon: any;
}

interface WeekPlan {
  week: number;
  title: string;
  focus: string;
  milestone: string;
  actionUrl: string;
  actionLabel: string;
}

export function TYGNJourney() {
  const { isDark } = useThemeCustomizer();
  const [selectedIdentity, setSelectedIdentity] = useState<string>('student-1-2');
  const [selectedGoal, setSelectedGoal] = useState<string>('communication');

  const identities: IdentityOption[] = [
    { id: 'student-1-2', label: '1st / 2nd Year Explorer', subtitle: 'Building fundamentals & exploring tech stacks' },
    { id: 'student-3-4', label: '3rd / 4th Year Senior', subtitle: 'Internship hunting, portfolio building & technical screening' },
    { id: 'builder', label: 'Core Builder / Hacker', subtitle: 'Winning hackathons & shipping open-source software' },
    { id: 'leader', label: 'Community Lead / Mentor', subtitle: 'Public speaking, squad leadership & mentorship' }
  ];

  const goals: GoalOption[] = [
    { id: 'communication', label: 'Verbal Manners & Executive Presence', icon: MessageSquare },
    { id: 'technical', label: 'Production Engineering & Project Depth', icon: Layers },
    { id: 'career', label: 'Curated Tech Internships & Placements', icon: Trophy },
    { id: 'leadership', label: 'Confidence & High-Pressure Decision Making', icon: Compass }
  ];

  const getWeekPlan = (): WeekPlan[] => {
    if (selectedGoal === 'communication') {
      return [
        {
          week: 1,
          title: 'Etiquette Diagnostic & Baseline Audit',
          focus: 'Identify blindspots in tone, passive aggression, and email phrasing.',
          milestone: 'Complete official 10-Q Verbal Manners Diagnostic on Growth Hub.',
          actionUrl: '/growth#quiz',
          actionLabel: 'Take Diagnostic'
        },
        {
          week: 2,
          title: 'Say It Better Routine & Daily Speaking',
          focus: 'Train diplomatic rewrites of crude workplace phrases.',
          milestone: 'Score 90+ in Say It Better Arena & maintain 7-day speaking streak.',
          actionUrl: '/games',
          actionLabel: 'Play Say It Better'
        },
        {
          week: 3,
          title: 'Interview & Negotiation Roleplay',
          focus: 'Simulate high-stakes recruiter screenings and teammate feedback.',
          milestone: 'Pass 3 full Conversation Simulator rounds with >80 Confidence.',
          actionUrl: '/growth#simulator',
          actionLabel: 'Open Simulator'
        },
        {
          week: 4,
          title: 'Executive Presence & Portfolio Delivery',
          focus: 'Present project architectures with poise and concise technical answers.',
          milestone: 'Reach Level 4 Challenger rank in the Growth Engine.',
          actionUrl: '/growth',
          actionLabel: 'View Growth Profile'
        }
      ];
    }

    return [
      {
        week: 1,
        title: 'Core Architecture & Skill Tree Mapping',
        focus: 'Select a focused stack from the 2026 Tech Radar and review Drive notes.',
        milestone: 'Curate your stack roadmap and join relevant technical channel.',
        actionUrl: '/notes',
        actionLabel: 'Access Notes'
      },
      {
        week: 2,
        title: 'Form Squad & Sprint Planning',
        focus: 'Connect with co-builders via Collab Finder for an upcoming hackathon.',
        milestone: 'Submit a squad collab request and initialize GitHub repo.',
        actionUrl: '/collab-finder',
        actionLabel: 'Find Teammates'
      },
      {
        week: 3,
        title: 'Prototype Shipped to Production',
        focus: 'Build real software, integrate authentication and cloud deployment.',
        milestone: 'Publish live URL in Student Project Showcase.',
        actionUrl: '/projects',
        actionLabel: 'Explore Projects'
      },
      {
        week: 4,
        title: 'ATS Resume Screening & Opportunity Apply',
        focus: 'Scan your resume with AI Resume Lab and apply to verified listings.',
        milestone: 'Apply to 3 curated internships matching your verified skill set.',
        actionUrl: '/opportunities',
        actionLabel: 'Browse Opportunities'
      }
    ];
  };

  const plan = getWeekPlan();

  return (
    <section className="container-custom">
      <div className="space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              SECTION 08 — PERSONALIZED PATHWAY
            </div>
            <h2 className="editorial-title text-3xl sm:text-5xl mt-2">
              The TYGN Journey
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] max-w-sm">
            Select your current phase and primary objective to generate your custom 4-week execution trajectory.
          </p>
        </div>

        {/* 2-Step Configuration Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1: Who are you */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#737373]">
              Step 01 // Current Status
            </div>
            <div className="space-y-2">
              {identities.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedIdentity(item.id);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    selectedIdentity === item.id
                      ? isDark
                        ? 'bg-white text-black font-bold border-white shadow-md'
                        : 'bg-black text-white font-bold border-black shadow-md'
                      : 'bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] border-white/10 dark:border-white/10 light:border-black/10 text-inherit hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-sm font-display font-bold">{item.label}</div>
                    <div className={`text-xs mt-0.5 ${selectedIdentity === item.id ? 'opacity-80' : 'text-[#737373]'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                  {selectedIdentity === item.id && <Check size={16} strokeWidth={3} className="shrink-0 ml-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: What is your primary objective */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#737373]">
              Step 02 // Primary Goal
            </div>
            <div className="space-y-2">
              {goals.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedGoal(item.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selectedGoal === item.id
                        ? isDark
                          ? 'bg-white text-black font-bold border-white shadow-md'
                          : 'bg-black text-white font-bold border-black shadow-md'
                        : 'bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] border-white/10 dark:border-white/10 light:border-black/10 text-inherit hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent size={16} className="shrink-0" />
                      <span className="text-sm font-display font-bold">{item.label}</span>
                    </div>
                    {selectedGoal === item.id && <Check size={16} strokeWidth={3} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generated 4-Week Timeline */}
        <div className="mono-card p-6 sm:p-12 space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 dark:border-white/10 light:border-black/10 pb-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[#737373]">
              Generated Roadmap // 4-Week Milestone Plan
            </div>
            <div className="text-xs text-[#737373]">
              Adaptive execution tree
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {plan.map((step) => (
              <div 
                key={step.week}
                className="p-5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-[#737373]">
                    WEEK 0{step.week}
                  </div>
                  <h4 className="font-display font-bold text-base text-inherit">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#737373] leading-relaxed">
                    {step.focus}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 dark:border-white/10 light:border-black/10 space-y-3">
                  <div className="text-[0.72rem] font-medium text-inherit">
                    🎯 {step.milestone}
                  </div>
                  <Link
                    href={step.actionUrl}
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-outline text-xs py-1.5 px-3 w-full justify-between inline-flex no-underline text-inherit"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
