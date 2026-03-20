'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workout, Exercise } from '@/lib/types';
import { getWorkoutsFromStorage, saveWorkoutsToStorage, estimateCalories } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setWorkouts(getWorkoutsFromStorage());
    setIsLoaded(true);
  }, []);

  const addWorkout = useCallback((workout: Omit<Workout, 'id' | 'caloriesBurned'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: uuidv4(),
      caloriesBurned: estimateCalories(workout.type, workout.duration),
    };
    setWorkouts((prev) => {
      const updated = [newWorkout, ...prev];
      saveWorkoutsToStorage(updated);
      return updated;
    });
    return newWorkout;
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      saveWorkoutsToStorage(updated);
      return updated;
    });
  }, []);

  const getRecentWorkouts = useCallback((count: number = 5) => {
    return [...workouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }, [workouts]);

  return {
    workouts,
    isLoaded,
    addWorkout,
    deleteWorkout,
    getRecentWorkouts,
  };
}
