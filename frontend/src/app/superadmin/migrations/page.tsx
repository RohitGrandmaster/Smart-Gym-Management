// RESPONSIBILITY: Server component entry point for the Superadmin Migrations module.
import { Metadata } from 'next';
import SuperadminMigrationsClient from './migrations_components/SuperadminMigrationsClient';

export const metadata: Metadata = {
  title: 'Schema Rollouts | Superadmin Dashboard',
  description: 'Manage and track database schema migrations across all tenant instances.',
};

export default function SuperadminMigrationsPage() {
  return (
    <main className="w-full h-full bg-background min-h-screen">
      <SuperadminMigrationsClient />
    </main>
  );
}
