'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  Lock, 
  BookOpen, 
  Sparkles, 
  Gamepad2, 
  Briefcase, 
  Users, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

interface PublicFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublicFeaturesModal({ isOpen, onClose }: PublicFeaturesModalProps) {
  const { isDark } = useThemeCustomizer();

  if (!isOpen) return null;

  const features = [
    {
      title: 'Notes & Academic Drive',
      description: 'Organize your learning resources, syllabus, and verified laboratory notes for all semesters.',
      icon: BookOpen,
      target: '/notes',
    },
    {
      title: 'Growth Hub',
      description: 'Build communication, verbal manners, executive presence, and professional etiquette.',
      icon: Sparkles,
      target: '/growth',
    },
    {
      title: 'Games Arena',
      description: 'Practice high-stakes workplace communication through interactive scenarios and Say It Better.',
      icon: Gamepad2,
      target: '/games',
    },
    {
      title: 'Opportunities Board',
      description: 'Discover curated internships, hackathons, coding competitions, and student grants.',
      icon: Briefcase,
      target: '/opportunities',
    },
    {
      title: 'Community Collaboration',
      description: 'Connect with peers, find project teammates, and participate in peer discussions.',
      icon: Users,
      target: '/community',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="fixed inset-0" 
        onClick={() => {
          soundEffects.playClick();
          onClose();
        }} 
      />

      <div 
        className="relative z-10 w-full max-w-xl mono-card p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: isDark ? '#0a0a0a' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div>
            <div className="editorial-eyebrow">
              PLATFORM OVERVIEW // PUBLIC PREVIEW
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-inherit mt-1">
              TYGN FEATURES
            </h3>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-inherit transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
          The public website provides an introduction to the ecosystem. Sign in with your student account to unlock full interactive tools.
        </p>

        <div className="space-y-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors hover:border-white/25"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-inherit">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-inherit">{feat.title}</h4>
                    <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">{feat.description}</p>
                  </div>
                </div>

                <Link
                  href={`/login?redirect=${encodeURIComponent(feat.target)}`}
                  onClick={() => {
                    soundEffects.playClick();
                    onClose();
                  }}
                  className="btn btn-secondary text-[0.72rem] py-1.5 px-3 rounded-lg font-bold shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto no-underline text-inherit"
                >
                  <Lock size={11} />
                  <span>Sign in to access</span>
                  <ArrowRight size={11} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono text-[#737373]">
            Verified Student Platform
          </span>

          <Link
            href="/login"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="btn btn-primary text-xs py-2 px-5 font-bold w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <span>Continue with Google</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
