'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  X, 
  Menu, 
  Sliders, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Shield, 
  LogOut, 
  UserCheck, 
  LayoutDashboard,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { SoundToggle } from '@/components/common/SoundToggle';
import { GoogleIcon } from '@/components/auth/GoogleAuthModal';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isAdmin, openGoogleModal, signInWithGoogle, logout } = useAuth();
  const { isDark, toggleTheme, setIsCustomizerOpen } = useThemeCustomizer();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Growth Hub', href: '/growth' },
    { label: 'Games Arena', href: '/games' },
    { label: 'Opportunities', href: '/opportunities' },
  ];

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
            borderColor: isDark ? (scrolled ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)') : (scrolled ? 'rgba(0, 0, 0, 0.14)' : 'rgba(0, 0, 0, 0.06)'),
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
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => soundEffects.playClick()}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all no-underline ${
                    isActive
                      ? isDark
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-black text-white font-bold shadow-sm'
                      : isDark
                      ? 'text-[#d4d4d4] hover:text-white hover:bg-white/5'
                      : 'text-[#404040] hover:text-black hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Trigger */}
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

            {/* Auth CTA or User Profile */}
            {!isAuthenticated || !currentUser ? (
              <button
                onClick={() => signInWithGoogle()}
                className="btn btn-primary text-xs py-1.5 px-3.5 sm:px-4 rounded-full font-bold flex items-center gap-2"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                  <GoogleIcon size={10} />
                </div>
                <span>Join</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full p-0.5 border"
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

                {/* Dropdown Menu */}
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
                        href="/notes"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                      >
                        <BookOpen size={14} /> Notes Drive
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 text-inherit no-underline"
                        >
                          <Shield size={14} /> Admin Portal
                        </Link>
                      )}

                      <div className="border-t border-white/10 dark:border-white/10 light:border-black/10 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold text-[#737373] hover:text-white transition-colors"
                        >
                          <LogOut size={13} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-full border"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                color: 'inherit',
              }}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 flex flex-col justify-between p-8 pt-28 animate-fadeIn"
          style={{
            background: isDark ? '#000000' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
          }}
        >
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-[#737373]">
              Navigation
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-2xl sm:text-3xl font-black text-inherit no-underline hover:opacity-70 transition-opacity flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-[#737373]">0{idx + 1}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-8 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCustomizerOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#737373] hover:text-white"
            >
              <Sliders size={14} /> Customize TYGN
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signInWithGoogle();
                }}
                className="btn btn-primary text-xs py-2 px-5"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs font-bold text-[#737373]"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
