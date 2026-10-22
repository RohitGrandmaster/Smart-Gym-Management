// RESPONSIBILITY: Server component page for Admin Members. Passes no initial data (client-side fetch via hook).
import AdminMembersMain from '@/app/admin/members/members_components/AdminMembersMain/AdminMembersMain';

export const metadata = { title: 'Members — Admin | Smart Gym 360' };

export default function AdminMembersPage() {
  return <AdminMembersMain />;
}
