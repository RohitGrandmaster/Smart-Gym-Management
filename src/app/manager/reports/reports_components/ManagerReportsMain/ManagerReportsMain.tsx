// RESPONSIBILITY: Orchestrator for the Reports module — KPIs, tab switcher, charts, table, and CSV export.
// DATA FLOW: ReportsProvider → useReportsContext → KPIs + Charts + Table
'use client';

import { ReportsProvider, useReportsContext } from '@/app/manager/reports/reports_context/ManagerReportsContext';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import ManagerReportsKPIs from '@/app/manager/reports/reports_components/ManagerReportsKPIs/ManagerReportsKPIs';
import ManagerReportsCharts from '@/app/manager/reports/reports_components/ManagerReportsCharts/ManagerReportsCharts';
import ManagerReportsTable from '@/app/manager/reports/reports_components/ManagerReportsTable/ManagerReportsTable';
import { REPORT_TABS, REPORT_DATE_RANGE_OPTIONS } from '@/app/manager/reports/reports_utils/ManagerReportsSharedConstants';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

function ReportsInner() {
  const { tab, setTab, dateRange, setDateRange, fetchState, exporting, handleExportCSV, reload } = useReportsContext();

  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Reports & Analytics" subtitle="Revenue, attendance, member churn, and expense breakdown" />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-input rounded-xl p-1">
            {REPORT_TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-lg motion-safe:transition-colors ${
                  tab === t ? 'bg-card text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
            >
              {REPORT_DATE_RANGE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={reload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-input border border-border text-secondary hover:text-foreground motion-safe:transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={handleExportCSV}
              disabled={exporting || fetchState === 'loading'}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:opacity-90 motion-safe:transition-opacity disabled:opacity-50"
            >
              {exporting ? <Loader2 size={14} className="motion-safe:animate-spin" /> : <Download size={14} />}
              Export CSV
            </button>
          </div>
        </div>

        {/* KPIs */}
        {fetchState === 'loading' ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-24 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <ManagerReportsKPIs />
        )}

        {/* Chart */}
        {fetchState === 'error' ? (
          <div className="bg-card border border-border rounded-xl py-16 text-center space-y-3">
            <p className="text-sm text-danger font-medium">Failed to load report data</p>
            <button onClick={reload} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90">
              Try Again
            </button>
          </div>
        ) : (
          <ManagerReportsCharts />
        )}

        {/* Data Table */}
        <ManagerReportsTable />
      </div>
    </div>
  );
}

export default function ManagerReportsMain() {
  return (
    <ReportsProvider>
      <ReportsInner />
    </ReportsProvider>
  );
}
