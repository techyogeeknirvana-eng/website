'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Compass, 
  ShieldCheck, 
  Zap, 
  Users, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';

export function HeroSection() {
  const { isAuthenticated, openGoogleModal, currentUser } = useAuth();

  const handleJoinClick = () => {
    soundEffects.playClick();
    if (!isAuthenticated) {
      openGoogleModal();
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20 px-4">
      {/* Background Cyber Grid & Radiant Lights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)'
          }}
        />

        {/* Ambient Gradient Glows */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-35"
          style={{
            background: 'radial-gradient(circle, var(--accent-indigo) 0%, var(--accent-cyan) 60%, transparent 100%)'
          }}
        />
        <div 
          className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full blur-[120px] opacity-25"
          style={{
            background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-10 -left-20 w-[450px] h-[450px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Floating Orbital Node Badges (Yukti Kula inspired tech composition) */}
      <div className="pointer-events-none absolute inset-0 max-w-6xl mx-auto hidden lg:block z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-28 left-8"
        >
          <div className="glass-card px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">40+ Live Events &amp; Summits</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-36 right-10"
        >
          <div className="glass-card px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="font-semibold text-white">Adaptive Communication Coach</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-32 left-16"
        >
          <div className="glass-card px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            <Zap size={14} className="text-amber-400" />
            <span className="font-semibold text-white">Student-Led Tech Ecosystem</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-28 right-16"
        >
          <div className="glass-card px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span className="font-semibold text-white">Verified B.Tech Opportunities</span>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        {/* Top Eyebrow Chip */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-8 shadow-inner"
        >
          <Sparkles size={14} className="text-cyan-400" />
          <span>TechYOGeek Nirvana &bull; Student Technology Ecosystem</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 font-display"
        >
          Where Students <br />
          <span className="text-gradient">
            Learn. Build. Compete. Connect. Grow.
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300/90 max-w-2xl mx-auto font-normal leading-relaxed mb-10"
        >
          A student-led technology ecosystem connecting learners, builders, communities, colleges and industry through events, hackathons, workshops, verified opportunities and personalized communication growth.
        </motion.p>

        {/* Call to Actions (3 Key CTAs) */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              onClick={() => soundEffects.playClick()}
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-lg shadow-indigo-500/25 flex items-center gap-2 group transition-all transform hover:-translate-y-0.5"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={handleJoinClick}
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-lg shadow-indigo-500/25 flex items-center gap-2 group transition-all transform hover:-translate-y-0.5"
            >
              <span>Join TYGN</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <Link
            href="/events"
            onClick={() => soundEffects.playClick()}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 shadow-sm"
          >
            <Calendar size={16} className="text-cyan-400" />
            <span>Explore Events</span>
          </Link>

          <Link
            href="/growth"
            onClick={() => soundEffects.playClick()}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 shadow-sm group"
          >
            <Compass size={16} className="text-amber-400 group-hover:rotate-45 transition-transform" />
            <span>Explore Growth Hub</span>
          </Link>
        </motion.div>

        {/* Institutional Credibility Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Non-profit student network
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            15+ College chapters
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Open source &amp; merit-driven
          </span>
        </motion.div>
      </div>
    </section>
  );
}
