// RESPONSIBILITY: Server component entry point for the Superadmin Global Audit module.
import { Metadata } from 'next';
import SuperadminGlobalAuditClient from './global-audit_components/SuperadminGlobalAuditClient';

export const metadata: Metadata = {
  title: 'Global Audit Logs | Superadmin Dashboard',
  description: 'Immutable security ledger for system-wide infrastructure and billing events.',
};

export default function SuperadminGlobalAuditPage() {
  return (
    <main className="w-full h-full bg-background min-h-screen">
      <SuperadminGlobalAuditClient />
    </main>
  );
}
