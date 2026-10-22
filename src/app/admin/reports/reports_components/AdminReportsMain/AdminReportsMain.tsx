// RESPONSIBILITY: Main entry point for the Reports module. Composes toolbar, tabs, KPIs, and tab content panels.
'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import { useAdminReportsStore } from '@/app/admin/reports/reports_store/useAdminReportsStore';
import { useAdminReportsLogic } from '@/app/admin/reports/reports_context/useAdminReportsLogic';
import AdminReportsTabs from '@/app/admin/reports/reports_components/AdminReportsTabs/AdminReportsTabs';
import AdminReportsKPIs from '@/app/admin/reports/reports_components/AdminReportsKPIs/AdminReportsKPIs';
import AdminReportsRevenue from '@/app/admin/reports/reports_components/AdminReportsRevenue/AdminReportsRevenue';
import AdminReportsMembership from '@/app/admin/reports/reports_components/AdminReportsMembership/AdminReportsMembership';
import AdminReportsAttendance from '@/app/admin/reports/reports_components/AdminReportsAttendance/AdminReportsAttendance';
import AdminReportsPayroll from '@/app/admin/reports/reports_components/AdminReportsPayroll/AdminReportsPayroll';
import AdminReportsPnL from '@/app/admin/reports/reports_components/AdminReportsPnL/AdminReportsPnL';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';
import { DATE_RANGE_OPTIONS } from '@/app/admin/reports/reports_utils/AdminReportsSharedConstants';
import { reportsApi } from '@/app/admin/reports/reports_api/reports_api';
import type { ReportDateRange } from '@/app/admin/reports/reports_types/reports_types';

const GYM_OPTIONS = [
  { value: 'all', label: 'All Gyms' },
  { value: 'b1', label: 'Andheri East' },
  { value: 'b2', label: 'Bandra West' },
  { value: 'b3', label: 'Powai' },
  { value: 'b4', label: 'Thane' },
];

const EXPORT_FORMAT_OPTIONS = [
  { value: 'pdf', label: 'Export as PDF' },
  { value: 'excel', label: 'Export as Excel' },
];

function ReportsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="h-12 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      <div className="h-80 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
    </div>
  );
}

export default function AdminReportsMain() {
  const { activeTab, dateRange, setDateRange, startDate, endDate, setCustomDateRange, selectedGymId, setSelectedGymId } = useAdminReportsStore();
  const { fetchState } = useAdminReportsLogic();
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>('pdf');

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await reportsApi.exportReport({ tab: activeTab, format: exportFormat });
      if (res.success && res.data?.url && res.data.url !== '#') {
        const link = document.createElement('a');
        link.href = res.data.url;
        link.download = `report-${activeTab}-${dateRange}.${exportFormat === 'excel' ? 'xlsx' : 'pdf'}`;
        link.click();
      } else {
        // Mock: show browser print dialog as PDF fallback
        if (exportFormat === 'pdf') window.print();
      }
    } finally {
      setExporting(false);
    }
  };

  if (fetchState === 'loading') return <ReportsSkeleton />;

  return (
    <div className="min-h-full pb-10">
      <AdminHeader title="Reports" subtitle="Consolidated cross-gym analytics and performance reports" />
      <div className="p-6 space-y-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="w-44">
              <AdminSearchableDropdown
                options={GYM_OPTIONS}
                value={selectedGymId}
                onChange={(v) => setSelectedGymId(v as string)}
                placeholder="All Gyms"
              />
            </div>
            <div className="w-44">
              <AdminSearchableDropdown
                options={DATE_RANGE_OPTIONS}
                value={dateRange}
                onChange={(v) => { setDateRange(v as ReportDateRange); if (v !== 'custom') setCustomDateRange('', ''); }}
                placeholder="Date Range"
              />
            </div>
            {dateRange === 'custom' && (
              <div className="flex items-center gap-2 flex-wrap">
                <input type="date" value={startDate} onChange={(e) => setCustomDateRange(e.target.value, endDate)}
                  className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Start date" />
                <span className="text-secondary text-sm">to</span>
                <input type="date" value={endDate} onChange={(e) => setCustomDateRange(startDate, e.target.value)}
                  className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="End date" />
              </div>
            )}
          </div>

          {/* Export Controls */}
          <div className="flex items-center gap-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Export format"
            >
              {EXPORT_FORMAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-input border border-border rounded-lg text-sm font-medium text-secondary hover:text-foreground hover:border-primary motion-safe:transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {exporting
                ? <><Loader2 size={15} className="motion-safe:animate-spin" /> Exporting...</>
                : <><Download size={15} /> Export</>
              }
            </button>
          </div>
        </div>

        {/* KPIs */}
        <AdminReportsKPIs />

        {/* Tabs */}
        <AdminReportsTabs />

        {/* Tab Content */}
        {activeTab === 'revenue' && <AdminReportsRevenue />}
        {activeTab === 'membership' && <AdminReportsMembership />}
        {activeTab === 'attendance' && <AdminReportsAttendance />}
        {activeTab === 'payroll' && <AdminReportsPayroll />}
        {activeTab === 'pnl' && <AdminReportsPnL />}

      </div>
    </div>
  );
}
