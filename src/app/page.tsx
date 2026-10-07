'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Briefcase, 
  Calendar, 
  Sparkles, 
  Gamepad2, 
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { WhatIsTYGN } from '@/components/home/WhatIsTYGN';
import { TYGNJourney } from '@/components/home/TYGNJourney';
import { dbStore } from '@/lib/db/store';
import { Opportunity, CommunityEvent } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

export default function HomePage() {
  const { isDark } = useThemeCustomizer();
  const { signInWithGoogle, isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    setOpportunities(dbStore.getOpportunities().slice(0, 3));
    setEvents(dbStore.getEvents().slice(0, 3));
  }, []);

  return (
    <div className="space-y-32 sm:space-y-44 pb-24">
      {/* SECTION 01: HERO */}
      <HeroSection />

      {/* SECTION 02 & 03: MANIFESTO & 5 PILLARS */}
      <WhatIsTYGN />

      {/* SECTION 04: WHAT'S HAPPENING (EVENTS SHOWCASE) */}
      <section className="container-custom">
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div>
              <div className="editorial-eyebrow">
                SECTION 04 — TECH CALENDAR
              </div>
              <h2 className="editorial-title text-3xl sm:text-5xl mt-2">
                What&apos;s Happening
              </h2>
            </div>
            <Link
              href="/events"
              onClick={() => soundEffects.playClick()}
              className="text-xs sm:text-sm font-semibold text-inherit hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 no-underline"
            >
              <span>View All Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#737373]">
                    <span className="font-mono">{evt.date}</span>
                    <span className="mono-badge text-[0.62rem] py-0.5 px-2">{evt.category}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-inherit">
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#737373] line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#737373]">
                    {evt.participantsCount} Registered
                  </span>
                  <Link
                    href={`/events?id=${evt.id}`}
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-outline text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 no-underline text-inherit"
                  >
                    <span>Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05: OPPORTUNITIES MARKETPLACE */}
      <section className="container-custom">
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div>
              <div className="editorial-eyebrow">
                SECTION 05 — CAREER LAUNCHPAD
              </div>
              <h2 className="editorial-title text-3xl sm:text-5xl mt-2">
                Curated Opportunities
              </h2>
            </div>
            <Link
              href="/opportunities"
              onClick={() => soundEffects.playClick()}
              className="text-xs sm:text-sm font-semibold text-inherit hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 no-underline"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="mono-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#737373]">
                    <span className="font-semibold text-inherit">{opp.company}</span>
                    <span className="mono-badge text-[0.62rem] py-0.5 px-2">{opp.type}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-inherit">
                    {opp.title}
                  </h3>
                  <div className="text-xs text-[#737373]">
                    {opp.location} • {opp.stipendOrSalary}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[0.68rem] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a3a3a3]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
                  <span className="text-[0.72rem] font-mono text-[#737373]">
                    Verified
                  </span>
                  <Link
                    href={`/opportunities?id=${opp.id}`}
                    onClick={() => soundEffects.playClick()}
                    className="btn btn-outline text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 no-underline text-inherit"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06: BUILD YOURSELF (GROWTH HUB SHOWCASE) */}
      <section className="container-custom">
        <div className="mono-card p-8 sm:p-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div className="space-y-3 max-w-xl">
              <div className="editorial-eyebrow">
                SECTION 06 — PERSONAL DEVELOPMENT
              </div>
              <h2 className="editorial-title text-3xl sm:text-5xl">
                Become Better At More Than Code.
              </h2>
              <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
                Technical brilliance fails when paired with crude communication. Train with our signature 10-Question Diagnostic, tone rewrites, and interview simulations.
              </p>
            </div>

            <Link
              href="/growth"
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary text-xs sm:text-sm py-3 px-6 shrink-0"
            >
              <span>Enter Growth Hub</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-2">
              <div className="font-display font-black text-2xl">10-Q Diagnostic</div>
              <p className="text-xs text-[#737373] leading-relaxed">
                Adaptive situational testing that detects communication blindspots and calculates weakness weights.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-2">
              <div className="font-display font-black text-2xl">Phrase Analyzer</div>
              <p className="text-xs text-[#737373] leading-relaxed">
                Instant translation of aggressive, blunt, or passive campus messages into executive clarity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-2">
              <div className="font-display font-black text-2xl">Daily Streak Engine</div>
              <p className="text-xs text-[#737373] leading-relaxed">
                30-second daily elevator pitch challenges designed to build permanent verbal confidence under pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07: PLAY. PRACTICE. IMPROVE. (GAMES ARENA SHOWCASE) */}
      <section className="container-custom">
        <div className="mono-card p-8 sm:p-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div className="space-y-3 max-w-xl">
              <div className="editorial-eyebrow">
                SECTION 07 — INTERACTIVE ARENA
              </div>
              <h2 className="editorial-title text-3xl sm:text-5xl">
                Play. Practice. Improve.
              </h2>
              <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
                Short, competitive games engineered to sharpen decision-making instinct, vocabulary precision, and diplomatic response under clock pressure.
              </p>
            </div>

            <Link
              href="/games"
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary text-xs sm:text-sm py-3 px-6 shrink-0"
            >
              <Gamepad2 size={16} />
              <span>Launch Games Arena</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-2">
              <div className="text-xs font-mono text-[#737373]">FLAGSHIP GAME</div>
              <div className="font-display font-bold text-lg text-inherit">Say It Better</div>
              <p className="text-xs text-[#737373]">Rewrite everyday crude sentences into poised executive statements.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-2">
              <div className="text-xs font-mono text-[#737373]">ETHICAL JUDGMENT</div>
              <div className="font-display font-bold text-lg text-inherit">Etiquette Dilemma</div>
              <p className="text-xs text-[#737373]">Make the right professional decision during high-friction workplace events.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-black/[0.02] border border-white/10 dark:border-white/10 light:border-black/10 space-y-2">
              <div className="text-xs font-mono text-[#737373]">WORD ARCHITECTURE</div>
              <div className="font-display font-bold text-lg text-inherit">Vocabulary Precision</div>
              <p className="text-xs text-[#737373]">Replace vague filler terminology with high-impact professional precision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 08: THE TYGN JOURNEY */}
      <TYGNJourney />

      {/* SECTION 09: PARTNERS & CAMPUSES */}
      <section className="container-custom">
        <div className="space-y-8 text-center max-w-3xl mx-auto">
          <div className="editorial-eyebrow">
            SECTION 09 — ECOSYSTEM REACH
          </div>
          <h2 className="editorial-title text-3xl sm:text-4xl">
            Student-Led. Institution-Trusted.
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
            Active contributors, hackathon contenders, and student leaders spanning engineering colleges across India.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            {['GLBITM Greater Noida', 'Delhi NCR Campuses', 'B.Tech Tech Clubs', 'Open Source Orgs'].map((partner, i) => (
              <div 
                key={i}
                className="p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] font-display font-bold text-xs sm:text-sm flex items-center justify-center text-[#a3a3a3]"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section className="container-custom">
        <div className="mono-card p-10 sm:p-20 text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="editorial-eyebrow">
              SECTION 10 — GET STARTED
            </div>
            <h2 className="editorial-title text-4xl sm:text-6xl md:text-7xl">
              Build With Us.
            </h2>
            <p className="text-sm sm:text-lg text-[#737373] max-w-xl mx-auto leading-relaxed">
              Step into a community that demands technical execution, sharp communication, and real engineering standards.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isAuthenticated ? (
              <button
                onClick={() => signInWithGoogle()}
                className="btn btn-primary text-sm sm:text-base py-3.5 px-8 font-bold w-full sm:w-auto"
              >
                Join TechYOGeek Nirvana
              </button>
            ) : (
              <Link
                href="/dashboard"
                onClick={() => soundEffects.playClick()}
                className="btn btn-primary text-sm sm:text-base py-3.5 px-8 font-bold w-full sm:w-auto no-underline"
              >
                Launch Your Dashboard
              </Link>
            )}

            <Link
              href="/growth"
              onClick={() => soundEffects.playClick()}
              className="btn btn-secondary text-sm sm:text-base py-3.5 px-8 font-semibold w-full sm:w-auto no-underline"
            >
              Take Communication Diagnostic
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
