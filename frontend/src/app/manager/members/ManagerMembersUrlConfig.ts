// RESPONSIBILITY: Single source of truth for all URLs used by the Members module.
// Both page routes (for navigation) and backend API endpoints are defined here.
// No file in the Members module should ever hardcode a URL string — always import from here.
export const MembersUrlConfig = {
  PAGES: {
    LIST: '/manager/members',
    ADD: '/manager/members',
  },
  BACKEND_API: {
    BASE: '/manager/members',
    STATS: '/manager/members/stats',
    RENEW: (id: string) => `/manager/members/${id}/renew`,
    GET_ONE: (id: string) => `/manager/members/${id}`,
    UPDATE: (id: string) => `/manager/members/${id}`,
    DELETE: (id: string) => `/manager/members/${id}`,
  }
};

