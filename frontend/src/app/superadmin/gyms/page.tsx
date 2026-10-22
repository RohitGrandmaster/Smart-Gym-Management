// RESPONSIBILITY: Server Component that acts as the entry point for the Tenants (Gyms) list page.
import { Metadata } from 'next';
import SuperadminGymsClient from '@/app/superadmin/gyms/gyms_components/SuperadminGymsClient';

export const metadata: Metadata = {
  title: 'Gyms | Superadmin',
  description: 'Manage SaaS clients and tenants.',
};

export default function GymsPage() {
  // In the future, server-side fetching can happen here before passing data to SuperadminGymsClient
  return (
    <SuperadminGymsClient />
  );
}

