'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';

const HEALTH_GOALS = [
  { id: 'lose-weight', label: 'Lose Weight', icon: '⬇️' },
  { id: 'build-muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'eat-healthier', label: 'Eat Healthier', icon: '🥗' },
];

const DIETARY_PREFS = [
  { id: 'none', label: 'No Restriction', icon: '🍽️' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'halal', label: 'Halal', icon: '✨' },
  { id: 'keto', label: 'Keto', icon: '🥓' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<string>('none');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoalClick = (id: string) => {
    setSelectedGoals((prev) => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!email) newErrors.email = 'Email is required';
      if (!name) newErrors.name = 'Name is required';
    } else if (step === 2) {
      if (selectedGoals.length === 0) newErrors.goals = 'Select at least one goal';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Complete onboarding
      login(email, name, selectedGoals, selectedDiet);
      router.push('/feed');
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const progressPercent = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-brand-light pb-8">
      {/* Header */}
      <div className="pt-8 px-6 text-center mb-8">
        <div className="text-5xl mb-2">🥗</div>
        <h1 className="text-3xl font-bold text-neutral-text">Kiss My Cache</h1>
        <p className="text-neutral-muted text-sm mt-1">Strava for Nutrition</p>
      </div>

      {step === 1 && (
        <div className="text-center mb-4">
          <p className="text-neutral-muted text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-primary font-semibold">Log in</Link>
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="px-6 mb-8">
        <div className="h-2 bg-neutral-border rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-neutral-muted mt-2">Step {step} of 3</p>
      </div>

      {/* Step 1: Email & Name */}
      {step === 1 && (
        <div className="px-6 space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Health Goals */}
      {step === 2 && (
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-neutral-text mb-4">What are your goals?</h2>
          <div className="space-y-3">
            {HEALTH_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalClick(goal.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                  selectedGoals.includes(goal.id)
                    ? 'border-brand-primary bg-brand-light'
                    : 'border-neutral-border bg-white hover:border-neutral-muted'
                }`}
              >
                <span className="text-2xl">{goal.icon}</span>
                <span className="font-medium text-neutral-text">{goal.label}</span>
                {selectedGoals.includes(goal.id) && (
                  <span className="ml-auto text-brand-primary">✓</span>
                )}
              </button>
            ))}
          </div>
          {errors.goals && <p className="text-red-500 text-xs mt-3">{errors.goals}</p>}
        </div>
      )}

      {/* Step 3: Dietary Preference */}
      {step === 3 && (
        <div className="px-6 max-w-md mx-auto">
          <
          h2 className="text-lg font-bold text-neutral-text mb-4">Dietary preference?</h2>
          <div className="grid grid-cols-2 gap-3">
            {DIETARY_PREFS.map((pref) => (
              <button
                key={pref.id}
                onClick={() => setSelectedDiet(pref.id)}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedDiet === pref.id
                    ? 'border-brand-primary bg-brand-light'
                    : 'border-neutral-border bg-white hover:border-neutral-muted'
                }`}
              >
                <span className="text-2xl">{pref.icon}</span>
                <span className="text-sm font-medium text-neutral-text text-center">{pref.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-neutral-border flex gap-3 max-w-2xl mx-auto w-full md:rounded-t-2xl">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
        >
          Back
        </button>
        <button onClick={handleNext} className="btn-primary flex-1">
          {step === 3 ? 'Start' : 'Next'}
        </button>
      </div>
    </div>
  );
}
