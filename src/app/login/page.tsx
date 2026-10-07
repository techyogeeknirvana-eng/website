'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock, 
  CheckCircle2, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  GraduationCap,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '@/lib/auth/AuthContext';
import { soundEffects } from '@/lib/audio/soundEffects';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { GoogleIcon } from '@/components/auth/GoogleAuthModal';
import { useThemeCustomizer } from '@/contexts/ThemeCustomizerContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect') || '/dashboard';
  const { isDark } = useThemeCustomizer();

  const { 
    signInWithGoogle, 
    loginWithGoogle, 
    loginWithPassword, 
    signUpWithPassword 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'google' | 'credentials' | 'signup'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSignIn = async () => {
    soundEffects.playClick();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        // If Google popup fails or is blocked, provide graceful fallback
        console.warn('Google sign-in popup notice:', res.error);
        setErrorMessage('Google popup was cancelled or blocked. You can also sign in with email below.');
      } else {
        router.push(redirectTarget);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google sign-in error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setIsLoading(true);
    setErrorMessage('');

    if (authMode === 'signup') {
      const res = await signUpWithPassword(email, password, fullName || undefined);
      if (res.success) {
        router.push(redirectTarget);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } else {
      const res = await loginWithPassword(email, password);
      if (res.success) {
        router.push(redirectTarget);
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    }
    setIsLoading(false);
  };

  // Instant one-click demo login for fast testing
  const handleQuickDemoLogin = async (role: 'student' | 'admin') => {
    soundEffects.playClick();
    setIsLoading(true);
    setErrorMessage('');
    if (role === 'admin') {
      await loginWithGoogle(ADMIN_EMAIL, 'TYGN Lead Admin', undefined, 'ADMIN');
    } else {
      await loginWithGoogle('student@tygn.dev', 'Alex Sharma', undefined, 'USER');
    }
    setIsLoading(false);
    router.push(redirectTarget);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-white relative overflow-hidden">
      {/* Background Subtle Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none subtle-grid opacity-25"
        style={{
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
        }}
      />
      <div 
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
        }}
      />

      {/* LEFT: Large Editorial Branding & Ecosystem Showcase */}
      <div className="lg:w-1/2 p-8 sm:p-14 lg:p-20 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-white/10">
        <div>
          <Link
            href="/"
            onClick={() => soundEffects.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#a3a3a3] hover:text-white transition-colors mb-12 no-underline"
          >
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </Link>

          <div className="space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[0.68rem] font-mono uppercase tracking-widest text-[#d4d4d4]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>AUTHENTICATION GATE</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-none text-white">
                TYGN NIRVANA
              </h1>
              <p className="font-display font-bold text-2xl sm:text-3xl text-[#a3a3a3] tracking-tight">
                One ecosystem. Everything you need to grow.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
              Sign in to access your notes, opportunities, events, games, Growth Hub and personalized TYGN experience.
            </p>

            {/* Feature Access Highlights */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>B.Tech Academic Drive</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>Personal Growth Hub</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>Games Arena &amp; Quizzes</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>Curated Opportunities</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs font-mono text-[#525252]">
          © {new Date().getFullYear()} TECHYOGEEK NIRVANA. VERIFIED STUDENT PLATFORM.
        </div>
      </div>

      {/* RIGHT: High-Contrast Monochrome Authentication Card */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-20 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md mono-card p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              Welcome to TYGN
            </h2>
            <p className="text-xs sm:text-sm text-[#737373]">
              Sign in to continue to your dashboard
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg border border-white/20 bg-white/5 text-xs text-white text-center">
              {errorMessage}
            </div>
          )}

          {/* Primary Action: Continue with Google */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-display font-bold text-sm flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                <GoogleIcon size={18} />
              </div>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 text-[0.68rem] uppercase font-mono text-[#525252]">
              <div className="h-px bg-white/10 flex-1" />
              <span>or student credentials</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* Credentials / Signup Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[0.7rem] font-mono text-[#737373] uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Sharma"
                    className="w-full p-3 rounded-xl border border-white/15 bg-white/[0.03] text-xs text-white outline-none focus:border-white transition-colors"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[0.7rem] font-mono text-[#737373] uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full p-3 rounded-xl border border-white/15 bg-white/[0.03] text-xs text-white outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[0.7rem] font-mono text-[#737373] uppercase">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border border-white/15 bg-white/[0.03] text-xs text-white outline-none focus:border-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-secondary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>{authMode === 'signup' ? 'Create Account' : 'Sign In with Password'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-[#737373] pt-1">
              {authMode === 'signup' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('credentials');
                    setErrorMessage('');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Already have an account? Sign In
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Need an account? Sign Up
                </button>
              )}
            </div>

            {/* Quick Demo Access Buttons for Testing */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="text-[0.65rem] font-mono uppercase tracking-wider text-[#737373] text-center">
                Fast Environment Demo Access
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  disabled={isLoading}
                  className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-[0.72rem] font-mono text-[#a3a3a3] hover:text-white transition-colors"
                >
                  ⚡ Demo Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  disabled={isLoading}
                  className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-[0.72rem] font-mono text-[#a3a3a3] hover:text-white transition-colors"
                >
                  🛡️ Lead Admin
                </button>
              </div>
            </div>
          </div>

          <p className="text-[0.68rem] text-[#525252] text-center leading-relaxed">
            By continuing, you agree to the TYGN terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicRoute>
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </PublicRoute>
  );
}
