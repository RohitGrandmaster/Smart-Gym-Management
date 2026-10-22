// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Inquiries module.

import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { MessageType, ManagerMessageRecipient } from '@/app/manager/manager_components/ManagerFeedback/ManagerMessageModal';
import type { InquiryFormValues } from '@/app/manager/inquiries/inquiries_utils/ManagerInquiriesSharedConstants';

export enum FetchState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface InquiriesContextType {
  inquiries: Inquiry[];
  stats: InquiryStats | null;
  fetchState: FetchState;
  error: string;
  totalInquiries: number;
  toast: { message: string; type: ToastType } | null;
  showToast: (msg: string, t: ToastType) => void;
  hideToast: () => void;
  loadAll: () => Promise<void>;

  search: string;
  debouncedSearch: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  dateFilter: string;
  setDateFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;

  // Selection State
  selectedIds: string[];
  toggleSelectAll: (selectAll: boolean) => void;
  toggleSelectOne: (id: string) => void;
  clearSelection: () => void;

  // Modal State
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editId: string | null;
  editData: InquiryFormValues | null;
  saving: boolean;

  // Actions
  openAdd: () => void;
  openEdit: (inq: Inquiry) => void;
  saveInquiry: (data: InquiryFormValues) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;

  // Message Modal State
  msgModal: { open: boolean; recipient: ManagerMessageRecipient; type: MessageType; message: string; subject?: string } | null;
  openMsg: (inq: Inquiry, type: MessageType) => void;
  closeMsg: () => void;

  // Bulk Message Modal State
  bulkMsgModal: { open: boolean; type: MessageType; recipients: ManagerMessageRecipient[] } | null;
  openBulkMsg: (type: MessageType) => void;
  closeBulkMsg: () => void;

  convertLead: Inquiry | null;
  openConvert: (inq: Inquiry) => void;
  closeConvert: () => void;
}

export interface Inquiry {
  id: string; name: string; phone: string; email?: string;
  interest: string; status: string; source?: string;
  notes?: string; followUpDate?: string; createdAt: string;
  followUpLogs?: { date: string; note: string }[];
}

export interface InquiryStats {
  total: number; new: number; followUp: number; converted: number; lost: number;
}
