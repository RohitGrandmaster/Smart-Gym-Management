// RESPONSIBILITY: Renders the full permission toggle matrix grouped by feature group for the active role + scope.
'use client';

import { useAdminPermissionsLogic } from '@/app/admin/permissions/permissions_context/useAdminPermissionsLogic';
import { useAdminPermissionsStore } from '@/app/admin/permissions/permissions_store/useAdminPermissionsStore';
import { PERMISSION_FEATURES, PERMISSION_GROUPS } from '@/app/admin/permissions/permissions_utils/AdminPermissionsSharedConstants';
import type { RoleType } from '@/app/admin/permissions/permissions_types/permissions_types';

export default function AdminPermissionsMatrix() {
  const { getEffectivePermissions, updateRolePermission, updateGymOverride, saving } = useAdminPermissionsLogic();
  const { activeRole, selectedGymId } = useAdminPermissionsStore();

  const perms = getEffectivePermissions(selectedGymId, activeRole);

  const handleToggle = (key: string, current: boolean) => {
    if (selectedGymId === 'default') {
      updateRolePermission(activeRole as RoleType, key, !current);
    } else {
      updateGymOverride(selectedGymId, activeRole as RoleType, key, !current);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground capitalize">
            {activeRole} Permissions
            {selectedGymId !== 'default' && <span className="ml-2 text-xs text-warning bg-warning-bg px-2 py-0.5 rounded-full border border-warning/20">Gym Override</span>}
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            {selectedGymId === 'default' ? 'Changes apply to all gyms by default' : 'Changes override defaults for this gym only'}
          </p>
        </div>
        {saving && <span className="text-xs text-secondary animate-pulse">Saving...</span>}
      </div>

      <div className="divide-y divide-border">
        {PERMISSION_GROUPS.map((group) => {
          const features = PERMISSION_FEATURES.filter(f => f.group === group);
          const groupEnabled = features.filter(f => perms[f.key]).length;

          return (
            <div key={group}>
              {/* Group Header */}
              <div className="px-5 py-3 bg-input/50 flex items-center justify-between">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">{group}</span>
                <span className="text-xs text-secondary">{groupEnabled}/{features.length} enabled</span>
              </div>

              {/* Feature Rows */}
              {features.map((feature) => {
                const isEnabled = perms[feature.key] ?? false;
                return (
                  <div
                    key={feature.key}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-primary/5 motion-safe:transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-foreground">{feature.label}</p>
                      <p className="text-xs text-secondary mt-0.5">{feature.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(feature.key, isEnabled)}
                      disabled={saving}
                      aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${feature.label}`}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed ${
                        isEnabled ? 'bg-primary' : 'bg-input border border-border'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 motion-safe:transition motion-safe:duration-200 ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
