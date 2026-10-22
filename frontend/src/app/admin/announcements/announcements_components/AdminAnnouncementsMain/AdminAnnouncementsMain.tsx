// RESPONSIBILITY: Main orchestrator for the Announcements / Notice Board module.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminAnnouncementsKPIs from '@/app/admin/announcements/announcements_components/AdminAnnouncementsKPIs/AdminAnnouncementsKPIs';
import AdminAnnouncementsTable from '@/app/admin/announcements/announcements_components/AdminAnnouncementsTable/AdminAnnouncementsTable';
import AdminAnnouncementsModal from '@/app/admin/announcements/announcements_components/AdminAnnouncementsModal/AdminAnnouncementsModal';

export default function AdminAnnouncementsMain() {
  return (
    <div className="min-h-full pb-10">
      <AdminHeader
        title="Announcements"
        subtitle="Broadcast notices to members, managers, trainers, and staff across all gyms"
      />
      <div className="p-6 space-y-5">
        <AdminAnnouncementsKPIs />
        <AdminAnnouncementsTable />
      </div>
      <AdminAnnouncementsModal />
    </div>
  );
}
