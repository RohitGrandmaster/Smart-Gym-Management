// RESPONSIBILITY: Defines the TypeScript types and interfaces for the HR module.
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { EMPTY_STAFF } from '@/app/manager/hr/hr_utils/ManagerHrSharedConstants';
import React from 'react';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface HrInitialData {
  staff: Staff[];
  payrolls: Payroll[];
  summary: HrSummary | null;
}

export interface HrContextType {
 staff: Staff[];
 payrolls: Payroll[];
 summary: HrSummary | null;
 fetchState: FetchState;
 error: string;
  toast: { message: string; type: ToastType } | null;
  
  search: string;
  debouncedSearch: string;
  setSearch: (s: string) => void;
  roleFilter: string;
  setRoleFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  
  showToast: (msg: string, t: ToastType) => void;
  hideToast: () => void;
 loadAll: () => Promise<void>;
 
 // Form / Modal State
 showModal: boolean;
 setShowModal: (show: boolean) => void;
 showPayrollModal: boolean;
 setShowPayrollModal: (show: boolean) => void;
 paymentModal: { payrollId: string; staffName: string; pendingAmount: number; } | null;
 setPaymentModal: (modal: { payrollId: string; staffName: string; pendingAmount: number; } | null) => void;
 editId: string | null;
 editData: Partial<Staff> | null;
 viewProfileData: Staff | null;
 setViewProfileData: (s: Staff | null) => void;
 saving: boolean;
 
 // Actions
 openAdd: () => void;
 openEdit: (s: Staff) => void;
  openAddPayroll: () => void;
  saveStaff: (data: Partial<Staff> & { joinDate?: string | Date; salary?: string | number }) => Promise<void>;
  savePayroll: (data: Partial<Payroll> & { amount?: string | number }) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  toggleStaffStatus: (staff: Staff) => Promise<void>;
  markPayrollPaid: (id: string, amount: number) => Promise<void>;
  giveAdvance: (data: { staffId: string; amount: number; notes?: string; date?: string; paymentMode?: string }) => Promise<void>;
  payDue: (data: { staffId: string; amount: number; notes?: string; date?: string; paymentMode?: string }) => Promise<void>;
 payrollMonth: string;
 setPayrollMonth: (m: string) => void;
}

export interface Staff {
  id: string; name: string; email: string; phone: string;
  role: string; salary: number; branch: string; gender: string;
  address?: string; aadhaar?: string; upiId?: string; advanceSalary?: number; joinDate: string; isActive: boolean;
  salaryType?: 'Monthly' | 'Daily'; paymentCycle?: string; currentDue?: number;
}
export interface Payroll {
  id: string; staffId: string; month: string; amount: number;
  paidAmount: number; pendingAmount: number;
  status: string; paidAt?: string; notes?: string;
  staff?: { name: string; role: string };
}
export interface HrSummary {
  totalSalaryThisMonth: number;
  totalSalaryPaid: number;
  totalSalaryDue: number;
  totalAdvanceGiven: number;
  pendingPaymentsCount: number;
  totalStaff: number;
  activeStaff: number;
  totalPayrollThisMonth: number;
  paidCount: number;
}

export interface LedgerEntry {
  id: string;
  staffId: string;
  date: string;
  type: 'Salary Generated' | 'Salary Paid' | 'Advance Given' | 'Due Paid';
  credit: number;
  debit: number;
  balance: number;
  notes?: string;
  referenceNo?: string;
  paymentMode?: string;
}
