// HealthSync Types — extended from base template
 
export interface HealthGoal {
  id: string;
  name: string;
}
 
export interface DietaryPreference {
  id: string;
  name: string;
}
 
export type PrivacyLevel = 'private' | 'followers' | 'everyone';
 
export interface User {
  id: string;
  email: string;
  name: string;
  gender?: string;
  age?: number;
  healthGoals: string[];
  dietaryPreference: string; // kept for backward compat
  dietaryRestrictions: string[];
  physicalLimitations: string;
  medications: string;
  scheduleDescription: string;
  scheduleWindows?: ScheduleWindow[];
  privacyLevel: PrivacyLevel;
  avatar?: string;
  createdAt: Date;
}
 
export interface ScheduleWindow {
  type: 'meal' | 'movement' | 'rest';
  time: string;
  label: string;
}
 
export interface DailyPlanItem {
  id: string;
  time: string;
  type: 'meal' | 'workout' | 'hydration' | 'rest';
  title: string;
  description: string;
  duration?: string;
  completed: boolean;
}
 
export interface GoalProgress {
  goalId: string;
  label: string;
  icon: string;
  progress: number;
  metric: string;
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
  reactions: Record<string, number>;
  timestamp: Date;
  liked?: boolean;
}
 
export interface Group {
  id: string;
  name: string;
  description: string;
  icon: string;
  members: number;
  joined: boolean;
}
 
export interface CommunityActivity {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  type: 'workout' | 'meal' | 'milestone';
  title: string;
  detail: string;
  duration?: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  isGPS: boolean;
  privacyLevel: PrivacyLevel;
}
 
export interface AppState {
  currentUser: User | null;
  meals: Meal[];
  friends: User[];
}


