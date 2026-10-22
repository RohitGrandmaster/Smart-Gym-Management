'use client';
// RESPONSIBILITY: Global Reports page — Revenue export (CSV/PDF), Churn analysis, Tenant health scores.
// All data imported from reports_constants. Pure view layer.
// DATA FLOW: reports_constants → SuperadminReportsClient → tabs + charts + tables

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Download, TrendingDown, HeartPulse, IndianRupee,
  AlertTriangle, CheckCircle2, XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CHART_COLORS } from '@/app/superadmin/superadmin_utils/SuperadminChartConstants';
import type { RevenueRow, ChurnRecord, TenantHealthScore, ReportsTab } from '@/app/superadmin/reports/reports_types/reports_types';
import {
  REVENUE_DATA,
  CHURN_DATA,
  HEALTH_DATA,
  GRADE_STYLES,
  PAYMENT_HEALTH_STYLES,
  TICKET_DANGER_THRESHOLD,
  TICKET_WARNING_THRESHOLD,
  KPI_CARD_GRADIENT,
} from '@/app/superadmin/reports/reports_types/reports_constants';

// Heavy chart — code-split via dynamic import (Rule 15, Design §10)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Tab = ReportsTab;

export default function SuperadminReportsClient() {
  const [tab, setTab] = useState<ReportsTab>('revenue');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-05-31');

  function handleExportCSV() {
    toast.success('Exporting CSV report... (demo)');
  }

  function handleExportPDF() {
    toast.success('Generating PDF report... (demo)');
  }

  const lastRow = REVENUE_DATA[REVENUE_DATA.length - 1] as RevenueRow;
  const totalMRR = lastRow.mrr;
  const totalChurnedRevenue = CHURN_DATA.reduce((s, c) => s + c.mrr, 0);
  const avgHealthScore = Math.round(HEALTH_DATA.reduce((s, h) => s + h.score, 0) / HEALTH_DATA.length);

  const revenueChartOptions = {
    chart: { type: 'area' as const, toolbar: { show: false }, background: 'transparent' },
    colors: [CHART_COLORS.PRIMARY, CHART_COLORS.DANGER],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 90, 100] } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: {
      categories: REVENUE_DATA.map((d) => d.month),
      axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { colors: CHART_COLORS.TEXT_SECONDARY } },
    },
    yaxis: {
      labels: {
        style: { colors: CHART_COLORS.TEXT_SECONDARY },
        formatter: (v: number) => `₹${(v / 1000).toFixed(0)}k`,
      },
    },
    grid: { borderColor: CHART_COLORS.BORDER, strokeDashArray: 4 },
    legend: { labels: { colors: CHART_COLORS.TEXT_SECONDARY }, position: 'top' as const, horizontalAlign: 'left' as const },
    theme: { mode: 'dark' as const },
    tooltip: { theme: 'dark' as const },
  };

  const revenueChartSeries = [
    { name: 'MRR', data: REVENUE_DATA.map((d) => d.mrr) },
    { name: 'Churned Revenue', data: REVENUE_DATA.map((d) => d.churnedRevenue) },
  ];

  const churnReasonCounts = CHURN_DATA.reduce<Record<string, number>>((acc, c) => {
    acc[c.reason] = (acc[c.reason] ?? 0) + 1;
    return acc;
  }, {});

  const churnPieOptions = {
    chart: { type: 'donut' as const, background: 'transparent' },
    colors: [CHART_COLORS.DANGER, CHART_COLORS.WARNING, CHART_COLORS.PRIMARY, CHART_COLORS.INFO, CHART_COLORS.SUCCESS],
    labels: Object.keys(churnReasonCounts),
    legend: { labels: { colors: CHART_COLORS.TEXT_SECONDARY }, position: 'bottom' as const },
    theme: { mode: 'dark' as const },
    tooltip: { theme: 'dark' as const },
    dataLabels: { style: { colors: ['#fff'] } },
  };

  const churnPieSeries = Object.values(churnReasonCounts);

  const avgDaysActive = Math.round(
    CHURN_DATA.reduce((s, c) => s + c.daysActive, 0) / CHURN_DATA.length
  );

  const sortedHealthData = [...HEALTH_DATA].sort((a, b) => b.score - a.score);

  function renderTicketCount(count: number) {
    const color =
      count > TICKET_DANGER_THRESHOLD
        ? 'text-danger'
        : count > TICKET_WARNING_THRESHOLD
        ? 'text-warning'
        : 'text-secondary';
    return <span className={`text-xs font-medium ${color}`}>{count}</span>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
          <p className="text-secondary mt-1 text-sm">Revenue reports, churn analysis, and tenant health scores.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-input border border-border text-secondary hover:text-foreground rounded-lg text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Download size={18} strokeWidth={2} /> CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-black font-semibold rounded-lg text-sm shadow-lg shadow-primary/20 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Download size={18} strokeWidth={2} /> PDF
          </button>
        </div>
      </div>

      {/* Summary KPIs — Design §5a: gold gradient on all cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="bg-card border border-border rounded-xl p-5 shadow-sm motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-200"
          style={{ background: KPI_CARD_GRADIENT }}
        >
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee size={18} strokeWidth={2} className="text-primary" />
            <span className="text-xs text-secondary uppercase tracking-wider">Current MRR</span>
          </div>
          <p className="text-3xl font-bold text-foreground">₹{totalMRR.toLocaleString('en-IN')}</p>
          <p className="text-xs text-success mt-1">↑ +8.6% from last month</p>
        </div>
        <div
          className="bg-card border border-border rounded-xl p-5 shadow-sm motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-200"
          style={{ background: KPI_CARD_GRADIENT }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} strokeWidth={2} className="text-danger" />
            <span className="text-xs text-secondary uppercase tracking-wider">Churned Revenue (MTD)</span>
          </div>
          <p className="text-3xl font-bold text-foreground">₹{totalChurnedRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-danger mt-1">{CHURN_DATA.length} tenants churned</p>
        </div>
        <div
          className="bg-card border border-border rounded-xl p-5 shadow-sm motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-200"
          style={{ background: KPI_CARD_GRADIENT }}
        >
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse size={18} strokeWidth={2} className="text-success" />
            <span className="text-xs text-secondary uppercase tracking-wider">Avg Health Score</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{avgHealthScore}/100</p>
          <p className="text-xs text-secondary mt-1">Across {HEALTH_DATA.length} active tenants</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-secondary font-medium">Date Range:</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-1.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        />
        <span className="text-secondary text-sm">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-1.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-input border border-border rounded-xl p-1 w-fit flex-wrap">
        {([
          { key: 'revenue' as const, label: 'Revenue Report', icon: IndianRupee },
          { key: 'churn' as const, label: 'Churn Analysis', icon: TrendingDown },
          { key: 'health' as const, label: 'Tenant Health', icon: HeartPulse },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              tab === key ? 'bg-card text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
            }`}
          >
            <Icon size={18} strokeWidth={2} /> {label}
          </button>
        ))}
      </div>

      {/* Revenue Report Tab */}
      {tab === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-foreground mb-6">MRR vs Churned Revenue</h2>
            <div className="h-72">
              <Chart options={revenueChartOptions} series={revenueChartSeries} type="area" height="100%" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-input/40">
                    {['Month', 'MRR', 'New Revenue', 'Churned', 'Net Revenue', 'Tenants'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {REVENUE_DATA.map((row: RevenueRow) => (
                    <tr key={row.month} className="hover:bg-input/30 motion-safe:transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{row.month}</td>
                      <td className="px-4 py-3 text-foreground">₹{row.mrr.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-success">+₹{row.newRevenue.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-danger">-₹{row.churnedRevenue.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">₹{row.netRevenue.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-secondary">{row.tenantCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Churn Analysis Tab */}
      {tab === 'churn' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground mb-6">Churn Reasons Breakdown</h2>
              <div className="h-64">
                <Chart options={churnPieOptions} series={churnPieSeries} type="donut" height="100%" />
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
              <h2 className="text-base font-semibold text-foreground mb-2">Churn Summary</h2>
              <div className="flex justify-between text-sm"><span className="text-secondary">Total Churned Tenants</span><span className="text-foreground font-medium">{CHURN_DATA.length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-secondary">Total Lost MRR</span><span className="text-danger font-medium">₹{totalChurnedRevenue.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-secondary">Avg Days Active Before Churn</span><span className="text-foreground font-medium">{avgDaysActive} days</span></div>
              <div className="flex justify-between text-sm"><span className="text-secondary">Top Churn Reason</span><span className="text-foreground font-medium">Too expensive</span></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-input/40">
                    {['Tenant', 'Plan', 'Churned At', 'Reason', 'Lost MRR', 'Days Active'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CHURN_DATA.map((row: ChurnRecord) => (
                    <tr key={row.id} className="hover:bg-input/30 motion-safe:transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{row.gymName}</p>
                        <p className="text-xs text-secondary">{row.ownerName}</p>
                      </td>
                      <td className="px-4 py-3 text-secondary">{row.plan}</td>
                      <td className="px-4 py-3 text-secondary">{row.churnedAt}</td>
                      <td className="px-4 py-3 text-secondary">{row.reason}</td>
                      <td className="px-4 py-3 text-danger font-medium">₹{row.mrr.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-secondary">{row.daysActive}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Health Tab */}
      {tab === 'health' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-input/40">
                  {['Tenant', 'Plan', 'Score', 'Grade', 'Members', 'Last Login', 'Payment', 'Feature Use', 'Tickets'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedHealthData.map((row: TenantHealthScore) => (
                  <tr key={row.id} className="hover:bg-input/30 motion-safe:transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{row.gymName}</td>
                    <td className="px-4 py-3 text-secondary text-xs">{row.plan}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-input rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.score >= 80 ? 'bg-success' : row.score >= 60 ? 'bg-primary' : row.score >= 40 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                        <span className="text-foreground font-medium text-xs">{row.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_STYLES[row.grade]}`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{row.memberCount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-secondary text-xs">{row.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1 text-xs font-medium ${PAYMENT_HEALTH_STYLES[row.paymentHealth]}`}>
                        {row.paymentHealth === 'GOOD' && <CheckCircle2 size={18} strokeWidth={2} />}
                        {row.paymentHealth === 'AT_RISK' && <AlertTriangle size={18} strokeWidth={2} />}
                        {row.paymentHealth === 'OVERDUE' && <XCircle size={18} strokeWidth={2} />}
                        {row.paymentHealth}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary">{row.featureUsage}%</td>
                    <td className="px-4 py-3">{renderTicketCount(row.supportTickets)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
