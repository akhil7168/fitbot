'use client';

import { useMemo } from 'react';
import { Workout, ProgressData } from '@/lib/types';
import { calculateProgress } from '@/lib/utils';

export function useProgress(workouts: Workout[]): ProgressData {
  return useMemo(() => calculateProgress(workouts), [workouts]);
}
