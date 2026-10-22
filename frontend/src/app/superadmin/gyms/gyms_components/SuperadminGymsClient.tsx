'use client';
// RESPONSIBILITY: Root orchestrator for the Gyms page. Renders the layout, toolbar, and table.
import '@/app/superadmin/gyms/gyms.css';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import SuperadminGymsToolbar from '@/app/superadmin/gyms/gyms_components/SuperadminGymsToolbar/SuperadminGymsToolbar';
import SuperadminGymsTable from '@/app/superadmin/gyms/gyms_components/SuperadminGymsTable/SuperadminGymsTable';


export default function SuperadminGymsClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tenants (Gyms)</h1>
          <p className="text-secondary mt-1">Manage your SaaS clients, subscriptions, and access.</p>
        </div>
        <Link 
          href={SuperadminUrlConfig.PAGES.GYM_ADD}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium motion-safe:transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Onboard New Gym
        </Link>
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <SuperadminGymsToolbar />
        <SuperadminGymsTable />
      </div>
    </div>
  );
}
