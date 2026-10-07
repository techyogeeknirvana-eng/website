'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Award, 
  Clock, 
  Check, 
  Play, 
  Pause, 
  RotateCcw 
} from 'lucide-react';
import { DAILY_CHALLENGES } from '@/data/growthResources';
import { growthProgressStore } from '@/lib/growth/progressStore';
import { soundEffects } from '@/lib/audio/soundEffects';

export function DailyChallenge() {
  const [progress, setProgress] = useState(growthProgressStore.getProgress());
  const [userSubmission, setUserSubmission] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const activeChallenge = DAILY_CHALLENGES[0];

  useEffect(() => {
    const cur = growthProgressStore.getProgress();
    setProgress(cur);
    if (cur.completedChallenges.includes(today)) {
      setIsCompleted(true);
    }
  }, [today]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      soundEffects.playCountdownBeep();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const toggleTimer = () => {
    soundEffects.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    soundEffects.playClick();
    setIsTimerRunning(false);
    setTimerSeconds(30);
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSubmission.trim()) return;

    soundEffects.playSuccess();
    growthProgressStore.completeDailyChallenge(activeChallenge.id, activeChallenge.xpReward);
    setIsCompleted(true);
    setProgress(growthProgressStore.getProgress());
  };

  return (
    <div className="mono-card p-6 sm:p-10 space-y-8 animate-fadeIn">
      {/* Top Streak & Level Bar (Monochrome Luxury) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center shrink-0">
            <Flame size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-inherit">Daily Habit Streak</span>
              <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                🔥 {progress.currentStreak} Day{progress.currentStreak === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-[#737373]">Best streak record: {progress.bestStreak} days</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-xs font-mono font-bold text-inherit uppercase">
              Level {progress.levelNumber}: {progress.levelName}
            </div>
            <div className="text-xs text-[#737373]">{progress.xp} Total XP</div>
          </div>
          <div className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
        </div>
      </div>

      {/* Challenge Description & Timer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="editorial-eyebrow">
              TODAY&apos;S CHALLENGE // +{activeChallenge.xpReward} XP
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-inherit mt-1">
              {activeChallenge.title}
            </h3>
          </div>

          {/* 30-Second Countdown Timer */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] border border-white/10 dark:border-white/10 light:border-black/10 shrink-0">
            <Clock size={16} className="text-[#737373]" />
            <span className="font-mono font-bold text-base w-12 text-center text-inherit">
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
            </span>
            <button
              onClick={toggleTimer}
              className="p-1.5 rounded-lg hover:bg-white/10 text-inherit"
              title={isTimerRunning ? 'Pause timer' : 'Start 30-sec timer'}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={resetTimer}
              className="p-1.5 rounded-lg hover:bg-white/10 text-inherit"
              title="Reset timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
          {activeChallenge.task}
        </p>

        {/* Recommended vs Avoid Approach Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-1">
            <strong className="text-inherit block">Recommended Structure</strong>
            <p className="text-[#737373] italic leading-relaxed">
              &ldquo;{activeChallenge.exampleGood}&rdquo;
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-1">
            <strong className="text-inherit block">Avoid Raw Phrasing</strong>
            <p className="text-[#737373] italic leading-relaxed">
              &ldquo;{activeChallenge.exampleAvoid}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      {!isCompleted ? (
        <form onSubmit={handleComplete} className="space-y-4 pt-2">
          <label className="text-xs font-mono text-[#737373] block">
            Type your 3-sentence response (or speak aloud with timer):
          </label>
          <textarea
            value={userSubmission}
            onChange={(e) => setUserSubmission(e.target.value)}
            placeholder="Introduce who you are, what technology you build with, and what problem you solve..."
            rows={3}
            className="w-full text-xs sm:text-sm font-sans"
            required
          />
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] text-[#737373]">
              Est. time: ~30 seconds • XP awarded on submit
            </span>
            <button
              type="submit"
              className="btn btn-primary text-xs py-2.5 px-6 font-bold"
            >
              Claim +{activeChallenge.xpReward} XP
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.02] flex items-center justify-between text-xs text-inherit">
          <div className="flex items-center gap-2 font-bold">
            <Check size={16} />
            <span>Today&apos;s Challenge Completed (+50 XP Claimed)</span>
          </div>
          <span className="font-mono text-[#737373]">Next reset: Midnight</span>
        </div>
      )}
    </div>
  );
}
