'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizzesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/live');
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Redirecting to Nirvana Live Quizzes...
    </div>
  );
}
