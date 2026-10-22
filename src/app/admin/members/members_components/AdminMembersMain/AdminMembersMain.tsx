// RESPONSIBILITY: Main entry point for Admin Members module. Composes KPIs, toolbar, table, and profile drawer.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminMembersKPIs from '@/app/admin/members/members_components/AdminMembersKPIs/AdminMembersKPIs';
import AdminMembersToolbar from '@/app/admin/members/members_components/AdminMembersToolbar/AdminMembersToolbar';
import AdminMembersTable from '@/app/admin/members/members_components/AdminMembersTable/AdminMembersTable';
import AdminMembersProfileDrawer from '@/app/admin/members/members_components/AdminMembersProfileDrawer/AdminMembersProfileDrawer';
import { useAdminMembersLogic } from '@/app/admin/members/members_context/useAdminMembersLogic';

export default function AdminMembersMain() {
  const { selectedMember, setSelectedMember } = useAdminMembersLogic();

  return (
    <div className="min-h-full pb-10 bg-background text-foreground">
      <AdminHeader
        title="Members Overview"
        subtitle="Cross-branch member analytics, expiry tracking, and outstanding dues"
      />
      <div className="p-6 space-y-5">
        <AdminMembersKPIs />
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          <AdminMembersToolbar />
          <AdminMembersTable />
        </div>
      </div>

      {selectedMember && (
        <AdminMembersProfileDrawer
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
