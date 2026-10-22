// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Single source of truth for all URLs used by the Members module.
// Both page routes (for navigation) and backend API endpoints are defined here.
// No file in the Members module should ever hardcode a URL string — always import from here.
export const MembersUrlConfig = {
  PAGES: {
    LIST: '/trainer/members',
    ADD: '/trainer/members',
  },
  BACKEND_API: {
    BASE: '/trainer/members',
    STATS: '/trainer/members/stats',
    RENEW: (id: string) => `/trainer/members/${id}/renew`,
    GET_ONE: (id: string) => `/trainer/members/${id}`,
    UPDATE: (id: string) => `/trainer/members/${id}`,
    DELETE: (id: string) => `/trainer/members/${id}`,
  }
};


