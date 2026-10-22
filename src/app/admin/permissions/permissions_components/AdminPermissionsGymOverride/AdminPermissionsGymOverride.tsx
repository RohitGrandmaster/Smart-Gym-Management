// RESPONSIBILITY: Renders the gym-specific override summary panel — shows which gyms have custom overrides.
'use client';

import { Building2, AlertTriangle } from 'lucide-react';
import { useAdminPermissionsLogic } from '@/app/admin/permissions/permissions_context/useAdminPermissionsLogic';
import { useAdminPermissionsStore } from '@/app/admin/permissions/permissions_store/useAdminPermissionsStore';

export default function AdminPermissionsGymOverride() {
  const { permissionsData } = useAdminPermissionsLogic();
  const { setSelectedGymId, setActiveRole, selectedGymId } = useAdminPermissionsStore();

  const overrides = permissionsData?.gymOverrides ?? [];

  if (overrides.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Gym-Specific Overrides</h3>
        </div>
        <p className="text-xs text-secondary">No gym-specific overrides configured. All gyms use the default role permissions.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Building2 size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Gym-Specific Overrides</h3>
        <span className="ml-auto text-xs bg-warning-bg text-warning px-2 py-0.5 rounded-full border border-warning/20">{overrides.length} active</span>
      </div>
      <div className="divide-y divide-border">
        {overrides.map((override, i) => {
          const overrideCount = Object.keys(override.overrides).length;
          const isSelected = selectedGymId === override.gymId;
          return (
            <button
              key={i}
              onClick={() => { setSelectedGymId(override.gymId); setActiveRole(override.role); }}
              className={`w-full px-5 py-3.5 flex items-center gap-3 text-left hover:bg-primary/5 motion-safe:transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
            >
              <AlertTriangle size={14} className="text-warning flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{override.gymName}</p>
                <p className="text-xs text-secondary capitalize">{override.role} · {overrideCount} custom rule{overrideCount !== 1 ? 's' : ''}</p>
              </div>
              {isSelected && <span className="text-xs text-primary font-medium">Viewing</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
