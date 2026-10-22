// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Members module. Single source of truth for member data shapes.
import type { Plan } from '@/app/manager/plans/plans_types/ManagerPlansTypes';
import type { Payment } from '@/app/manager/finance/finance_types/ManagerFinanceTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { MessageType, ManagerMessageRecipient } from '@/app/manager/manager_components/ManagerFeedback/ManagerMessageModal';
import type { ManagerReceiptData } from '@/app/manager/manager_components/ManagerShared/ManagerThermalReceipt';
import type { MemberFormValues } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import type { DietPlan } from '@/app/manager/library/library_types/ManagerLibraryTypes';
import type { Workout } from '@/app/manager/workout/workout_types/ManagerWorkoutTypes';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface MembersInitialData {
  members: Member[];
  plans: Plan[];
  stats: MemberStats;
  totalMembers: number;
}

export interface Member {
  id: string; name: string; email: string; phone: string;
  gender: string; address?: string; aadhaar?: string; branch: string;
  planId: string; plan?: { id: string; name: string; tier: string };
  billingCycle: string; status: string;
  joinDate: string; expiryDate: string;
  paidAmount: number; pendingAmount: number; advanceAmount?: number; photo?: string;
  createdAt: string;
  assignedDietId?: string;
  assignedDiet?: DietPlan;
  assignedWorkoutId?: string;
  assignedWorkout?: Workout;
  medicalHistory?: string;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  isPT?: boolean;
}

export interface MemberStats {
  total: number; active: number; pending: number; expired: number;
}

/** Extends Plan with an optional per-day custom price used in the billing cycle calculator. */
export interface PlanWithCustom extends Plan {
  priceCustom?: number;
}

export interface MembersContextType {
  search: string;
  debouncedSearch: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;

  toast: { message: string; type: ToastType } | null;
  showToast: (msg: string, t: ToastType) => void;
  hideToast: () => void;

  // Member Profile
  selectedMember: Member | null;
  setSelectedMember: (m: Member | null) => void;
  profileTab: 'overview' | 'attendance' | 'payments' | 'workout' | 'diet';
  setProfileTab: (tab: 'overview' | 'attendance' | 'payments' | 'workout' | 'diet') => void;

  // Add/Edit Modal
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  editId: string | null;
  editData: MemberFormValues | null;

  // Renew Modal
  showRenewModal: boolean;
  setShowRenewModal: (show: boolean) => void;

  // Add Payment Modal
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;

  // Actions
  openAdd: () => void;
  openEdit: (m: Member) => void;
  saveMember: (data: MemberFormValues) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  assignDiet: (memberId: string, diet: DietPlan | null) => Promise<void>;
  assignWorkout: (memberId: string, workout: Workout | null) => Promise<void>;
  renewMember: (data: { planId: string; newExpiryDate: string; amountPaid: number; paymentMethod: string; billingCycle: string; customDays?: number }) => Promise<void>;
  recordPayment: (data: { amount: number; method: string }) => Promise<void>;
  freezeMember: (isFrozen: boolean) => Promise<void>;
  toggleSuspend: (isSuspended: boolean) => Promise<void>;
  assignTrainer: (memberId: string, trainerId: string, trainerName: string, isPT: boolean) => Promise<void>;
  trainers: { id: string; name: string; role: string }[];

  // Message Modal
  msgModal: { open: boolean; recipient: ManagerMessageRecipient; type: MessageType; message: string; subject?: string } | null;
  openMsg: (m: Member, type: MessageType) => void;
  closeMsg: () => void;

  // Receipt Printing
  printData: ManagerReceiptData | null;
  handlePrint: (p: Payment) => void;
  handleSharePaymentWhatsApp: (p: Payment) => void;
  setPrintData: (data: ManagerReceiptData | null) => void;
}
