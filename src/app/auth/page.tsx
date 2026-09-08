'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth, isGlobalAdminEmail } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import tygn_logo from '@/assets/tygn-logo.png';
import GlobeCanvas from '@/components/visuals/GlobeCanvas';

// Next.js router adapter for useNavigate
const useNavigate = () => {
  const router = useRouter();
  return (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

const Auth = () => {
  const { signInWithGoogle, loading, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const isSwitching = searchParams.get('switch') === 'true';
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !isSwitching) {
      if (isGlobalAdminEmail(user.email) || user.role === 'ADMIN') navigate('/admin', { replace: true });
      else navigate(redirectTarget || '/', { replace: true });
    }
  }, [user, navigate, redirectTarget, isSwitching]);

  const handleGoogle = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: 'Google sign-in failed', description: (error as any).message ?? 'Try again.', variant: 'destructive' });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleSignOutAndReauth = () => {
    logout();
    handleGoogle();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-300" />
      </div>
    );
  }

  const logoSrc = typeof tygn_logo === 'string' ? tygn_logo : (tygn_logo as any)?.src || '/assets/tygn-logo.png';

  return (
    <div className="premium-shell relative flex min-h-screen items-center justify-center overflow-hidden p-4 text-slate-100">
      {/* Ambient field */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(243 80% 60% / 0.28), transparent 70%)' }}
          animate={{ x: [0, 70, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(196 92% 55% / 0.20), transparent 70%)' }}
          animate={{ x: [0, -50, 0], y: [0, -70, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="cyber-grid-bg absolute inset-0 opacity-30"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
          }}
        />
      </div>

      {/* Rotating globe backdrop */}
      <GlobeCanvas className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.28]" />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="panel p-8 text-center">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-sky-400/25 to-indigo-500/25 blur-lg" />
            <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-black/60 p-2">
              <img src={logoSrc} alt="TYGN logo" className="h-full w-full object-contain" />
            </div>
          </div>

          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-sky-300/80">TYGN Network Access</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-gradient-premium">
            Enter the Network
          </h1>
          <p className="mx-auto mt-3 mb-8 max-w-xs text-sm leading-relaxed text-slate-300/70">
            Sign in with Google to join the B.Tech student network.
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="group relative h-12 w-full overflow-hidden rounded-xl border border-white/15 bg-white/[0.04] font-semibold text-white transition hover:bg-white/[0.08] disabled:opacity-60 cursor-pointer"
          >
            <span className="relative flex h-full items-center justify-center gap-3">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </span>
          </button>

          <div className="mt-8 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider">
            <Tag icon={ShieldCheck} label="Encrypted" />
            <Tag icon={Zap} label="Real-time" />
            <Tag icon={Sparkles} label="Student-first" />
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-slate-400/50">
            Google sign-in only · No passwords stored
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Tag = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex flex-col items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] py-2">
    <Icon className="h-3 w-3 text-cyan-300" />
    <span className="text-white/60">{label}</span>
  </div>
);

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-300" />
        </div>
      }
    >
      <Auth />
    </Suspense>
  );
}
