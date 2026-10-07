'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ShieldAlert, LogOut, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

// Explicit whitelist of public routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/auth',
  '/about',
  '/about-public',
  '/robots.txt',
  '/sitemap.xml',
];

function RouteGuardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, currentUser, isLoading, isAdmin, logout } = useAuth();

  // Capture incoming referral codes from URL (?ref=CODE)
  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref && typeof window !== 'undefined') {
      const cleanRef = ref.trim().toUpperCase();
      sessionStorage.setItem('tygn_pending_referral', cleanRef);
      localStorage.setItem('tygn_pending_referral', cleanRef);
      document.cookie = `tygn_pending_referral=${cleanRef}; path=/; max-age=2592000; SameSite=Lax`;
    }
  }, [searchParams]);

  // Handle shorthand route redirects
  useEffect(() => {
    if (pathname === '/drive') {
      router.replace('/notes');
      return;
    }
    if (pathname === '/jobs') {
      router.replace('/opportunities');
      return;
    }
    if (pathname === '/channels') {
      router.replace('/community');
      return;
    }
    if (pathname === '/collab') {
      router.replace('/collab-finder');
      return;
    }
    if (pathname === '/competitions') {
      router.replace('/events');
      return;
    }
    if (pathname === '/resume') {
      router.replace('/resume-lab');
      return;
    }
    if (pathname === '/interview') {
      router.replace('/ai-interview');
      return;
    }
    if (pathname === '/code-explainer' || pathname === '/ai') {
      router.replace('/ai-code');
      return;
    }
    if (pathname === '/settings') {
      router.replace('/profile');
      return;
    }
  }, [pathname, router]);

  // Route gatekeeping: Protect all routes not explicitly on the public whitelist
  const isPublicRoute = PUBLIC_ROUTES.some(
    (pub) => pathname === pub || (pub !== '/' && pathname.startsWith(pub + '/'))
  );

  useEffect(() => {
    if (isLoading) return;

    // If on a protected route without authentication, redirect immediately to /login
    if (!isPublicRoute && (!isAuthenticated || !currentUser)) {
      const qs = searchParams?.toString() ? `?${searchParams.toString()}` : '';
      const fullTarget = `${pathname}${qs}`;
      router.replace(`/login?redirect=${encodeURIComponent(fullTarget)}`);
      return;
    }

    // If an authenticated user visits /login or /auth, redirect to dashboard or target
    if ((pathname === '/login' || pathname === '/auth') && isAuthenticated && currentUser) {
      const redirectTarget = searchParams?.get('redirect') || '/dashboard';
      router.replace(redirectTarget);
      return;
    }

    // Admin routes require admin privileges
    if (pathname.startsWith('/admin') && (!isAdmin || !isAuthenticated)) {
      router.replace('/dashboard?unauthorized=admin');
      return;
    }
  }, [isLoading, isAuthenticated, currentUser, pathname, isPublicRoute, isAdmin, router, searchParams]);

  // STRICT BAN / SUSPENSION ENFORCEMENT: Block suspended users completely
  const isSuspended =
    Boolean(currentUser?.isSuspended) ||
    (typeof window !== 'undefined' && localStorage.getItem('tygn_is_suspended') === 'true');

  if (isSuspended) {
    return (
      <div className="fixed inset-0 z-[9999999] min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="mono-card max-w-lg w-full p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto text-inherit">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <span className="mono-badge text-xs py-0.5 px-3">
              COMMUNITY SAFETY ENFORCEMENT
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-inherit">
              Account Suspended
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Your account (<strong className="text-inherit">{currentUser?.email || 'Platform User'}</strong>) has been suspended by a platform administrator.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-left text-xs space-y-1.5 font-mono">
            <div><strong>Member:</strong> {currentUser?.name || 'User'} (@{currentUser?.username || 'account'})</div>
            <div><strong>Status:</strong> SUSPENDED</div>
            <div>
              <strong>Appeals:</strong> techyogeeknirvana@gmail.com
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={async () => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('tygn_is_suspended');
                }
                await logout();
                router.replace('/');
              }}
              className="btn btn-secondary text-xs py-2 px-5 font-semibold inline-flex items-center gap-2"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
            <a
              href="mailto:techyogeeknirvana@gmail.com?subject=Account%20Suspension%20Appeal"
              className="btn btn-primary text-xs py-2 px-5 font-bold inline-flex items-center gap-2"
            >
              <Mail size={14} />
              <span>Appeal</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 1. Loading state on protected route: Zero flash of protected content
  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-2">TYGN</div>
        <div className="text-xs font-mono text-[#737373] tracking-widest uppercase animate-pulse">
          Loading your experience...
        </div>
      </div>
    );
  }

  // 2. Unauthenticated on protected route: Intercept and render security shield while redirecting
  if (!isPublicRoute && (!isAuthenticated || !currentUser)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto text-inherit">
          <Lock size={20} />
        </div>
        <div className="space-y-1">
          <div className="font-display font-black text-xl sm:text-2xl text-inherit">
            Authentication Required
          </div>
          <div className="text-xs font-mono text-[#737373]">
            Redirecting to TYGN Sign In...
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Route Forbidden Screen
  if (pathname.startsWith('/admin') && (!isAdmin || !isAuthenticated)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center space-y-4">
        <div className="font-display font-black text-6xl text-inherit">403</div>
        <div className="font-display font-bold text-xl text-inherit">Access Denied</div>
        <p className="text-xs text-[#737373] max-w-sm leading-relaxed">
          This section is strictly restricted to TYGN platform administrators. Your account does not have administrative privileges.
        </p>
        <Link href="/dashboard" className="btn btn-primary text-xs py-2 px-6 font-bold mt-2">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <RouteGuardContent>{children}</RouteGuardContent>
    </Suspense>
  );
}
