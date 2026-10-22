// RESPONSIBILITY: Server Component — fetches initial SSR data and renders the Gym Store module entry point.
import ManagerStoreMain from '@/app/manager/store/store_components/ManagerStoreMain/ManagerStoreMain';
import { ssrStoreApi } from '@/app/manager/store/store_api/ManagerStoreServerApi';
import type { StoreInitialData } from '@/app/manager/store/store_types/ManagerStoreTypes';

export default async function StorePage() {
  let initialData: StoreInitialData | undefined = undefined;
  
  try {
    const [productsRes, ordersRes, summaryRes] = await Promise.all([
      ssrStoreApi.getProducts(),
      ssrStoreApi.getOrders({ limit: '10', page: '1' }),
      ssrStoreApi.getStoreSummary(),
    ]);
    initialData = {
      products: productsRes.data?.products || productsRes.data || [],
      orders: ordersRes.data?.orders || [],
      totalOrders: ordersRes.data?.total || 0,
      summary: summaryRes.data || { revenue: 0, lowStock: 0 }
    } as unknown as StoreInitialData;
  } catch {
    // SSR data fetch failed gracefully — client-side store will re-fetch
  }

  return <ManagerStoreMain initialData={initialData} />;
}
