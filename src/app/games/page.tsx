'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { GamesSuite } from '@/components/games/GamesSuite';

export default function GamesPage() {
  return (
    <div className="min-h-screen py-10 px-4 max-w-6xl mx-auto space-y-10">
      {/* Hero Header */}
      <div 
        className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(244, 63, 94, 0.15), transparent 70%), linear-gradient(180deg, rgba(13, 18, 29, 0.9) 0%, rgba(5, 8, 14, 0.98) 100%)'
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Gamepad2 size={14} /> Interactive Training Arena
        </div>
        <h1 className="text-3xl sm:text-6xl font-black text-white font-display tracking-tight mb-4">
          TYGN Games Arena
        </h1>
        <p className="text-slate-300/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
          Bite-sized, replayable, and mobile-friendly games designed to train professional tone, situational instinct, and vocabulary precision under pressure.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Live Tone Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            XP &amp; Level Rewards
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Mobile-Optimized Play
          </span>
        </div>
      </div>

      {/* Games Suite */}
      <GamesSuite />
    </div>
  );
}
