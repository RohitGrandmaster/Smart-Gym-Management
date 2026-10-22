// RESPONSIBILITY: Renders the Attendance report tab — attendance summary and heatmap-style grid per gym.
'use client';

import { useAdminReportsLogic } from '@/app/admin/reports/reports_context/useAdminReportsLogic';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getHeatColor(rate: number): string {
  if (rate >= 80) return 'bg-success text-white';
  if (rate >= 60) return 'bg-warning text-white';
  if (rate >= 40) return 'bg-info text-white';
  return 'bg-danger-bg text-danger border border-danger/20';
}

export default function AdminReportsAttendance() {
  const { reportData } = useAdminReportsLogic();
  if (!reportData) return null;

  return (
    <div className="space-y-6">
      {/* Summary Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Attendance Summary by Gym</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5">
                {['Gym', 'Avg Daily Check-ins', 'Total Check-ins', 'Attendance Rate', 'Peak Day'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportData.attendanceSummary.map((row) => (
                <tr key={row.gymId} className="hover:bg-primary/5 motion-safe:transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{row.gymName}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{row.avgDailyAttendance}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{row.totalCheckIns.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-input rounded-full max-w-24">
                        <div className="h-2 bg-success rounded-full" style={{ width: `${row.attendanceRate}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{row.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-subtle text-primary">{row.peakDay}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Attendance Heatmap (Simulated by Day)</h2>
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success inline-block" /> High (80%+)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning inline-block" /> Med (60%+)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-info inline-block" /> Low (40%+)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-danger-bg border border-danger/20 inline-block" /> Poor</span>
          </div>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-secondary uppercase tracking-wider pb-3 pr-4 w-32">Gym</th>
                {DAYS.map(d => (
                  <th key={d} className="text-center text-xs font-semibold text-secondary uppercase tracking-wider pb-3 px-1">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-2">
              {reportData.attendanceSummary.map((gym, gi) => (
                <tr key={gym.gymId}>
                  <td className="text-sm font-medium text-foreground pr-4 py-1">{gym.gymName}</td>
                  {DAYS.map((_, di) => {
                    // Simulate day-level rates from the gym's overall rate with variance
                    const variance = (di % 3 - 1) * 8 + (gi % 2) * 5;
                    const rate = Math.min(100, Math.max(10, gym.attendanceRate + variance));
                    return (
                      <td key={di} className="px-1 py-1">
                        <div className={`w-full h-9 rounded-lg flex items-center justify-center text-xs font-bold ${getHeatColor(rate)}`}>
                          {rate.toFixed(0)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
