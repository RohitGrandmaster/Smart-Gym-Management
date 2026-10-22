'use client';
// RESPONSIBILITY: Renders the KPI stat cards (Active Coupons, Total Redeemed) for the Coupons page. Purely presentational — receives data via props.
import { Tag, CheckCircle2, Ticket } from 'lucide-react';
interface CouponsStatsBarProps {
  activeCoupons: number;
  totalRedeemed: number;
  totalCoupons: number;
  activeKpi: 'ALL' | 'ACTIVE' | 'REDEEMED';
  onKpiClick: (kpi: 'ALL' | 'ACTIVE' | 'REDEEMED') => void;
}

export default function SuperadminCouponsStatsBar({ 
  activeCoupons, 
  totalRedeemed, 
  totalCoupons,
  activeKpi, 
  onKpiClick 
}: CouponsStatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div 
        onClick={() => onKpiClick(activeKpi === 'ALL' ? 'ALL' : 'ALL')} // Clicking "Total" always clears to ALL
        className={`bg-card border rounded-xl p-5 flex flex-col justify-center cursor-pointer motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:hover:-translate-y-1 hover:shadow-lg ${activeKpi === 'ALL' ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-secondary" />
          </div>
          <span className="text-xs font-medium text-secondary uppercase tracking-wider">Total Coupons</span>
        </div>
        <div className="text-3xl font-bold text-foreground mt-1">{totalCoupons}</div>
      </div>

      <div 
        onClick={() => onKpiClick(activeKpi === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
        className={`bg-card border rounded-xl p-5 flex flex-col justify-center cursor-pointer motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:hover:-translate-y-1 hover:shadow-lg ${activeKpi === 'ACTIVE' ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-secondary uppercase tracking-wider">Active Coupons</span>
        </div>
        <div className="text-3xl font-bold text-foreground mt-1">{activeCoupons}</div>
      </div>

      <div 
        onClick={() => onKpiClick(activeKpi === 'REDEEMED' ? 'ALL' : 'REDEEMED')}
        className={`bg-card border rounded-xl p-5 flex flex-col justify-center cursor-pointer motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:hover:-translate-y-1 hover:shadow-lg ${activeKpi === 'REDEEMED' ? 'border-success ring-2 ring-success/20' : 'border-border'}`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-success-bg/30 flex items-center justify-center">
            <Tag className="w-5 h-5 text-success" />
          </div>
          <span className="text-xs font-medium text-secondary uppercase tracking-wider">Total Redeemed</span>
        </div>
        <div className="text-3xl font-bold text-foreground mt-1">{totalRedeemed.toLocaleString()}</div>
      </div>
    </div>
  );
}
