// RESPONSIBILITY: Renders the tab navigation bar for the Reports module.
'use client';

import { REPORT_TABS } from '@/app/admin/reports/reports_utils/AdminReportsSharedConstants';
import { useAdminReportsStore } from '@/app/admin/reports/reports_store/useAdminReportsStore';
import type { ReportTab } from '@/app/admin/reports/reports_types/reports_types';

export default function AdminReportsTabs() {
  const { activeTab, setActiveTab } = useAdminReportsStore();

  return (
    <div className="flex gap-1 bg-input rounded-xl p-1 overflow-x-auto custom-scrollbar">
      {REPORT_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value as ReportTab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap motion-safe:transition-all motion-safe:duration-200 ${
            activeTab === tab.value
              ? 'bg-card text-primary shadow-sm border border-border'
              : 'text-secondary hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
