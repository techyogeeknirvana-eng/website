'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Award, 
  Check, 
  Sliders,
  MessageSquare,
  Bot
} from 'lucide-react';
import { VerbalMannersQuiz } from '@/components/growth/VerbalMannersQuiz';
import { DailyChallenge } from '@/components/growth/DailyChallenge';
import { CommunicationCoach } from '@/components/growth/CommunicationCoach';
import { CommunicationPractice } from '@/components/growth/CommunicationPractice';
import { ConversationSimulator } from '@/components/growth/ConversationSimulator';
import { SkillRadar } from '@/components/growth/SkillRadar';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export default function GrowthHubPage() {
  const { isDark } = useThemeCustomizer();
  const [activeTab, setActiveTab] = useState<'quiz' | 'coach' | 'practice' | 'simulator' | 'daily'>('quiz');
  const [progress] = useState(growthProgressStore.getProgress());

  const progressMetrics = [
    { label: 'Communication', value: 72 },
    { label: 'Confidence', value: 64 },
    { label: 'Professional Etiquette', value: 81 },
    { label: 'Critical Thinking', value: 76 },
    { label: 'Leadership', value: 58 },
    { label: 'Presentation', value: 69 },
  ];

  const handleStartDiagnostic = () => {
    soundEffects.playClick();
    setActiveTab('quiz');
    const el = document.getElementById('workspace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewProgress = () => {
    soundEffects.playClick();
    const el = document.getElementById('progress-dashboard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container-custom pt-24 sm:pt-28 pb-24 space-y-16 sm:space-y-24">
      {/* 1. GROWTH HUB HERO */}
      <section className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 dark:border-white/10 light:border-black/10 text-xs font-semibold uppercase tracking-widest text-[#737373]">
          <Sparkles size={13} />
          <span>PERSONAL GROWTH PLATFORM // TYGN GROWTH HUB</span>
        </div>

        <div className="space-y-3">
          <h1 className="editorial-title text-4xl sm:text-6xl md:text-7xl text-inherit">
            Become Better At More Than Code.
          </h1>
          <p className="text-sm sm:text-lg text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] max-w-2xl mx-auto leading-relaxed">
            Practice communication, verbal manners, confidence, leadership and professional behaviour through adaptive challenges.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={handleStartDiagnostic}
            className="btn btn-primary text-sm sm:text-base py-3 sm:py-3.5 px-8 font-bold w-full sm:w-auto"
          >
            Start Diagnostic
          </button>
          <button
            onClick={handleViewProgress}
            className="btn btn-secondary text-sm sm:text-base py-3 sm:py-3.5 px-8 font-semibold w-full sm:w-auto"
          >
            View My Progress
          </button>
        </div>
      </section>

      {/* 2. PERSONAL GROWTH DASHBOARD (Item 13) */}
      <section id="progress-dashboard" className="mono-card p-6 sm:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              COMPETENCY DASHBOARD // VERIFIED PROFILE
            </div>
            <h2 className="editorial-title text-2xl sm:text-4xl text-inherit mt-1">
              Your Progress
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="mono-badge text-xs py-1 px-3">
              🔥 {progress.currentStreak} Day Streak
            </span>
            <span className="mono-badge text-xs py-1 px-3">
              Level {progress.levelNumber}: {progress.levelName}
            </span>
          </div>
        </div>

        {/* 6 Monochrome Progress Cards (Communication 72%, Confidence 64%, etc.) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {progressMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#737373] uppercase font-bold">{metric.label}</span>
                <span className="font-display font-black text-lg text-inherit">{metric.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-current transition-all duration-500"
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TODAY'S CHALLENGE STRIP (Item 22) */}
      <section>
        <DailyChallenge />
      </section>

      {/* 4. INTERACTIVE WORKSPACE TABS */}
      <section id="workspace" className="space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] border border-white/10 dark:border-white/10 light:border-black/10 w-fit mx-auto">
          {[
            { id: 'quiz', label: '10-Q Diagnostic' },
            { id: 'coach', label: 'Phrase Coach' },
            { id: 'practice', label: 'Practice Scenarios' },
            { id: 'simulator', label: 'Conversation Simulator' },
            { id: 'radar', label: 'Competency Radar' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`py-2 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-black text-white font-bold shadow-md'
                    : 'text-[#737373] hover:text-white dark:hover:text-white light:hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'quiz' && <VerbalMannersQuiz />}
          {activeTab === 'coach' && <CommunicationCoach />}
          {activeTab === 'practice' && <CommunicationPractice />}
          {activeTab === 'simulator' && <ConversationSimulator />}
          {activeTab === (('radar' as any)) && (
            <div className="flex justify-center">
              <SkillRadar />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
