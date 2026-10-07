'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Zap,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { SAY_IT_BETTER_CHALLENGES } from '@/data/gamesData';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';

export function SayItBetterGame() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasScored, setHasScored] = useState(false);

  const challenge = SAY_IT_BETTER_CHALLENGES[challengeIdx];

  const handleSelectOption = (idx: number) => {
    soundEffects.playClick();
    setSelectedIdx(idx);
    setHasScored(true);

    const chosen = challenge.options[idx];
    if (chosen.toneScore >= 80) {
      soundEffects.playSuccess();
      growthProgressStore.recordGamePlay('say-it-better', chosen.toneScore, 30);
    }
  };

  const nextChallenge = () => {
    soundEffects.playClick();
    setSelectedIdx(null);
    setHasScored(false);
    setChallengeIdx((challengeIdx + 1) % SAY_IT_BETTER_CHALLENGES.length);
  };

  const chosen = selectedIdx !== null ? challenge.options[selectedIdx] : null;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <MessageSquare size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
              Flagship TYGN Game
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              Say It Better
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Challenge {challengeIdx + 1} of {SAY_IT_BETTER_CHALLENGES.length}
          </span>
          <button
            onClick={nextChallenge}
            className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white border border-white/10 bg-white/[0.04] inline-flex items-center gap-1 transition-colors"
          >
            <span>Next</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* The Raw Phrase */}
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Context: {challenge.context}
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25">
          <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">
            Raw / Blunt Statement:
          </span>
          <p className="text-base sm:text-lg font-bold text-white font-display">
            &ldquo;{challenge.originalText}&rdquo;
          </p>
        </div>
      </div>

      {/* Multiple Choice Rewrites */}
      <div className="space-y-3 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Select the most executive rewrite:
        </span>
        {challenge.options.map((opt, i) => {
          const isSelected = selectedIdx === i;
          return (
            <button
              key={i}
              onClick={() => handleSelectOption(i)}
              className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm ${
                isSelected
                  ? opt.toneScore >= 80
                    ? 'border-emerald-400 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10'
                    : 'border-amber-400 bg-amber-500/15 text-white shadow-lg shadow-amber-500/10'
                  : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              <div className="leading-relaxed">&ldquo;{opt.text}&rdquo;</div>
            </button>
          );
        })}
      </div>

      {/* Real-Time Live Scoring Metrics */}
      {chosen && (
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 animate-fadeIn">
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">Tone Score</span>
              <span className="text-base sm:text-lg font-bold font-mono text-cyan-400">{chosen.toneScore}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">Professionalism</span>
              <span className="text-base sm:text-lg font-bold font-mono text-indigo-400">{chosen.professionalismScore}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">Clarity</span>
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">{chosen.clarityScore}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed mb-4">
            {chosen.feedback}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles size={13} /> +30 XP awarded
            </span>
            <button
              onClick={nextChallenge}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 shadow-md inline-flex items-center gap-1"
            >
              <span>Play Next Round</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
