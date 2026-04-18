// Types for the app
export interface HealthGoal {
  id: string;
  name: string;
}

export interface DietaryPreference {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  healthGoals: string[];
  dietaryPreference: string;
  avatar?: string;
  createdAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  mealName: string;
  image?: string;
  calories?: number;
  protein?: number;
  likes: number;
  reactions: Record<string, number>; // emoji -> count
  timestamp: Date;
  liked?: boolean;
}

export interface AppState {
  currentUser: User | null;
  meals: Meal[];
  friends: User[];
}
