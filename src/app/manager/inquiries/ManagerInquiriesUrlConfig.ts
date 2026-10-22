// RESPONSIBILITY: Single source of truth for all backend API endpoints used by the Inquiries module.
export const InquiriesUrlConfig = {
  PAGES: {
    LIST: '/manager/inquiries',
  },
  BACKEND_API: {
    BASE: '/manager/inquiries',
    GET_ONE: (id: string) => `/manager/inquiries/${id}`,
    STATS: '/manager/inquiries/meta/stats',
    UPDATE: (id: string) => `/manager/inquiries/${id}`,
    DELETE: (id: string) => `/manager/inquiries/${id}`,
  }
};
