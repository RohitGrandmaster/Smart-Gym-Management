// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Shared TypeScript types for the Trainer module.
// Extracted to strictly enforce Module Boundary Isolation (Rule 63).

export interface Member {
  id: string; name: string; email: string; phone: string;
  gender: string; address?: string; branch: string;
  planId: string; plan?: { id: string; name: string; tier: string };
  billingCycle: string; status: string;
  joinDate: string; expiryDate: string;
  paidAmount: number; pendingAmount: number; photo?: string;
  createdAt: string;
  age?: number;
  lastWorkout?: string;
  progressStatus?: 'Good' | 'Average' | 'Needs Attention';
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  isPT?: boolean;
  assignedDietId?: string;
  assignedDiet?: DietPlan;
  assignedWorkoutId?: string;
  assignedWorkout?: Workout;
  fitnessGoal?: string;
}

export interface MemberStats {
  total: number; active: number; pending: number; expired: number;
}

export interface Attendance {
  id: string;
  memberId?: number;
  staffId?: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  type: string;
  member?: { name: string; id?: string };
  staff?: { name: string; id?: string };
}

export interface Exercise {
  id: string; name: string; category: string; muscleGroup: string[];
  sets?: number; reps?: string; duration?: string;
  difficulty: string; description?: string; videoUrl?: string; imageUrl?: string; isActive: boolean;
  equipment?: string; instructions?: string;
}

export interface DietPlan {
  id: string; name: string; goal: string;
  calories?: number; protein?: number; carbs?: number; fats?: number;
  description?: string; meals: string[]; isActive: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: string;
}

export interface Workout {
  id: string; name: string; level: string; days: number;
  exercises: number; focus: string; duration: string; tags: string[]; isActive?: boolean;
  goal?: string; startDate?: string; endDate?: string;
  instructions?: string;
  assignedMemberId?: string;
  workoutExercises?: WorkoutExercise[];
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

