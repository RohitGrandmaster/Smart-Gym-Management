// RESPONSIBILITY: Provides strongly-typed network calls for the workout module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { WorkoutUrlConfig } from '@/app/manager/workout/ManagerWorkoutUrlConfig';
import type { Workout } from '@/app/manager/workout/workout_types/ManagerWorkoutTypes';

export const workoutApi = {
  getWorkouts: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ workouts: Workout[], total: number }>>(`${WorkoutUrlConfig.BACKEND_API.WORKOUTS_BASE}${q}`);
  },
  createWorkout: (body: Partial<Workout>) =>
    apiFetch<ApiResponse<Workout>>(WorkoutUrlConfig.BACKEND_API.WORKOUTS_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateWorkout: (id: string, body: Partial<Workout>) =>
    apiFetch<ApiResponse<Workout>>(WorkoutUrlConfig.BACKEND_API.WORKOUT_UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  removeWorkout: (id: string) => apiFetch<ApiResponse<{ id: string }>>(WorkoutUrlConfig.BACKEND_API.WORKOUT_DELETE(id), { method: 'DELETE' }),
};
