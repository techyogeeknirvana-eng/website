'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { PRACTICE_SCENARIOS } from '@/data/growthResources';
import { soundEffects } from '@/lib/audio/soundEffects';

export function CommunicationPractice() {
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
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Real-World Practice Mode
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
            Scenario {activeScenarioIdx + 1} of {PRACTICE_SCENARIOS.length}
          </h3>
        </div>
        <button
          onClick={nextScenario}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Next Scenario</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Situation Details */}
      <div className="mb-6">
        <h4 className="text-base sm:text-lg font-bold text-white mb-2">
          {scenario.title}
        </h4>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
          <strong>The Situation:</strong> {scenario.situation}
        </div>
        <p className="text-xs text-slate-400 italic">
          Context: {scenario.context}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          How do you respond?
        </span>
        {scenario.options.map(opt => {
          const isSelected = selectedOptId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm ${
                isSelected
                  ? opt.isOptimal
                    ? 'border-emerald-400 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10'
                    : 'border-amber-400 bg-amber-500/15 text-white shadow-lg shadow-amber-500/10'
                  : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="leading-relaxed">{opt.text}</div>
            </button>
          );
        })}
      </div>

      {/* Instant Feedback on Selection */}
      {selectedOpt && (
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 animate-fadeIn">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {selectedOpt.isOptimal ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <XCircle size={18} className="text-amber-400" />
              )}
              <span className={`text-xs font-bold uppercase tracking-wider ${
                selectedOpt.isOptimal ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                Rating: {selectedOpt.effectiveness}
              </span>
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400">
              Tone Score: {selectedOpt.toneScore} / 100
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {selectedOpt.analysis}
          </p>
        </div>
      )}
    </div>
  );
}
