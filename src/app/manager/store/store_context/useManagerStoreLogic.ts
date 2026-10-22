// RESPONSIBILITY: Custom hook encapsulating all UI state and API orchestration for the gym product Store module.
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDebounce } from '@/app/manager/manager_utils/useDebounce';
import { storeApi } from '@/app/manager/store/store_api/ManagerStoreApi';
import type { Product, Order, StoreSummary } from '@/app/manager/store/store_types/ManagerStoreTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { ManagerReceiptData } from '@/app/manager/manager_components/ManagerShared/ManagerThermalReceipt';
import { EMPTY_PRODUCT_FORM, ProductFormValues } from '@/app/manager/store/store_utils/ManagerStoreSharedConstants';
import { GYM_DETAILS } from '@/app/manager/manager_utils/ManagerSharedConstants';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { StoreContextType, OrderItem, StoreInitialData, FetchState } from '@/app/manager/store/store_types/ManagerStoreTypes';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';
import { useManagerStoreOrder } from './useManagerStoreOrder';
import { useManagerStoreProducts } from './useManagerStoreProducts';
export function useManagerStoreLogic(initialData?: StoreInitialData | null): StoreContextType {
  const { confirm } = useConfirm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab') || 'Products';
  
  const search = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('categoryFilter') || 'ALL';
  const stockFilter = searchParams.get('stockFilter') || 'ALL';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const sortOrder = (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'DESC';
  
  const debouncedSearch = useDebounce(search, 300);

  const setUrlParam = useCallback((key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) current.set(key, value);
    else current.delete(key);
    if (key !== 'page' && key !== 'tab') current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const setTab = useCallback((val: string) => setUrlParam('tab', val), [setUrlParam]);
  const setSearch = useCallback((val: string) => setUrlParam('search', val || null), [setUrlParam]);
  const setCategoryFilter = useCallback((val: string) => setUrlParam('categoryFilter', val || null), [setUrlParam]);
  const setStockFilter = useCallback((val: string) => setUrlParam('stockFilter', val || null), [setUrlParam]);
  const setCurrentPage = useCallback((val: number) => setUrlParam('page', val.toString()), [setUrlParam]);
  const setStartDate = useCallback((val: string) => setUrlParam('startDate', val || null), [setUrlParam]);
  const setEndDate = useCallback((val: string) => setUrlParam('endDate', val || null), [setUrlParam]);
  const setSortOrder = useCallback((val: 'ASC' | 'DESC') => setUrlParam('sortOrder', val), [setUrlParam]);
  const [products, setProducts] = useState<Product[]>(initialData?.products || []);
  const [orders, setOrders] = useState<Order[]>(initialData?.orders || []);
  const [totalOrders, setTotalOrders] = useState<number>(initialData?.totalOrders || 0);
  const [summary, setSummary] = useState<StoreSummary | null>(initialData?.summary || null);
  const [fetchState, setFetchState] = useState<FetchState>(initialData ? 'success' : 'loading');
  const [saving, setSaving] = useState(false);
  const isFirstRender = React.useRef(true);
 
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [printData, setPrintData] = useState<ManagerReceiptData | null>(null);

  const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
  const hideToast = useCallback(() => setToast(null), []);

 const loadAll = useCallback(async () => {
 setFetchState('loading');
 try {
      const params: Record<string, string> = { 
        limit: '10', 
        page: currentPage.toString(),
        sortOrder
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [productsRes, ordersRes, summaryRes] = await Promise.all([
        storeApi.getProducts(params),
        storeApi.getOrders(params),
        storeApi.getStoreSummary(),
      ]);
      let fetchedProducts = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data as { products?: unknown[] }).products as Product[] || [];
      let fetchedOrders = ordersRes.data.orders || [];

      if (debouncedSearch || categoryFilter !== 'ALL' || stockFilter !== 'ALL') {
        const q = debouncedSearch.toLowerCase();
        fetchedProducts = fetchedProducts.filter((p: Product) => {
          const matchesSearch = !debouncedSearch || p.name?.toLowerCase().includes(q) || (p.category && p.category?.toLowerCase().includes(q));
          const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
          const matchesStock = stockFilter === 'ALL' || (stockFilter === 'IN_STOCK' ? p.stock > 0 : p.stock === 0);
          return matchesSearch && matchesCategory && matchesStock;
        });
        
        if (debouncedSearch) {
          fetchedOrders = fetchedOrders.filter((o: Order) => 
            o.id?.toLowerCase().includes(q) || (o.notes && o.notes?.toLowerCase().includes(q))
          );
        }
      }

      if (startDate) {
        const start = new Date(startDate).getTime();
        fetchedOrders = fetchedOrders.filter((o: Order) => new Date(o.createdAt).getTime() >= start);
      }
      if (endDate) {
        const end = new Date(endDate).getTime();
        fetchedOrders = fetchedOrders.filter((o: Order) => new Date(o.createdAt).getTime() <= end + 86400000);
      }

      fetchedOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
      });

      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
      setTotalOrders(ordersRes.data.total || 0);
      setSummary(summaryRes.data);
 } catch (e) { 
 showToast((e as Error).message, 'error'); 
 setFetchState('error');
  } finally { 
  setFetchState('success'); 
  }
  }, [showToast, currentPage, debouncedSearch, categoryFilter, stockFilter, startDate, endDate, sortOrder]);

  useEffect(() => { 
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
    }
    loadAll(); 
  }, [loadAll, initialData]);

  const productLogic = useManagerStoreProducts(
    setProducts,
    setSummary,
    showToast,
    setSaving,
    confirm as any
  );

  const orderLogic = useManagerStoreOrder(
    loadAll,
    setTab,
    showToast,
    setPrintData,
    setSaving
  );

  return {
    tab, setTab,
    products, orders, totalOrders, summary, fetchState, saving,
    toast, printData, setPrintData, search, debouncedSearch, setSearch,
    categoryFilter, setCategoryFilter, stockFilter, setStockFilter,
    currentPage, setCurrentPage,
    startDate, setStartDate, endDate, setEndDate, sortOrder, setSortOrder,
    ...productLogic,
    ...orderLogic,
    hideToast, loadAll
 };
}

