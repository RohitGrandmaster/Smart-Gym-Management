// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { create } from 'zustand';
import { EMPTY_SETTINGS_FORM } from '@/app/admin/settings/settings_utils/SettingsSharedConstants';

interface AdminSettingsStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  form: typeof EMPTY_SETTINGS_FORM;
  setForm: (form: typeof EMPTY_SETTINGS_FORM) => void;
}

export const useAdminSettingsStore = create<AdminSettingsStore>((set) => ({
  activeTab: 'Gym Profile',
  setActiveTab: (tab) => set({ activeTab: tab }),
  form: EMPTY_SETTINGS_FORM,
  setForm: (form) => set({ form }),
}));

