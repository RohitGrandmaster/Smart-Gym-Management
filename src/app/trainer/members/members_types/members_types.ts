// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Members module. Single source of truth for member data shapes.
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import type { MessageType, TrainerMessageRecipient } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerMessageModal';
import type { MemberFormValues } from '@/app/trainer/members/members_utils/MembersSharedConstants';

import type { Member, MemberStats, FetchState, Workout, DietPlan } from '@/app/trainer/trainer_types/trainer_types';

export interface MembersInitialData {
  members: Member[];
  stats: MemberStats;
  totalMembers: number;
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
  profileTab: 'overview' | 'fitness' | 'progress' | 'workout' | 'diet' | 'attendance';
  setProfileTab: (tab: 'overview' | 'fitness' | 'progress' | 'workout' | 'diet' | 'attendance') => void;

  // Add/Edit Modal
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  editId: string | null;
  editData: MemberFormValues | null;

  // Actions
  openAdd: () => void;
  openEdit: (m: Member) => void;
  saveMember: (data: MemberFormValues) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  assignWorkout: (memberId: string, workout: Workout | null) => Promise<void>;
  assignDiet: (memberId: string, diet: DietPlan | null) => Promise<void>;

  // Message Modal
  msgModal: { open: boolean; recipient: TrainerMessageRecipient; type: MessageType; message: string; subject?: string } | null;
  openMsg: (m: Member, type: MessageType) => void;
  closeMsg: () => void;
}

