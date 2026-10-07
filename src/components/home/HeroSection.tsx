'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function HeroSection() {
  const { isDark } = useThemeCustomizer();

  const handleScrollToStory = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 sm:pt-28 pb-16 overflow-hidden">
      {/* Subtle Animated Monochrome Grid & Atmospheric Radial Shade */}
      <div 
        className="absolute inset-0 pointer-events-none subtle-grid opacity-30 dark:opacity-25"
        style={{
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)',
        }}
      />

      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[130px] pointer-events-none opacity-20 dark:opacity-15"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6 sm:space-y-8">
        {/* Eyebrow Pill */}
        <div 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest transition-all"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)',
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            color: isDark ? '#d4d4d4' : '#404040',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <span>STUDENT TECHNOLOGY PLATFORM</span>
        </div>

        {/* Main Headline — Editorial Large Typography */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="font-display font-black tracking-tight leading-[0.92] text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-inherit">
            TYGN
          </h1>
          <p className="font-display font-semibold tracking-tight text-2xl sm:text-4xl md:text-5xl text-[#a3a3a3] dark:text-[#a3a3a3] light:text-[#525252]">
            Learn. Build. Compete. Grow.
          </p>
        </div>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-lg md:text-xl text-[#737373] dark:text-[#a3a3a3] light:text-[#525252] max-w-2xl mx-auto leading-relaxed font-normal">
          A student-led technology ecosystem where students discover opportunities, build real projects, compete in challenges, and develop the skills needed beyond the classroom.
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <a
            href="#story"
            onClick={handleScrollToStory}
            className="btn btn-primary text-sm sm:text-base py-3 sm:py-3.5 px-8 sm:px-10 w-full sm:w-auto font-bold flex items-center justify-center gap-2"
          >
            <span>Explore TYGN</span>
            <ArrowRight size={16} />
          </a>

          <Link
            href="/growth"
            onClick={() => soundEffects.playClick()}
            className="btn btn-secondary text-sm sm:text-base py-3 sm:py-3.5 px-8 sm:px-10 w-full sm:w-auto font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Enter Growth Hub</span>
          </Link>
        </div>

        {/* Secondary Trust Strip */}
        <div className="pt-8 sm:pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 border-t border-white/10 dark:border-white/10 light:border-black/10 w-full text-center">
          <div>
            <div className="font-display font-black text-2xl sm:text-3xl">1,200+</div>
            <div className="text-[0.68rem] uppercase font-bold tracking-wider text-[#737373] mt-0.5">Students</div>
          </div>
          <div>
            <div className="font-display font-black text-2xl sm:text-3xl">15+</div>
            <div className="text-[0.68rem] uppercase font-bold tracking-wider text-[#737373] mt-0.5">Hackathons</div>
          </div>
          <div>
            <div className="font-display font-black text-2xl sm:text-3xl">50+</div>
            <div className="text-[0.68rem] uppercase font-bold tracking-wider text-[#737373] mt-0.5">Opportunities</div>
          </div>
          <div>
            <div className="font-display font-black text-2xl sm:text-3xl">100%</div>
            <div className="text-[0.68rem] uppercase font-bold tracking-wider text-[#737373] mt-0.5">Student-Led</div>
          </div>
        </div>
      </div>
    </section>
  );
}
