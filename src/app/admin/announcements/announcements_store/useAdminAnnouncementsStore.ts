// RESPONSIBILITY: Zustand store for Announcements UI state — filters, pagination, modal.
import { create } from 'zustand';
import type { Announcement, AnnouncementFormValues } from '@/app/admin/announcements/announcements_types/announcements_types';
import { EMPTY_ANNOUNCEMENT_FORM } from '@/app/admin/announcements/announcements_utils/AdminAnnouncementsSharedConstants';

interface AdminAnnouncementsStore {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  priorityFilter: string;
  setPriorityFilter: (v: string) => void;
  gymFilter: string;
  setGymFilter: (v: string) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  editingAnnouncement: Announcement | null;
  setEditingAnnouncement: (a: Announcement | null) => void;
  form: AnnouncementFormValues;
  setForm: (f: AnnouncementFormValues) => void;
}

export const useAdminAnnouncementsStore = create<AdminAnnouncementsStore>((set) => ({
  search: '',
  setSearch: (v) => set({ search: v, currentPage: 1 }),
  statusFilter: 'all',
  setStatusFilter: (v) => set({ statusFilter: v, currentPage: 1 }),
  priorityFilter: 'all',
  setPriorityFilter: (v) => set({ priorityFilter: v, currentPage: 1 }),
  gymFilter: 'all',
  setGymFilter: (v) => set({ gymFilter: v, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (v) => set({ currentPage: v }),
  showModal: false,
  setShowModal: (v) => set({ showModal: v }),
  editingAnnouncement: null,
  setEditingAnnouncement: (a) => set({ editingAnnouncement: a }),
  form: EMPTY_ANNOUNCEMENT_FORM,
  setForm: (f) => set({ form: f }),
}));
