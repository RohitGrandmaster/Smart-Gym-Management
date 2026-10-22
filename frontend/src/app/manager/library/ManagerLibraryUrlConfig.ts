// RESPONSIBILITY: Single source of truth for all backend API endpoints used by the Diet Library module.
export const LibraryUrlConfig = {
  PAGES: {
    LIBRARY: '/manager/library',
  },
  BACKEND_API: {
    EXERCISES_BASE: '/manager/library/exercises',
    EXERCISE_UPDATE: (id: string) => `/manager/library/exercises/${id}`,
    EXERCISE_DELETE: (id: string) => `/manager/library/exercises/${id}`,
    DIET_PLANS_BASE: '/manager/library/diet-plans',
    DIET_PLAN_UPDATE: (id: string) => `/manager/library/diet-plans/${id}`,
    DIET_PLAN_DELETE: (id: string) => `/manager/library/diet-plans/${id}`,
  }
};
