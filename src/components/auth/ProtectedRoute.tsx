'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldAlert, Lock, ArrowRight, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isAdmin, isLoading, openGoogleModal, logout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !currentUser) {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoading, isAuthenticated, currentUser, pathname, router]);

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
            }}
          >
            COMMUNITY SAFETY ENFORCEMENT
          </span>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '8px 0 12px 0', color: '#ffffff' }}>
            Account Suspended
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Your account ({currentUser?.email}) has been suspended by a platform administrator. Platform access is restricted.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={async () => {
                if (typeof window !== 'undefined') localStorage.removeItem('tygn_is_suspended');
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

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid rgba(6, 182, 212, 0.2)',
            borderTopColor: 'var(--accent-cyan)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Verifying security authorization...
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div
        className="container-custom"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <div
          className="panel"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '36px 28px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--accent-cyan)',
            }}
          >
            <Lock size={26} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Authentication Required
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
            You need to be signed in to access this section of Techyogeek Nirvana.
          </p>

          <button
            onClick={openGoogleModal}
            className="btn-premium"
            style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}
          >
            Sign In with Email or Google <ArrowRight size={16} style={{ marginLeft: '6px' }} />
          </button>
        </div>
      </div>
    );
  }

  // Require Admin, but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div
        className="container-custom"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <div
          className="panel"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '36px 28px',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(14, 14, 27, 0.95) 100%)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#f87171',
            }}
          >
            <ShieldAlert size={28} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: '#fca5a5' }}>
            Admin Access Required
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
            This area requires platform administrator privileges. Please sign in with{' '}
            <strong style={{ color: '#fff' }}>techyogeeknirvana@gmail.com</strong>.
          </p>

          <button
            onClick={() => router.push('/')}
            className="btn btn-outline"
            style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
