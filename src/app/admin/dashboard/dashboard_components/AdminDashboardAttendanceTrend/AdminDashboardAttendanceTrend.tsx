// RESPONSIBILITY: Renders the cross-branch daily attendance trend chart using ApexCharts.
'use client';

import dynamic from 'next/dynamic';
import { CalendarCheck } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MOCK_ATTENDANCE = [
  { day: 'Mon', checkins: 312 },
  { day: 'Tue', checkins: 287 },
  { day: 'Wed', checkins: 345 },
  { day: 'Thu', checkins: 298 },
  { day: 'Fri', checkins: 378 },
  { day: 'Sat', checkins: 421 },
  { day: 'Sun', checkins: 195 },
];

export default function AdminDashboardAttendanceTrend() {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: ['#FACC15'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '55%',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: MOCK_ATTENDANCE.map((d) => d.day),
      labels: { style: { colors: '#A1A1AA', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#A1A1AA', fontSize: '12px' },
        formatter: (v) => String(Math.round(v)),
      },
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: 'dark',
      y: { formatter: (v) => `${v} check-ins` },
    },
  };

  const series = [{ name: 'Check-ins', data: MOCK_ATTENDANCE.map((d) => d.checkins) }];
  const total = MOCK_ATTENDANCE.reduce((s, d) => s + d.checkins, 0);
  const avg = Math.round(total / MOCK_ATTENDANCE.length);

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-info/20 rounded-xl">
            <CalendarCheck size={18} strokeWidth={2} className="text-info" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Weekly Attendance</h2>
            <p className="text-xs text-secondary">Cross-branch daily check-ins</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">{total.toLocaleString('en-IN')}</p>
          <p className="text-xs text-secondary">Avg {avg}/day</p>
        </div>
      </div>
      <ReactApexChart options={options} series={series} type="bar" height={220} />
    </div>
  );
}
