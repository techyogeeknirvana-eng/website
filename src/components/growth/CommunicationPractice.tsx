'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  RotateCcw,
  Check, 
  X,
  Lightbulb
} from 'lucide-react';
import { PRACTICE_SCENARIOS } from '@/data/growthResources';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function CommunicationPractice() {
  const { isDark } = useThemeCustomizer();
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);

  const scenario = PRACTICE_SCENARIOS[activeScenarioIdx];

  const handleSelect = (id: string) => {
    soundEffects.playClick();
    setSelectedOptId(id);
  };

  const nextScenario = () => {
    soundEffects.playClick();
    setSelectedOptId(null);
    setActiveScenarioIdx((activeScenarioIdx + 1) % PRACTICE_SCENARIOS.length);
  };

  const selectedOpt = scenario.options.find(o => o.id === selectedOptId);

  return (
    <div className="mono-card p-6 sm:p-12 space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div>
          <div className="editorial-eyebrow">
            REAL-WORLD PRACTICE SCENARIO // 0{activeScenarioIdx + 1} OF {PRACTICE_SCENARIOS.length}
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit mt-1">
            {scenario.title}
          </h3>
        </div>
        <button
          onClick={nextScenario}
          className="text-xs font-mono font-semibold text-[#737373] hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Skip to Next</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Scenario Brief */}
      <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-2">
        <div className="text-[0.68rem] font-mono uppercase text-[#737373]">Situation Context</div>
        <p className="text-xs sm:text-sm text-inherit leading-relaxed">
          {scenario.situation}
        </p>
      </div>

      {/* Response Options */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-[#737373]">
          Select the most diplomatically sound course of action:
        </div>
        <div className="space-y-3">
          {scenario.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-3.5 ${
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
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Panel */}
      {selectedOpt && (
        <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <span className="mono-badge text-[0.65rem] py-0.5 px-2">
              {selectedOpt.isOptimal ? 'Recommended Executive Path' : 'Alternative / Needs Nuance'}
            </span>
            <span className="text-xs font-mono text-[#737373]">
              Effectiveness: {selectedOpt.effectiveness} ({selectedOpt.toneScore}/100)
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold uppercase text-[#737373]">Rationale</div>
            <p className="text-xs sm:text-sm text-inherit leading-relaxed">
              {selectedOpt.analysis}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={nextScenario}
              className="btn btn-primary text-xs py-2 px-5 font-bold inline-flex items-center gap-2"
            >
              <span>Next Scenario</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
