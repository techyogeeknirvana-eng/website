'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  Flame, 
  Award, 
  Compass, 
  Gamepad2, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { VerbalMannersQuiz } from '@/components/growth/VerbalMannersQuiz';
import { DailyChallenge } from '@/components/growth/DailyChallenge';
import { CommunicationCoach } from '@/components/growth/CommunicationCoach';
import { CommunicationPractice } from '@/components/growth/CommunicationPractice';
import { ConversationSimulator } from '@/components/growth/ConversationSimulator';
import { SkillRadar } from '@/components/growth/SkillRadar';
import { GROWTH_RESOURCES } from '@/data/growthResources';
import { soundEffects } from '@/lib/audio/soundEffects';

export default function GrowthHubPage() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'coach' | 'practice' | 'simulator' | 'resources'>('quiz');

  return (
    <div className="min-h-screen py-10 px-4 max-w-6xl mx-auto space-y-12">
      {/* Top Hero Banner */}
      <div 
        className="glass-card rounded-3xl p-8 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.15), transparent 70%), linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(5, 8, 14, 0.98) 100%)'
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
          <TrendingUp size={14} /> Personal Growth Platform
        </div>
        <h1 className="text-3xl sm:text-6xl font-black text-white font-display tracking-tight mb-4">
          TYGN Growth Hub
        </h1>
        <p className="text-slate-300/80 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Technical mastery needs verbal etiquette, confidence, and leadership communication. Train with adaptive diagnostics, real-time phrase analysis, and conversation simulations.
        </p>

        {/* Quick Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 w-fit mx-auto">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('quiz');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            10-Q Etiquette Diagnostic
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('coach');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'coach'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Communication Coach
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('practice');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Practice Scenarios
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('simulator');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Conversation Simulator
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('resources');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'resources'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resource Library
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'quiz' && (
          <div className="animate-fadeIn">
            <VerbalMannersQuiz />
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="animate-fadeIn">
            <CommunicationCoach />
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="animate-fadeIn">
            <CommunicationPractice />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="animate-fadeIn">
            <ConversationSimulator />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="animate-fadeIn space-y-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Executive Blueprints
              </span>
              <h3 className="text-2xl font-bold text-white font-display">
                Communication Learning Library
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GROWTH_RESOURCES.map(res => (
                <div key={res.id} className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-cyan-400 uppercase tracking-wider">
                        {res.skill.replace(/-/g, ' ')}
                      </span>
                      <span>{res.readTime}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{res.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {res.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Key Executive Phrasings:
                      </span>
                      {res.keyPhrases.map((phrase, i) => (
                        <div key={i} className="text-xs text-cyan-200 italic p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          {phrase}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs text-slate-400 italic">
                    Practice Prompt: {res.practicePrompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Daily Challenge & Skill Radar Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-white/10">
        <div className="lg:col-span-7">
          <DailyChallenge />
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <SkillRadar />
        </div>
      </div>
    </div>
  );
}
