'use client';

import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  BookOpen, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SayItBetterGame } from './SayItBetterGame';
import { ETIQUETTE_DILEMMAS, VOCABULARY_CHALLENGES } from '@/data/gamesData';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';

export function GamesSuite() {
  const [activeTab, setActiveTab] = useState<'say-it-better' | 'etiquette' | 'vocabulary'>('say-it-better');

  // Etiquette state
  const [dilemmaIdx, setDilemmaIdx] = useState(0);
  const [selectedDilemmaChoice, setSelectedDilemmaChoice] = useState<number | null>(null);

  // Vocabulary state
  const [vocabIdx, setVocabIdx] = useState(0);
  const [selectedVocabChoice, setSelectedVocabChoice] = useState<number | null>(null);

  const activeDilemma = ETIQUETTE_DILEMMAS[dilemmaIdx];
  const activeVocab = VOCABULARY_CHALLENGES[vocabIdx];

  const handleDilemmaAnswer = (idx: number) => {
    soundEffects.playClick();
    setSelectedDilemmaChoice(idx);
    const opt = activeDilemma.options[idx];
    if (opt.isCorrect) {
      soundEffects.playSuccess();
      growthProgressStore.recordGamePlay('etiquette', 100, opt.xp);
    }
  };

  const nextDilemma = () => {
    soundEffects.playClick();
    setSelectedDilemmaChoice(null);
    setDilemmaIdx((dilemmaIdx + 1) % ETIQUETTE_DILEMMAS.length);
  };

  const handleVocabAnswer = (idx: number) => {
    soundEffects.playClick();
    setSelectedVocabChoice(idx);
    if (idx === activeVocab.correctIndex) {
      soundEffects.playSuccess();
      growthProgressStore.recordGamePlay('logic', 100, 25);
    }
  };

  const nextVocab = () => {
    soundEffects.playClick();
    setSelectedVocabChoice(null);
    setVocabIdx((vocabIdx + 1) % VOCABULARY_CHALLENGES.length);
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 w-fit mx-auto">
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('say-it-better');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'say-it-better'
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare size={16} />
          <span>Say It Better (Flagship)</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('etiquette');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'etiquette'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert size={16} />
          <span>Etiquette Dilemma</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('vocabulary');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'vocabulary'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen size={16} />
          <span>Vocabulary Precision</span>
        </button>
      </div>

      {/* Tab 1: Say It Better */}
      {activeTab === 'say-it-better' && (
        <div className="animate-fadeIn">
          <SayItBetterGame />
        </div>
      )}

      {/* Tab 2: Etiquette Dilemma */}
      {activeTab === 'etiquette' && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fadeIn max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Category: {activeDilemma.category}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                What Would You Do?
              </h3>
            </div>
            <button
              onClick={nextDilemma}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Next Dilemma</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 leading-relaxed mb-6">
            {activeDilemma.situation}
          </div>

          <div className="space-y-3 mb-6">
            {activeDilemma.options.map((opt, i) => {
              const isSelected = selectedDilemmaChoice === i;
              return (
                <button
                  key={i}
                  onClick={() => handleDilemmaAnswer(i)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm ${
                    isSelected
                      ? opt.isCorrect
                        ? 'border-emerald-400 bg-emerald-500/15 text-white'
                        : 'border-rose-400 bg-rose-500/15 text-white'
                      : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="leading-relaxed">{opt.text}</div>
                </button>
              );
            })}
          </div>

          {selectedDilemmaChoice !== null && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 animate-fadeIn text-xs leading-relaxed text-slate-200">
              <strong className={activeDilemma.options[selectedDilemmaChoice].isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                {activeDilemma.options[selectedDilemmaChoice].isCorrect ? '✅ Excellent Decision:' : '⚠️ Consider Alternative:'}
              </strong>{' '}
              {activeDilemma.options[selectedDilemmaChoice].explanation}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Vocabulary Precision */}
      {activeTab === 'vocabulary' && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fadeIn max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Executive Phrasing Challenge
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                Replace Informal Jargon
              </h3>
            </div>
            <button
              onClick={nextVocab}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Next Word</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mb-6">
            <span className="text-xs text-slate-400 block mb-1">How would you say:</span>
            <div className="text-2xl font-bold text-white font-display p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              &ldquo;{activeVocab.informalPhrase}&rdquo;
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {activeVocab.options.map((opt, idx) => {
              const isSelected = selectedVocabChoice === idx;
              const isCorrect = idx === activeVocab.correctIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleVocabAnswer(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm ${
                    isSelected
                      ? isCorrect
                        ? 'border-emerald-400 bg-emerald-500/15 text-white'
                        : 'border-rose-400 bg-rose-500/15 text-white'
                      : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="font-medium">{opt}</div>
                </button>
              );
            })}
          </div>

          {selectedVocabChoice !== null && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-200">
              <strong className="text-cyan-400">Example in engineering sentence:</strong><br />
              &ldquo;{activeVocab.exampleSentence}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
