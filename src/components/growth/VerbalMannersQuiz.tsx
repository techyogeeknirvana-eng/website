'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  BookOpen, 
  Compass, 
  AlertCircle,
  Lightbulb,
  Check
} from 'lucide-react';
import { QuizQuestionItem, QuizSessionResult } from '@/types/growth';
import { quizEngine } from '@/lib/growth/quizEngine';
import { GROWTH_RESOURCES } from '@/data/growthResources';
import { soundEffects } from '@/lib/audio/soundEffects';

export function VerbalMannersQuiz() {
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
      soundEffects.playSuccess();
      const evalResult = quizEngine.evaluateSession(questions, newAnswers);
      setResult(evalResult);
      setGameState('results');
    }
  };

  // 1. INTRO SCREEN
  if (gameState === 'intro') {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/20">
          <Sparkles size={30} className="text-white" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
          Adaptive Engine &bull; Verbal Manners &amp; Etiquette
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display mb-4">
          10-Question Communication Diagnostic
        </h3>
        <p className="text-slate-300/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
          Every session delivers a tailored set of exactly 10 situational questions. The engine tracks your past answers, rotates fresh questions, and identifies your strengths and growth areas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Exactly 10 Questions
            </span>
            <p className="text-xs text-slate-300">Fast, focused 4-minute diagnostic.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Adaptive Selection
            </span>
            <p className="text-xs text-slate-300">Intelligently emphasizes your growth areas.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Educational Feedback
            </span>
            <p className="text-xs text-slate-300">Coaching insights on why choices work or fail.</p>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-xl shadow-indigo-500/30 transition-transform transform hover:-translate-y-0.5 inline-flex items-center gap-2"
        >
          <span>Begin 10-Question Diagnostic</span>
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  // 2. ACTIVE QUIZ (Questions 1 to 10)
  if (gameState === 'playing' && questions.length === 10) {
    const currentQ = questions[currentIndex];
    const progressPercent = ((currentIndex + 1) / 10) * 100;

    return (
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl max-w-3xl mx-auto">
        {/* Top Progress Strip */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider">
              Question {currentIndex + 1} of 10
            </span>
            <span className="font-mono text-slate-300">
              {currentQ.categoryLabel}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Context / Situation */}
        {currentQ.context && (
          <div className="mb-3 inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300 italic">
            Context: {currentQ.context}
          </div>
        )}

        {/* Question Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
          {currentQ.question}
        </h3>

        {/* 4 Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/10'
                    : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isSelected ? 'bg-cyan-400 text-slate-950 font-black' : 'border border-white/20 text-slate-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Next Button */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-xs text-slate-500">
            Select the most professionally appropriate response
          </span>
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              selectedOption !== null
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{currentIndex === 9 ? 'Complete Diagnostic' : 'Next Question'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // 3. RESULTS SCREEN
  if (gameState === 'results' && result) {
    const recommended = GROWTH_RESOURCES.find(r => r.skill === result.focusArea) || GROWTH_RESOURCES[0];

    return (
      <div className="glass-card rounded-3xl p-6 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Header Summary Score */}
        <div className="text-center pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} /> Diagnostic Results
          </div>
          <h3 className="text-3xl sm:text-5xl font-black text-white font-display mb-2">
            Your Score: <span className="text-cyan-400">{result.score}</span> / 10
          </h3>
          <div className="text-sm font-semibold text-slate-300">
            Communication Level:{' '}
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold ml-1">
              {result.level}
            </span>
          </div>
        </div>

        {/* Category Breakdown & Performance Bars */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Category Performance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.entries(result.categoryScores).map(([cat, data]: [string, any]) => (
              <div key={cat} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200 capitalize">
                    {cat.replace(/-/g, ' ')}
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{data.percentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      data.percentage >= 80 
                        ? 'bg-emerald-400' 
                        : data.percentage >= 50 
                        ? 'bg-cyan-400' 
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Educational Feedback (What you did well vs need to improve) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={15} /> What You Did Well
            </span>
            <ul className="space-y-2 text-xs text-slate-200">
              {result.feedbackGood.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-3 flex items-center gap-1.5">
              <AlertCircle size={15} /> What You Need to Improve
            </span>
            <ul className="space-y-2 text-xs text-slate-200">
              {result.feedbackImprove.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What to Learn Next (Tailored Recommended Resource) */}
        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
            <BookOpen size={14} /> Recommended Learning for Your Focus Area: {result.focusAreaLabel}
          </div>
          <h4 className="text-base font-bold text-white mb-2">{recommended.title}</h4>
          <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
            {recommended.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {recommended.keyPhrases.map((phrase, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-cyan-200 italic">
                {phrase}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/growth"
              onClick={() => soundEffects.playClick()}
              className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-600 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Learn Resource</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Detailed Question-by-Question Review */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Lightbulb size={14} className="text-amber-400" /> Question-by-Question Educational Review
          </h4>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div 
                  key={q.id}
                  className={`p-4 rounded-2xl border text-left ${
                    isCorrect ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : 'border-rose-500/30 bg-rose-500/[0.03]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white">
                      Q{idx + 1}: {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 shrink-0">
                        <CheckCircle2 size={14} /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 shrink-0">
                        <XCircle size={14} /> Not Best Choice
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 mb-2.5">
                    <div>
                      <span className="text-slate-400">Your choice: </span>
                      <span className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                        {q.options[userAns]}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div>
                        <span className="text-slate-400">Optimal response: </span>
                        <span className="text-emerald-300 font-medium">
                          {q.options[q.correctAnswer]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Educational Feedback */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                    <p className="mb-1"><strong className="text-white">Why?</strong> {q.explanation}</p>
                    <p className="mb-1"><strong className="text-cyan-300">Better Approach:</strong> {q.betterApproach}</p>
                    <p><strong className="text-amber-300">Remember:</strong> {q.keyTakeaway}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to restart new adaptive session */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Next diagnostic session will automatically prioritize questions from your focus area.
          </p>
          <button
            onClick={startQuiz}
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Generate New 10-Question Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
