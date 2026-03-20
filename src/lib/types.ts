export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
  duration?: number; // minutes, for cardio
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'sports';
  exercises: Exercise[];
  date: string;
  duration: number; // total minutes
  caloriesBurned?: number;
  notes?: string;
}

export interface ProgressData {
  totalWorkouts: number;
  totalDuration: number; // minutes
  totalCalories: number;
  currentStreak: number;
  weeklyWorkouts: { day: string; count: number }[];
  monthlyProgress: { month: string; workouts: number; duration: number }[];
  workoutTypeDistribution: { type: string; count: number }[];
}

export interface SuggestedPrompt {
  icon: string;
  title: string;
  prompt: string;
}

export type WorkoutType = Workout['type'];
