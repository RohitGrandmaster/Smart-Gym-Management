// RESPONSIBILITY: Main entry point for the Bulk Communications module.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminBulkCommunicationsKPIs from '@/app/admin/bulk-communications/bulk_communications_components/AdminBulkCommunicationsKPIs/AdminBulkCommunicationsKPIs';
import AdminBulkCommunicationsComposer from '@/app/admin/bulk-communications/bulk_communications_components/AdminBulkCommunicationsComposer/AdminBulkCommunicationsComposer';
import AdminBulkCommunicationsHistory from '@/app/admin/bulk-communications/bulk_communications_components/AdminBulkCommunicationsHistory/AdminBulkCommunicationsHistory';
import { useAdminBulkCommunicationsLogic } from '@/app/admin/bulk-communications/bulk_communications_context/useAdminBulkCommunicationsLogic';
import type { BroadcastTab } from '@/app/admin/bulk-communications/bulk_communications_types/bulk_communications_types';

const TABS: { id: BroadcastTab; label: string }[] = [
  { id: 'compose', label: 'Compose' },
  { id: 'history', label: 'Broadcast History' },
];

export default function AdminBulkCommunicationsMain() {
  const { activeTab, setActiveTab } = useAdminBulkCommunicationsLogic();
  return (
    <div className="min-h-full pb-10">
      <AdminHeader title="Bulk Communications" subtitle="Broadcast messages across all gyms via WhatsApp, SMS, or Email" />
      <div className="p-6 space-y-5">
        <AdminBulkCommunicationsKPIs />
        <div className="flex gap-1 bg-input rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium motion-safe:transition-all ${activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'compose' ? <AdminBulkCommunicationsComposer /> : <AdminBulkCommunicationsHistory />}
      </div>
    </div>
  );
}
