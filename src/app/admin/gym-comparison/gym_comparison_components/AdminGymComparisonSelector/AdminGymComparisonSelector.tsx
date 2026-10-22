// RESPONSIBILITY: Renders the gym selector checkboxes (2–4 gyms) for the Gym Comparison module. Pulls gym list from global store.
'use client';

import { useAdminGymComparisonStore } from '@/app/admin/gym-comparison/gym_comparison_store/useAdminGymComparisonStore';
import { useAdminBranchesData } from '@/app/admin/admin_store/useAdminBranchesData';

export default function AdminGymComparisonSelector() {
  const { selectedGymIds, toggleGym } = useAdminGymComparisonStore();
  const { data: branches = [] } = useAdminBranchesData();

  return (
    <div className="bg-card rounded-xl border border-border px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-secondary whitespace-nowrap">Compare Gyms:</span>
        {branches.map((gym) => {
          const selected = selectedGymIds.includes(gym.id);
          return (
            <button
              key={gym.id}
              onClick={() => toggleGym(gym.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border motion-safe:transition-all motion-safe:duration-200 ${
                selected
                  ? 'bg-primary-subtle text-primary border-primary'
                  : 'bg-input text-secondary border-border hover:border-primary hover:text-foreground'
              }`}
            >
              {gym.name}
            </button>
          );
        })}
        <span className="text-xs text-secondary ml-auto">Select 2–4 gyms to compare</span>
      </div>
    </div>
  );
}
