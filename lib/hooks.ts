'use client';

import { useEffect, useState } from 'react';
import { User, Meal } from './types';
import { dataStore } from './dataStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = dataStore.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email: string, name: string, healthGoals: string[], dietaryPreference: string) => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      healthGoals,
      dietaryPreference,
      avatar: ['👨‍💻', '👩‍🍳', '🏃', '🧑‍⚕️', '👨‍🔬'][Math.floor(Math.random() * 5)],
      createdAt: new Date(),
    };
    dataStore.setCurrentUser(user);
    setUser(user);
    return user;
  };

  const logout = () => {
    dataStore.clearCurrentUser();
    setUser(null);
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock meals on first load
    dataStore.initializeMockMeals();
    const currentMeals = dataStore.getMeals();
    setMeals(currentMeals);
    setLoading(false);
  }, []);

  const addMeal = (meal: Meal) => {
    dataStore.addMeal(meal);
    const updatedMeals = dataStore.getMeals();
    setMeals(updatedMeals);
  };

  const likeMeal = (mealId: string) => {
    dataStore.likeMeal(mealId);
    const updatedMeals = dataStore.getMeals();
    setMeals(updatedMeals);
  };

  const addReaction = (mealId: string, emoji: string) => {
    dataStore.addReaction(mealId, emoji);
    const updatedMeals = dataStore.getMeals();
    setMeals(updatedMeals);
  };

  return { meals, loading, addMeal, likeMeal, addReaction };
}

export function useFriends() {
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const currentFriends = dataStore.getFriends();
    setFriends(currentFriends);
  }, []);

  return { friends };
}
