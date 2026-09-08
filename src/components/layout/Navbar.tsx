'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  Shield, 
  X, 
  Radio, 
  Briefcase, 
  Calendar, 
  Users, 
  Compass, 
  FileText, 
  UserCheck, 
  ChevronDown, 
  LayoutDashboard,
  Layers,
  Code,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Sliders,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { SoundToggle } from '@/components/common/SoundToggle';
import { GoogleIcon } from '@/components/auth/GoogleAuthModal';
import { soundEffects } from '@/lib/audio/soundEffects';
import { CreditChip } from '@/components/credits/CreditChip';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isAdmin, isGoogleLoggedIn, openGoogleModal, openGoogleChooser, signInWithGoogle, logout } = useAuth();
  const [allFunctionsOpen, setAllFunctionsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setAllFunctionsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAllFunctionsOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenSearch = () => {
    soundEffects.playClick();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const featureDirectory = [
    {
      category: 'Community & Connections',
      color: '#06b6d4',
      items: [
        { label: 'About TYGN (Our Story)', desc: 'Founded 2023, student mission, pillars & founders', href: '/about', icon: <Compass size={16} />, badge: 'Story' },
        { label: 'Community Hub & Channels', desc: 'Discord-like channels, role tags & real-time chat', href: '/community', icon: <MessageSquare size={16} /> },
        { label: 'Collab Finder', desc: 'Find hackathon teammates & project co-builders', href: '/collab-finder', icon: <Users size={16} /> },
        { label: 'Community Moments', desc: 'Stories, code snippets & project wins feed', href: '/moments', icon: <Sparkles size={16} /> },
      ]
    },
    {
      category: 'Academic & Knowledge Hub',
      color: '#3b82f6',
      items: [
        { label: 'B.Tech Notes Drive', desc: 'Direct Google Drive academic repository & curriculum notes', href: '/notes', icon: <BookOpen size={16} />, badge: 'Official Drive' },
        { label: 'Tech Radar 2025', desc: 'Industry tech stack radar for engineering students', href: '/tech-radar', icon: <Compass size={16} /> },
        { label: 'Engineering Roadmaps', desc: 'Role-based skill trees (Fullstack, DevOps, AI)', href: '/roadmaps', icon: <Code size={16} /> },
        { label: 'Open Showcase Projects', desc: 'Student open-source portfolio repository', href: '/projects', icon: <Layers size={16} /> },
      ]
    },
    {
      category: 'Interactive Live Hub',
      color: '#ec4899',
      items: [
        { label: 'Nirvana Live Room', desc: 'Mentimeter-style live quizzes, leaderboards & polls', href: '/live', icon: <Radio size={16} />, badge: 'Live' },
        { label: 'Join Session by PIN', desc: 'Enter 6-digit PIN code to join live presentation', href: '/live/join', icon: <Sliders size={16} /> },
        { label: 'Tech Competitions & Events', desc: 'Workshops, hackathons & community tech summits', href: '/events', icon: <Calendar size={16} /> },
        { label: 'Internships & Job Board', desc: 'Curated developer jobs, stipends & fast-track hiring', href: '/opportunities', icon: <Briefcase size={16} /> },
      ]
    },
    {
      category: 'AI Developer Suite',
      color: '#8b5cf6',
      items: [
        { label: 'AI Resume Lab & OCR', desc: 'Upload PDF/Image for ATS scoring and tech feedback', href: '/resume-lab', icon: <FileText size={16} />, badge: 'PDF/Image' },
        { label: 'AI Mock Interview Room', desc: 'Adaptive voice and code technical screening simulation', href: '/ai-interview', icon: <Code size={16} /> },
        { label: 'AI Code Explainer', desc: 'Deep-dive complexity analyzer and bug detector', href: '/ai-code', icon: <Sparkles size={16} /> },
      ]
    },
  ];

  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: allFunctionsOpen ? 10000 : 900,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        className="container-custom"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          gap: '16px',
        }}
      >
        {/* Left: Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="/"
            onClick={() => soundEffects.playClick()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                background: '#07090e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src="/assets/tygn-logo.png"
                alt="TYGN Official Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 800,
                    fontSize: '1.18rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>TYGN</span>
                  <span className="text-gradient" style={{ fontSize: '0.98rem' }}>NIRVANA</span>
                </div>
                <div
                  style={{
                    fontSize: '0.66rem',
                    color: 'var(--accent-amber)',
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  B.Tech Student Community
                </div>
              </div>
          </a>
        </div>

        {/* Center: Enhanced Formatted Search Bar */}
        <div
          onClick={handleOpenSearch}
          style={{
            flex: '1',
            maxWidth: '460px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-glass-card)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          className="navbar-search-bar"
        >
          <Search size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            Search notes, drive, jobs, quizzes, channels...
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '2px 7px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.06)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
            }}
          >
            ⌘K
          </div>
        </div>

        {/* Right Controls: Sound, Google Auth, and THREE LINES (All Features Menu) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sound Synthesizer */}
          <SoundToggle />

          {/* Google Sign-in / Authenticated User Profile */}
          {!isAuthenticated || !currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={openGoogleModal}
                className="btn btn-ghost"
                style={{
                  padding: '7px 12px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => signInWithGoogle()}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px',
                  }}
                >
                  <GoogleIcon size={12} />
                </div>
                <span>Get Started</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditChip />
              <div
                className={isAdmin ? 'badge badge-rose hide-on-mobile' : 'badge badge-cyan hide-on-mobile'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={openGoogleModal}
                title={isAdmin ? 'Lead Administrator Active' : 'Account Active'}
              >
                <CheckCircle2 size={13} style={{ color: isAdmin ? 'var(--accent-rose)' : 'var(--accent-cyan)' }} />
                <span>{isAdmin ? 'Admin' : currentUser.isEmailVerified ? 'Google Verified' : 'Registered'}</span>
              </div>

              {currentUser && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    <img
                      src={
                        currentUser.avatar && !currentUser.avatar.includes('unsplash.com')
                          ? currentUser.avatar
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0284c7&color=fff&bold=true`
                      }
                      alt={currentUser.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0284c7&color=fff&bold=true`;
                      }}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: isAdmin ? '2px solid var(--accent-rose)' : '2px solid var(--accent-cyan)',
                        objectFit: 'cover',
                      }}
                    />
                  </button>

                  {userMenuOpen && (
                    <>
                      {/* Click-outside dismiss backdrop */}
                      <div
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          position: 'fixed',
                          inset: 0,
                          zIndex: 9998,
                          backgroundColor: 'transparent',
                        }}
                      />
                      <div
                        className="animate-fadeIn"
                        style={{
                          position: 'absolute',
                          top: '46px',
                          right: 0,
                          zIndex: 9999,
                          width: '260px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          borderRadius: '16px',
                          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 25px rgba(99, 102, 241, 0.2)',
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                          background: '#090d19',
                          backgroundImage: 'linear-gradient(180deg, #0f1629 0%, #080c16 100%)',
                        }}
                      >
                      <div style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {currentUser.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {currentUser.email}
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                          <span className={isAdmin ? 'badge badge-rose' : 'badge badge-cyan'} style={{ fontSize: '0.68rem' }}>
                            {isAdmin ? '👑 Lead Admin' : '⚡ B.Tech Student'}
                          </span>
                          <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                            {currentUser.xp} XP
                          </span>
                        </div>
                      </div>

                      <a
                        href="/dashboard"
                        onClick={() => {
                          setUserMenuOpen(false);
                          soundEffects.playClick();
                        }}
                        className="btn-ghost"
                        style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '8px', textDecoration: 'none' }}
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </a>

                      <a
                        href={`/profile/${currentUser.username}`}
                        onClick={() => {
                          setUserMenuOpen(false);
                          soundEffects.playClick();
                        }}
                        className="btn-ghost"
                        style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '8px', textDecoration: 'none' }}
                      >
                        <UserCheck size={15} /> My Profile
                      </a>

                      <a
                        href="/notes"
                        onClick={() => {
                          setUserMenuOpen(false);
                          soundEffects.playClick();
                        }}
                        className="btn-ghost"
                        style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '8px', textDecoration: 'none' }}
                      >
                        <BookOpen size={15} style={{ color: 'var(--accent-cyan)' }} /> B.Tech Notes Drive
                      </a>

                      {isAdmin && (
                        <a
                          href="/admin"
                          onClick={() => {
                            setUserMenuOpen(false);
                            soundEffects.playClick();
                          }}
                          className="btn-ghost"
                          style={{
                            justifyContent: 'flex-start',
                            fontSize: '0.85rem',
                            padding: '8px',
                            textDecoration: 'none',
                            color: 'var(--accent-rose)',
                          }}
                        >
                          <Shield size={15} /> Admin Control Center
                        </a>
                      )}

                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '4px' }}>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signInWithGoogle();
                          }}
                          className="btn-secondary"
                          style={{ width: '100%', fontSize: '0.78rem', padding: '7px', marginBottom: '4px' }}
                        >
                          Switch Google Account
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="btn-ghost"
                          style={{ width: '100%', fontSize: '0.78rem', padding: '7px', color: 'var(--accent-rose)', justifyContent: 'center' }}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
                </div>
              )}
            </div>
          )}

          {/* THE THREE LINES BUTTON (ALL FEATURES ENCLOSED HERE) */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setAllFunctionsOpen(!allFunctionsOpen);
            }}
            title="Click to view all platform features"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: allFunctionsOpen ? 'var(--gradient-nirvana)' : 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--border-glow)',
              color: allFunctionsOpen ? '#ffffff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.84rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: allFunctionsOpen ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none',
            }}
          >
            {allFunctionsOpen ? (
              <X size={18} />
            ) : (
              /* The Three Clean Lines */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '18px',
                  height: '14px',
                }}
              >
                <span style={{ height: '2px', width: '100%', background: 'currentColor', borderRadius: '2px' }} />
                <span style={{ height: '2px', width: '100%', background: 'currentColor', borderRadius: '2px' }} />
                <span style={{ height: '2px', width: '100%', background: 'currentColor', borderRadius: '2px' }} />
              </div>
            )}
            <span style={{ letterSpacing: '0.5px' }}>{allFunctionsOpen ? 'Close' : 'Features'}</span>
          </button>
        </div>
      </div>

      {/* ALL FEATURES DRAWER (ONLY VISIBLE WHEN CLICKING ON THE THREE LINES BUTTON) */}
      {allFunctionsOpen && (
        <>
          {/* Dimmed full-page backdrop preventing background bleed-through */}
          <div
            onClick={() => {
              soundEffects.playClick();
              setAllFunctionsOpen(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              top: '70px',
              backgroundColor: 'rgba(2, 6, 23, 0.92)',
              backdropFilter: 'blur(16px)',
              zIndex: 9990,
              animation: 'fadeIn 0.2s ease-out',
            }}
          />

          <div
            className="animate-fadeIn"
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              maxHeight: 'calc(100vh - 70px)',
              overflowY: 'auto',
              borderTop: '1px solid rgba(99, 102, 241, 0.35)',
              borderBottom: '2px solid rgba(99, 102, 241, 0.45)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.98), 0 0 40px rgba(99, 102, 241, 0.25)',
              padding: '28px 20px 48px',
              zIndex: 9995,
              background: '#090d1a',
              backgroundImage: 'radial-gradient(ellipse at top, #0f172a 0%, #060913 100%)',
            }}
          >
            <div className="container-custom">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '22px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                      PLATFORM DIRECTORY
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      • Click any feature to launch
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                    All Features &amp; Capabilities
                  </h3>
                </div>
                <button
                  onClick={() => setAllFunctionsOpen(false)}
                  className="btn-ghost"
                  style={{ padding: '8px', color: 'var(--text-muted)' }}
                  title="Close features"
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {featureDirectory.map((cat, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#0f172a',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.55)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: cat.color,
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: cat.color,
                        }}
                      />
                      {cat.category}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {cat.items.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href={item.href}
                          onClick={() => {
                            setAllFunctionsOpen(false);
                            soundEffects.playClick();
                          }}
                          className="btn-ghost"
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            textAlign: 'left',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid transparent',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                            (e.currentTarget as HTMLElement).style.background = 'rgba(99, 102, 241, 0.12)';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.02)';
                          }}
                        >
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ marginTop: '2px', color: cat.color }}>{item.icon}</div>
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          {item.badge && (
                            <span
                              className="badge badge-amber"
                              style={{
                                fontSize: '0.64rem',
                                padding: '2px 6px',
                                flexShrink: 0,
                                marginLeft: '8px',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Quick Launch Bar - Only when genuinely authenticated as Admin */}
              {isAuthenticated && isAdmin && currentUser && (
                <div
                  style={{
                    marginTop: '20px',
                    padding: '14px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: '#1a0e1c',
                    border: '1px solid rgba(244, 63, 94, 0.45)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Shield size={18} style={{ color: 'var(--accent-rose)' }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
                      Admin Controls Active: {currentUser.email}
                    </span>
                  </div>
                  <a
                    href="/admin"
                    onClick={() => setAllFunctionsOpen(false)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    Launch Admin Control Center
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .navbar-search-bar {
            display: none !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
