// RESPONSIBILITY: Zustand store for Permissions module UI state — active role tab, selected gym for override.
import { create } from 'zustand';
import type { RoleType } from '@/app/admin/permissions/permissions_types/permissions_types';

interface AdminPermissionsStore {
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  selectedGymId: string;
  setSelectedGymId: (id: string) => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
}

export const useAdminPermissionsStore = create<AdminPermissionsStore>((set) => ({
  activeRole: 'manager',
  setActiveRole: (role) => set({ activeRole: role }),
  selectedGymId: 'default',
  setSelectedGymId: (id) => set({ selectedGymId: id }),
  saving: false,
  setSaving: (v) => set({ saving: v }),
}));
