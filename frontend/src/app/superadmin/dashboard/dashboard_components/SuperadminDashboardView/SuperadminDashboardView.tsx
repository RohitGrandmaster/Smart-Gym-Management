'use client';
// RESPONSIBILITY: SuperadminDashboardView.tsx renders the main SaaS metrics dashboard.
// Displays KPI cards with gold gradient, MRR area chart (ApexCharts), and recent onboards panel.
// Syncs time range filter to URL query params (Rule 41). No direct API calls — uses TanStack Query.
//
// DATA FLOW: superadminApi.dashboard.fetchDashboardData() → useQuery → SuperadminDashboardView → KPI + Chart JSX

import { Users, Building2, CreditCard, Activity } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import { CHART_COLORS } from '@/app/superadmin/superadmin_utils/SuperadminChartConstants';
import type {
  SaaSDashboardMetrics,
  RevenueChartData,
  TimeRange,
} from '@/app/superadmin/dashboard/superadmin_dashboard_types/superadmin_dashboard_types';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Type-safe shape of the dashboard API response data object.
 * Avoids the `any` cast that was previously on this component.
 */
interface DashboardApiData {
  metrics: SaaSDashboardMetrics;
  revenue: RevenueChartData[];
}

/**
 * Formats a number to Indian currency string: ₹1,23,456
 * @param value - Raw numeric value
 */
function formatIndianCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function SuperadminDashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Rule 41: Sync filter state to URL query params for shareable views
  const timeRangeFromUrl = (searchParams.get('range') as TimeRange) ?? 'monthly';
  const [timeRange, setTimeRange] = useState<TimeRange>(timeRangeFromUrl);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /**
   * Updates local state AND URL query param simultaneously.
   * Ensures the page URL is bookmarkable with the active time range.
   */
  const handleTimeRangeChange = useCallback((newRange: TimeRange) => {
    setTimeRange(newRange);
    if (newRange !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', newRange);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const { data: fetchRes, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'dashboard'],
    queryFn: () => superadminApi.dashboard.fetchDashboardData(),
  });

  const fetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  // Type-safe cast: the API wrapper returns ApiResponse<SaaSDashboardMetrics> but
  // the backend also returns revenue[] alongside it — typed here explicitly.
  const apiData = fetchRes?.data as unknown as DashboardApiData | undefined;

  if (fetchState === 'loading') {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-skeleton-base motion-safe:animate-pulse rounded" />
          <div className="h-4 w-96 bg-skeleton-base motion-safe:animate-pulse rounded mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={`kpi-skeleton-${i}`} className="bg-skeleton-base border border-border rounded-xl p-6 h-32 motion-safe:animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-skeleton-base border border-border rounded-xl p-6 h-80 motion-safe:animate-pulse" />
          <div className="bg-skeleton-base border border-border rounded-xl p-6 h-80 motion-safe:animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !apiData) {
    return (
      <div className="p-8 text-center text-danger font-medium">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  const { metrics, revenue: revenueChartData } = apiData;

  const timeMultiplier = timeRange === 'weekly' ? 0.25 : timeRange === 'yearly' ? 12 : timeRange === 'custom' ? 1.5 : 1;
  const mrrLabel = timeRange === 'weekly' ? 'WEEKLY RR' : timeRange === 'yearly' ? 'YEARLY RR' : timeRange === 'custom' ? 'CUSTOM RR' : 'TOTAL MRR';

  const kpiCards = [
    {
      label: mrrLabel,
      value: formatIndianCurrency(Math.round((metrics.monthlyRecurringRevenue || 0) * timeMultiplier)),
      trend: '+12%',
      trendUp: true,
      icon: CreditCard,
      colorClass: 'text-success',
      iconBgClass: 'bg-success/10',
    },
    {
      label: 'TOTAL GYMS (TENANTS)',
      value: String(metrics.totalGyms),
      trend: '+3 this week',
      trendUp: true,
      icon: Building2,
      colorClass: 'text-primary',
      iconBgClass: 'bg-primary/10',
    },
    {
      label: 'ACTIVE GYMS',
      value: String(metrics.activeGyms),
      trend: undefined,
      trendUp: true,
      icon: Activity,
      colorClass: 'text-primary',
      iconBgClass: 'bg-primary/10',
    },
    {
      label: 'TOTAL END USERS',
      value: (metrics.totalEndUsers || 0).toLocaleString('en-IN'),
      trend: '+8% vs last month',
      trendUp: true,
      icon: Users,
      colorClass: 'text-purple',
      iconBgClass: 'bg-purple/10',
    },
  ];

  const chartOptions = {
    chart: {
      type: 'area' as const,
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: [CHART_COLORS.PRIMARY],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: {
      categories: revenueChartData.map((d: RevenueChartData) => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: CHART_COLORS.TEXT_SECONDARY } },
    },
    yaxis: {
      labels: {
        style: { colors: CHART_COLORS.TEXT_SECONDARY },
        // Design §21: Indian currency formatting in chart tooltips
        formatter: (val: number) => `₹${(val / 1000).toFixed(1)}k`,
      },
    },
    grid: {
      borderColor: CHART_COLORS.BORDER,
      strokeDashArray: 4,
    },
    theme: { mode: 'dark' as const },
    tooltip: { theme: 'dark' as const },
  };

  const chartSeries = [{
    name: mrrLabel,
    data: revenueChartData.map((d: RevenueChartData) => Math.round(d.mrr * timeMultiplier)),
  }];

  return (
    <div className="space-y-6">
      {/* Page Header + Time Range Filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SaaS Overview</h1>
          <p className="text-secondary mt-1 text-sm">
            Monitor the health and growth of your Multi-Tenant SaaS platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {timeRange === 'custom' && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm font-medium text-secondary" htmlFor="dashboard-start-date">
                From:
              </label>
              <input
                id="dashboard-start-date"
                type="date"
                className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Start Date"
              />
              <label className="text-sm font-medium text-secondary ml-1" htmlFor="dashboard-end-date">
                To:
              </label>
              <input
                id="dashboard-end-date"
                type="date"
                className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="End Date"
              />
            </div>
          )}
          <select
            value={timeRange}
            aria-label="Select time range"
            onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
            className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* KPI Cards — Design §5a: gold gradient bg + trend indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              // Design §5a: Subtle premium gold gradient over bg-card
              className="relative overflow-hidden bg-card border border-border rounded-xl p-6 shadow-sm motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-200"
              style={{
                background: 'linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))',
              }}
            >
              {/* Design §5a: Icon top-left in rounded square with color bg */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-secondary font-medium text-xs uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${card.iconBgClass} flex items-center justify-center`}>
                  <Icon size={18} className={card.colorClass} />
                </div>
              </div>
              {/* Design §5a: Big number 28px bold */}
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              {/* Design §5a: Trend line below the number */}
              {card.trend && (
                <p className={`text-xs mt-2 font-medium ${card.trendUp ? 'text-success' : 'text-danger'}`}>
                  {card.trendUp ? '↑' : '↓'} {card.trend}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts + Recent Onboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR Area Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-6">{mrrLabel} Growth</h2>
          <div className="h-80 w-full">
            <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
          </div>
        </div>

        {/* Recent Onboards */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-6">Recent Onboards</h2>
          <div className="space-y-4">
            {metrics.recentOnboards.map((tenant) => {
              const planUpper = tenant.plan?.toUpperCase() ?? 'UNKNOWN';
              const planClass =
                planUpper === 'ENTERPRISE' ? 'bg-purple-bg text-purple border border-purple' :
                planUpper === 'PRO' ? 'bg-primary-subtle text-primary border border-primary' :
                (planUpper === 'STARTER' || planUpper === 'BASIC') ? 'bg-success-bg text-success border border-success' :
                'bg-input text-secondary border border-border';

              return (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-input motion-safe:transition-colors motion-safe:duration-200 cursor-default"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground truncate" title={tenant.name}>
                      {tenant.name}
                    </h3>
                    <p className="text-xs text-secondary mt-1 truncate" title={tenant.ownerName}>
                      {tenant.ownerName}
                    </p>
                  </div>
                  <div className="ml-3 text-right flex flex-col items-end shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${planClass}`}>
                      {planUpper}
                    </span>
                    <p className="text-xs text-disabled mt-2">{tenant.createdAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
