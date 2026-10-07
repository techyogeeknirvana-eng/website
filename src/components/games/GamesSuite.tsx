'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Gamepad2, 
  ShieldAlert, 
  Check, 
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';
import { ETIQUETTE_DILEMMAS, VOCABULARY_CHALLENGES } from '@/data/gamesData';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function GamesSuite({ initialGame = 'etiquette' }: { initialGame?: string }) {
  const { isDark } = useThemeCustomizer();
  const [activeGame, setActiveGame] = useState<string>(initialGame);

  // Dilemma State
  const [dilemmaIdx, setDilemmaIdx] = useState(0);
  const [selectedDilemmaOpt, setSelectedDilemmaOpt] = useState<number | null>(null);

  // Vocab State
  const [vocabIdx, setVocabIdx] = useState(0);
  const [selectedVocabOpt, setSelectedVocabOpt] = useState<number | null>(null);

  const dilemma = ETIQUETTE_DILEMMAS[dilemmaIdx];
  const vocab = VOCABULARY_CHALLENGES[vocabIdx];

  const handleSelectDilemma = (idx: number) => {
    soundEffects.playClick();
    setSelectedDilemmaOpt(idx);
    const chosen = dilemma.options[idx];
    if (chosen.isCorrect) {
      soundEffects.playSuccess();
      growthProgressStore.recordGamePlay('etiquette', 100, 40);
    }
  };

  const nextDilemma = () => {
    soundEffects.playClick();
    setSelectedDilemmaOpt(null);
    setDilemmaIdx((dilemmaIdx + 1) % ETIQUETTE_DILEMMAS.length);
  };

  const handleSelectVocab = (idx: number) => {
    soundEffects.playClick();
    setSelectedVocabOpt(idx);
    const isCorrect = idx === vocab.correctIndex;
    if (isCorrect) {
      soundEffects.playSuccess();
      growthProgressStore.recordGamePlay('say-it-better', 100, 30);
    }
  };

  const nextVocab = () => {
    soundEffects.playClick();
    setSelectedVocabOpt(null);
    setVocabIdx((vocabIdx + 1) % VOCABULARY_CHALLENGES.length);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Game Mode Tab Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] border border-white/10 dark:border-white/10 light:border-black/10 w-fit mx-auto">
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveGame('etiquette');
          }}
          className={`py-2 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'etiquette'
              ? isDark
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-black text-white font-bold shadow-md'
              : 'text-[#737373] hover:text-white dark:hover:text-white light:hover:text-black'
          }`}
        >
          Etiquette Dilemma
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveGame('vocab');
          }}
          className={`py-2 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'vocab'
              ? isDark
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-black text-white font-bold shadow-md'
              : 'text-[#737373] hover:text-white dark:hover:text-white light:hover:text-black'
          }`}
        >
          Vocabulary Precision
        </button>
      </div>

      {/* GAME 1: ETIQUETTE DILEMMA */}
      {activeGame === 'etiquette' && (
        <div className="mono-card p-6 sm:p-12 space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div>
              <div className="editorial-eyebrow">
                DILEMMA 0{dilemmaIdx + 1} OF {ETIQUETTE_DILEMMAS.length} {'//'} HIGH FRICTION
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit mt-1">
                {dilemma.category}
              </h3>
            </div>

            <button
              onClick={nextDilemma}
              className="text-xs font-mono font-semibold text-[#737373] hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Next Dilemma</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02]">
            <p className="text-xs sm:text-sm text-inherit leading-relaxed">
              {dilemma.situation}
            </p>
          </div>

          <div className="space-y-3">
            {dilemma.options.map((opt, idx) => {
              const isSelected = selectedDilemmaOpt === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectDilemma(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? isDark
                        ? 'bg-white text-black font-semibold border-white shadow-md'
                        : 'bg-black text-white font-semibold border-black shadow-md'
                      : 'bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] border-white/10 dark:border-white/10 light:border-black/10 text-inherit hover:border-white/25'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                    isSelected
                      ? isDark ? 'border-black bg-black text-white' : 'border-white bg-white text-black'
                      : 'border-current/30 text-inherit'
                  }`}>
                    {isSelected ? '✓' : ''}
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed">
                    {opt.text}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDilemmaOpt !== null && (
            <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10 light:border-black/10">
                <span className="mono-badge text-xs py-0.5 px-2.5">
                  {dilemma.options[selectedDilemmaOpt].isCorrect ? 'Diplomatic & Correct' : 'Sub-optimal Response'}
                </span>
                <span className="text-xs font-mono text-[#737373]">
                  +{dilemma.options[selectedDilemmaOpt].isCorrect ? '40' : '10'} XP
                </span>
              </div>
              <p className="text-xs sm:text-sm text-inherit leading-relaxed">
                {dilemma.options[selectedDilemmaOpt].explanation}
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={nextDilemma}
                  className="btn btn-primary text-xs py-2 px-5 font-bold inline-flex items-center gap-1.5"
                >
                  <span>Next Dilemma</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: VOCABULARY PRECISION */}
      {activeGame === 'vocab' && (
        <div className="mono-card p-6 sm:p-12 space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div>
              <div className="editorial-eyebrow">
                PRECISION ROUND 0{vocabIdx + 1} OF {VOCABULARY_CHALLENGES.length}
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit mt-1">
                &ldquo;{vocab.informalPhrase}&rdquo;
              </h3>
            </div>

            <button
              onClick={nextVocab}
              className="text-xs font-mono font-semibold text-[#737373] hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Next Term</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-[#737373]">
              Choose the most impactful executive precision alternative:
            </div>
            <div className="space-y-3">
              {vocab.options.map((optionText, idx) => {
                const isSelected = selectedVocabOpt === idx;
                const isCorrect = idx === vocab.correctIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectVocab(idx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all flex items-start gap-4 ${
                      isSelected
                        ? isDark
                          ? 'bg-white text-black font-semibold border-white shadow-md'
                          : 'bg-black text-white font-semibold border-black shadow-md'
                        : 'bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] border-white/10 dark:border-white/10 light:border-black/10 text-inherit hover:border-white/25'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                      isSelected
                        ? isDark ? 'border-black bg-black text-white' : 'border-white bg-white text-black'
                        : 'border-current/30 text-inherit'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">&ldquo;{optionText}&rdquo;</div>
                      {isSelected && (
                        <div className="text-xs text-[#737373] mt-1">
                          {isCorrect ? `Optimal: "${vocab.exampleSentence}"` : `Recommended: "${vocab.executiveAlternative}"`}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedVocabOpt !== null && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
              <span className="mono-badge text-xs py-1 px-3">
                +{selectedVocabOpt === vocab.correctIndex ? '30' : '10'} XP
              </span>
              <button
                onClick={nextVocab}
                className="btn btn-primary text-xs py-2 px-5 font-bold inline-flex items-center gap-1.5"
              >
                <span>Next Term</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
