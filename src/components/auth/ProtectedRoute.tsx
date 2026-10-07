'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
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
  const { currentUser, isAuthenticated, isAdmin, can, isLoading, logout } = useAuth();
  const hasAdminAccess = isAdmin || can('admin.access_dashboard');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !currentUser) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      if (requireAdmin && !hasAdminAccess) {
        router.replace('/dashboard?unauthorized=admin');
      }
    }
  }, [isLoading, isAuthenticated, currentUser, pathname, requireAdmin, hasAdminAccess, router]);

  const isSuspended =
    Boolean(currentUser?.isSuspended) ||
    (typeof window !== 'undefined' && localStorage.getItem('tygn_is_suspended') === 'true');

  if (isSuspended) {
    return (
      <div className="fixed inset-0 z-[9999999] min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="mono-card max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto text-inherit">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <span className="mono-badge text-xs py-0.5 px-3">
              COMMUNITY SAFETY ENFORCEMENT
            </span>
            <h1 className="font-display font-black text-2xl text-inherit">
              Account Suspended
            </h1>
            <p className="text-xs text-[#737373] leading-relaxed">
              Your account has been suspended by a platform administrator.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={async () => {
                if (typeof window !== 'undefined') localStorage.removeItem('tygn_is_suspended');
                await logout();
                router.replace('/');
              }}
              className="btn btn-secondary text-xs py-2 px-5 font-semibold inline-flex items-center gap-2"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="font-display font-black text-3xl tracking-tight mb-2">TYGN</div>
        <div className="text-xs font-mono text-[#737373] tracking-widest uppercase animate-pulse">
          Loading your experience...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto text-inherit">
          <Lock size={20} />
        </div>
        <div className="space-y-1">
          <div className="font-display font-bold text-xl text-inherit">
            Authentication Required
          </div>
          <div className="text-xs font-mono text-[#737373]">
            Redirecting to TYGN Sign In...
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && !hasAdminAccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="font-display font-black text-6xl text-inherit">403</div>
        <div className="font-display font-bold text-xl text-inherit">Access Denied</div>
        <p className="text-xs text-[#737373] max-w-sm leading-relaxed">
          This section is strictly restricted to TYGN platform administrators.
        </p>
        <Link href="/dashboard" className="btn btn-primary text-xs py-2 px-6 font-bold mt-2">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
