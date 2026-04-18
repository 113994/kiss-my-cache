
import { User, Meal, CommunityActivity, Group, DailyPlanItem, GoalProgress, PrivacyLevel } from './types';

const STORAGE_KEYS = {
  CURRENT_USER: 'hs-current-user',
  MEALS: 'kiss-meals',         // keep for compat
  FRIENDS: 'kiss-friends',     // keep for compat
  DAILY_PLAN: 'hs-daily-plan',
  COMMUNITY: 'hs-community',
  GROUPS: 'hs-groups',
};

function safe<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export class DataStore {
  private static instance: DataStore;
  private constructor() {}
  static getInstance(): DataStore {
    if (!DataStore.instance) DataStore.instance = new DataStore();
    return DataStore.instance;
  }

  // ---- User ----
  getCurrentUser(): User | null { return safe<User | null>(STORAGE_KEYS.CURRENT_USER, null); }
  setCurrentUser(user: User): void { save(STORAGE_KEYS.CURRENT_USER, user); }
  clearCurrentUser(): void { if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); }

  // ---- Meals (original) ----
  getMeals(): Meal[] { return safe<Meal[]>(STORAGE_KEYS.MEALS, []); }
  addMeal(meal: Meal): void {
    const meals = this.getMeals();
    meals.unshift(meal);
    save(STORAGE_KEYS.MEALS, meals);
  }
  likeMeal(mealId: string): void {
    const meals = this.getMeals();
    const meal = meals.find(m => m.id === mealId);
    if (meal) { meal.likes += 1; meal.liked = true; save(STORAGE_KEYS.MEALS, meals); }
  }
  addReaction(mealId: string, emoji: string): void {
    const meals = this.getMeals();
    const meal = meals.find(m => m.id === mealId);
    if (meal) { meal.reactions[emoji] = (meal.reactions[emoji] || 0) + 1; save(STORAGE_KEYS.MEALS, meals); }
  }

  initializeMockMeals(): void {
    if (this.getMeals().length > 0) return;
    const mockMeals: Meal[] = [
      { id: 'm1', userId: 'friend1', username: 'Alex Chen', userAvatar: '👨‍💻', mealName: 'Grilled Salmon with Quinoa', calories: 580, protein: 42, likes: 12, reactions: { '🔥': 3, '💪': 5, '🥗': 4 }, timestamp: new Date(Date.now() - 1000 * 60 * 30), liked: false },
      { id: 'm2', userId: 'friend2', username: 'Sarah Williams', userAvatar: '👩‍🍳', mealName: 'Buddha Bowl with Tahini Dressing', calories: 420, protein: 18, likes: 8, reactions: { '🥗': 8 }, timestamp: new Date(Date.now() - 1000 * 60 * 120), liked: false },
      { id: 'm3', userId: 'friend3', username: 'Jordan Davis', userAvatar: '🏃', mealName: 'Chicken Shawarma Wrap', calories: 520, protein: 38, likes: 15, reactions: { '🔥': 7, '💪': 6, '🥗': 2 }, timestamp: new Date(Date.now() - 1000 * 60 * 180), liked: false },
    ];
    save(STORAGE_KEYS.MEALS, mockMeals);
  }

  getFriends(): User[] { return safe<User[]>(STORAGE_KEYS.FRIENDS, this.initializeMockFriends()); }

  private initializeMockFriends(): User[] {
    const friends: User[] = [
      { id: 'friend1', email: 'alex@example.com', name: 'Alex Chen', healthGoals: ['strength', 'energy'], dietaryPreference: 'none', dietaryRestrictions: [], physicalLimitations: '', medications: '', scheduleDescription: '', privacyLevel: 'followers', avatar: '👨‍💻', createdAt: new Date() },
      { id: 'friend2', email: 'sarah@example.com', name: 'Sarah Williams', healthGoals: ['weight-loss', 'energy'], dietaryPreference: 'vegan', dietaryRestrictions: ['vegan'], physicalLimitations: '', medications: '', scheduleDescription: '', privacyLevel: 'everyone', avatar: '👩‍🍳', createdAt: new Date() },
      { id: 'friend3', email: 'jordan@example.com', name: 'Jordan Davis', healthGoals: ['sleep', 'mental-wellness'], dietaryPreference: 'halal', dietaryRestrictions: ['halal'], physicalLimitations: '', medications: '', scheduleDescription: '', privacyLevel: 'followers', avatar: '🏃', createdAt: new Date() },
    ];
    save(STORAGE_KEYS.FRIENDS, friends);
    return friends;
  }

  // ---- Daily Plan ----
  getDailyPlan(): DailyPlanItem[] { return safe<DailyPlanItem[]>(STORAGE_KEYS.DAILY_PLAN, []); }
  saveDailyPlan(plan: DailyPlanItem[]): void { save(STORAGE_KEYS.DAILY_PLAN, plan); }
  togglePlanItem(itemId: string): void {
    const plan = this.getDailyPlan();
    const item = plan.find(i => i.id === itemId);
    if (item) { item.completed = !item.completed; save(STORAGE_KEYS.DAILY_PLAN, plan); }
  }

  generateDailyPlan(user: User): DailyPlanItem[] {
    const goals = user.healthGoals;
    const hasMobility = user.physicalLimitations.toLowerCase().includes('mobility') || user.physicalLimitations.toLowerCase().includes('knee') || user.physicalLimitations.toLowerCase().includes('back');
    const onBetaBlockers = user.medications.toLowerCase().includes('beta') || user.medications.toLowerCase().includes('atenolol') || user.medications.toLowerCase().includes('metoprolol');

    const plan: DailyPlanItem[] = [
      { id: 'p1', time: '7:00 AM', type: 'hydration', title: 'Morning Hydration', description: 'Start with 2 glasses of water to kickstart metabolism.', completed: false },
      { id: 'p2', time: '7:30 AM', type: 'meal', title: 'Breakfast', description: goals.includes('weight-loss') ? 'High-protein meal: eggs + avocado toast, ~400 cal' : 'Balanced breakfast: oats with fruit and nuts, ~500 cal', duration: '20 min', completed: false },
    ];

    if (goals.includes('strength') || goals.includes('energy')) {
      plan.push({
        id: 'p3', time: '8:30 AM', type: 'workout',
        title: onBetaBlockers ? 'Light Strength Training' : goals.includes('strength') ? 'Strength Session' : 'Morning Walk',
        description: hasMobility
          ? 'Chair-based resistance exercises + seated stretches'
          : onBetaBlockers
          ? 'Moderate resistance training, keep heart rate low'
          : 'Full-body compound lifts: squats, push-ups, rows',
        duration: onBetaBlockers ? '30 min' : '45 min',
        completed: false,
      });
    }

    plan.push(
      { id: 'p4', time: '10:30 AM', type: 'hydration', title: 'Mid-Morning Water', description: 'Stay hydrated — aim for 500ml.', completed: false },
      { id: 'p5', time: '12:30 PM', type: 'meal', title: 'Lunch', description: goals.includes('weight-loss') ? 'Lean protein + veggies: grilled chicken salad, ~500 cal' : 'Energizing bowl: quinoa, roasted veggies, chickpeas, ~650 cal', duration: '30 min', completed: false },
    );

    if (goals.includes('flexibility') || hasMobility) {
      plan.push({ id: 'p6', time: '2:00 PM', type: 'workout', title: 'Midday Stretch', description: 'Gentle yoga or mobility flow to reduce stiffness.', duration: '15 min', completed: false });
    }

    plan.push(
      { id: 'p7', time: '3:30 PM', type: 'hydration', title: 'Afternoon Hydration', description: '500ml water — beat the afternoon slump.', completed: false },
      { id: 'p8', time: '6:30 PM', type: 'meal', title: 'Dinner', description: goals.includes('sleep') ? 'Light, tryptophan-rich meal: turkey, sweet potato, leafy greens, ~550 cal' : 'Balanced dinner: salmon, brown rice, broccoli, ~600 cal', duration: '30 min', completed: false },
    );

    if (goals.includes('sleep')) {
      plan.push({ id: 'p9', time: '9:00 PM', type: 'rest', title: 'Wind-Down Routine', description: 'No screens 30 min before bed. Try light reading or journaling.', duration: '30 min', completed: false });
    }
    if (goals.includes('mental-wellness')) {
      plan.push({ id: 'p10', time: '9:30 PM', type: 'rest', title: 'Mindfulness / Meditation', description: '10-minute guided breathing exercise to reduce cortisol.', duration: '10 min', completed: false });
    }

    plan.push({ id: 'p11', time: '10:00 PM', type: 'rest', title: 'Sleep', description: goals.includes('sleep') ? 'Target 8 hours — set a consistent alarm.' : 'Aim for 7–8 hours for optimal recovery.', completed: false });

    save(STORAGE_KEYS.DAILY_PLAN, plan);
    return plan;
  }

  getGoalProgress(user: User): GoalProgress[] {
    const goalMap: Record<string, { label: string; icon: string; metric: string; progress: number }> = {
      'weight-loss': { label: 'Weight Loss', icon: '⬇️', metric: '2.1 lbs lost', progress: 42 },
      'energy': { label: 'Energy Boost', icon: '⚡', metric: '5 days consistent', progress: 71 },
      'sleep': { label: 'Better Sleep', icon: '😴', metric: 'Avg 7.2 hrs', progress: 60 },
      'strength': { label: 'Strength', icon: '💪', metric: '3 sessions/week', progress: 55 },
      'mental-wellness': { label: 'Mental Wellness', icon: '🧘', metric: '4 days mindful', progress: 80 },
      'flexibility': { label: 'Flexibility', icon: '🤸', metric: '6 stretches done', progress: 33 },
    };
    return user.healthGoals.map(g => ({ goalId: g, ...( goalMap[g] || { label: g, icon: '🎯', metric: 'In progress', progress: 50 }) }));
  }

  // ---- Community ----
  getCommunityFeed(): CommunityActivity[] { return safe<CommunityActivity[]>(STORAGE_KEYS.COMMUNITY, this.initializeMockCommunity()); }
  likeCommunityPost(id: string): void {
    const feed = this.getCommunityFeed();
    const item = feed.find(f => f.id === id);
    if (item) { item.liked = !item.liked; item.likes += item.liked ? 1 : -1; save(STORAGE_KEYS.COMMUNITY, feed); }
  }

  private initializeMockCommunity(): CommunityActivity[] {
    const feed: CommunityActivity[] = [
      { id: 'c1', userId: 'friend2', username: 'Sarah Williams', userAvatar: '👩‍🍳', type: 'workout', title: 'Morning Yoga Session', detail: '45 min • 320 cal', duration: '45 min', timestamp: new Date(Date.now() - 1000 * 60 * 20), likes: 7, liked: false, isGPS: false, privacyLevel: 'everyone' },
      { id: 'c2', userId: 'friend1', username: 'Alex Chen', userAvatar: '👨‍💻', type: 'milestone', title: '🎉 7-Day Streak!', detail: 'Alex hit a week-long streak of daily check-ins', timestamp: new Date(Date.now() - 1000 * 60 * 60), likes: 18, liked: false, isGPS: false, privacyLevel: 'everyone' },
      { id: 'c3', userId: 'friend3', username: 'Jordan Davis', userAvatar: '🏃', type: 'workout', title: 'Evening Run', detail: '5.2 km • 28 min', duration: '28 min', timestamp: new Date(Date.now() - 1000 * 60 * 120), likes: 11, liked: false, isGPS: true, privacyLevel: 'followers' },
      { id: 'c4', userId: 'friend2', username: 'Sarah Williams', userAvatar: '👩‍🍳', type: 'meal', title: 'Logged: Vegan Protein Bowl', detail: 'Quinoa, edamame, tempeh • 520 cal', timestamp: new Date(Date.now() - 1000 * 60 * 180), likes: 4, liked: false, isGPS: false, privacyLevel: 'everyone' },
    ];
    save(STORAGE_KEYS.COMMUNITY, feed);
    return feed;
  }

  // ---- Groups ----
  getGroups(): Group[] { return safe<Group[]>(STORAGE_KEYS.GROUPS, this.initializeMockGroups()); }
  toggleJoinGroup(id: string): void {
    const groups = this.getGroups();
    const g = groups.find(g => g.id === id);
    if (g) { g.joined = !g.joined; g.members += g.joined ? 1 : -1; save(STORAGE_KEYS.GROUPS, groups); }
  }

  private initializeMockGroups(): Group[] {
    const groups: Group[] = [
      { id: 'g1', name: 'Morning Runners ATL', description: 'Early risers hitting Piedmont Park at 6am', icon: '🏃', members: 42, joined: false },
      { id: 'g2', name: 'Plant-Based Lifters', description: 'Proving you can get gains on plants', icon: '🌱', members: 31, joined: false },
      { id: 'g3', name: 'Mindful Mornings', description: 'Meditation, journaling, and calm starts', icon: '🧘', members: 28, joined: true },
      { id: 'g4', name: 'Sleep Optimizers', description: 'Biohackers focused on quality sleep', icon: '😴', members: 19, joined: false },
    ];
    save(STORAGE_KEYS.GROUPS, groups);
    return groups;
  }
}

export const dataStore = DataStore.getInstance();