// RESPONSIBILITY: Tab switcher for Payouts module (Summary vs P&L Statement).
'use client';

import { useAdminPayoutsLogic } from '@/app/admin/payouts/payouts_context/useAdminPayoutsLogic';
import type { PayoutTab } from '@/app/admin/payouts/payouts_types/payouts_types';

const TABS: { id: PayoutTab; label: string }[] = [
  { id: 'summary', label: 'Payout Summary' },
  { id: 'pnl', label: 'P&L Statement' },
];

export default function AdminPayoutsTabs() {
  const { activeTab, setActiveTab } = useAdminPayoutsLogic();
  return (
    <div className="flex gap-1 bg-input rounded-xl p-1 w-fit">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium motion-safe:transition-all ${activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
