// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { create } from 'zustand';

export interface BranchExpenseItem { id: string; label: string; amount: number; category: string; date: string; }
export interface BranchRevenueItem { id: string; label: string; amount: number; method: string; date: string; }
export interface BranchStaffMember { id: string; name: string; role: string; shift: string; status: 'active' | 'on-leave'; }
export interface BranchStudent { id: string; name: string; plan: string; status: 'active' | 'expired'; joinDate: string; }

export interface Branch {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  revenue: number;
  expenses: number;
  studentsCount: number;
  staffCount: number;
  expenseItems?: BranchExpenseItem[];
  revenueItems?: BranchRevenueItem[];
  staffList?: BranchStaffMember[];
  studentList?: BranchStudent[];
}

interface AdminGlobalState {
  selectedBranchId: string; // 'all' means aggregate view
  setSelectedBranchId: (id: string) => void;
}

export const useAdminGlobalStore = create<AdminGlobalState>((set) => ({
  selectedBranchId: 'all',
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
}));

