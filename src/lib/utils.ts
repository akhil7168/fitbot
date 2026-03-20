import { Workout, ProgressData } from './types';
import { format, subDays, startOfWeek, isAfter, parseISO, differenceInDays } from 'date-fns';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function getWorkoutsFromStorage(): Workout[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('fitbot-workouts');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWorkoutsToStorage(workouts: Workout[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fitbot-workouts', JSON.stringify(workouts));
}

export function calculateProgress(workouts: Workout[]): ProgressData {
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  // Current streak
  let currentStreak = 0;
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedWorkouts.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = today;

    for (let i = 0; i < 365; i++) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const hasWorkout = sortedWorkouts.some((w) => w.date === dateStr);
      if (hasWorkout) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else if (i === 0) {
        // Allow today to not have a workout yet
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  }

  // Weekly workouts (last 7 days)
  const weekStart = startOfWeek(new Date());
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyWorkouts = dayNames.map((day, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = workouts.filter((w) => w.date === dateStr).length;
    return { day, count };
  });

  // Monthly progress (last 6 months)
  const monthlyProgress = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = format(date, 'MMM');
    const yearMonth = format(date, 'yyyy-MM');
    const monthWorkouts = workouts.filter((w) => w.date.startsWith(yearMonth));
    monthlyProgress.push({
      month: monthStr,
      workouts: monthWorkouts.length,
      duration: monthWorkouts.reduce((sum, w) => sum + w.duration, 0),
    });
  }

  // Workout type distribution
  const typeCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
  });
  const workoutTypeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }));

  return {
    totalWorkouts,
    totalDuration,
    totalCalories,
    currentStreak,
    weeklyWorkouts,
    monthlyProgress,
    workoutTypeDistribution,
  };
}

export function estimateCalories(type: string, duration: number): number {
  const caloriesPerMinute: Record<string, number> = {
    strength: 6,
    cardio: 10,
    flexibility: 3,
    hiit: 12,
    sports: 8,
  };
  return Math.round((caloriesPerMinute[type] || 6) * duration);
}
