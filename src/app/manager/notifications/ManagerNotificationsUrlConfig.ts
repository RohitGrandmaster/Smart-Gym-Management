export const ManagerNotificationsUrlConfig = {
  PAGES: { LIST: '/manager/notifications' },
  BACKEND_API: {
    BASE: '/manager/notifications',
    MARK_READ: (id: string) => `/manager/notifications/${id}/read`,
    MARK_ALL_READ: '/manager/notifications/read-all',
    DELETE: (id: string) => `/manager/notifications/${id}`,
    KPIS: '/manager/notifications/kpis',
  },
};
