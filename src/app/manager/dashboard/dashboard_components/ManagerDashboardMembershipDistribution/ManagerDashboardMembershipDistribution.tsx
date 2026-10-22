// RESPONSIBILITY: Renders the distribution of members by plan on the dashboard.
'use client';

import { useDashboardContext } from '@/app/manager/dashboard/dashboard_context/ManagerDashboardContext';
import { DASHBOARD_PLAN_BG_COLORS } from '@/app/manager/dashboard/dashboard_utils/ManagerDashboardSharedConstants';

export default function ManagerDashboardMembershipDistribution() {
 const { stats, timeRange } = useDashboardContext();
 if (!stats) return null;
 const s = stats;

 const timeMultiplier = timeRange === 'weekly' ? 0.25 : timeRange === 'yearly' ? 12 : timeRange === 'custom' ? 1.5 : 1;

 const total = (s.membersByPlan || []).reduce((a, b) => a + Math.round(b.count * timeMultiplier), 0);

 return (
 <div className="rounded-xl shadow-sm border p-5 bg-card border-border">
 <h2 className="font-semibold mb-4 text-primary">Membership Distribution</h2>
 <div className="flex flex-wrap gap-3">
 {(s.membersByPlan || []).map((p) => {
 const scaledCount = Math.round(p.count * timeMultiplier);
 const pct = total > 0 ? Math.round((scaledCount / total) * 100) : 0;
 const bgStyle = DASHBOARD_PLAN_BG_COLORS[p.plan] || 'bg-secondary';
 return (
 <div key={p.plan} className="flex-1 min-w-40 rounded-lg p-4 bg-input">
 <div className="flex items-center gap-2 mb-2">
 <div className={`w-3 h-3 rounded-full ${bgStyle}`} />
 <span className="text-sm font-medium text-primary">{p.plan}</span>
 </div>
 <div className="text-2xl font-bold text-primary">{scaledCount}</div>
 <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-border">
 <div className={`h-full rounded-full ${bgStyle}`} style={{ width: `${pct}%` }} />
 </div>
 <div className="text-xs mt-1 text-secondary">{pct}% of total</div>
 </div>
 );
 })}
 {(s.membersByPlan || []).length === 0 && (
 <p className="text-sm py-4 text-secondary">No data available yet.</p>
 )}
 </div>
 </div>
 );
}
