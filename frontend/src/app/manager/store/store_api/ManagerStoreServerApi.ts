// RESPONSIBILITY: Server-side API fetching for the store module.
import { ssrApiFetch } from '@/lib/server-api';
import type { ApiResponse } from '@/lib/api';
import { StoreUrlConfig } from '@/app/manager/store/ManagerStoreUrlConfig';
import type { Product, Order, StoreSummary } from '@/app/manager/store/store_types/ManagerStoreTypes';

export const ssrStoreApi = {
  getProducts: () => ssrApiFetch<ApiResponse<{ products: Product[]; total: number }>>(StoreUrlConfig.BACKEND_API.PRODUCTS_BASE),
  getOrders: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<{ orders: Order[]; total: number }>>(`${StoreUrlConfig.BACKEND_API.ORDERS_BASE}${q}`);
  },
  getStoreSummary: () => ssrApiFetch<ApiResponse<StoreSummary>>(StoreUrlConfig.BACKEND_API.SUMMARY),
};
