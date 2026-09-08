'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.username) {
      router.replace(`/profile/${encodeURIComponent(currentUser.username)}`);
    } else {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Redirecting to profile...
    </div>
  );
}
