'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Code, 
  Layers, 
  Trophy, 
  Users, 
  BookOpen, 
  FileText, 
  Briefcase, 
  Calendar, 
  HelpCircle,
  Cpu,
  Compass,
  Zap,
  CheckCircle2,
  Share2,
  ExternalLink
} from 'lucide-react';
import { LinkedinIcon } from '@/components/common/BrandIcons';
import { soundEffects } from '@/lib/audio/soundEffects';
import FounderCyberProfile from '@/components/about/FounderCyberProfile';

export default function AboutPage() {
  const [activeEcosystemNode, setActiveEcosystemNode] = useState<string | null>(null);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  const ecosystemNodes = [
    {
      id: 'notes',
      label: 'NOTES',
      desc: 'Learn and revise with curated academic notes & drive links.',
      href: '/notes',
      icon: <BookOpen size={20} />,
      color: '#38bdf8',
    },
    {
      id: 'quizzes',
      label: 'QUIZZES',
      desc: 'Test your knowledge with real-time adaptive quizzes.',
      href: '/quizzes',
      icon: <HelpCircle size={20} />,
      color: '#a855f7',
    },
    {
      id: 'community',
      label: 'COMMUNITY',
      desc: 'Learn, chat and network with passionate engineering peers.',
      href: '/community',
      icon: <Users size={20} />,
      color: '#06b6d4',
    },
    {
      id: 'events',
      label: 'EVENTS',
      desc: 'Hackathons, CTFs, workshops and technical events.',
      href: '/events',
      icon: <Calendar size={20} />,
      color: '#f59e0b',
    },
    {
      id: 'opportunities',
      label: 'OPPORTUNITIES',
      desc: 'Discover internships, jobs, freelance gigs and competitions.',
      href: '/opportunities',
      icon: <Briefcase size={20} />,
      color: '#10b981',
    },
    {
      id: 'resume',
      label: 'RESUME',
      desc: 'Build, audit and improve your career profile with AI ATS scoring.',
      href: '/resume-lab',
      icon: <FileText size={20} />,
      color: '#ec4899',
    },
  ];

  const pillars = [
    {
      num: '01',
      title: 'LEARN',
      tagline: 'Knowledge becomes valuable when you can apply it.',
      desc: 'Move past passive video watching. We curate high-yield engineering notes, real-world roadmaps, and hands-on modules designed for actual application.',
      icon: <BookOpen size={24} style={{ color: 'var(--accent-cyan)' }} />,
      glow: 'rgba(6, 182, 212, 0.25)',
      border: 'rgba(6, 182, 212, 0.4)',
    },
    {
      num: '02',
      title: 'BUILD',
      tagline: 'Ideas matter when you turn them into something real.',
      desc: 'Turn theoretical concepts into live open-source applications, AI models, and scalable architectures. Build a tangible portfolio that proves competence.',
      icon: <Layers size={24} style={{ color: 'var(--accent-indigo)' }} />,
      glow: 'rgba(99, 102, 241, 0.25)',
      border: 'rgba(99, 102, 241, 0.4)',
    },
    {
      num: '03',
      title: 'COMPETE',
      tagline: 'Challenges push you beyond what you thought you could do.',
      desc: 'Participate in high-stakes hackathons, competitive programming sprints, and live CTF challenges. Pressure forges elite engineering problem solvers.',
      icon: <Trophy size={24} style={{ color: 'var(--accent-amber)' }} />,
      glow: 'rgba(245, 158, 11, 0.25)',
      border: 'rgba(245, 158, 11, 0.4)',
    },
    {
      num: '04',
      title: 'CONNECT',
      tagline: 'The right people can change what you build and where you go.',
      desc: 'Surround yourself with ambitious student builders, hackathon co-founders, and industry mentors. Great careers are built on peer networks.',
      icon: <Users size={24} style={{ color: 'var(--accent-purple)' }} />,
      glow: 'rgba(168, 85, 247, 0.25)',
      border: 'rgba(168, 85, 247, 0.4)',
    },
  ];

  const timelineSteps = [
    {
      year: '2023',
      badge: 'THE BEGINNING',
      title: 'The Spark & Foundation',
      desc: 'Started as a student-led initiative to break down silos between colleges and give passionate coders direct access to study materials, guidance, and peer collaboration.',
      color: '#f59e0b',
    },
    {
      year: 'LEARN',
      badge: 'KNOWLEDGE COMMONS',
      title: 'Building Knowledge',
      desc: 'Created structured curriculum notes, tech radars, and curated roadmaps so no student is left guessing what skills actually matter in the modern software industry.',
      color: '#38bdf8',
    },
    {
      year: 'BUILD',
      badge: 'PROJECT ENGINE',
      title: 'Turning Ideas into Projects',
      desc: 'Launched peer code showcases, collaborative repositories, and technical incubators empowering students to ship working web apps, AI tools, and system prototypes.',
      color: '#818cf8',
    },
    {
      year: 'COMPETE',
      badge: 'CHALLENGE ARENA',
      title: 'Testing Skills Through Challenges',
      desc: 'Organized competitive hackathon squads, algorithmic showdowns, and live interactive quiz rooms that test technical prowess in real time.',
      color: '#ec4899',
    },
    {
      year: 'CONNECT',
      badge: 'OPPORTUNITY NETWORK',
      title: 'Finding People and Opportunities',
      desc: 'Forging bridges to verified internships, startup fellowships, and cross-university project teams where builders meet builders.',
      color: '#10b981',
    },
  ];

  const founder = {
    name: 'Prabh Ansh Jot Singh',
    role: 'FOUNDER & TECHNOLOGY ENTHUSIAST',
    image: '/team/prabh-ansh-jot-singh.png',
    bio: 'Prabh Ansh Jot Singh is a technology enthusiast and the founder of TYGN (TechYOGeek Nirvana), a community built to help students learn, build, compete, and discover opportunities in technology.',
    detailedBio: 'With a strong interest in cybersecurity, cloud, AI, networking, and software development, he focuses on creating practical platforms, technical communities, and experiences that encourage students to move beyond theory and start building.',
    focusAreas: ['Cybersecurity', 'Cloud Infrastructure', 'Artificial Intelligence', 'Networking', 'Software Development'],
    linkedinUrl: 'https://www.linkedin.com/in/prabhanshjotsingh/?skipRedirect=true',
  };

  const coreTeam = [
    {
      name: 'Ishpreet',
      role: 'Co-Founder & Full Stack Developer',
      image: '/team/ishpreet.png',
      bio: 'Ishpreet is a passionate Full Stack Developer focused on building scalable, user-friendly, and impactful web applications. With experience across both frontend and backend development, he enjoys turning ideas into complete digital products.',
      detailedBio: 'He is driven by problem-solving, clean development, and continuous learning, with a keen interest in exploring modern technologies and creating solutions that make a difference.',
      focusAreas: ['Full Stack Development', 'Frontend & Backend', 'Scalable Web Apps', 'Clean Architecture', 'Modern Stacks'],
      linkedinUrl: 'https://www.linkedin.com/in/ishpreet-singh-cse/',
    },
    {
      name: 'Harsh Vardhan Singh',
      role: 'Co-Founder & Data Analyst',
      image: '/team/harsh-vardhan-singh.jpg',
      bio: 'Harsh Vardhan Singh is a data-driven professional with a strong interest in data analytics, business intelligence, and turning complex data into meaningful insights. He works with data to identify patterns, understand trends, and support better decision-making.',
      detailedBio: 'With a practical approach to problem-solving, he focuses on transforming raw information into clear, actionable insights that create real value.',
      focusAreas: ['Data Analytics', 'Business Intelligence', 'Data Modeling', 'Pattern Recognition', 'Actionable Insights'],
      linkedinUrl: 'https://www.linkedin.com/in/harshvardhan-singh-57812537a?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    },
  ];

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0d1224 0%, #04060c 60%, #010204 100%)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dynamic Keyframe Animations & Micro-Interactions */}
      <style>{`
        @keyframes tygnSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes tygnSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes tygnFloatPulse {
          0%, 100% {
            transform: translateY(0px) scale(1);
            filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.4));
          }
          50% {
            transform: translateY(-8px) scale(1.04);
            filter: drop-shadow(0 0 28px rgba(99, 102, 241, 0.65));
          }
        }
        @keyframes tygnPulseAura {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.16);
            opacity: 0.85;
          }
        }
        @keyframes tygnScanline {
          0% {
            top: -10%;
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            top: 115%;
            opacity: 0;
          }
        }
        @keyframes tygnCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes tygnLivePing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          70%, 100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        @keyframes tygnTextShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes tygnRadarWave {
          0% {
            transform: translate(-50%, -50%) scale(0.92);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }
        @keyframes tygnAuroraFlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0.35;
          }
          50% {
            transform: translate(-46%, -54%) scale(1.25) rotate(180deg);
            opacity: 0.65;
          }
        }
        @keyframes tygnSubtleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes tygnFadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tygnCtaPulse {
          0%, 100% {
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.4), 0 0 50px rgba(99, 102, 241, 0.2);
          }
          50% {
            box-shadow: 0 0 45px rgba(6, 182, 212, 0.7), 0 0 80px rgba(99, 102, 241, 0.4);
          }
        }

        .tygn-anim-hero-1 {
          animation: tygnFadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tygn-anim-hero-2 {
          animation: tygnFadeSlideUp 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .tygn-anim-hero-3 {
          animation: tygnFadeSlideUp 0.8s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .tygn-anim-hero-4 {
          animation: tygnFadeSlideUp 0.8s 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .tygn-text-gradient-animated {
          background: linear-gradient(135deg, #ffffff 0%, #38bdf8 30%, #a855f7 60%, #38bdf8 85%, #ffffff 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          WebkitTextFillColor: transparent;
          animation: tygnTextShimmer 7s ease-in-out infinite;
        }

        .tygn-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.9) 50%, transparent 100%);
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.9);
          animation: tygnScanline 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: 5;
        }

        .tygn-cursor-blink {
          animation: tygnCursorBlink 0.9s infinite;
        }

        .tygn-live-ping {
          animation: tygnLivePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .tygn-founder-card-hover {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .tygn-founder-card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(56, 189, 248, 0.5) !important;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5), 0 0 35px rgba(6, 182, 212, 0.25) !important;
        }

        .tygn-cta-button-glow {
          animation: tygnCtaPulse 3s ease-in-out infinite;
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .tygn-cta-button-glow:hover {
          transform: translateY(-3px) scale(1.03);
          filter: brightness(1.15);
        }
      `}</style>

      {/* Background Cyber Grid Accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'tygnSubtleFloat 8s ease-in-out infinite',
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1, padding: '60px 24px 100px 24px' }}>
        
        {/* ==========================================================
            1. HERO SECTION
        ========================================================== */}
        <section style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 120px auto', paddingTop: '40px' }}>
          {/* Eyebrow */}
          <div
            className="tygn-anim-hero-1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: 'var(--accent-cyan)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '28px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                boxShadow: '0 0 8px var(--accent-cyan)',
                position: 'relative',
              }}
            >
              <span
                className="tygn-live-ping"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                }}
              />
            </span>
            01 / ABOUT TYGN
          </div>

          {/* Large Headline */}
          <h1
            className="tygn-anim-hero-2"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: '-0.035em',
              marginBottom: '28px',
              textTransform: 'uppercase',
            }}
          >
            ONE HOME.<br />
            <span className="tygn-text-gradient-animated">
              ENDLESS POSSIBILITIES.
            </span>
          </h1>

          {/* Supporting Paragraph */}
          <p
            className="tygn-anim-hero-3"
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '740px',
              margin: '0 auto 40px auto',
              fontWeight: 400,
            }}
          >
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TYGN (TechYOGeek Nirvana)</strong> is a student-driven technology community founded in 2023, built to bring learning, building, competition, collaboration, and opportunities together in one place.
          </p>

          <p
            className="tygn-anim-hero-3"
            style={{
              fontSize: '1.02rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 48px auto',
            }}
          >
            We believe students shouldn&apos;t have to search everywhere to find the knowledge, people, challenges, and opportunities they need to grow.
          </p>

          {/* Animated Futuristic TYGN Cyber Emblem */}
          <div
            className="tygn-anim-hero-4"
            style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer Pulsing Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(99, 102, 241, 0.15) 60%, transparent 80%)',
                animation: 'tygnPulseAura 4s ease-in-out infinite',
              }}
            />
            {/* Rotating Outer Ring with Orbit Nodes */}
            <div
              style={{
                position: 'absolute',
                inset: '4px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(6, 182, 212, 0.45)',
                animation: 'tygnSpinSlow 24s linear infinite',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 10px var(--accent-cyan)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-indigo)',
                  boxShadow: '0 0 10px var(--accent-indigo)',
                }}
              />
            </div>
            {/* Middle Ring with Reverse Orbit Node */}
            <div
              style={{
                position: 'absolute',
                inset: '22px',
                borderRadius: '50%',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                animation: 'tygnSpinReverse 16s linear infinite',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-3px',
                  transform: 'translateY(-50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ec4899',
                  boxShadow: '0 0 8px #ec4899',
                }}
              />
            </div>
            {/* Center Core Badge with Floating Pulse */}
            <div
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(7, 10, 20, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 35px rgba(6, 182, 212, 0.4), inset 0 0 18px rgba(99, 102, 241, 0.35)',
                zIndex: 2,
                animation: 'tygnFloatPulse 4s ease-in-out infinite',
              }}
            >
              <Cpu size={32} style={{ color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 8px #38bdf8)' }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', marginTop: '4px', color: '#fff' }}>TYGN</span>
            </div>
          </div>
        </section>

        {/* ==========================================================
            2. WHAT IS TYGN? (Asymmetric Editorial Layout)
        ========================================================== */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center',
            marginBottom: '130px',
            padding: '48px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(13, 18, 36, 0.6) 0%, rgba(5, 8, 16, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Text Column */}
          <div>
            <span
              style={{
                color: 'var(--accent-indigo)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              WHAT WE ARE
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
              }}
            >
              More than a community.<br />
              <span className="text-gradient">A place to grow.</span>
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              TYGN is an ecosystem for students and technology enthusiasts who want to do more than consume technology.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {[
                { title: 'Learn something new.', sub: 'Master the stacks that actually build real software.' },
                { title: 'Build something real.', sub: 'Move from tutorial hell to shipped production systems.' },
                { title: 'Compete against the best.', sub: 'Test problem-solving under real pressure and deadlines.' },
                { title: 'Connect with curious minds.', sub: 'Find co-founders, collaborators and lifelong tech peers.' },
                { title: 'Discover opportunities.', sub: 'Access direct internships, fellowships and talent pipelines.' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={13} style={{ color: 'var(--accent-cyan)' }} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.96rem' }}>{item.title}</strong>{' '}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.98rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              TYGN brings these experiences together under one roof.
            </p>
          </div>

          {/* Futuristic Visual / Graphic Column with Cyber Scanner */}
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              padding: '28px',
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(7, 10, 20, 0.95) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 0 40px rgba(6, 182, 212, 0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Animated Laser Scanner */}
            <div className="tygn-scanline" />

            {/* Top Terminal Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                tygn_core_ecosystem.ts
              </span>
            </div>

            {/* Code / Visual Blueprint */}
            <div style={{ fontFamily: 'monospace', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <div style={{ color: '#64748b' }}>{'// Initializing student capability engine'}</div>
              <div>
                <span style={{ color: '#f43f5e' }}>const</span> <span style={{ color: '#38bdf8' }}>community</span> = <span style={{ color: '#f43f5e' }}>new</span> <span style={{ color: '#fbbf24' }}>TYGNEcosystem</span>({'{'}
              </div>
              <div style={{ paddingLeft: '16px' }}>
                <div>founded: <span style={{ color: '#a855f7' }}>2023</span>,</div>
                <div>mission: <span style={{ color: '#10b981' }}>&quot;Empower Engineering Builders&quot;</span>,</div>
                <div>access: <span style={{ color: '#38bdf8' }}>&quot;Open &amp; Universal&quot;</span>,</div>
                <div>capabilities: [</div>
                <div style={{ paddingLeft: '16px', color: '#38bdf8' }}>
                  &apos;Knowledge Base&apos;, &apos;Open Collab&apos;,<br />
                  &apos;Hackathon Readiness&apos;, &apos;AI Suites&apos;
                </div>
                <div>]</div>
              </div>
              <div>{'}'});</div>
              <div style={{ marginTop: '12px', color: '#64748b' }}>{'// Resulting growth trajectory'}</div>
              <div>
                <span style={{ color: '#10b981' }}>community</span>.<span style={{ color: '#fbbf24' }}>accelerateCareers</span>({'{'} <span style={{ color: '#e2e8f0' }}>realWorldImpact</span>: <span style={{ color: '#a855f7' }}>Infinity</span> {'}'});
                <span className="tygn-cursor-blink" style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginLeft: '3px' }}>|</span>
              </div>
            </div>

            {/* Visual Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Community Pulse</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                      position: 'relative',
                    }}
                  >
                    <span
                      className="tygn-live-ping"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: '#10b981',
                      }}
                    />
                  </span>
                  Real-Time
                </div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ecosystem Mode</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>All-in-One</div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            3. OUR STORY & FOUNDERS
        ========================================================== */}
        <section style={{ marginBottom: '130px' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px auto' }}>
            <span
              style={{
                color: 'var(--accent-amber)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              02 / OUR STORY
            </span>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '18px',
              }}
            >
              It started with a simple idea.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              TYGN began in 2023 with a simple belief: talented students should have easier access to useful resources, meaningful technical experiences, communities, and opportunities.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6 }}>
              What started as a student-driven initiative is growing into a platform where students can learn, build, compete, collaborate, and discover what&apos;s next.
            </p>
          </div>

          {/* Authentic Founder Spotlight & Leadership */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '28px' }}>
              Visionary Leadership &amp; Student Builders
            </div>

            {/* Cyber/AI Founder Profile: Prabh Ansh Jot Singh */}
            <FounderCyberProfile founder={founder} />

            {/* Co-Founders & Core Leadership */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--accent-indigo)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                TYGN Co-Founders
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                maxWidth: '920px',
                margin: '0 auto',
              }}
            >
              {coreTeam.map((m, i) => (
                <div
                  key={i}
                  className="glass-card tygn-founder-card-hover"
                  style={{
                    padding: '28px 24px',
                    borderRadius: '22px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginBottom: '18px',
                        border: '2px solid rgba(56, 189, 248, 0.4)',
                        boxShadow: '0 0 24px rgba(6, 182, 212, 0.25)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease',
                      }}
                    >
                      <img
                        src={m.image}
                        alt={m.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: m.name === 'Ishpreet' ? 'center 15%' : 'center' }}
                      />
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: '#fff' }}>{m.name}</h4>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 12px',
                        borderRadius: '999px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: 'var(--accent-indigo)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                      }}
                    >
                      <Code size={12} /> {m.role}
                    </span>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '12px', fontWeight: 500 }}>
                      {m.bio}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '18px' }}>
                      {m.detailedBio}
                    </p>
                  </div>

                  {m.focusAreas && (
                    <div style={{ width: '100%', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                        {m.focusAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="badge"
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.linkedinUrl && (
                    <div style={{ marginTop: '16px', width: '100%' }}>
                      <a
                        href={m.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEffects.playClick()}
                        className="btn btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          color: '#ffffff',
                          width: '100%',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(2, 132, 199, 0.55)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 18px rgba(2, 132, 199, 0.35)';
                        }}
                      >
                        <LinkedinIcon size={16} color="#ffffff" />
                        <span>Connect on LinkedIn</span>
                        <ExternalLink size={13} style={{ opacity: 0.8, marginLeft: '2px' }} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Timeline (2023 -> LEARN -> BUILD -> COMPETE -> CONNECT) */}
          <div
            style={{
              padding: '40px 32px',
              borderRadius: '24px',
              background: 'linear-gradient(180deg, rgba(13, 18, 36, 0.5) 0%, rgba(5, 7, 15, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                EVOLUTION TRAJECTORY
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                position: 'relative',
              }}
            >
              {timelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${step.color}33`,
                    position: 'relative',
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = `${step.color}88`;
                    e.currentTarget.style.boxShadow = `0 10px 25px ${step.color}22`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = `${step.color}33`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: step.color,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    {step.badge}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px', color: '#fff' }}>
                    {step.year}
                  </div>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================
            4. WHAT WE BELIEVE (4 Interactive Cards)
        ========================================================== */}
        <section style={{ marginBottom: '130px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
            <span
              style={{
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              OUR CORE PHILOSOPHY
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                textTransform: 'uppercase',
              }}
            >
              WE BELIEVE TECHNOLOGY IS BEST LEARNED BY DOING.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="glass-card"
                onMouseEnter={() => {
                  setHoveredPillar(idx);
                  soundEffects.playClick();
                }}
                onMouseLeave={() => setHoveredPillar(null)}
                style={{
                  padding: '32px 26px',
                  borderRadius: '22px',
                  background: hoveredPillar === idx ? 'rgba(15, 23, 42, 0.95)' : 'rgba(10, 14, 26, 0.6)',
                  border: hoveredPillar === idx ? `1px solid ${p.border}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: hoveredPillar === idx ? `0 16px 40px ${p.glow}` : '0 4px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredPillar === idx ? 'translateY(-6px)' : 'translateY(0)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.6, fontFamily: 'monospace' }}>
                      {p.num}
                    </span>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: hoveredPillar === idx ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.25s ease',
                      }}
                    >
                      {p.icon}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                    {p.title}
                  </h3>

                  <p style={{ fontSize: '0.92rem', color: 'var(--accent-cyan)', fontWeight: 600, lineHeight: 1.4, marginBottom: '14px' }}>
                    {p.tagline}
                  </p>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ paddingTop: '20px', marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span>Pillar {p.num}</span>
                  <ArrowRight size={13} style={{ transform: hoveredPillar === idx ? 'translateX(3px)' : 'none', transition: 'transform 0.2s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================
            5. THE TYGN ECOSYSTEM (Connected Node Graph)
        ========================================================== */}
        <section style={{ marginBottom: '130px' }}>
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 48px auto' }}>
            <span
              style={{
                color: 'var(--accent-indigo)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              UNIFIED ARCHITECTURE
            </span>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              The TYGN Ecosystem
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              Everything you need to move forward. Six core functional nodes connected around a single, student-driven hub.
            </p>
          </div>

          {/* Central Connected Hub Display with Radar Waves */}
          <div
            style={{
              borderRadius: '28px',
              padding: '48px 32px',
              background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 0 60px rgba(6, 182, 212, 0.1)',
            }}
          >
            {/* Center TYGN Node with Radar Ping Waves */}
            <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
              {/* Radiating radar rings */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '260px',
                  height: '64px',
                  borderRadius: '999px',
                  border: '1px solid rgba(6, 182, 212, 0.45)',
                  animation: 'tygnRadarWave 3s cubic-bezier(0, 0, 0.2, 1) infinite',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '290px',
                  height: '76px',
                  borderRadius: '999px',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  animation: 'tygnRadarWave 3s 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(99, 102, 241, 0.22) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.55)',
                  boxShadow: '0 0 35px rgba(6, 182, 212, 0.35)',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Cpu size={22} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.04em' }}>TYGN CENTRAL NODE</span>
              </div>
            </div>

            {/* 6 Connected Orbit Nodes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {ecosystemNodes.map((node) => {
                const isActive = activeEcosystemNode === node.id;
                return (
                  <Link
                    key={node.id}
                    href={node.href}
                    onMouseEnter={() => {
                      setActiveEcosystemNode(node.id);
                      soundEffects.playClick();
                    }}
                    onMouseLeave={() => setActiveEcosystemNode(null)}
                    style={{
                      textDecoration: 'none',
                      padding: '24px',
                      borderRadius: '18px',
                      background: isActive ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)',
                      border: isActive ? `1px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.07)',
                      boxShadow: isActive ? `0 10px 30px ${node.color}33` : 'none',
                      transform: isActive ? 'translateY(-4px)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: `${node.color}1a`,
                            border: `1px solid ${node.color}4d`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: node.color,
                            transform: isActive ? 'scale(1.1)' : 'none',
                            transition: 'transform 0.25s ease',
                          }}
                        >
                          {node.icon}
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: node.color, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: node.color,
                              boxShadow: `0 0 6px ${node.color}`,
                            }}
                          />
                          NODE ACTIVE
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px', color: '#fff' }}>
                        {node.label}
                      </h3>

                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {node.desc}
                      </p>
                    </div>

                    <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: node.color, fontWeight: 700 }}>
                      <span>Launch Node</span>
                      <ArrowRight size={13} style={{ transform: isActive ? 'translateX(4px)' : 'none', transition: 'transform 0.2s ease' }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================
            6. OUR MISSION (Large Full-Width Statement)
        ========================================================== */}
        <section
          style={{
            marginBottom: '130px',
            padding: '80px 40px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, rgba(8, 12, 26, 0.9) 0%, rgba(13, 19, 40, 0.8) 50%, rgba(4, 6, 14, 0.95) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Dynamic Ambient Aurora */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)',
              filter: 'blur(70px)',
              pointerEvents: 'none',
              animation: 'tygnAuroraFlow 10s ease-in-out infinite',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                color: 'var(--accent-rose)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '20px',
              }}
            >
              03 / OUR MISSION
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '28px',
                textTransform: 'uppercase',
                maxWidth: '900px',
                margin: '0 auto 28px auto',
              }}
            >
              MAKE TECHNOLOGY<br />
              <span className="tygn-text-gradient-animated">MORE ACCESSIBLE.</span><br />
              MAKE STUDENTS<br />
              <span style={{ color: 'var(--accent-indigo)' }}>MORE CAPABLE.</span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '740px',
                margin: '0 auto',
                fontWeight: 500,
              }}
            >
              Our mission is to create an ecosystem where curiosity becomes knowledge, knowledge becomes skill, and skill becomes real-world impact.
            </p>
          </div>
        </section>

        {/* ==========================================================
            7. STATS (Minimal Premium Strip)
        ========================================================== */}
        <section style={{ marginBottom: '130px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              padding: '40px 24px',
              borderRadius: '24px',
              background: 'rgba(10, 14, 26, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
            }}
          >
            {[
              { val: '2023', label: 'FOUNDED', sub: 'Student-Driven Roots' },
              { val: '1', label: 'COMMUNITY', sub: 'Unified Platform' },
              { val: '∞', label: 'IDEAS', sub: 'Boundless Innovation' },
              { val: '24/7', label: 'LEARN • BUILD • GROW', sub: 'Always Active Network' },
            ].map((st, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRight: idx < 3 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div
                  style={{
                    fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {st.val}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {st.label}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {st.sub}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================
            8. FINAL CTA (Strong Animated Glow & Clean Buttons)
        ========================================================== */}
        <section
          style={{
            textAlign: 'center',
            padding: '75px 32px',
            borderRadius: '28px',
            background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.18) 0%, rgba(8, 12, 24, 0.92) 70%)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 0 55px rgba(6, 182, 212, 0.22)',
            position: 'relative',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            YOUR JOURNEY<br />
            <span className="tygn-text-gradient-animated">STARTS HERE.</span>
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
            }}
          >
            Whether you&apos;re learning your first technology, building your next project, preparing for an opportunity, or looking for people to build with, there&apos;s a place for you at TYGN.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Link
              href="/"
              onClick={() => soundEffects.playClick()}
              className="btn btn-primary tygn-cta-button-glow"
              style={{
                padding: '14px 34px',
                fontSize: '0.96rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
              }}
            >
              EXPLORE TYGN
            </Link>

            <Link
              href="/community"
              onClick={() => soundEffects.playClick()}
              className="btn btn-secondary"
              style={{
                padding: '14px 34px',
                fontSize: '0.96rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              JOIN THE COMMUNITY
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
