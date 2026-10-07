'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  Menu, 
  Sliders, 
  Sun, 
  Moon, 
  Shield, 
  LogOut, 
  LayoutDashboard,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  User,
  Settings,
  HelpCircle,
  FolderGit2,
  Gamepad2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { SoundToggle } from '@/components/common/SoundToggle';
import { GoogleIcon } from '@/components/auth/GoogleAuthModal';
import { PublicFeaturesModal } from '@/components/layout/PublicFeaturesModal';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isAdmin, wallet, logout } = useAuth();
  const { isDark, toggleTheme, setIsCustomizerOpen } = useThemeCustomizer();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const handleOpenSearch = () => {
    soundEffects.playClick();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const handleSignOut = async () => {
    soundEffects.playClick();
    setUserDropdownOpen(false);
    await logout();
    router.replace('/');
  };

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Full platform links for public and authenticated experiences
  const publicNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Growth Hub', href: '/growth' },
    { label: 'Games Arena', href: '/games' },
    { label: 'Opportunities', href: '/opportunities' },
  ];

  const authenticatedNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'About', href: '/about' },
    { label: 'Notes', href: '/notes' },
    { label: 'Events', href: '/events' },
    { label: 'Growth Hub', href: '/growth' },
    { label: 'Games Arena', href: '/games' },
    { label: 'Opportunities', href: '/opportunities' },
  ];

  const navLinks = (isAuthenticated && currentUser) ? authenticatedNavLinks : publicNavLinks;

  return (
    <>
      {/* Floating Capsule Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center px-4 ${
          scrolled ? 'pt-2 sm:pt-3' : 'pt-4 sm:pt-6'
        }`}
      >
        <div
          className={`w-full max-w-6xl transition-all duration-300 rounded-full border flex items-center justify-between px-4 sm:px-6 ${
            scrolled
              ? 'py-2.5 bg-black/85 dark:bg-black/85 light:bg-white/90 backdrop-blur-2xl border-white/15 dark:border-white/15 light:border-black/10 shadow-2xl'
              : 'py-3.5 bg-black/60 dark:bg-black/60 light:bg-white/80 backdrop-blur-xl border-white/10 dark:border-white/10 light:border-black/5 shadow-lg'
          }`}
          style={{
            background: isDark ? 'rgba(5, 5, 5, 0.82)' : 'rgba(255, 255, 255, 0.88)',
            borderColor: isDark 
              ? (scrolled ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)') 
              : (scrolled ? 'rgba(0, 0, 0, 0.14)' : 'rgba(0, 0, 0, 0.06)'),
            color: isDark ? '#ffffff' : '#000000',
          }}
        >
          {/* Brand Logo & Identifier */}
          <Link
            href="/"
            onClick={() => soundEffects.playClick()}
            className="flex items-center gap-3 text-inherit no-underline shrink-0"
          >
            <div
              className="w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center shrink-0 transition-transform hover:scale-105"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                background: isDark ? '#000000' : '#ffffff',
              }}
            >
              <img
                src="/assets/tygn-logo.png"
                alt="TYGN"
                className="w-full h-full object-contain p-0.5 invert dark:invert-0"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-sm sm:text-base tracking-tight leading-none">
                TYGN
              </span>
              <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#737373] leading-none mt-0.5">
                NIRVANA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => soundEffects.playClick()}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all no-underline ${
                    isActive
                      ? isDark
                        ? 'bg-white text-black font-extrabold shadow-[0_0_18px_rgba(255,255,255,0.4)] ring-2 ring-white scale-[1.03]'
                        : 'bg-black text-white font-extrabold shadow-[0_0_18px_rgba(0,0,0,0.3)] ring-2 ring-black scale-[1.03]'
                      : isDark
                      ? 'text-[#d4d4d4] hover:text-white hover:bg-white/10 font-semibold'
                      : 'text-[#404040] hover:text-black hover:bg-black/10 font-semibold'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isActive && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDark ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    )}
                    <span>{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Authenticated Controls: Search & Credits (Never shown before login) */}
            {isAuthenticated && currentUser && (
              <>
                {/* Search Trigger */}
                <button
                  onClick={handleOpenSearch}
                  title="Search commands (Cmd+K)"
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs text-[#a3a3a3] hover:text-white transition-colors"
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <Search size={13} />
                  <span className="text-[0.7rem] font-mono opacity-60">⌘K</span>
                </button>

                {/* Credits Badge (Isolated to authenticated user) */}
                <div 
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold"
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                  }}
                  title="Your Available Credits"
                >
                  <Zap size={12} className="text-inherit" />
                  <span>{wallet?.totalCredits ?? currentUser.xp ?? 10}</span>
                </div>
              </>
            )}

            {/* Customizer Drawer Trigger */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsCustomizerOpen(true);
              }}
              title="Customize Experience"
              className="p-2 rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                color: 'inherit',
              }}
            >
              <Sliders size={14} />
            </button>

            {/* Audio Toggle */}
            <div className="hidden sm:block">
              <SoundToggle />
            </div>

            {/* Theme Toggle (Black / White) */}
            <button
              onClick={() => {
                soundEffects.playClick();
                toggleTheme();
              }}
              title={isDark ? 'Switch to White Theme' : 'Switch to Black Theme'}
              className="p-2 rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                color: 'inherit',
              }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* AUTH ACTIONS: Public (Sign In / Get Started) vs Authenticated (Profile Dropdown) */}
            {!isAuthenticated || !currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={() => soundEffects.playClick()}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold hover:opacity-80 transition-opacity no-underline text-inherit"
                >
                  Sign In
                </Link>

                <Link
                  href="/login"
                  onClick={() => soundEffects.playClick()}
                  className="btn btn-primary text-xs py-1.5 px-4 rounded-full font-bold flex items-center gap-2 no-underline"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                    <GoogleIcon size={10} />
                  </div>
                  <span>Get Started</span>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setUserDropdownOpen(!userDropdownOpen);
                  }}
                  className="flex items-center gap-2 rounded-full p-0.5 border transition-transform hover:scale-105"
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <img
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=000&color=fff&bold=true`}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </button>

                {/* Authenticated Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div
                      className="absolute right-0 top-10 z-50 w-64 p-3 rounded-2xl border shadow-2xl animate-fadeIn space-y-1"
                      style={{
                        background: isDark ? '#0a0a0a' : '#ffffff',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    >
                      <div className="p-2 border-b border-white/10 dark:border-white/10 light:border-black/10 mb-1">
                        <div className="text-xs font-bold truncate">{currentUser.name}</div>
                        <div className="text-[0.68rem] text-[#737373] truncate">{currentUser.email}</div>
                        <div className="mt-1.5 flex gap-1.5">
                          <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                            {isAdmin ? 'Lead Admin' : 'Student'}
                          </span>
                          <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                            {currentUser.xp || 0} XP
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                      >
                        <User size={14} /> Profile
                      </Link>

                      <Link
                        href="/notes"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                      >
                        <FolderGit2 size={14} /> Notes &amp; Drive
                      </Link>

                      <Link
                        href="/growth"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                      >
                        <Sparkles size={14} /> Growth Hub
                      </Link>

                      <Link
                        href="/games"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                      >
                        <Gamepad2 size={14} /> Games Arena
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-inherit hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline"
                        >
                          <Shield size={14} /> Admin Console
                        </Link>
                      )}

                      <div className="pt-1 border-t border-white/10 dark:border-white/10 light:border-black/10">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut size={14} /> Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-full border text-inherit"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              }}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-2xl p-6 pt-28 flex flex-col justify-between animate-fadeIn text-white">
          <div className="space-y-4">
            <div className="editorial-eyebrow pb-2 border-b border-white/10">
              {isAuthenticated ? 'PLATFORM NAVIGATION' : 'PUBLIC EXPERIENCE'}
            </div>

            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-display font-bold text-lg py-3 px-4 rounded-xl flex items-center justify-between no-underline transition-all ${
                      isActive
                        ? 'bg-white text-black shadow-lg ring-2 ring-white'
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black text-white">
                        ACTIVE
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <GoogleIcon size={16} />
                  <span>Get Started with Google</span>
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary w-full py-3 rounded-xl font-bold text-center block"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="btn btn-secondary w-full py-3 rounded-xl font-bold text-red-400 flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Public Features Modal */}
      <PublicFeaturesModal
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
      />
    </>
  );
}
