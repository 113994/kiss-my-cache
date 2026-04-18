'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light">
        <div className="text-center">
          <div className="text-6xl mb-4">🥗</div>
          <p className="text-neutral-text text-lg">Kiss My Cache</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🥗</div>
        <h1 className="text-3xl font-bold text-neutral-text">Kiss My Cache</h1>
        <p className="text-neutral-muted text-sm mt-2">Strava for Nutrition</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Link href="/login" className="btn-primary w-full block text-center">
          Log In
        </Link>
        <Link href="/onboarding" className="btn-secondary w-full block text-center">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
