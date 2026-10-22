// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized constants, schema, and shared utilities for the Workout Library module.
import { z } from 'zod';
import type { Exercise } from '@/app/trainer/trainer_types/trainer_types';
import type { Workout } from '@/app/trainer/trainer_types/trainer_types';
/* ── Dropdown / Filter Options (Rule 3: Backend-Ready Constants) ── */

export const WORKOUT_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;

export const EXERCISE_DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const EQUIPMENT_OPTIONS = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Cables', 'Kettlebell'] as const;

export const WORKOUT_FOCUS_OPTIONS = ['Hypertrophy', 'Strength', 'Bodybuilding', 'Cardio', 'Bodyweight'];

export const EXERCISE_MUSCLE_OPTIONS = ['Quadriceps', 'Chest', 'Back', 'Shoulders', 'Hamstrings', 'Posterior Chain', 'Arms', 'Core'];

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
  days: z.coerce.number().min(1, 'Must be a valid number > 0'),
  exercises: z.coerce.number().min(1, 'Must be a valid number > 0'),
  focus: z.string().min(2, 'Focus area is required'),
  duration: z.string().min(2, 'Duration is required'),
  tags: z.string(),
  goal: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  instructions: z.string().optional(),
  assignedMemberId: z.string().optional(),
  workoutExercises: z.array(z.object({
    exerciseId: z.string().optional(),
    name: z.string(),
    sets: z.coerce.number().min(1),
    reps: z.string().or(z.coerce.number().transform(v => String(v))),
    weight: z.string().optional(),
    restTime: z.string().optional()
  })).optional()
});
export type WorkoutFormValues = z.infer<typeof WorkoutSchema>;

export const EMPTY_WORKOUT_FORM: WorkoutFormValues = { 
  name: '', 
  level: 'Beginner', 
  days: 0, 
  exercises: 0, 
  focus: '', 
  duration: '', 
  tags: '',
  goal: '',
  startDate: '',
  endDate: '',
  instructions: '',
  assignedMemberId: '',
  workoutExercises: []
};

export const ExerciseSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  muscle: z.string().min(2, 'Primary muscle is required'),
  equipment: z.string(),
  difficulty: z.string(),
  instructions: z.string().optional(),
  videoUrl: z.string().optional()
});
export type ExerciseFormValues = z.infer<typeof ExerciseSchema>;

export const EMPTY_EXERCISE_FORM: ExerciseFormValues = { 
  name: '', 
  muscle: '', 
  equipment: 'Barbell', 
  difficulty: 'Beginner',
  instructions: '',
  videoUrl: ''
};


