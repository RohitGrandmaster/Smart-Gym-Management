// RESPONSIBILITY: Provides the implementation for ManagerFinanceTypes.ts functionality within its module.

import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { AddPaymentFormValues } from '@/app/manager/finance/finance_utils/ManagerFinanceSharedConstants';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface FinanceInitialData {
  payments: Payment[];
  totalPayments: number;
  summary: FinanceSummary | null;
}

export interface FinanceContextType {
  payments: Payment[];
  totalPayments: number;
  summary: FinanceSummary | null;
 fetchState: FetchState;
 saving: boolean;
 error: string;
 toast: { message: string; type: ToastType } | null;
 showToast: (msg: string, t: ToastType) => void;
 hideToast: () => void;
 loadAll: () => Promise<void>;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  savePayment: (data: AddPaymentFormValues) => Promise<void>;
}

export interface Payment {
  id: string; memberId: string; amount: number; method: string;
  status: string; notes?: string; invoiceNo: string; paidAt: string;
  member?: { name: string; email: string; phone: string; plan?: { name: string } };
}
export interface FinanceSummary {
  totalRevenue: number; monthlyRevenue: number; pendingAmount: number;
  totalPayments: number;
  revenueByMethod: { UPI: number; Cash: number; Card: number; NetBanking: number };
  monthlyData: { month: string; revenue: number; expenses?: number }[];
}
