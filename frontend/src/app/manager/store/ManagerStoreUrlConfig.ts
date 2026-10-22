// RESPONSIBILITY: Single source of truth for all backend API endpoints used by the Store module.
export const StoreUrlConfig = {
  PAGES: {
    PRODUCTS: '/manager/store',
    ORDERS: '/manager/store',
  },
  BACKEND_API: {
    PRODUCTS_BASE: '/manager/store/products',
    PRODUCT_UPDATE: (id: string) => `/manager/store/products/${id}`,
    PRODUCT_DELETE: (id: string) => `/manager/store/products/${id}`,
    ORDERS_BASE: '/manager/store/orders',
    SUMMARY: '/manager/store/summary',
  }
};
