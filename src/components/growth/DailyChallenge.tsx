'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { DAILY_CHALLENGES } from '@/data/growthResources';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';

export function DailyChallenge() {
  const [progress, setProgress] = useState(growthProgressStore.getProgress());
  const [userSubmission, setUserSubmission] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const activeChallenge = DAILY_CHALLENGES[0];

  useEffect(() => {
    const cur = growthProgressStore.getProgress();
    setProgress(cur);
    if (cur.completedChallenges.includes(today)) {
      setIsCompleted(true);
    }
  }, [today]);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSubmission.trim()) return;

    soundEffects.playSuccess();
    const ok = growthProgressStore.completeDailyChallenge(activeChallenge.id, activeChallenge.xpReward);
    setIsCompleted(true);
    setFeedbackSuccess(true);
    setProgress(growthProgressStore.getProgress());
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Top Banner: Streak & XP Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Daily Growth Streak</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs">
                🔥 {progress.currentStreak} Day{progress.currentStreak === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Best streak: {progress.bestStreak} days</p>
          </div>
        </div>

        {/* Level & XP Badge */}
        <div className="flex items-center gap-3 bg-white/[0.04] px-4 py-2 rounded-2xl border border-white/10">
          <Award size={18} className="text-indigo-400" />
          <div>
            <div className="text-xs font-bold text-white">
              Level {progress.levelNumber}: <span className="text-cyan-400">{progress.levelName}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {progress.xp} Total XP
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Body */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
          <Sparkles size={13} /> Today&apos;s Challenge &bull; +{activeChallenge.xpReward} XP
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-2">
          {activeChallenge.title}
        </h3>
        <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
          {activeChallenge.description}
        </p>

        {/* Exemplars Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Recommended Approach
            </span>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              {activeChallenge.exampleGood}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
              ⚠️ Approach to Avoid
            </span>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              {activeChallenge.exampleAvoid}
            </p>
          </div>
        </div>

        {/* Interactive Response Form */}
        {isCompleted ? (
          <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center animate-fadeIn">
            <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">Today&apos;s Challenge Completed!</h4>
            <p className="text-xs text-emerald-200">
              +{activeChallenge.xpReward} XP earned. Your streak is protected for today. Return tomorrow for your next verbal challenge!
            </p>
          </div>
        ) : (
          <form onSubmit={handleComplete} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Type your practice response below:
              </label>
              <textarea
                rows={3}
                value={userSubmission}
                onChange={e => setUserSubmission(e.target.value)}
                placeholder="Type your elevator pitch or refined message here..."
                className="w-full rounded-2xl bg-white/[0.04] border border-white/10 p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={13} /> Takes ~2 minutes
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-transform transform hover:-translate-y-0.5"
              >
                <span>Submit &amp; Claim {activeChallenge.xpReward} XP</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
