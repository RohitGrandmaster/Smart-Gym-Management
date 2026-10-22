// RESPONSIBILITY: ApexCharts-based charts for each report tab — Revenue, Attendance, Members, Expenses.
'use client';

import dynamic from 'next/dynamic';
import { useReportsContext } from '@/app/manager/reports/reports_context/ManagerReportsContext';
import { EXPENSE_CATEGORY_STYLES } from '@/app/manager/reports/reports_utils/ManagerReportsSharedConstants';
import { Loader2 } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false, loading: () => (
  <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 motion-safe:animate-spin text-primary" /></div>
)});

const CHART_BASE = {
  chart: { background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
  tooltip: { theme: 'dark' as const },
  xaxis: { labels: { style: { colors: '#A1A1AA', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { style: { colors: '#A1A1AA', fontSize: '11px' } } },
  legend: { labels: { colors: '#A1A1AA' } },
};

function RevenueChart() {
  const { summary } = useReportsContext();
  const data = summary?.revenueData ?? [];

  const options = {
    ...CHART_BASE,
    chart: { ...CHART_BASE.chart, type: 'bar' as const, stacked: false },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
    colors: ['#FACC15', '#EF4444', '#22C55E'],
    xaxis: { ...CHART_BASE.xaxis, categories: data.map(d => d.month) },
    dataLabels: { enabled: false },
  };

  return (
    <Chart
      type="bar"
      height={300}
      options={options}
      series={[
        { name: 'Revenue',  data: data.map(d => d.revenue)  },
        { name: 'Expenses', data: data.map(d => d.expenses) },
        { name: 'Profit',   data: data.map(d => d.profit)   },
      ]}
    />
  );
}

function AttendanceChart() {
  const { summary } = useReportsContext();
  const data = (summary?.attendanceData ?? []).slice(-14);

  const options = {
    ...CHART_BASE,
    chart: { ...CHART_BASE.chart, type: 'area' as const },
    colors: ['#22C55E', '#EF4444'],
    fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.05 } },
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: { ...CHART_BASE.xaxis, categories: data.map(d => d.date) },
    dataLabels: { enabled: false },
  };

  return (
    <Chart
      type="area"
      height={300}
      options={options}
      series={[
        { name: 'Present', data: data.map(d => d.present) },
        { name: 'Absent',  data: data.map(d => d.absent)  },
      ]}
    />
  );
}

function MembersChart() {
  const { summary } = useReportsContext();
  const data = summary?.memberChurnData ?? [];

  const options = {
    ...CHART_BASE,
    chart: { ...CHART_BASE.chart, type: 'line' as const },
    colors: ['#22C55E', '#EF4444', '#FACC15'],
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: { ...CHART_BASE.xaxis, categories: data.map(d => d.month) },
    dataLabels: { enabled: false },
    markers: { size: 4 },
  };

  return (
    <Chart
      type="line"
      height={300}
      options={options}
      series={[
        { name: 'New Members', data: data.map(d => d.newMembers) },
        { name: 'Churned',     data: data.map(d => d.churned)    },
        { name: 'Active',      data: data.map(d => d.active)     },
      ]}
    />
  );
}

function ExpensesChart() {
  const { summary } = useReportsContext();
  const data = summary?.expenseBreakdown ?? [];

  const options = {
    ...CHART_BASE,
    chart: { ...CHART_BASE.chart, type: 'donut' as const },
    colors: ['#EF4444', '#F59E0B', '#3B82F6', '#FACC15', '#22C55E', '#C084FC', '#A1A1AA'],
    labels: data.map(d => d.category),
    legend: { position: 'bottom' as const, labels: { colors: '#A1A1AA' } },
    dataLabels: { style: { fontSize: '11px' } },
    plotOptions: { pie: { donut: { size: '65%' } } },
  };

  return (
    <Chart
      type="donut"
      height={320}
      options={options}
      series={data.map(d => d.amount)}
    />
  );
}

export default function ManagerReportsCharts() {
  const { tab, summary } = useReportsContext();

  if (!summary) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {tab === 'Revenue'    && <RevenueChart    />}
      {tab === 'Attendance' && <AttendanceChart />}
      {tab === 'Members'    && <MembersChart    />}
      {tab === 'Expenses'   && <ExpensesChart   />}
    </div>
  );
}
