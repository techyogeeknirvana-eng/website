'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Users,
  Calendar,
  Radio,
  FileText,
  ExternalLink,
  BookOpen,
  Terminal,
  ShieldCheck,
  Check,
  GraduationCap,
  Quote,
  Flame,
  Award,
  Lock,
  Compass,
} from 'lucide-react';
import { GlobalMeshCanvas } from '@/components/common/GlobalMeshCanvas';
import { CyberHackerCanvas } from '@/components/common/CyberHackerCanvas';
import GlobeCanvas from '@/components/visuals/GlobeCanvas';
import { GoogleIcon } from '@/components/auth/GoogleAuthModal';
import { LaunchScreen } from '@/components/common/LaunchScreen';
import { dbStore } from '@/lib/db/store';
import { Opportunity, CommunityEvent, Project } from '@/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { useAuth } from '@/lib/auth/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, openGoogleModal, currentUser, isAdmin, signInWithGoogle } = useAuth();
  const [showRerunLaunch, setShowRerunLaunch] = useState(false);

  // Single curated example per category (1 flagship per section)
  const [flagshipOpportunity, setFlagshipOpportunity] = useState<Opportunity | null>(null);
  const [flagshipEvent, setFlagshipEvent] = useState<CommunityEvent | null>(null);
  const [flagshipProject, setFlagshipProject] = useState<Project | null>(null);

  const DRIVE_FOLDER_URL =
    'https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA';

  useEffect(() => {
    const opps = dbStore.getOpportunities();
    if (opps.length > 0) setFlagshipOpportunity(opps[0]);

    const evts = dbStore.getEvents();
    if (evts.length > 0) setFlagshipEvent(evts[0]);

    const projs = dbStore.getProjects();
    if (projs.length > 0) setFlagshipProject(projs[0]);
  }, []);

  // Smoothly redirect authenticated users to /dashboard
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  const stats = [
    { label: 'Active students', value: '500+' },
    { label: 'Notes shared', value: '120+' },
    { label: 'Events listed', value: '40+' },
    { label: 'Colleges', value: '15+' },
  ];

  const modules = [
    {
      name: 'Notes',
      href: '/notes',
      icon: BookOpen,
      desc: 'Branch & semester study material, curated by seniors.',
      highlight: false,
    },
    {
      name: 'Community',
      href: '/community',
      icon: Users,
      desc: 'Ask, answer, and chat with fellow B.Tech students.',
      highlight: false,
    },
    {
      name: 'Quizzes',
      href: '/live',
      icon: Radio,
      desc: 'Practice core CS, DSA and aptitude in short bursts.',
      highlight: false,
    },
    {
      name: 'Resume Builder',
      href: '/resume-lab',
      icon: FileText,
      desc: 'AI-powered ATS scoring with actionable feedback.',
      highlight: false,
    },
    {
      name: 'Events',
      href: '/events',
      icon: Calendar,
      desc: 'Hackathons, workshops and meetups in one feed.',
      highlight: false,
    },
    {
      name: 'Opportunities',
      href: '/opportunities',
      icon: Briefcase,
      desc: 'Internships and entry-level roles, hand-picked.',
      highlight: false,
    },
    {
      name: 'Get Credits',
      href: '/profile',
      icon: Award,
      desc: 'Earn credits by contributing, referring friends, or topping up.',
      highlight: true,
    },
  ];

  const testimonials = [
    {
      name: 'Aarav S.',
      role: 'CSE, 3rd year',
      quote:
        'TYGN saved me hours of hunting for notes. Got a clean PDF for every subject in one click.',
    },
    {
      name: 'Priya K.',
      role: 'ECE, 2nd year',
      quote:
        'The resume checker actually told me what was wrong. Cleared an internship screen the week after.',
    },
    {
      name: 'Rohan M.',
      role: 'IT, final year',
      quote:
        'Community answers come back fast, and the hackathon listings are genuinely useful.',
    },
  ];

  return (
    <div className="premium-shell text-slate-100">
      {/* Launch Screen (Startup Neural Boot) */}
      <LaunchScreen />

      {/* Manual Rerun Launch Screen Modal */}
      {showRerunLaunch && (
        <LaunchScreen
          forceShow={true}
          onComplete={() => setShowRerunLaunch(false)}
        />
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden" style={{ position: 'relative' }}>
        <div
          className="cyber-grid-bg pointer-events-none absolute inset-0"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.35,
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container-custom"
          style={{
            position: 'relative',
            paddingTop: '80px',
            paddingBottom: '60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Headline & Action */}
          <div style={{ maxWidth: '620px' }}>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 14px',
                fontSize: '12px',
                color: '#7dd3fc',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={14} style={{ color: '#38bdf8' }} />
              <span>For B.Tech students, by B.Tech students</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.4rem, 5.2vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
                color: 'var(--text-primary)',
              }}
            >
              The student ecosystem for{' '}
              <span className="text-gradient-premium">notes, community &amp; careers.</span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '560px',
              }}
            >
              TYGN Connect brings together study material, peer Q&amp;A, quizzes, resume tools,
              events and opportunities — one calm home instead of ten scattered tabs.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginBottom: '44px' }}>
              {isAuthenticated && currentUser ? (
                isAdmin ? (
                  <Link
                    href="/admin"
                    className="btn-premium"
                    style={{ padding: '14px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <ShieldCheck size={18} />
                    Open Admin Control Center
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="btn-premium"
                    style={{ padding: '14px 28px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Enter Dashboard <ArrowRight size={16} />
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="btn btn-primary"
                  style={{
                    padding: '14px 30px',
                    fontSize: '1.02rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 0 35px rgba(6, 182, 212, 0.45)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '3px',
                    }}
                  >
                    <GoogleIcon size={14} />
                  </div>
                  <span>Sign in with Google</span>
                  <ArrowRight size={16} />
                </button>
              )}

              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '13px 22px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Explore Platform
              </Link>

              {/* Direct Drive Notes Quick Link */}
              <a
                href={DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '13px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  color: '#38bdf8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <BookOpen size={16} /> B.Tech Drive <ExternalLink size={13} />
              </a>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '16px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    className="sheen-text"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1.7rem',
                      fontWeight: 800,
                      lineHeight: 1.2,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Interactive Globe Skeleton Graphic */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              height: '460px',
              margin: '0 auto',
            }}
          >
            <GlobeCanvas className="w-full h-full" />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '9999px',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '6px 18px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#7dd3fc',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(6, 182, 212, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <Sparkles size={13} style={{ color: 'var(--accent-cyan)' }} />
              <span>Interactive 3D Tech Globe • Drag to Rotate</span>
            </div>
          </div>
        </div>

        {/* Aurora Glowing Divider */}
        <div className="aurora-line" style={{ margin: '0 auto', maxWidth: '1200px' }} />
      </section>

      {/* EVERYTHING YOU NEED IN ONE PLACE MODULES */}
      <section id="features" style={{ padding: '80px 20px' }}>
        <div className="container-custom">
          <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '10px',
                color: 'var(--text-primary)',
              }}
            >
              Everything you need, in one place.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
              Focused modules. No fluff, no dead clicks — each card opens a real, working part of
              the platform.
            </p>
          </div>

          {/* Module Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.name}
                  href={m.href}
                  className="panel"
                  style={{
                    padding: '24px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderColor: m.highlight ? 'rgba(99, 102, 241, 0.4)' : undefined,
                  }}
                  onClick={() => soundEffects.playClick()}
                >
                  {m.highlight && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(90deg, #818cf8, #38bdf8)',
                        padding: '2px 10px',
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#05070f',
                      }}
                    >
                      New
                    </span>
                  )}

                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      border: m.highlight
                        ? '1px solid rgba(165, 180, 252, 0.4)'
                        : '1px solid rgba(56, 189, 248, 0.3)',
                      backgroundColor: m.highlight
                        ? 'rgba(99, 102, 241, 0.12)'
                        : 'rgba(56, 189, 248, 0.08)',
                    }}
                  >
                    <Icon
                      size={22}
                      style={{ color: m.highlight ? '#818cf8' : '#38bdf8' }}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {m.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      color: 'var(--text-secondary)',
                      flex: 1,
                      marginBottom: '16px',
                    }}
                  >
                    {m.desc}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: m.highlight ? '#818cf8' : '#38bdf8',
                    }}
                  >
                    Open <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HACKER ARENA SECTION (Ship like a hacker. Look like a pro.) */}
      <section
        style={{
          position: 'relative',
          padding: '80px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Holographic Cyber Skull Canvas */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              height: '360px',
              margin: '0 auto',
            }}
          >
            <CyberHackerCanvas />
          </div>

          {/* Hacker Info */}
          <div style={{ maxWidth: '580px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 14px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: '#a5b4fc',
                marginBottom: '16px',
              }}
            >
              <Terminal size={14} /> build · break · rebuild
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
              Ship like a hacker.{' '}
              <span className="text-gradient-premium">Look like a pro.</span>
            </h2>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '24px',
              }}
            >
              CTF-style challenges, project battles and peer code reviews — the fun of hacker
              culture with the discipline of a real engineering workflow. Learn in public, level
              up in weeks.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
                marginBottom: '28px',
              }}
            >
              {[
                'CTF challenges',
                'Code reviews',
                'Project battles',
                'Mentor circles',
                'Weekly sprints',
                'Live leaderboards',
              ].map((badge) => (
                <div
                  key={badge}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>

            <Link
              href="/community"
              className="btn-premium"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              Enter the arena <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* CURATED FLAGSHIP SECTIONS (1 Real Example Per Section) */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#38bdf8',
                marginBottom: '8px',
              }}
            >
              <Flame size={14} /> Curated Spotlight
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              Live In The Ecosystem Right Now
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Flagship Hackathon Card */}
            {flagshipEvent && (
              <div className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    Flagship Hackathon
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{flagshipEvent.date}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {flagshipEvent.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '16px' }}>
                  {flagshipEvent.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
                    {flagshipEvent.participantsCount} Builders Joined
                  </span>
                  <Link
                    href={`/events/${flagshipEvent.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#fff',
                      background: 'rgba(255,255,255,0.08)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    View Hackathon <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}

            {/* Flagship Opportunity Card */}
            {flagshipOpportunity && (
              <div className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    Curated Role
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{flagshipOpportunity.type}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px', color: 'var(--text-primary)' }}>
                  {flagshipOpportunity.title}
                </h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginBottom: '8px' }}>
                  {flagshipOpportunity.company} · {flagshipOpportunity.location}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '16px' }}>
                  {flagshipOpportunity.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                    {flagshipOpportunity.stipendOrSalary || 'Competitive'}
                  </span>
                  <Link
                    href={`/opportunities/${flagshipOpportunity.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#fff',
                      background: 'rgba(255,255,255,0.08)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    View Details <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}

            {/* Flagship Student Project Card */}
            {flagshipProject && (
              <div className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#6ee7b7',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    Student Showcase
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⭐ {flagshipProject.likes || 42} Upvotes</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {flagshipProject.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '16px' }}>
                  {flagshipProject.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>By {flagshipProject.authorName}</span>
                  <Link
                    href={`/projects/${flagshipProject.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#fff',
                      background: 'rgba(255,255,255,0.08)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    Explore Project <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (Built with students. Trusted by students.) */}
      <section style={{ padding: '80px 20px', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container-custom">
          <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '9999px',
                border: '1px solid rgba(165, 180, 252, 0.25)',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                padding: '4px 12px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#a5b4fc',
                marginBottom: '12px',
              }}
            >
              <Award size={13} /> Community impact
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Built with students. Trusted by students.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: 0,
                }}
              >
                <Quote size={22} style={{ color: '#38bdf8' }} />
                <blockquote
                  style={{
                    marginTop: '16px',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    flex: 1,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption
                  style={{
                    marginTop: '20px',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</span> ·{' '}
                  {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION PANEL (Ready to join TYGN Connect?) */}
      <section style={{ padding: '80px 20px 100px 20px' }}>
        <div
          className="panel container-custom"
          style={{
            maxWidth: '940px',
            padding: '50px 30px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Radial Glow Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.6,
              background:
                'radial-gradient(600px 240px at 50% 0%, hsla(243, 80%, 60%, 0.22), transparent 70%)',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <Sparkles
              size={28}
              style={{ color: '#38bdf8', margin: '0 auto 16px auto', display: 'block' }}
            />
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '12px',
                color: 'var(--text-primary)',
              }}
            >
              Ready to join TYGN Connect?
            </h3>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                maxWidth: '540px',
                margin: '0 auto 28px auto',
              }}
            >
              Free for every B.Tech student. Sign in with Google and you&apos;re in.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '14px',
              }}
            >
              {isAuthenticated && currentUser ? (
                <Link
                  href="/notes"
                  className="btn-premium"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                >
                  Go to Notes
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={openGoogleModal}
                  className="btn-premium"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                >
                  Sign in with Google
                </button>
              )}

              <a
                href={DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <BookOpen size={16} /> Direct Drive Notes <ExternalLink size={14} />
              </a>

              {/* Rerun Mainframe Diagnostics Button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setShowRerunLaunch(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  backgroundColor: 'rgba(56, 189, 248, 0.06)',
                  color: '#38bdf8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <Terminal size={15} /> [ RERUN BOOT DIAGNOSTICS ]
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
