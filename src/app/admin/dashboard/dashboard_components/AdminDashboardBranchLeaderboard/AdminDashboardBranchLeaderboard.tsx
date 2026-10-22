'use client';

import { useAdminDashboardLogic } from '@/app/admin/dashboard/dashboard_context/useAdminDashboardLogic';
import { useAdminGlobalStore } from '@/app/admin/admin_store/useAdminGlobalStore';
import { TrendingUp, TrendingDown, Minus, Building2 } from 'lucide-react';

export default function AdminDashboardBranchLeaderboard() {
  const { stats } = useAdminDashboardLogic();
  const { selectedBranchId } = useAdminGlobalStore();
  
  if (!stats?.branchLeaderboard) return null;

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
          <Building2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Branch Leaderboard</h2>
          <p className="text-xs text-secondary">Top performing locations by revenue</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold text-secondary uppercase tracking-wider">
              <th className="pb-3 pl-2">Branch Name</th>
              <th className="pb-3 text-right">Revenue</th>
              <th className="pb-3 text-right">Active Members</th>
              <th className="pb-3 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stats.branchLeaderboard.map((branch, idx) => {
              const isSelected = selectedBranchId === branch.id;
              return (
              <tr 
                key={branch.id} 
                className={`transition-colors group ${isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-white/5'}`}
              >
                <td className="py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-secondary w-4">{idx + 1}.</span>
                    <span className="text-sm font-semibold text-foreground">{branch.name}</span>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <span className="text-sm font-bold text-success">
                    {branch.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="text-sm font-medium text-foreground">{branch.activeMembers}</span>
                </td>
                <td className="py-3 text-center">
                  <div className="flex justify-center">
                    {branch.trend === 'up' && <TrendingUp size={16} className="text-success" />}
                    {branch.trend === 'down' && <TrendingDown size={16} className="text-danger" />}
                    {branch.trend === 'flat' && <Minus size={16} className="text-secondary" />}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
