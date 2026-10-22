// RESPONSIBILITY: Renders the ranked leaderboard with trend arrows for the Gym Comparison module.
'use client';

import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { useAdminGymComparisonLogic } from '@/app/admin/gym-comparison/gym_comparison_context/useAdminGymComparisonLogic';
import { formatCurrency } from '@/app/admin/gym-comparison/gym_comparison_utils/AdminGymComparisonSharedConstants';

const RANK_COLORS = ['text-yellow-400', 'text-zinc-400', 'text-amber-600', 'text-secondary'];
const TREND_MAP = {
  up: { icon: TrendingUp, color: 'text-success', bg: 'bg-success-bg' },
  down: { icon: TrendingDown, color: 'text-danger', bg: 'bg-danger-bg' },
  flat: { icon: Minus, color: 'text-secondary', bg: 'bg-input' },
};

export default function AdminGymComparisonLeaderboard() {
  const { filteredGyms } = useAdminGymComparisonLogic();
  const sorted = [...filteredGyms].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Trophy size={18} className="text-primary" />
        <h2 className="text-base font-semibold text-foreground">Gym Leaderboard</h2>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((gym, idx) => {
          const TrendIcon = TREND_MAP[gym.trend].icon;
          return (
            <div key={gym.gymId} className="px-5 py-4 flex items-center gap-4 hover:bg-primary/5 motion-safe:transition-colors">
              <span className={`text-2xl font-black w-8 text-center ${RANK_COLORS[idx] ?? 'text-secondary'}`}>#{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{gym.gymName}</p>
                <p className="text-xs text-secondary mt-0.5">{gym.activeMembers} active members · {gym.staffCount} staff</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{formatCurrency(gym.revenue)}</p>
                <p className="text-xs text-secondary">{gym.profitMargin.toFixed(1)}% margin</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${TREND_MAP[gym.trend].bg}`}>
                <TrendIcon size={13} className={TREND_MAP[gym.trend].color} />
                <span className={`text-xs font-bold ${TREND_MAP[gym.trend].color}`}>
                  {gym.revenueChange > 0 ? '+' : ''}{gym.revenueChange}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
