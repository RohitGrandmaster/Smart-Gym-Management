// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides strongly-typed network calls for the workout module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { WorkoutUrlConfig } from '@/app/trainer/workout/workout_url_config';
import type { Workout, Exercise } from '@/app/trainer/trainer_types/trainer_types';

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
  getExercises: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ exercises: Exercise[], total: number }>>(`${WorkoutUrlConfig.BACKEND_API.EXERCISES_BASE}${q}`);
  },
  createExercise: (body: Partial<Exercise>) =>
    apiFetch<ApiResponse<Exercise>>(WorkoutUrlConfig.BACKEND_API.EXERCISES_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateExercise: (id: string, body: Partial<Exercise>) =>
    apiFetch<ApiResponse<Exercise>>(WorkoutUrlConfig.BACKEND_API.EXERCISE_UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  removeExercise: (id: string) => apiFetch<ApiResponse<{ id: string }>>(WorkoutUrlConfig.BACKEND_API.EXERCISE_DELETE(id), { method: 'DELETE' }),
};

