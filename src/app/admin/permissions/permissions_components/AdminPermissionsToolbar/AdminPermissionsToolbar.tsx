// RESPONSIBILITY: Renders the role selector tabs and gym scope selector for the Permissions module.
'use client';

import { useAdminPermissionsStore } from '@/app/admin/permissions/permissions_store/useAdminPermissionsStore';
import type { RoleType } from '@/app/admin/permissions/permissions_types/permissions_types';

const ROLES: { value: RoleType; label: string; description: string }[] = [
  { value: 'manager', label: 'Manager', description: 'Full operational access by default' },
  { value: 'trainer', label: 'Trainer', description: 'Limited to members and attendance' },
];

const GYM_OPTIONS = [
  { value: 'default', label: 'Default (All Gyms)' },
  { value: 'b1', label: 'Andheri East' },
  { value: 'b2', label: 'Bandra West' },
  { value: 'b3', label: 'Powai' },
  { value: 'b4', label: 'Thane' },
];

export default function AdminPermissionsToolbar() {
  const { activeRole, setActiveRole, selectedGymId, setSelectedGymId } = useAdminPermissionsStore();

  return (
    <div className="space-y-4">
      {/* Role Tabs */}
      <div className="flex gap-3 flex-wrap">
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => setActiveRole(role.value)}
            className={`px-5 py-3 rounded-xl border text-left motion-safe:transition-all motion-safe:duration-200 ${
              activeRole === role.value
                ? 'bg-primary-subtle border-primary text-primary'
                : 'bg-card border-border text-secondary hover:border-primary hover:text-foreground'
            }`}
          >
            <p className="text-sm font-semibold capitalize">{role.label}</p>
            <p className="text-xs mt-0.5 opacity-70">{role.description}</p>
          </button>
        ))}
      </div>

      {/* Gym Scope */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-secondary">Scope:</span>
        {GYM_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedGymId(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border motion-safe:transition-all ${
              selectedGymId === opt.value
                ? 'bg-primary-subtle text-primary border-primary'
                : 'bg-input text-secondary border-border hover:border-primary hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
        {selectedGymId !== 'default' && (
          <span className="text-xs text-warning bg-warning-bg px-2 py-1 rounded-lg border border-warning/20">
            Overrides defaults for this gym only
          </span>
        )}
      </div>
    </div>
  );
}
