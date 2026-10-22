// RESPONSIBILITY: Provides the implementation for plans_url_config.ts functionality within its module.
export const PlansUrlConfig = {
  PAGES: {
    LIST: '/admin/plans',
  },
  BACKEND_API: {
    BASE: '/admin/plans',
    GET_ONE: (id: string) => `/admin/plans/${id}`,
    UPDATE: (id: string) => `/admin/plans/${id}`,
    DELETE: (id: string) => `/admin/plans/${id}`,
  }
};
