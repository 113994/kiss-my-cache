'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useMeals } from '@/lib/hooks';
import { MealCard } from '@/components/MealCard';
import { BottomNav } from '@/components/BottomNav';
import { useEffect, useState } from 'react';

export default function FeedPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const { meals, loading: mealsLoading, likeMeal, addReaction } = useMeals();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  if (!isClient || userLoading || mealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-muted">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-neutral-border z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-text">
            Welcome, {user.name}! 👋
          </h1>
          <p className="text-sm text-neutral-muted mt-1">See what your friends ate</p>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="px-6 mt-4">
        <div className="card-base p-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white">
          <p className="text-sm font-medium mb-2">Today's Progress</p>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white" style={{ width: '67%' }}></div>
          </div>
          <p className="text-sm">You've logged <strong>2 of 3</strong> meals today</p>
        </div>
      </div>

      {/* Feed */}
      <div className="px-6 mt-6 space-y-4">
        {meals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🥗</p>
            <p className="text-neutral-muted">No meals yet. Start posting!</p>
          </div>
        ) : (
          meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onLike={likeMeal}
              onReact={addReaction}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
