// RESPONSIBILITY: Zustand store for Gym Comparison module UI state — selected gyms for comparison.
import { create } from 'zustand';

interface AdminGymComparisonStore {
  selectedGymIds: string[];
  toggleGym: (id: string) => void;
  setSelectedGymIds: (ids: string[]) => void;
}

export const useAdminGymComparisonStore = create<AdminGymComparisonStore>((set, get) => ({
  selectedGymIds: ['b1', 'b2', 'b3', 'b4'],
  toggleGym: (id) => {
    const current = get().selectedGymIds;
    if (current.includes(id)) {
      if (current.length <= 2) return; // minimum 2 gyms required
      set({ selectedGymIds: current.filter(g => g !== id) });
    } else {
      if (current.length >= 4) return; // maximum 4 gyms
      set({ selectedGymIds: [...current, id] });
    }
  },
  setSelectedGymIds: (ids) => set({ selectedGymIds: ids }),
}));
