'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ShieldAlert, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

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

  // Route gatekeeping: Only protect authenticated routes
  useEffect(() => {
    if (isLoading) return;

    const privateRoutes = [
      '/dashboard',
      '/profile',
      '/resume-lab',
      '/opportunities/submit',
      '/events/submit',
      '/live/create',
      '/admin',
    ];

    const isPrivate = privateRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

    if (isPrivate && (!isAuthenticated || !currentUser)) {
      router.replace(`/?auth=required&redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Admin routes require admin privileges
    if (pathname.startsWith('/admin') && (!isAdmin || !isAuthenticated)) {
      router.replace('/dashboard?unauthorized=admin');
      return;
    }
  }, [isLoading, isAuthenticated, currentUser, pathname, isAdmin, router]);

  // STRICT BAN / SUSPENSION ENFORCEMENT: Block suspended users completely from the site
  const isSuspended =
    Boolean(currentUser?.isSuspended) ||
    (typeof window !== 'undefined' && localStorage.getItem('tygn_is_suspended') === 'true');

  if (isSuspended) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#05070e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#f8fafc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'fixed',
          inset: 0,
          zIndex: 9999999,
        }}
      >
        <div
          className="glass-card glow-border"
          style={{
            maxWidth: '520px',
            width: '100%',
            padding: '40px 32px',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, rgba(28, 10, 18, 0.98) 0%, rgba(12, 12, 22, 0.98) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.45)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 45px rgba(244, 63, 94, 0.25)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '2px solid var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: 'var(--accent-rose)',
              boxShadow: '0 0 35px rgba(244, 63, 94, 0.4)',
            }}
          >
            <ShieldAlert size={34} />
          </div>

          <span
            className="badge badge-rose"
            style={{
              marginBottom: '14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '5px 12px',
              letterSpacing: '0.05em',
            }}
          >
            COMMUNITY SAFETY ENFORCEMENT
          </span>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '8px 0 12px 0', color: '#ffffff' }}>
            Account Suspended
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Your account (<strong style={{ color: '#f8fafc' }}>{currentUser?.email || 'Platform User'}</strong>) has been suspended by a platform administrator. While suspended, all platform access to discussions, AI tools, events, opportunities, and your profile is restricted.
          </p>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.86rem',
              color: '#cbd5e1',
              marginBottom: '28px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div><strong>Member:</strong> {currentUser?.name || 'User'} (@{currentUser?.username || 'account'})</div>
            <div><strong>Status:</strong> <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>SUSPENDED (BANNED)</span></div>
            <div>
              <strong>Appeals:</strong> Contact Lead Administrator at{' '}
              <a href="mailto:techyogeeknirvana@gmail.com" style={{ color: '#38bdf8', textDecoration: 'underline' }}>
                techyogeeknirvana@gmail.com
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={async () => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('tygn_is_suspended');
                }
                await logout();
                router.replace('/');
              }}
              className="btn btn-secondary"
              style={{ padding: '12px 22px', fontSize: '0.88rem', borderRadius: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={15} /> Sign Out
            </button>
            <a
              href="mailto:techyogeeknirvana@gmail.com?subject=Account%20Suspension%20Appeal"
              className="btn btn-danger"
              style={{ padding: '12px 22px', fontSize: '0.88rem', borderRadius: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Mail size={15} /> Appeal Suspension
            </a>
          </div>
        </div>
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
