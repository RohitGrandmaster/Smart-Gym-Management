// RESPONSIBILITY: Renders a summary card showing how many permissions are enabled for a role.
'use client';

import { ShieldCheck, ShieldOff } from 'lucide-react';
import { useAdminPermissionsLogic } from '@/app/admin/permissions/permissions_context/useAdminPermissionsLogic';
import { PERMISSION_FEATURES } from '@/app/admin/permissions/permissions_utils/AdminPermissionsSharedConstants';
import type { RoleType } from '@/app/admin/permissions/permissions_types/permissions_types';

interface AdminPermissionsRoleCardProps {
  role: RoleType;
}

export default function AdminPermissionsRoleCard({ role }: AdminPermissionsRoleCardProps) {
  const { getEffectivePermissions, selectedGymId } = useAdminPermissionsLogic();
  const perms = getEffectivePermissions(selectedGymId, role);
  const total = PERMISSION_FEATURES.length;
  const enabled = Object.values(perms).filter(Boolean).length;

  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary-subtle flex items-center justify-center flex-shrink-0">
        <ShieldCheck size={22} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground capitalize">{role}</p>
        <p className="text-xs text-secondary mt-0.5">{enabled} of {total} permissions enabled</p>
        <div className="mt-2 h-1.5 bg-input rounded-full">
          <div
            className="h-1.5 bg-primary rounded-full motion-safe:transition-all"
            style={{ width: `${(enabled / total) * 100}%` }}
          />
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-2xl font-black text-primary">{enabled}</p>
        <p className="text-xs text-secondary">enabled</p>
      </div>
    </div>
  );
}
