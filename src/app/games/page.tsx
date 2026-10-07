'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Gamepad2, 
  ArrowRight, 
  Flame, 
  Award, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { SayItBetterGame } from '@/components/games/SayItBetterGame';
import { GamesSuite } from '@/components/games/GamesSuite';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

interface GameItem {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  xpReward: number;
  category: string;
}

export default function GamesPage() {
  const { isDark } = useThemeCustomizer();
  const [selectedGame, setSelectedGame] = useState<string>('say-it-better');

  const allGames: GameItem[] = [
    {
      id: 'say-it-better',
      title: 'Say It Better',
      tagline: 'Improve everyday blunt sentences into polished executive statements.',
      difficulty: 'Intermediate',
      time: '2 min',
      xpReward: 50,
      category: 'Flagship // Tone Refinement',
    },
    {
      id: 'etiquette-dilemma',
      title: 'Etiquette Dilemma',
      tagline: 'Make the right professional decision under workplace friction.',
      difficulty: 'Intermediate',
      time: '3 min',
      xpReward: 40,
      category: 'Ethics & Judgment',
    },
    {
      id: 'vocab-precision',
      title: 'Vocabulary Precision',
      tagline: 'Replace vague filler words with high-impact executive precision.',
      difficulty: 'Beginner',
      time: '2 min',
      xpReward: 30,
      category: 'Word Architecture',
    },
    {
      id: 'rapid-response',
      title: 'Rapid Response',
      tagline: 'Respond to urgent stakeholder requests under 15-second clock pressure.',
      difficulty: 'Advanced',
      time: '4 min',
      xpReward: 60,
      category: 'Crisis Communication',
    },
    {
      id: 'logic-breaker',
      title: 'Logic Breaker',
      tagline: 'Identify subtle fallacies in project plans and technical arguments.',
      difficulty: 'Advanced',
      time: '5 min',
      xpReward: 65,
      category: 'Critical Thinking',
    },
    {
      id: 'cyber-challenge',
      title: 'Cyber Challenge',
      tagline: 'Detect social engineering and credential traps in everyday communications.',
      difficulty: 'Intermediate',
      time: '3 min',
      xpReward: 45,
      category: 'Security Mindset',
    },
  ];

  const handleLaunchGame = (id: string) => {
    soundEffects.playClick();
    setSelectedGame(id);
    const el = document.getElementById('play-arena');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container-custom pt-24 sm:pt-28 pb-24 space-y-16 sm:space-y-24">
      {/* 1. HERO (Item 50) */}
      <section className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 dark:border-white/10 light:border-black/10 text-xs font-semibold uppercase tracking-widest text-[#737373]">
          <Gamepad2 size={13} />
          <span>INTERACTIVE TRAINING ARENA // TYGN GAMES</span>
        </div>

        <div className="space-y-3">
          <h1 className="editorial-title text-4xl sm:text-6xl md:text-7xl text-inherit">
            PLAY. PRACTICE. IMPROVE.
          </h1>
          <p className="text-sm sm:text-lg text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] max-w-2xl mx-auto leading-relaxed">
            Short, competitive challenges designed to sharpen how you think, speak and respond under pressure.
          </p>
        </div>
      </section>

      {/* 2. FEATURED: SAY IT BETTER (Item 50) */}
      <section className="mono-card p-8 sm:p-14 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="space-y-3 max-w-xl">
            <div className="editorial-eyebrow">
              FEATURED CHALLENGE // FLAGSHIP
            </div>
            <h2 className="editorial-title text-3xl sm:text-5xl">
              Say It Better
            </h2>
            <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
              Raw, blunt statements can ruin collaboration. Master the art of converting casual campus frustration into authoritative, polite, and persuasive executive communication.
            </p>
          </div>

          <button
            onClick={() => handleLaunchGame('say-it-better')}
            className="btn btn-primary text-xs sm:text-sm py-3.5 px-8 font-bold shrink-0 inline-flex items-center gap-2"
          >
            <span>PLAY NOW</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Quick Showcase Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] space-y-1.5">
            <div className="text-[0.65rem] font-mono text-[#737373] uppercase">Raw Statement</div>
            <p className="text-xs sm:text-sm font-medium line-through opacity-60">
              &ldquo;Send me the file ASAP.&rdquo;
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.02] space-y-1.5">
            <div className="text-[0.65rem] font-mono text-inherit uppercase font-bold">Executive Alternative</div>
            <p className="text-xs sm:text-sm text-inherit font-medium">
              &ldquo;Could you please share the file when you get a moment? We need it to finalize the sprint assets.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 3. ALL GAME CARDS (Item 26 & 50) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              CHALLENGE SUITE
            </div>
            <h2 className="editorial-title text-2xl sm:text-4xl mt-1">
              All Games
            </h2>
          </div>
          <span className="text-xs font-mono text-[#737373]">
            {allGames.length} Challenges Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGames.map((game) => (
            <div
              key={game.id}
              className={`mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all ${
                selectedGame === game.id ? 'border-white/40 shadow-xl' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#737373] text-[0.68rem]">{game.category}</span>
                  <span className="mono-badge text-[0.62rem] py-0.5 px-2">{game.difficulty}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-inherit">
                  {game.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                  {game.tagline}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
                <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} /> {game.time}
                  </span>
                  <span className="font-bold text-inherit">
                    +{game.xpReward} XP
                  </span>
                </div>

                <button
                  onClick={() => handleLaunchGame(game.id)}
                  className={`btn text-xs py-2.5 px-4 w-full justify-center font-bold ${
                    selectedGame === game.id ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <span>Play {game.title}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ACTIVE ARENA RUNNER */}
      <section id="play-arena" className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <div className="editorial-eyebrow">
            LIVE ARENA RUNNER
          </div>
          <h2 className="editorial-title text-2xl sm:text-4xl">
            {selectedGame === 'say-it-better'
              ? 'Say It Better Arena'
              : selectedGame === 'etiquette-dilemma'
              ? 'Etiquette Dilemma Arena'
              : 'Vocabulary Precision Arena'}
          </h2>
        </div>

        {selectedGame === 'say-it-better' && <SayItBetterGame />}
        {selectedGame === 'etiquette-dilemma' && <GamesSuite initialGame="etiquette" />}
        {selectedGame === 'vocab-precision' && <GamesSuite initialGame="vocab" />}
        {selectedGame !== 'say-it-better' && selectedGame !== 'etiquette-dilemma' && selectedGame !== 'vocab-precision' && (
          <div className="mono-card p-12 text-center max-w-xl mx-auto space-y-4">
            <h3 className="font-display font-bold text-xl text-inherit">Coming to Live Arena</h3>
            <p className="text-xs sm:text-sm text-[#737373]">
              This specialized module is scheduled for the next community tournament update. In the meantime, play Say It Better or Etiquette Dilemma.
            </p>
            <button
              onClick={() => setSelectedGame('say-it-better')}
              className="btn btn-primary text-xs py-2 px-5 font-bold"
            >
              Play Say It Better Now
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
