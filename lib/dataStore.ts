import { User, Meal, HealthGoal, DietaryPreference } from './types';

const STORAGE_KEYS = {
  CURRENT_USER: 'kiss-current-user',
  MEALS: 'kiss-meals',
  FRIENDS: 'kiss-friends',
  USER_DATA: 'kiss-user-data',
  USER_REGISTRY: 'kiss-user-registry',
};

export class DataStore {
  private static instance: DataStore;

  private constructor() {}

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // User management
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CURRENT_USER) : null;
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  clearCurrentUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  getUserRegistry(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.USER_REGISTRY);
    return data ? JSON.parse(data) : [];
  }

  registerUser(user: User): void {
    if (typeof window === 'undefined') return;
    const registry = this.getUserRegistry();
    const idx = registry.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      registry[idx] = user;
    } else {
      registry.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USER_REGISTRY, JSON.stringify(registry));
  }

  findUserByEmail(email: string): User | null {
    const registry = this.getUserRegistry();
    return registry.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  // Meal management
  getMeals(): Meal[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  }

  addMeal(meal: Meal): void {
    if (typeof window === 'undefined') return;
    const meals = this.getMeals();
    meals.unshift(meal); // Add to top for reverse chronological order
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }

  likeMeal(mealId: string): void {
    if (typeof window === 'undefined') return;
    const meals = this.getMeals();
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      meal.likes += 1;
      meal.liked = true;
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    }
  }

  addReaction(mealId: string, emoji: string): void {
    if (typeof window === 'undefined') return;
    const meals = this.getMeals();
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      meal.reactions[emoji] = (meal.reactions[emoji] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    }
  }

  // Friends/mock data
  getFriends(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.FRIENDS);
    return data ? JSON.parse(data) : this.initializeMockFriends();
  }

  private initializeMockFriends(): User[] {
    const friends: User[] = [
      {
        id: 'friend1',
        email: 'alex@example.com',
        name: 'Alex Chen',
        healthGoals: ['build-muscle', 'eat-healthier'],
        dietaryPreference: 'none',
        avatar: '👨‍💻',
        createdAt: new Date(),
      },
      {
        id: 'friend2',
        email: 'sarah@example.com',
        name: 'Sarah Williams',
        healthGoals: ['lose-weight', 'eat-healthier'],
        dietaryPreference: 'vegan',
        avatar: '👩‍🍳',
        createdAt: new Date(),
      },
      {
        id: 'friend3',
        email: 'jordan@example.com',
        name: 'Jordan Davis',
        healthGoals: ['eat-healthier'],
        dietaryPreference: 'halal',
        avatar: '🏃',
        createdAt: new Date(),
      },
    ];

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
    }
    return friends;
  }

  // Mock meals for demo
  initializeMockMeals(): void {
    if (typeof window === 'undefined') return;
    
    const mockMeals: Meal[] = [
      {
        id: 'm1',
        userId: 'friend1',
        username: 'Alex Chen',
        userAvatar: '👨‍💻',
        mealName: 'Grilled Salmon with Quinoa',
        calories: 580,
        protein: 42,
        likes: 12,
        reactions: { '🔥': 3, '💪': 5, '🥗': 4 },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        liked: false,
      },
      {
        id: 'm2',
        userId: 'friend2',
        username: 'Sarah Williams',
        userAvatar: '👩‍🍳',
        mealName: 'Buddha Bowl with Tahini Dressing',
        calories: 420,
        protein: 18,
        likes: 8,
        reactions: { '🥗': 8 },
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        liked: false,
      },
      {
        id: 'm3',
        userId: 'friend3',
        username: 'Jordan Davis',
        userAvatar: '🏃',
        mealName: 'Chicken Shawarma Wrap',
        calories: 520,
        protein: 38,
        likes: 15,
        reactions: { '🔥': 7, '💪': 6, '🥗': 2 },
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        liked: false,
      },
    ];

    if (this.getMeals().length === 0) {
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(mockMeals));
    }
  }
}

export const dataStore = DataStore.getInstance();
