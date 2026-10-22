// RESPONSIBILITY: Main entry point for the Blacklist module.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminBlacklistKPIs from '@/app/admin/blacklist/blacklist_components/AdminBlacklistKPIs/AdminBlacklistKPIs';
import AdminBlacklistToolbar from '@/app/admin/blacklist/blacklist_components/AdminBlacklistToolbar/AdminBlacklistToolbar';
import AdminBlacklistTable from '@/app/admin/blacklist/blacklist_components/AdminBlacklistTable/AdminBlacklistTable';
import AdminBlacklistModal from '@/app/admin/blacklist/blacklist_components/AdminBlacklistModal/AdminBlacklistModal';

export default function AdminBlacklistMain() {
  return (
    <div className="min-h-full pb-10">
      <AdminHeader title="Blacklist" subtitle="Manage cross-gym member bans — global or branch-specific" />
      <div className="p-6 space-y-5">
        <AdminBlacklistKPIs />
        <AdminBlacklistToolbar />
        <AdminBlacklistTable />
      </div>
      <AdminBlacklistModal />
    </div>
  );
}
