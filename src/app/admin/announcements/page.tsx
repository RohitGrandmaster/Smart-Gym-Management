import type { Metadata } from 'next';
import AdminAnnouncementsMain from '@/app/admin/announcements/announcements_components/AdminAnnouncementsMain/AdminAnnouncementsMain';

export const metadata: Metadata = {
  title: 'Announcements | Admin - GymSmart',
  description: 'Broadcast notices and announcements to members, staff, and trainers.',
};

export default function AdminAnnouncementsPage() {
  return <AdminAnnouncementsMain />;
}
