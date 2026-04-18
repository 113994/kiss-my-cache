'use client';
import { useEffect, useState, useCallback } from 'react';
import { User, Meal, DailyPlanItem, GoalProgress, CommunityActivity, Group } from './types';
import { dataStore } from './dataStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(dataStore.getCurrentUser());
    setLoading(false);
  }, []);

  const login = (userData: Omit<User, 'id' | 'avatar' | 'createdAt'>) => {
    const avatars = ['👨‍💻', '👩‍🍳', '🏃', '🧑‍⚕️', '👨‍🔬', '🧘', '🚴'];
    const user: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      createdAt: new Date(),
    };
    dataStore.setCurrentUser(user);
    // generate plan on first login
    dataStore.generateDailyPlan(user);
    setUser(user);
    return user;
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    dataStore.setCurrentUser(updated);
    setUser(updated);
  };

  const logout = () => {
    dataStore.clearCurrentUser();
    setUser(null);
  };

  return { user, loading, login, logout, updateUser, isAuthenticated: !!user };
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataStore.initializeMockMeals();
    setMeals(dataStore.getMeals());
    setLoading(false);
  }, []);

  const addMeal = (meal: Meal) => { dataStore.addMeal(meal); setMeals(dataStore.getMeals()); };
  const likeMeal = (mealId: string) => { dataStore.likeMeal(mealId); setMeals(dataStore.getMeals()); };
  const addReaction = (mealId: string, emoji: string) => { dataStore.addReaction(mealId, emoji); setMeals(dataStore.getMeals()); };

  return { meals, loading, addMeal, likeMeal, addReaction };
}

export function useFriends() {
  const [friends, setFriends] = useState<User[]>([]);
  useEffect(() => { setFriends(dataStore.getFriends()); }, []);
  return { friends };
}

export function useDailyPlan(user: User | null) {
  const [plan, setPlan] = useState<DailyPlanItem[]>([]);
  const [goals, setGoals] = useState<GoalProgress[]>([]);

  useEffect(() => {
    if (!user) return;
    let p = dataStore.getDailyPlan();
    if (p.length === 0) p = dataStore.generateDailyPlan(user);
    setPlan(p);
    setGoals(dataStore.getGoalProgress(user));
  }, [user]);

  const toggleItem = useCallback((id: string) => {
    dataStore.togglePlanItem(id);
    setPlan(dataStore.getDailyPlan());
  }, []);

  const completedCount = plan.filter(i => i.completed).length;

  return { plan, goals, toggleItem, completedCount, totalCount: plan.length };
}

export function useCommunity() {
  const [feed, setFeed] = useState<CommunityActivity[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    setFeed(dataStore.getCommunityFeed());
    setGroups(dataStore.getGroups());
  }, []);

  const likePost = (id: string) => { dataStore.likeCommunityPost(id); setFeed(dataStore.getCommunityFeed()); };
  const toggleGroup = (id: string) => { dataStore.toggleJoinGroup(id); setGroups(dataStore.getGroups()); };

  return { feed, groups, likePost, toggleGroup };
}