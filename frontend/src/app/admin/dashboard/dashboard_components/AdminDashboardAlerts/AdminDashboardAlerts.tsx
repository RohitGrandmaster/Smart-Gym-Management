'use client';

import { useAdminDashboardLogic } from '@/app/admin/dashboard/dashboard_context/useAdminDashboardLogic';
import { ShieldAlert, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export default function AdminDashboardAlerts() {
  const { stats } = useAdminDashboardLogic();
  if (!stats?.systemAlerts) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle size={18} className="text-danger" />;
      case 'medium': return <AlertTriangle size={18} className="text-warning" />;
      default: return <Info size={18} className="text-primary" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-danger/10 border-danger/20';
      case 'medium': return 'bg-warning/10 border-warning/20';
      default: return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-danger/20 text-danger rounded-xl">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">System Alerts</h2>
            <p className="text-xs text-secondary">Action required</p>
          </div>
        </div>
        <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {stats.systemAlerts.filter(a => a.severity === 'high').length} Critical
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {stats.systemAlerts.length === 0 ? (
          <p className="text-sm text-secondary text-center py-4">No alerts at this time.</p>
        ) : (
          stats.systemAlerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-xl border flex items-start gap-3 transition-colors hover:bg-opacity-80 ${getSeverityStyle(alert.severity)}`}>
              <div className="mt-0.5 shrink-0">
                {getSeverityIcon(alert.severity)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{alert.message}</p>
                <p className="text-[10px] text-secondary mt-1 uppercase font-semibold">
                  {new Date(alert.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {stats.systemAlerts.length > 0 && (
        <button className="w-full mt-4 py-2 border border-border rounded-lg text-xs font-bold text-secondary hover:text-foreground hover:bg-white/5 transition-colors">
          View All Alerts
        </button>
      )}
    </div>
  );
}
