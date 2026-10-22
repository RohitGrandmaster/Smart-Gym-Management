// RESPONSIBILITY: Custom hook encapsulating all business logic, async API calls, URL-synced state (search, page), and data for the Sales & Reports module. Feeds AdminSalesContext.
// DATA FLOW: salesApi → useAdminSalesLogic → AdminSalesContext → Sales components
import { useCallback } from 'react';
import { useDebounce } from '@/app/admin/admin_utils/useDebounce';
import { type SalesTab, type DateFilter } from '@/app/admin/sales/sales_utils/AdminSalesSharedConstants';
import { useAdminSalesStore } from '@/app/admin/sales/sales_store/useAdminSalesStore';
import type { SalesContextType, SalesInitialData, FetchState, OverviewDataPoint, MembershipReportItem, MembershipTotals, PendingPaymentMember, StoreOrder, StoreSummary } from '@/app/admin/sales/sales_types/sales_types';
import type { Member } from '@/app/admin/sales/sales_types/sales_types';
import { salesApi } from '@/app/admin/sales/sales_api/sales_api';
import type { ToastType } from '@/app/admin/admin_components/AdminFeedback/AdminToast';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAdminGlobalStore } from '@/app/admin/admin_store/useAdminGlobalStore';

export function useAdminSalesLogic(initialData?: SalesInitialData | null): SalesContextType {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { selectedBranchId } = useAdminGlobalStore();

  const tab = (searchParams.get('tab') || 'Overview') as SalesTab;
  const dateFilter = (searchParams.get('dateFilter') || 'This Month') as DateFilter;
  const search = searchParams.get('search') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const debouncedSearch = useDebounce(search, 300);

  const setSearch = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) { params.set('search', val); params.set('page', '1'); }
    else { params.delete('search'); params.set('page', '1'); }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  const setTab = useCallback((val: SalesTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', val);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  const setDateFilter = useCallback((val: DateFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('dateFilter', val);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  const setCurrentPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  // Remove custom toast state in favor of react-hot-toast, but we'll return a mock showToast for compatibility with context if needed, or update Context.
  // The plan said "Ensure backend-driven toasts (`res.message`)". We'll use react-hot-toast directly in mutations.
  // For context backward compatibility:
  const showToast = useCallback((message: string, type: ToastType) => {
    if (type === 'error') toast.error(message);
    else toast.success(message);
  }, []);

  const queryParams = { limit: '10', page: currentPage.toString(), branchId: selectedBranchId, ...(debouncedSearch ? { search: debouncedSearch } : {}) };

  const { data: overviewRes, isLoading: overviewLoading, isError: overviewError } = useQuery({
    queryKey: ['salesOverview', dateFilter, selectedBranchId],
    queryFn: () => salesApi.fetchOverview(selectedBranchId),
    initialData: initialData?.overviewData ? { success: true, message: 'SSR', data: { monthlyRevenue: initialData.overviewData } } : undefined,
  });

  const { data: reportRes, isLoading: reportLoading, isError: reportError } = useQuery({
    queryKey: ['salesMembershipReport', dateFilter, selectedBranchId],
    queryFn: () => salesApi.fetchMembershipReport(selectedBranchId),
    initialData: initialData?.membershipReport ? { success: true, message: 'SSR', data: { report: initialData.membershipReport, totals: initialData.membershipTotals || {} } } : undefined,
  });

  const { data: pendingRes, isLoading: pendingLoading, isError: pendingError } = useQuery({
    queryKey: ['salesPendingPayments', queryParams, dateFilter, selectedBranchId],
    queryFn: () => salesApi.fetchPendingPayments(queryParams),
    initialData: initialData?.pendingPayments ? { success: true, message: 'SSR', data: { members: initialData.pendingPayments, total: initialData.pendingTotal || 0 } } : undefined,
  });

  const { data: allMembershipsRes, isLoading: allMembershipsLoading, isError: allMembershipsError } = useQuery({
    queryKey: ['salesAllMemberships', queryParams, dateFilter, selectedBranchId],
    queryFn: () => salesApi.fetchAllMemberships(queryParams),
    initialData: initialData?.allMemberships ? { success: true, message: 'SSR', data: { members: initialData.allMemberships, total: initialData.allMembershipsTotal || 0 } } : undefined,
  });

  const isLoading = overviewLoading || reportLoading || pendingLoading || allMembershipsLoading;
  const isError = overviewError || reportError || pendingError || allMembershipsError;
  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  // Removed hardcoded store mock data to enforce Rule 75
  const storeOrders: StoreOrder[] = [];

  return {
    tab, setTab,
    dateFilter, setDateFilter,
    search, setSearch,
    currentPage, setCurrentPage,
    overviewData: overviewRes?.data?.monthlyRevenue || [],
    membershipReport: reportRes?.data?.report || [],
    membershipTotals: reportRes?.data?.totals || { activeCount: 0, revenue: 0 },
    pendingPayments: (pendingRes?.data?.members || []) as PendingPaymentMember[],
    pendingTotal: pendingRes?.data?.total || 0,
    allMemberships: allMembershipsRes?.data?.members || [],
    allMembershipsTotal: allMembershipsRes?.data?.total || 0,
    storeOrders,
    storeOrdersTotal: 0,
    storeSummary: null,
    fetchState,
    loadAll: async () => {}, // Mocked to do nothing since React Query handles refetching automatically
    toast: null,
    showToast
  };
}



