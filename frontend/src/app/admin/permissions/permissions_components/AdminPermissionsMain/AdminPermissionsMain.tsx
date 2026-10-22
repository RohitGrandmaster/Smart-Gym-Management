// RESPONSIBILITY: Main entry point for the Permissions module. Composes toolbar, role cards, matrix, and gym overrides panel.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import { useAdminPermissionsLogic } from '@/app/admin/permissions/permissions_context/useAdminPermissionsLogic';
import AdminPermissionsToolbar from '@/app/admin/permissions/permissions_components/AdminPermissionsToolbar/AdminPermissionsToolbar';
import AdminPermissionsRoleCard from '@/app/admin/permissions/permissions_components/AdminPermissionsRoleCard/AdminPermissionsRoleCard';
import AdminPermissionsMatrix from '@/app/admin/permissions/permissions_components/AdminPermissionsMatrix/AdminPermissionsMatrix';
import AdminPermissionsGymOverride from '@/app/admin/permissions/permissions_components/AdminPermissionsGymOverride/AdminPermissionsGymOverride';

function PermissionsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map(i => <div key={i} className="h-24 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="h-12 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      <div className="h-96 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
    </div>
  );
}

export default function AdminPermissionsMain() {
  const { fetchState } = useAdminPermissionsLogic();

  if (fetchState === 'loading') return <PermissionsSkeleton />;

  return (
    <div className="min-h-full pb-10">
      <AdminHeader
        title="Permissions"
        subtitle="Define what each role can access across your gyms"
      />
      <div className="p-6 space-y-6">

        {/* Role Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminPermissionsRoleCard role="manager" />
          <AdminPermissionsRoleCard role="trainer" />
        </div>

        {/* Toolbar: role tabs + gym scope */}
        <AdminPermissionsToolbar />

        {/* Main content: matrix + gym overrides sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AdminPermissionsMatrix />
          </div>
          <div>
            <AdminPermissionsGymOverride />
          </div>
        </div>

      </div>
    </div>
  );
}
