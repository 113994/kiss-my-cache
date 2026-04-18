'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/feed');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light">
      <div className="text-center">
        <div className="text-6xl mb-4">🥗</div>
        <p className="text-neutral-text text-lg">Kiss My Cache</p>
      </div>
    </div>
  );
}
