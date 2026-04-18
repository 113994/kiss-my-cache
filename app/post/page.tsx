'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useMeals } from '@/lib/hooks';
import { BottomNav } from '@/components/BottomNav';
import { useEffect, useState } from 'react';
import { Meal } from '@/lib/types';

export default function PostPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const { addMeal } = useMeals();
  const [isClient, setIsClient] = useState(false);

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [image, setImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealName.trim()) {
      alert('Please enter a meal name');
      return;
    }

    setIsSubmitting(true);

    try {
      const newMeal: Meal = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        username: user.name,
        userAvatar: user.avatar,
        mealName,
        image,
        calories: calories ? parseInt(calories) : undefined,
        protein: protein ? parseInt(protein) : undefined,
        likes: 0,
        reactions: {},
        timestamp: new Date(),
        liked: false,
      };

      addMeal(newMeal);
      setSuccess(true);

      // Reset form
      setMealName('');
      setCalories('');
      setProtein('');
      setImage('');

      setTimeout(() => {
        setSuccess(false);
        router.push('/feed');
      }, 1500);
    } catch (error) {
      console.error('Error posting meal:', error);
      alert('Failed to post meal. Try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-neutral-border z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-text">Share a Meal 📸</h1>
          <p className="text-sm text-neutral-muted mt-1">What did you eat today?</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        {/* Meal Name */}
        <div>
          <label className="block text-sm font-semibold text-neutral-text mb-2">
            Meal Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Grilled Salmon with Quinoa"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="input-base"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-neutral-text mb-2">
            Photo
          </label>
          {image ? (
            <div className="relative">
              <img src={image} alt="Meal" className="w-full h-40 object-cover rounded-lg mb-2" />
              <button
                type="button"
                onClick={() => setImage('')}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove photo
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-neutral-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm text-neutral-muted">Tap to upload a photo</p>
              </label>
            </div>
          )}
        </div>

        {/* Macros */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Calories
            </label>
            <input
              type="number"
              placeholder="e.g., 500"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Protein (g)
            </label>
            <input
              type="number"
              placeholder="e.g., 35"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="input-base"
            />
          </div>
        </div>

        {/* Quick suggestions */}
        <div className="bg-brand-light border border-brand-primary rounded-lg p-4">
          <p className="text-xs font-semibold text-brand-dark mb-2">💡 Quick Tips</p>
          <ul className="text-xs text-neutral-text space-y-1 list-disc list-inside">
            <li>Add a photo to get more engagement</li>
            <li>Include macros for better tracking</li>
            <li>Post consistently to build your streak!</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !mealName.trim() || success}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
            success
              ? 'bg-green-600'
              : isSubmitting
              ? 'bg-neutral-muted cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {success ? '✓ Posted!' : isSubmitting ? 'Posting...' : 'Share Meal'}
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
