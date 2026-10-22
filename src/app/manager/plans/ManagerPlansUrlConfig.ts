export const PlansUrlConfig = {
  PAGES: { LIST: '/manager/plans' },
  BACKEND_API: {
    BASE: '/manager/plans',
    GET_ONE: (id: string) => `/manager/plans/${id}`,
    UPDATE: (id: string) => `/manager/plans/${id}`,
    DELETE: (id: string) => `/manager/plans/${id}`
  }
};
export const ManagerPlansUrlConfig = PlansUrlConfig;
