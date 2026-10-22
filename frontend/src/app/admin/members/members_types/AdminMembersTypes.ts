// RESPONSIBILITY: TypeScript types and interfaces for the Admin Members module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type MemberStatus = 'active' | 'expired' | 'pending' | 'frozen';

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  branchName: string;
  planName: string;
  status: MemberStatus;
  joinDate: string;
  expiryDate: string;
  pendingAmount: number;
  gender: 'Male' | 'Female' | 'Other';
  photo?: string;
}

export interface AdminMembersSummary {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  pendingMembers: number;
  expiringThisWeek: number;
  expiringThisMonth: number;
  totalOutstanding: number;
  newThisMonth: number;
}

export interface AdminMembersContextType {
  members: AdminMember[];
  summary: AdminMembersSummary | null;
  fetchState: FetchState;
  error: string;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: MemberStatus | 'all';
  setStatusFilter: (s: MemberStatus | 'all') => void;
  branchFilter: string;
  setBranchFilter: (s: string) => void;
  expiryFilter: 'all' | 'this_week' | 'this_month';
  setExpiryFilter: (s: 'all' | 'this_week' | 'this_month') => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  selectedMember: AdminMember | null;
  setSelectedMember: (m: AdminMember | null) => void;
  loadAll: () => Promise<void>;
}
