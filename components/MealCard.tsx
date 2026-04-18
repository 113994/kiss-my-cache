'use client';

import { Meal } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';
import { useState } from 'react';

interface MealCardProps {
  meal: Meal;
  onLike: (mealId: string) => void;
  onReact: (mealId: string, emoji: string) => void;
}

const REACTION_EMOJIS = ['🔥', '💪', '🥗'];

export function MealCard({ meal, onLike, onReact }: MealCardProps) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className="card-base p-4 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{meal.userAvatar}</div>
        <div className="flex-1">
          <p className="font-semibold text-neutral-text">{meal.username}</p>
          <p className="text-xs text-neutral-muted">{formatDistanceToNow(meal.timestamp)} ago</p>
        </div>
      </div>

      {/* Meal Content */}
      <div className="mb-3">
        <h3 className="font-bold text-lg text-neutral-text mb-2">{meal.mealName}</h3>

        {/* Image placeholder */}
        {meal.image ? (
          <img src={meal.image} alt={meal.mealName} className="w-full h-48 object-cover rounded-lg mb-3" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-brand-light to-brand-primary rounded-lg mb-3 flex items-center justify-center text-4xl">
            {['🍗', '🥗', '🍱', '🥘', '🍝', '🥙'][Math.floor(Math.random() * 6)]}
          </div>
        )}

        {/* Macros */}
        <div className="flex gap-4 text-sm">
          {meal.calories && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-neutral-text">{meal.calories}</span>
              <span className="text-neutral-muted">cal</span>
            </div>
          )}
          {meal.protein && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-neutral-text">{meal.protein}g</span>
              <span className="text-neutral-muted">protein</span>
            </div>
          )}
        </div>
      </div>

      {/* Reactions and Engagement */}
      <div className="border-t border-neutral-border pt-3">
        {/* Reaction counts */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {Object.entries(meal.reactions).map(([emoji, count]) => (
            count > 0 && (
              <button
                key={emoji}
                onClick={() => onReact(meal.id, emoji)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-bg hover:bg-neutral-border transition-colors text-sm"
              >
                <span>{emoji}</span>
                <span className="text-xs text-neutral-muted">{count}</span>
              </button>
            )
          ))}
          {meal.likes > 0 && (
            <button className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-bg text-sm">
              <span>❤️</span>
              <span className="text-xs text-neutral-muted">{meal.likes}</span>
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onLike(meal.id)}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
              meal.liked
                ? 'bg-red-100 text-red-600'
                : 'bg-neutral-bg text-neutral-text hover:bg-neutral-border'
            }`}
          >
            {meal.liked ? '❤️ Liked' : '🤍 Like'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="py-2 px-3 rounded-lg bg-neutral-bg text-neutral-text hover:bg-neutral-border transition-colors text-sm font-medium"
            >
              💬 React
            </button>

            {showReactions && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 flex gap-2 border border-neutral-border">
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact(meal.id, emoji);
                      setShowReactions(false);
                    }}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
