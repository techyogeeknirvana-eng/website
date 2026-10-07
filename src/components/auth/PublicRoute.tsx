'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

function PublicRouteContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      const redirect = searchParams?.get('redirect') || '/dashboard';
      router.replace(redirect);
    }
  }, [isLoading, isAuthenticated, currentUser, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-2">TYGN</div>
        <div className="text-xs font-mono text-[#737373] tracking-widest uppercase animate-pulse">
          Loading your experience...
        </div>
      </div>
    );
  }

  if (isAuthenticated && currentUser) {
    return null;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PublicRouteContent>{children}</PublicRouteContent>
    </Suspense>
  );
}
