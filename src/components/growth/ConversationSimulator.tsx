'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { CONVERSATION_SCENARIOS } from '@/data/growthResources';
import { soundEffects } from '@/lib/audio/soundEffects';

export function ConversationSimulator() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(CONVERSATION_SCENARIOS[0].id);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);

  const scenario = CONVERSATION_SCENARIOS.find(s => s.id === activeScenarioId) || CONVERSATION_SCENARIOS[0];
  const turn = scenario.turns[0];

  const handleSelectOption = (idx: number) => {
    soundEffects.playClick();
    setSelectedOptIndex(idx);
  };

  const resetSimulation = () => {
    soundEffects.playClick();
    setSelectedOptIndex(null);
  };

  const chosenOption = selectedOptIndex !== null ? turn.options[selectedOptIndex] : null;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Header and Scenario Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
            Simulated Conversation Arena
          </span>
          <h3 className="text-lg sm:text-2xl font-bold text-white font-display">
            {scenario.title}
          </h3>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-2">
          {CONVERSATION_SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveScenarioId(s.id);
                setSelectedOptIndex(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeScenarioId === s.id
                  ? 'border-indigo-400 bg-indigo-500/20 text-white'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-white'
              }`}
            >
              {s.targetRole}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Chat Interface */}
      <div className="space-y-4 mb-8">
        {/* Speaker Bubble */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Bot size={18} />
          </div>
          <div className="p-4 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/10 max-w-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white">{turn.speaker}</span>
              <span className="text-[10px] text-slate-400">({turn.role})</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              &ldquo;{turn.message}&rdquo;
            </p>
          </div>
        </div>

        {/* User Options or Selected Response */}
        {chosenOption ? (
          <>
            {/* User Speech Bubble */}
            <div className="flex items-start gap-3 justify-end animate-fadeIn">
              <div className="p-4 rounded-2xl rounded-tr-sm bg-cyan-500/15 border border-cyan-500/30 max-w-xl text-right">
                <span className="text-[10px] font-bold text-cyan-300 block mb-1">Your Response</span>
                <p className="text-xs sm:text-sm text-white leading-relaxed">
                  &ldquo;{chosenOption.text}&rdquo;
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <User size={18} />
              </div>
            </div>

            {/* AI Evaluation Bubble */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles size={13} /> Simulation Assessment
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Performance Score: {chosenOption.score} / 100
                </span>
              </div>
              <p className="text-xs text-slate-200 mb-3 leading-relaxed">
                {chosenOption.feedback}
              </p>

              {chosenOption.nextDialogue && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                  <strong>Partner Reaction:</strong> &ldquo;{chosenOption.nextDialogue}&rdquo;
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={resetSimulation}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-white/10 inline-flex items-center gap-1.5"
              >
                <RotateCcw size={13} /> Try Another Branch
              </button>
            </div>
          </>
        ) : (
          <div className="pt-4 border-t border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              {turn.userPrompt}
            </span>
            <div className="space-y-3">
              {turn.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/[0.05] transition-all text-xs sm:text-sm text-slate-300 hover:text-white"
                >
                  <div className="leading-relaxed">{opt.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
