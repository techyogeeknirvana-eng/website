'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Award,
  Sparkles
} from 'lucide-react';
import { SAY_IT_BETTER_CHALLENGES } from '@/data/gamesData';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function SayItBetterGame() {
  const { isDark } = useThemeCustomizer();
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
      growthProgressStore.recordGamePlay('say-it-better', chosen.toneScore, 50);
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
    <div className="mono-card p-6 sm:p-12 space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div>
          <div className="editorial-eyebrow">
            FLAGSHIP TYGN GAME // CHALLENGE 0{challengeIdx + 1} OF {SAY_IT_BETTER_CHALLENGES.length}
          </div>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-inherit mt-1">
            Say It Better
          </h3>
        </div>

        <button
          onClick={nextChallenge}
          className="text-xs font-mono font-semibold text-[#737373] hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Next Challenge</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Raw Statement Challenge */}
      <div className="space-y-4">
        {challenge.context && (
          <div className="text-xs font-mono text-[#737373]">
            Scenario Context: {challenge.context}
          </div>
        )}

        <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] space-y-2">
          <div className="text-[0.68rem] font-mono uppercase text-[#737373]">Raw / Blunt Statement:</div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-inherit">
            &ldquo;{challenge.originalText}&rdquo;
          </div>
        </div>
      </div>

      {/* Rewrites Selector */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-[#737373]">
          Select the most polished executive alternative:
        </div>
        <div className="space-y-3">
          {challenge.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-4 ${
                  isSelected
                    ? isDark
                      ? 'bg-white text-black font-semibold border-white shadow-md'
                      : 'bg-black text-white font-semibold border-black shadow-md'
                    : 'bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] border-white/10 dark:border-white/10 light:border-black/10 text-inherit hover:border-white/25'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                    isSelected
                      ? isDark ? 'border-black bg-black text-white' : 'border-white bg-white text-black'
                      : 'border-current/30 text-inherit'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed">
                  &ldquo;{opt.text}&rdquo;
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Scoring & Why This Works Breakdown */}
      {chosen && (
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] space-y-6 animate-fadeIn">
          {/* 3 Metric Scorecard */}
          <div className="grid grid-cols-3 gap-3 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-center space-y-1">
              <div className="text-[0.65rem] font-mono uppercase text-[#737373]">Tone</div>
              <div className="font-display font-black text-2xl text-inherit">{chosen.toneScore}</div>
            </div>

            <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-center space-y-1">
              <div className="text-[0.65rem] font-mono uppercase text-[#737373]">Clarity</div>
              <div className="font-display font-black text-2xl text-inherit">{chosen.clarityScore}</div>
            </div>

            <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-center space-y-1">
              <div className="text-[0.65rem] font-mono uppercase text-[#737373]">Professionalism</div>
              <div className="font-display font-black text-2xl text-inherit">{chosen.professionalismScore}</div>
            </div>
          </div>

          {/* Why This Works Rationale */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-inherit">
              Why This Works:
            </div>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              {chosen.feedback}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="mono-badge text-xs py-1 px-3">
              +{chosen.toneScore >= 80 ? '50' : '15'} XP Awarded
            </span>

            <button
              onClick={nextChallenge}
              className="btn btn-primary text-xs py-2 px-6 font-bold inline-flex items-center gap-2"
            >
              <span>Next Statement</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
