'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  X,
  HelpCircle,
  Lightbulb,
  Award
} from 'lucide-react';
import { QuizQuestionItem, QuizSessionResult } from '@/types/growth';
import { quizEngine } from '@/lib/growth/quizEngine';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function VerbalMannersQuiz() {
  const { isDark } = useThemeCustomizer();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [questions, setQuestions] = useState<QuizQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<QuizSessionResult | null>(null);

  const startQuiz = () => {
    soundEffects.playClick();
    const sessionQuestions = quizEngine.generateSessionQuestions();
    setQuestions(sessionQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setResult(null);
    setGameState('playing');
  };

  const handleSelectOption = (idx: number) => {
    soundEffects.playClick();
    setSelectedOption(idx);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    soundEffects.playClick();
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(newAnswers);

    if (currentIndex < 9) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      // Evaluate session of exactly 10 questions
      const evaluated = quizEngine.evaluateSession(questions, newAnswers);
      setResult(evaluated);
      setGameState('results');
      soundEffects.playSuccess();
    }
  };

  // 1. INTRO SCREEN
  if (gameState === 'intro') {
    return (
      <div className="mono-card p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-8 animate-fadeIn">
        <div className="space-y-3">
          <div className="editorial-eyebrow">
            ADAPTIVE REASONING ENGINE // VERBAL MANNERS
          </div>
          <h3 className="editorial-title text-3xl sm:text-5xl text-inherit">
            10-Question Diagnostic
          </h3>
          <p className="text-sm sm:text-base text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] leading-relaxed max-w-xl mx-auto">
            Every session generates a unique set of exactly 10 situational workplace questions. The engine tracks your choices, penalizes recent repeats, and targets your weakest communication areas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-1">
            <div className="text-xs font-mono font-bold text-inherit">EXACTLY 10 QUESTIONS</div>
            <p className="text-xs text-[#737373]">Focused 4-minute situational assessment.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-1">
            <div className="text-xs font-mono font-bold text-inherit">ADAPTIVE ROTATION</div>
            <p className="text-xs text-[#737373]">Weights questions toward your identified blindspots.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-1">
            <div className="text-xs font-mono font-bold text-inherit">EDUCATIONAL RATIONALE</div>
            <p className="text-xs text-[#737373]">Direct coaching on why answers work or fail.</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={startQuiz}
            className="btn btn-primary text-sm py-3.5 px-8 font-bold inline-flex items-center gap-2"
          >
            <span>Begin 10-Question Diagnostic</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUIZ (Questions 1 to 10)
  if (gameState === 'playing' && questions.length === 10) {
    const currentQ = questions[currentIndex];
    const progressPercent = ((currentIndex + 1) / 10) * 100;

    return (
      <div className="mono-card p-6 sm:p-12 max-w-3xl mx-auto space-y-8 animate-fadeIn">
        {/* Progress Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
            <span className="font-bold text-inherit uppercase">
              Question 0{currentIndex + 1} of 10
            </span>
            <span>{currentQ.categoryLabel}</span>
          </div>
          <div className="w-full h-1 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-current transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Header */}
        <div className="space-y-3">
          {currentQ.context && (
            <div className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-white/10 dark:border-white/10 light:border-black/10 text-[#737373]">
              Context: {currentQ.context}
            </div>
          )}
          <h3 className="font-display font-bold text-lg sm:text-2xl text-inherit leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
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
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                    isSelected
                      ? isDark ? 'border-black bg-black text-white' : 'border-white bg-white text-black'
                      : 'border-current/30 text-inherit'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next / Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
          <span className="text-xs font-mono text-[#737373]">
            {selectedOption === null ? 'Select an answer to proceed' : 'Ready'}
          </span>
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className={`btn btn-primary text-xs sm:text-sm py-2.5 px-6 font-bold inline-flex items-center gap-2 ${
              selectedOption === null ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span>{currentIndex < 9 ? 'Next Question' : 'Complete Diagnostic'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // 3. RESULTS & FEEDBACK ENGINE
  if (gameState === 'results' && result) {
    const percentage = Math.round((result.score / 10) * 100);

    return (
      <div className="mono-card p-6 sm:p-14 max-w-4xl mx-auto space-y-10 animate-fadeIn">
        {/* Result Header */}
        <div className="text-center space-y-4 pb-8 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="editorial-eyebrow">
            DIAGNOSTIC COMPLETE // SESSION RESULTS
          </div>
          <div className="font-display font-black text-6xl sm:text-8xl">
            {result.score} / 10
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit">
              {percentage >= 80 
                ? 'Executive Caliber — Highly Polished' 
                : percentage >= 60 
                ? 'Developing Diplomatic Presence' 
                : 'Needs Structured Tone Training'}
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] max-w-lg mx-auto">
              {percentage >= 80
                ? 'You naturally handle friction, deliver feedback constructively, and communicate with high clarity.'
                : 'You are technically capable, but several choices sound abrupt, passive, or defensive in team contexts.'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-xs font-mono text-inherit">
            <Award size={14} /> +{result.score * 10} XP Earned
          </div>
        </div>

        {/* Strengths & Weaknesses Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-inherit">
              Where You Excelled
            </div>
            {result.strengths.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-inherit">
                    <Check size={14} className="text-inherit shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#737373]">Complete more sessions to establish strong competencies.</p>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-inherit">
              Identified Blindspots
            </div>
            {result.weaknesses.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm">
                {result.weaknesses.map((wk, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-inherit">
                    <X size={14} className="text-[#737373] shrink-0" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#737373]">No critical weaknesses detected in this diagnostic run.</p>
            )}
          </div>
        </div>

        {/* Feedback Engine: Question Review with Explanations */}
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#737373]">
            Question Review &amp; Educational Feedback
          </div>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userChoiceIdx = answers[q.id];
              const isCorrect = userChoiceIdx === q.correctAnswer;
              const correctOption = q.options[q.correctAnswer];
              const userOption = q.options[userChoiceIdx];

              return (
                <div
                  key={q.id}
                  className="p-5 sm:p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-mono text-[#737373]">0{idx + 1} {'//'} {q.categoryLabel}</span>
                    <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                      {isCorrect ? 'Correct' : 'Needs Polish'}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-inherit">
                    {q.question}
                  </h4>

                  {!isCorrect && userOption && (
                    <div className="text-xs text-[#737373] p-3 rounded-lg bg-white/5 border border-white/5">
                      <strong className="text-inherit">Your Answer:</strong> {userOption}
                    </div>
                  )}

                  <div className="text-xs text-inherit p-3 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                    <div>
                      <strong>Better Approach:</strong> {correctOption}
                    </div>
                    <div className="text-[#737373] leading-relaxed">
                      <strong>Why:</strong> {q.explanation}
                    </div>
                    {q.betterApproach && (
                      <div className="text-[#a3a3a3] italic">
                        &ldquo;{q.betterApproach}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 dark:border-white/10 light:border-black/10">
          <button
            onClick={startQuiz}
            className="btn btn-secondary text-xs sm:text-sm py-3 px-6 font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Retake Diagnostic</span>
          </button>

          <Link
            href="/games"
            onClick={() => soundEffects.playClick()}
            className="btn btn-primary text-xs sm:text-sm py-3 px-6 font-bold w-full sm:w-auto inline-flex items-center justify-center gap-2 no-underline"
          >
            <span>Practice in Games Arena</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
