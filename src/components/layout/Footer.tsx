'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  MessageCircle, 
  FolderGit2
} from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '@/components/common/BrandIcons';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export function Footer() {
  const { isDark } = useThemeCustomizer();

  return (
    <footer
      className="border-t py-16 sm:py-24 transition-colors"
      style={{
        background: isDark ? '#000000' : '#ffffff',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        color: isDark ? '#ffffff' : '#000000',
      }}
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-16 pb-16 border-b"
          style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }}
        >
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-7 h-7 rounded-full border flex items-center justify-center p-0.5"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }}
              >
                <img
                  src="/assets/tygn-logo.png"
                  alt="TYGN"
                  className="w-full h-full object-contain invert dark:invert-0"
                />
              </div>
              <span className="font-display font-black text-lg tracking-tight">
                TYGN NIRVANA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed max-w-xs">
              A student-led technology ecosystem where students discover opportunities, build real projects, and develop professional presence beyond the classroom.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/techyogeek-nirvana-834b92309/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border hover:bg-white/10 transition-colors"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }}
                title="LinkedIn"
              >
                <LinkedinIcon size={14} color="currentColor" />
              </a>
              <a
                href="https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border hover:bg-white/10 transition-colors"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }}
                title="WhatsApp Community"
              >
                <MessageCircle size={14} />
              </a>
              <a
                href="https://www.instagram.com/techyogeek.nirvana"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border hover:bg-white/10 transition-colors"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }}
                title="Instagram"
              >
                <InstagramIcon size={14} color="currentColor" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#737373]">
              Ecosystem
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  About TYGN
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Tech Events &amp; Summits
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Internships &amp; Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Growth & Training */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#737373]">
              Personal Growth
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/growth" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Growth Hub Overview
                </Link>
              </li>
              <li>
                <Link href="/growth#quiz" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  10-Q Communication Diagnostic
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Games Arena (Say It Better)
                </Link>
              </li>
              <li>
                <Link href="/growth#simulator" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Conversation Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Resources */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#737373]">
              Academic Drive
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/notes" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  B.Tech Notes Drive
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Engineering Skill Trees
                </Link>
              </li>
              <li>
                <Link href="/tech-radar" className="text-[#a3a3a3] hover:text-white transition-colors no-underline">
                  Tech Radar 2026
                </Link>
              </li>
              <li>
                <a
                  href="https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a3a3a3] hover:text-white transition-colors no-underline inline-flex items-center gap-1.5"
                >
                  <FolderGit2 size={13} /> Official Drive Archive <ArrowUpRight size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            © {new Date().getFullYear()} TechYOGeek Nirvana. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Learn. Build. Compete. Connect. Grow.</span>
            <span className="font-mono">TYGN v2.0 Monochrome</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
