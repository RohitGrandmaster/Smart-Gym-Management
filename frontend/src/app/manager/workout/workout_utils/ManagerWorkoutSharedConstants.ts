// RESPONSIBILITY: Centralized constants, schema, and shared utilities for the Workout Library module.
import { z } from 'zod';
/* ── Dropdown / Filter Options (Rule 3: Backend-Ready Constants) ── */

export const WORKOUT_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;

export const EXERCISE_DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const EQUIPMENT_OPTIONS = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Cables', 'Kettlebell'] as const;

export const WORKOUT_TAB_OPTIONS = ['Workout Plans', 'Exercise Library'] as const;

export const EXERCISE_TABLE_HEADERS = ['Exercise', 'Primary Muscle', 'Equipment', 'Difficulty', 'Actions'] as const;

/* ── Initial Mock Data (Backend-Ready) ── */

export const INITIAL_WORKOUTS: unknown[] = [
 { id: 1, name: 'Push Pull Legs', level: 'Intermediate', days: 6, exercises: 24, focus: 'Hypertrophy', duration: '75 min', tags: ['PPL', 'Classic'] },
 { id: 2, name: 'Full Body Strength', level: 'Beginner', days: 3, exercises: 12, focus: 'Strength', duration: '45 min', tags: ['Compound', 'Beginner'] },
 { id: 3, name: 'Arnold Split', level: 'Advanced', days: 6, exercises: 30, focus: 'Bodybuilding', duration: '90 min', tags: ['Classic', 'Volume'] },
 { id: 4, name: 'HIIT Fat Burn', level: 'Intermediate', days: 4, exercises: 18, focus: 'Cardio', duration: '40 min', tags: ['HIIT', 'Cardio'] },
 { id: 5, name: 'Calisthenics', level: 'Beginner', days: 4, exercises: 15, focus: 'Bodyweight', duration: '50 min', tags: ['Bodyweight', 'Flexible'] },
 { id: 6, name: 'Powerlifting Program',level: 'Advanced', days: 4, exercises: 10, focus: 'Strength', duration: '80 min', tags: ['Powerlifting', 'Heavy'] },
];

export const INITIAL_EXERCISES: unknown[] = [
 { id: 1, name: 'Barbell Squat', muscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Intermediate' },
 { id: 2, name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', difficulty: 'Beginner' },
 { id: 3, name: 'Deadlift', muscle: 'Posterior Chain', equipment: 'Barbell', difficulty: 'Advanced' },
 { id: 4, name: 'Pull-Up', muscle: 'Back', equipment: 'Bodyweight', difficulty: 'Intermediate' },
 { id: 5, name: 'Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', difficulty: 'Beginner' },
 { id: 6, name: 'Romanian Deadlift',muscle: 'Hamstrings', equipment: 'Barbell', difficulty: 'Intermediate' },
];

export const WorkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  level: z.string(),
  days: z.number().min(1, 'Must be a valid number > 0'),
  exercises: z.number().min(1, 'Must be a valid number > 0'),
  focus: z.string().min(2, 'Focus area is required'),
  duration: z.string().min(2, 'Duration is required'),
  tags: z.string()
});
export type WorkoutFormValues = z.infer<typeof WorkoutSchema>;

export const EMPTY_WORKOUT_FORM: WorkoutFormValues = { 
  name: '', 
  level: 'Beginner', 
  days: 0, 
  exercises: 0, 
  focus: '', 
  duration: '', 
  tags: '' 
};

export const ExerciseSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  muscle: z.string().min(2, 'Primary muscle is required'),
  equipment: z.string(),
  difficulty: z.string()
});
export type ExerciseFormValues = z.infer<typeof ExerciseSchema>;

export const EMPTY_EXERCISE_FORM: ExerciseFormValues = { 
  name: '', 
  muscle: '', 
  equipment: 'Barbell', 
  difficulty: 'Beginner' 
};

