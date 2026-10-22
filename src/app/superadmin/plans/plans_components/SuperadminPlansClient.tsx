// RESPONSIBILITY: SuperadminPlansClient.tsx is the root client entry for the Plans page. Initialises the Zustand store on mount.
'use client';

import { useEffect } from 'react';
import { useSuperadminPlansStore } from '@/app/superadmin/plans/plans_store/useSuperadminPlansStore';
import SuperadminPlansList from '@/app/superadmin/plans/plans_components/SuperadminPlansList';
import SuperadminPlanCreateModal from '@/app/superadmin/plans/plans_components/SuperadminPlanCreateModal';
import SuperadminPlanEditModal from '@/app/superadmin/plans/plans_components/SuperadminPlanEditModal';

export default function SuperadminPlansClient() {
  const openCreateModal = useSuperadminPlansStore(state => state.openCreateModal);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
          <p className="text-secondary mt-1">Manage pricing tiers and limits for SaaS tenants.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover motion-safe:transition-colors motion-safe:active:scale-95"
        >
          Create New Plan
        </button>
      </div>

      <SuperadminPlansList />
      <SuperadminPlanCreateModal />
      <SuperadminPlanEditModal />
    </div>
  );
}
