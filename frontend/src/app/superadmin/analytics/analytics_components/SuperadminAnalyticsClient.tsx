'use client';
// RESPONSIBILITY: Renders the Revenue Analytics dashboard — KPI cards + ApexCharts area/bar charts.
// Pure view layer: consumes useAnalyticsPage hook. No data-fetching or business logic here.
//
// DATA FLOW: useAnalyticsPage → SuperadminAnalyticsClient → KPI Cards + Charts

import dynamic from 'next/dynamic';
import { TrendingUp, Users, IndianRupee, Activity, ArrowDownRight } from 'lucide-react';
import { useAnalyticsPage } from '@/app/superadmin/analytics/analytics_utils/useAnalyticsPage';
import { CHART_COLORS } from '@/app/superadmin/superadmin_utils/SuperadminChartConstants';

// Heavy chart component — code-split via dynamic import (Rule 15, Design §10)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function SuperadminAnalyticsClient() {
  const { metrics, monthlyData, fetchState } = useAnalyticsPage();

  if (fetchState === 'loading') {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 bg-skeleton-base motion-safe:animate-pulse rounded mb-2" />
          <div className="h-4 w-96 bg-skeleton-base motion-safe:animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={`skeleton-${i}`} className="h-32 bg-skeleton-base motion-safe:animate-pulse rounded-xl border border-border" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-skeleton-base motion-safe:animate-pulse rounded-xl border border-border" />
          <div className="h-80 bg-skeleton-base motion-safe:animate-pulse rounded-xl border border-border" />
        </div>
      </div>
    );
  }

  if (fetchState === 'error' || !metrics) {
    return (
      <div className="p-8 text-center text-danger font-medium">
        Failed to load analytics data. Please try again.
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'MRR',
      // Design §21: Indian currency — ₹1,24,500
      value: `₹${metrics.mrr.toLocaleString('en-IN')}`,
      delta: '+12% from last month',
      deltaUp: true,
      icon: IndianRupee,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      label: 'ARR',
      value: `₹${metrics.arr.toLocaleString('en-IN')}`,
      delta: '+15% from last year',
      deltaUp: true,
      icon: TrendingUp,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Churn Rate',
      value: `${metrics.churnRate}%`,
      delta: 'Target: < 2%',
      deltaUp: metrics.churnRate < 2,
      icon: ArrowDownRight,
      iconBg: 'bg-danger-bg',
      iconColor: 'text-danger',
    },
    {
      label: 'Active Tenants',
      value: String(metrics.activeTenants),
      delta: '+3 this week',
      deltaUp: true,
      icon: Users,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
  ];

  // Design §10: Area chart for MRR trend — gold line, green area fill
  const mrrAreaOptions = {
    chart: { type: 'area' as const, toolbar: { show: false }, background: 'transparent' },
    colors: [CHART_COLORS.PRIMARY],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: {
      categories: monthlyData.map((d) => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: CHART_COLORS.TEXT_SECONDARY } },
    },
    yaxis: {
      labels: {
        style: { colors: CHART_COLORS.TEXT_SECONDARY },
        // Design §21: Indian currency formatting in Y-axis
        formatter: (val: number) => `₹${(val / 1000).toFixed(0)}k`,
      },
    },
    grid: { borderColor: CHART_COLORS.BORDER, strokeDashArray: 4 },
    theme: { mode: 'dark' as const },
    tooltip: { theme: 'dark' as const },
  };

  const mrrAreaSeries = [{ name: 'MRR', data: monthlyData.map((d) => d.mrr) }];

  // Design §10: Grouped bar chart — new tenants (gold) vs churned (red)
  const tenantBarOptions = {
    chart: { type: 'bar' as const, toolbar: { show: false }, background: 'transparent' },
    colors: [CHART_COLORS.PRIMARY, CHART_COLORS.DANGER],
    plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: monthlyData.map((d) => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: CHART_COLORS.TEXT_SECONDARY } },
    },
    yaxis: { labels: { style: { colors: CHART_COLORS.TEXT_SECONDARY } } },
    grid: { borderColor: CHART_COLORS.BORDER, strokeDashArray: 4 },
    legend: {
      labels: { colors: CHART_COLORS.TEXT_SECONDARY },
      position: 'top' as const,
      horizontalAlign: 'left' as const,
    },
    theme: { mode: 'dark' as const },
    tooltip: { theme: 'dark' as const },
  };

  const tenantBarSeries = [
    { name: 'Active Tenants', data: monthlyData.map((d) => d.tenantCount) },
    { name: 'Churned', data: monthlyData.map((d) => d.churnedCount) },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
        <p className="text-secondary mt-1 text-sm">Global SaaS metrics and financial intelligence.</p>
      </div>

      {/* KPI Cards — Design §5a: gold gradient, icon, trend line */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-card border border-border p-6 rounded-xl shadow-sm motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-200"
              style={{ background: 'linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-secondary font-medium text-xs uppercase tracking-wider">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <Icon size={18} className={card.iconColor} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className={`text-xs mt-2 font-medium ${card.deltaUp ? 'text-success' : 'text-secondary'}`}>
                {card.deltaUp ? '↑' : '↓'} {card.delta}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row — Design §10: ApexCharts area + bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-6">MRR Growth Trend</h2>
          <div className="h-72">
            <Chart options={mrrAreaOptions} series={mrrAreaSeries} type="area" height="100%" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-6">Tenant Growth vs Churn</h2>
          <div className="h-72">
            <Chart options={tenantBarOptions} series={tenantBarSeries} type="bar" height="100%" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity size={18} className="text-primary" />
            </div>
            <span className="text-secondary text-xs font-medium uppercase tracking-wider">LTV (Lifetime Value)</span>
          </div>
          <p className="text-3xl font-bold text-foreground mt-3">₹{metrics.ltv.toLocaleString('en-IN')}</p>
          <p className="text-xs text-success mt-2 font-medium">↑ Per tenant average</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <IndianRupee size={18} className="text-warning" />
            </div>
            <span className="text-secondary text-xs font-medium uppercase tracking-wider">CAC (Customer Acquisition Cost)</span>
          </div>
          <p className="text-3xl font-bold text-foreground mt-3">₹{metrics.cac.toLocaleString('en-IN')}</p>
          <p className="text-xs text-secondary mt-2">LTV:CAC = {(metrics.ltv / metrics.cac).toFixed(1)}x</p>
        </div>
      </div>
    </div>
  );
}
