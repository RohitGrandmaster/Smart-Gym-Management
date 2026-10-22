// RESPONSIBILITY: Defines all types for the Admin Sales & Reports module — membership, payments, store sales.
import { type SalesTab, type DateFilter } from '@/app/admin/sales/sales_utils/AdminSalesSharedConstants';
import type { ToastType } from '@/app/admin/admin_components/AdminFeedback/AdminToast';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

// ------- Membership Types -------
export interface Member {
  id: string; name: string; email: string; phone: string;
  gender: string; address?: string; branch: string;
  planId: string; plan?: { id: string; name: string; tier: string };
  billingCycle: string; status: string;
  joinDate: string; expiryDate: string;
  paidAmount: number; pendingAmount: number; photo?: string;
  createdAt: string;
}

export type PendingPaymentMember = Omit<Member, 'plan'> & {
  plan?: string;
  pendingAmount?: number;
  daysOverdue?: number;
};

export interface OverviewDataPoint {
  date: string;
  revenue: number;
}

export interface MembershipReportItem {
  id?: number;
  name?: string;
  totalMembers?: number;
  activeMembers?: number;
  revenue?: number;
  plan?: string;
  receivable?: number;
  received?: number;
  remaining?: number;
  refund?: number;
}

export interface MembershipTotals {
  activeCount?: number;
  revenue?: number;
  totalReceivable?: number;
  totalReceived?: number;
  remaining?: number;
  refunds?: number;
}

// ------- Store Types (self-contained copy for Rule 67 compliance) -------
export interface StoreProduct {
  id: string; name: string; category: string; price: number;
  stock: number; description?: string; imageUrl?: string; isActive: boolean;
}
export interface StoreOrderItem {
  id: string; qty: number; price: number;
  product: { name: string };
}
export interface StoreOrder {
  id: string; total: number; method: string; status: string;
  notes?: string; createdAt: string;
  items?: StoreOrderItem[];
}
export interface StoreSummary {
  totalProducts: number; totalOrders: number;
  totalRevenue: number; lowStockProducts: StoreProduct[];
}

// ------- Aggregate Data Shapes -------
export interface SalesInitialData {
  overviewData?: OverviewDataPoint[];
  membershipReport?: MembershipReportItem[];
  membershipTotals?: MembershipTotals;
  pendingPayments?: PendingPaymentMember[];
  pendingTotal?: number;
  allMemberships?: Member[];
  allMembershipsTotal?: number;
  storeOrders?: StoreOrder[];
  storeOrdersTotal?: number;
  storeSummary?: StoreSummary | null;
}

export interface SalesContextType {
  tab: SalesTab;
  setTab: (tab: SalesTab) => void;
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
  search: string;
  setSearch: (search: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;

  overviewData: OverviewDataPoint[];
  membershipReport: MembershipReportItem[];
  membershipTotals: MembershipTotals;
  pendingPayments: PendingPaymentMember[];
  pendingTotal: number;
  allMemberships: Member[];
  allMembershipsTotal: number;
  storeOrders: StoreOrder[];
  storeOrdersTotal: number;
  storeSummary: StoreSummary | null;

  fetchState: FetchState;
  loadAll: () => Promise<void>;

  toast: { message: string; type: ToastType } | null;
  showToast: (message: string, type: ToastType) => void;
}

