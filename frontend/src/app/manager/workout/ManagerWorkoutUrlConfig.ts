// RESPONSIBILITY: Single source of truth for all backend API endpoints used by the Workout Library module.
export const WorkoutUrlConfig = {
  PAGES: {
    WORKOUTS: '/manager/workout',
    EXERCISES: '/manager/workout',
    DIET_PLANS: '/manager/workout',
  },
  BACKEND_API: {
    WORKOUTS_BASE: '/manager/workout/workouts',
    WORKOUT_UPDATE: (id: string) => `/manager/workout/workouts/${id}`,
    WORKOUT_DELETE: (id: string) => `/manager/workout/workouts/${id}`,
    EXERCISES_BASE: '/manager/workout/exercises',
    EXERCISE_UPDATE: (id: string) => `/manager/workout/exercises/${id}`,
    EXERCISE_DELETE: (id: string) => `/manager/workout/exercises/${id}`,
    DIET_PLANS_BASE: '/manager/workout/diet-plans',
    DIET_PLAN_UPDATE: (id: string) => `/manager/workout/diet-plans/${id}`,
    DIET_PLAN_DELETE: (id: string) => `/manager/workout/diet-plans/${id}`,
  }
};
