'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    const result = loginWithEmail(email);
    if (result.success) {
      router.push('/feed');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🥗</div>
        <h1 className="text-2xl font-bold text-neutral-text">Welcome back</h1>
        <p className="text-neutral-muted text-sm mt-1">Log in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-neutral-text mb-2">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            className="input-base"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button type="submit" className="btn-primary w-full">Log In</button>
      </form>

      <p className="text-neutral-muted text-sm mt-6">
        {"Don't have an account? "}
        <Link href="/onboarding" className="text-brand-primary font-semibold">Sign up</Link>
      </p>

      <Link href="/" className="text-neutral-muted text-sm mt-4 block">
        ← Back
      </Link>
    </div>
  );
}
