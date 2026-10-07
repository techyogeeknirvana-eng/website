'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    router.replace(`/login${qs}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="font-display font-black text-3xl tracking-tight mb-2">TYGN</div>
      <div className="text-xs font-mono text-[#737373] animate-pulse">Redirecting to Sign In...</div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthRedirect />
    </Suspense>
  );
}
