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
  ArrowRight,
  Sparkles,
  Zap,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { FeaturesDirectoryModal } from '@/components/features/FeaturesDirectoryModal';

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
              ? 'py-2.5 shadow-2xl backdrop-blur-2xl'
              : 'py-3.5 shadow-lg backdrop-blur-xl'
          }`}
          style={{
            background: isDark ? 'rgba(5, 5, 5, 0.85)' : 'rgba(255, 255, 255, 0.90)',
            borderColor: isDark 
              ? (scrolled ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)') 
              : (scrolled ? 'rgba(0, 0, 0, 0.14)' : 'rgba(0, 0, 0, 0.06)'),
            color: isDark ? '#ffffff' : '#000000',
          }}
        >
          {/* 1. Brand Logo & Identifier */}
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
              <span className="font-display font-black text-xs sm:text-sm tracking-tight leading-none flex items-center gap-1.5">
                <span>TechYOGeek Nirvana</span>
                <span className="text-[0.68rem] font-mono font-bold text-[#a3a3a3]">(TYGN)</span>
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#737373] leading-none mt-1">
                STUDENT TECHNOLOGY ECOSYSTEM
              </span>
            </div>
          </Link>

          {/* 2, 3, 4. Desktop Navigation Links: Home, Dashboard, Features ONLY */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {/* Home */}
            <Link
              href="/"
              onClick={() => soundEffects.playClick()}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all no-underline ${
                pathname === '/'
                  ? isDark
                    ? 'bg-white text-black font-extrabold shadow-[0_0_18px_rgba(255,255,255,0.4)] ring-2 ring-white scale-[1.02]'
                    : 'bg-black text-white font-extrabold shadow-[0_0_18px_rgba(0,0,0,0.3)] ring-2 ring-black scale-[1.02]'
                  : isDark
                  ? 'text-[#d4d4d4] hover:text-white hover:bg-white/10 font-semibold'
                  : 'text-[#404040] hover:text-black hover:bg-black/10 font-semibold'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {pathname === '/' && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-black' : 'bg-white'}`} />
                )}
                <span>Home</span>
              </span>
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              onClick={() => soundEffects.playClick()}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all no-underline ${
                pathname === '/dashboard' || pathname.startsWith('/dashboard/')
                  ? isDark
                    ? 'bg-white text-black font-extrabold shadow-[0_0_18px_rgba(255,255,255,0.4)] ring-2 ring-white scale-[1.02]'
                    : 'bg-black text-white font-extrabold shadow-[0_0_18px_rgba(0,0,0,0.3)] ring-2 ring-black scale-[1.02]'
                  : isDark
                  ? 'text-[#d4d4d4] hover:text-white hover:bg-white/10 font-semibold'
                  : 'text-[#404040] hover:text-black hover:bg-black/10 font-semibold'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {(pathname === '/dashboard' || pathname.startsWith('/dashboard/')) && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-black' : 'bg-white'}`} />
                )}
                <span>Dashboard</span>
              </span>
            </Link>

            {/* Features (Dedicated Platform Directory Launcher) */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsFeaturesModalOpen(true);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                pathname === '/features' || isFeaturesModalOpen
                  ? isDark
                    ? 'bg-white text-black font-extrabold shadow-[0_0_18px_rgba(255,255,255,0.4)] ring-2 ring-white scale-[1.02]'
                    : 'bg-black text-white font-extrabold shadow-[0_0_18px_rgba(0,0,0,0.3)] ring-2 ring-black scale-[1.02]'
                  : isDark
                  ? 'text-[#d4d4d4] hover:text-white hover:bg-white/10 font-semibold'
                  : 'text-[#404040] hover:text-black hover:bg-black/10 font-semibold'
              }`}
              title="Open Platform Directory / All Features"
            >
              {(pathname === '/features' || isFeaturesModalOpen) && (
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-black' : 'bg-white'}`} />
              )}
              <span>Features</span>
            </button>
          </nav>

          {/* 5, 6. Right Controls: Search & Profile / Account Icon */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger (Always accessible Cmd+K) */}
            <button
              onClick={handleOpenSearch}
              title="Search commands (Cmd+K)"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs transition-colors hover:border-white/30"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                color: isDark ? '#d4d4d4' : '#525252',
              }}
            >
              <Search size={13} />
              <span className="hidden sm:inline text-xs font-medium">Search</span>
              <span className="hidden md:inline text-[0.65rem] font-mono px-1 rounded bg-white/10 dark:bg-white/10 light:bg-black/10 opacity-70">
                ⌘K
              </span>
            </button>

            {/* Profile / Account Icon */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setUserDropdownOpen(!userDropdownOpen);
                  }}
                  className="flex items-center gap-1.5 rounded-full p-0.5 border transition-transform hover:scale-105"
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  }}
                  title="Account & Profile"
                >
                  <img
                    src={
                      currentUser.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=000&color=fff&bold=true`
                    }
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
                      className="absolute right-0 top-10 z-50 w-72 p-3 rounded-2xl border shadow-2xl animate-fadeIn space-y-1.5"
                      style={{
                        background: isDark ? '#0a0a0a' : '#ffffff',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                        color: isDark ? '#ffffff' : '#000000',
                      }}
                    >
                      {/* User Profile Card */}
                      <div className="p-2.5 border-b border-white/10 dark:border-white/10 light:border-black/10 mb-1">
                        <div className="text-xs font-bold truncate">{currentUser.name}</div>
                        <div className="text-[0.68rem] text-[#737373] truncate">{currentUser.email}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                            {isAdmin ? 'Lead Admin' : 'Student'}
                          </span>
                          <span className="mono-badge text-[0.62rem] py-0.5 px-2 flex items-center gap-1">
                            <Zap size={10} />
                            <span>{wallet?.totalCredits ?? currentUser.xp ?? 10} XP</span>
                          </span>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="space-y-0.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                        >
                          <LayoutDashboard size={14} className="text-[#a3a3a3]" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline text-inherit"
                        >
                          <User size={14} className="text-[#a3a3a3]" />
                          <span>Profile</span>
                        </Link>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIsFeaturesModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 text-inherit text-left"
                        >
                          <span className="flex items-center gap-2.5">
                            <Sparkles size={14} className="text-[#a3a3a3]" />
                            <span>All Features</span>
                          </span>
                          <span className="text-[0.65rem] font-mono text-[#737373]">Directory</span>
                        </button>
                      </div>

                      {/* Preferences & System Controls */}
                      <div className="pt-2 border-t border-white/10 dark:border-white/10 light:border-black/10 space-y-1">
                        <div className="px-2 text-[0.62rem] font-mono uppercase tracking-wider text-[#737373]">
                          Preferences
                        </div>

                        {/* Theme Toggle in Dropdown */}
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            toggleTheme();
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 text-inherit"
                        >
                          <span className="flex items-center gap-2.5">
                            {isDark ? <Sun size={14} className="text-[#a3a3a3]" /> : <Moon size={14} className="text-[#a3a3a3]" />}
                            <span>Appearance</span>
                          </span>
                          <span className="text-[0.68rem] font-mono font-bold uppercase">
                            {isDark ? 'Black' : 'White'}
                          </span>
                        </button>

                        {/* Customizer Drawer Trigger */}
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setUserDropdownOpen(false);
                            setIsCustomizerOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 text-inherit"
                        >
                          <span className="flex items-center gap-2.5">
                            <Sliders size={14} className="text-[#a3a3a3]" />
                            <span>Display Customizer</span>
                          </span>
                          <ArrowRight size={11} className="text-[#737373]" />
                        </button>
                      </div>

                      {/* Admin Console (if Admin) */}
                      {isAdmin && (
                        <div className="pt-1 border-t border-white/10 dark:border-white/10 light:border-black/10">
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold text-inherit hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 no-underline"
                          >
                            <Shield size={14} className="text-white" />
                            <span>Admin Console</span>
                          </Link>
                        </div>
                      )}

                      {/* Sign Out */}
                      <div className="pt-1 border-t border-white/10 dark:border-white/10 light:border-black/10">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => soundEffects.playClick()}
                className="btn btn-primary text-xs py-1.5 px-3.5 sm:px-4 rounded-full font-bold flex items-center gap-2 no-underline"
                title="Sign In / Account"
              >
                <User size={13} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-full border text-inherit"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-2xl p-6 pt-24 flex flex-col justify-between animate-fadeIn text-white">
          <div className="space-y-4">
            <div className="editorial-eyebrow pb-2 border-b border-white/10">
              NAVIGATION
            </div>

            <div className="flex flex-col space-y-2">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-display font-bold text-lg py-3 px-4 rounded-xl flex items-center justify-between no-underline transition-all ${
                  pathname === '/'
                    ? 'bg-white text-black shadow-lg ring-2 ring-white'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Home</span>
                {pathname === '/' && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black text-white">
                    ACTIVE
                  </span>
                )}
              </Link>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-display font-bold text-lg py-3 px-4 rounded-xl flex items-center justify-between no-underline transition-all ${
                  pathname === '/dashboard' || pathname.startsWith('/dashboard/')
                    ? 'bg-white text-black shadow-lg ring-2 ring-white'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Dashboard</span>
                {(pathname === '/dashboard' || pathname.startsWith('/dashboard/')) && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black text-white">
                    ACTIVE
                  </span>
                )}
              </Link>

              {/* Features */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsFeaturesModalOpen(true);
                }}
                className={`w-full font-display font-bold text-lg py-3 px-4 rounded-xl flex items-center justify-between transition-all ${
                  pathname === '/features' || isFeaturesModalOpen
                    ? 'bg-white text-black shadow-lg ring-2 ring-white'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Features</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/20">
                  DIRECTORY
                </span>
              </button>

              {/* Search */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenSearch();
                }}
                className="w-full font-display font-bold text-lg py-3 px-4 rounded-xl flex items-center justify-between text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  <Search size={18} />
                  <span>Search</span>
                </span>
                <span className="text-[10px] font-mono opacity-60">⌘K</span>
              </button>
            </div>
          </div>

          {/* Mobile Drawer Bottom */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            {!isAuthenticated || !currentUser ? (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 no-underline"
                >
                  <User size={16} />
                  <span>Sign In / Get Started</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 flex items-center justify-between text-sm font-semibold no-underline text-inherit"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{currentUser.name}</span>
                  </div>
                  <span className="mono-badge text-[0.62rem] py-0.5 px-2">
                    {currentUser.xp || 0} XP
                  </span>
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="btn btn-secondary w-full py-2.5 rounded-xl font-bold text-red-400 flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Central Features Directory Modal (All 7 Categories, 25+ Features) */}
      <FeaturesDirectoryModal
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
      />
    </>
  );
}
