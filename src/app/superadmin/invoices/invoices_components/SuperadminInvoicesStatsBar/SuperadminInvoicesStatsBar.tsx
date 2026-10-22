// RESPONSIBILITY: Renders the SuperadminInvoicesStatsBar component.
import { DollarSign, AlertCircle } from 'lucide-react';

interface InvoicesStatsBarProps {
  totalRevenue: number;
  failedRevenue: number;
}

export default function SuperadminInvoicesStatsBar({ totalRevenue, failedRevenue }: InvoicesStatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 motion-safe:hover:-translate-y-1 hover:shadow-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out">
        <div className="p-4 bg-success/10 rounded-xl text-success"><DollarSign size={32} /></div>
        <div>
          <p className="text-sm font-medium text-secondary">Total Collected (This Month)</p>
          <p className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-card border border-destructive/30 rounded-xl p-6 flex items-center gap-4 motion-safe:hover:-translate-y-1 hover:shadow-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out">
        <div className="p-4 bg-danger-bg/10 rounded-xl text-danger"><AlertCircle size={32} /></div>
        <div>
          <p className="text-sm font-medium text-secondary">Failed Payments</p>
          <p className="text-3xl font-bold text-danger">₹{failedRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
