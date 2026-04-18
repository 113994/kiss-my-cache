'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useMeals } from '@/lib/hooks';
import { MealCard } from '@/components/MealCard';
import { BottomNav } from '@/components/BottomNav';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: userLoading, logout } = useAuth();
  const { meals, likeMeal, addReaction } = useMeals();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  if (!isClient || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-muted">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  // Filter meals from current user
  const userMeals = meals.filter(m => m.userId === user.id);
  const mealStreak = userMeals.length > 0 ? Math.floor(Math.random() * 7) + 1 : 0;
  const totalLikes = userMeals.reduce((sum, meal) => sum + meal.likes, 0);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      router.push('/');
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-neutral-border z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-text">Profile</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 mt-6">
        <div className="card-base p-6 text-center">
          <div className="text-6xl mb-4">{user.avatar}</div>
          <h2 className="text-2xl font-bold text-neutral-text">{user.name}</h2>
          <p className="text-neutral-muted text-sm mt-1">{user.email}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-border">
            <div>
              <p className="text-2xl font-bold text-brand-primary">{userMeals.length}</p>
              <p className="text-xs text-neutral-muted">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-primary">{totalLikes}</p>
              <p className="text-xs text-neutral-muted">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-primary">{mealStreak}</p>
              <p className="text-xs text-neutral-muted">Day Streak 🔥</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Goals */}
      <div className="px-6 mt-6">
        <h3 className="font-semibold text-neutral-text mb-3">Health Goals</h3>
        <div className="flex flex-wrap gap-2">
          {user.healthGoals.map((goal) => (
            <span
              key={goal}
              className="px-3 py-1 bg-brand-light text-brand-dark text-xs font-medium rounded-full"
            >
              {goal === 'lose-weight' && '⬇️ Lose Weight'}
              {goal === 'build-muscle' && '💪 Build Muscle'}
              {goal === 'eat-healthier' && '🥗 Eat Healthier'}
            </span>
          ))}
        </div>
      </div>

      {/* Dietary Preference */}
      <div className="px-6 mt-4">
        <h3 className="font-semibold text-neutral-text mb-3">Dietary Preference</h3>
        <p className="text-neutral-muted capitalize">{user.dietaryPreference}</p>
      </div>

      {/* Recent Meals */}
      <div className="px-6 mt-8">
        <h3 className="font-semibold text-neutral-text mb-4">Your Recent Meals</h3>
        {userMeals.length === 0 ? (
          <p className="text-center text-neutral-muted py-6">No meals posted yet. Go share one!</p>
        ) : (
          <div className="space-y-4">
            {userMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onLike={likeMeal}
                onReact={addReaction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Settings & Logout */}
      <div className="px-6 mt-8 pb-4">
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors"
        >
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
