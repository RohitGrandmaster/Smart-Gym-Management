// RESPONSIBILITY: Defines strict types for the Dashboard module, including comprehensive KPI stats and recent activity shapes.
export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type TimeRange = 'weekly' | 'monthly' | 'yearly' | 'custom';
export interface DashboardContextType { 
  stats: DashboardStats | null; 
  status: FetchState; 
  error: string;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  startDate: string;
  endDate: string;
  setCustomDateRange: (start: string, end: string) => void;
}

export interface RecentMember {
  id: string; 
  name: string; 
  plan: string | { name: string }; 
  status: string;
  joinDate: string; 
  paidAmount: number;
}

export interface RecentPayment {
  id: string; 
  invoiceNo: string; 
  amount: number; 
  method: string; 
  paidAt: string;
  member: { name: string };
}

export interface PendingPayment {
  id: string; 
  name: string; 
  pendingAmount: number; 
  expiryDate: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  totalStaff: number;
  activeStaff: number;
  totalProducts: number;
  lowStockCount: number;
  totalInquiries: number;
  newInquiries: number;
  memberGrowth: { month: string; count: number }[];
  revenueChart: { month: string; revenue: number }[];
  membersByPlan: { plan: string; count: number }[];
  membersByStatus: { active: number; pending: number; expired: number };
  todayAttendance: number;
  trainerAttendance: { present: number; total: number };
  recentMembers: RecentMember[];
  recentPayments: RecentPayment[];
  pendingPaymentsList: PendingPayment[];
  expiringMemberships: PendingPayment[];
}
