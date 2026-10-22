// RESPONSIBILITY: Centralized URL config for the Coupons module.
export const CouponsUrlConfig = {
  PAGES: { LIST: '/admin/coupons' },
  BACKEND_API: {
    BASE: '/admin/coupons',
    GET_ONE: (id: string) => `/admin/coupons/${id}`,
    UPDATE: (id: string) => `/admin/coupons/${id}`,
    DELETE: (id: string) => `/admin/coupons/${id}`,
    TOGGLE: (id: string) => `/admin/coupons/${id}/toggle`,
  },
};
