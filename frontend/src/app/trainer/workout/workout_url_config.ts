// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Single source of truth for all backend API endpoints used by the Workout Library module.
export const WorkoutUrlConfig = {
  PAGES: {
    WORKOUTS: '/trainer/workout',
    EXERCISES: '/trainer/workout',
    DIET_PLANS: '/trainer/workout',
  },
  BACKEND_API: {
    WORKOUTS_BASE: '/trainer/workout/workouts',
    WORKOUT_UPDATE: (id: string) => `/trainer/workout/workouts/${id}`,
    WORKOUT_DELETE: (id: string) => `/trainer/workout/workouts/${id}`,
    EXERCISES_BASE: '/trainer/workout/exercises',
    EXERCISE_UPDATE: (id: string) => `/trainer/workout/exercises/${id}`,
    EXERCISE_DELETE: (id: string) => `/trainer/workout/exercises/${id}`,
    DIET_PLANS_BASE: '/trainer/workout/diet-plans',
    DIET_PLAN_UPDATE: (id: string) => `/trainer/workout/diet-plans/${id}`,
    DIET_PLAN_DELETE: (id: string) => `/trainer/workout/diet-plans/${id}`,
  }
};

