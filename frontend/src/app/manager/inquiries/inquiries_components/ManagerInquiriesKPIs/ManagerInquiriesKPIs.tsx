// RESPONSIBILITY: Renders the four KPI stat cards (Total, New, Follow Up, Converted) for the Inquiries module.
'use client';

import { useInquiriesContext } from '@/app/manager/inquiries/inquiries_context/ManagerInquiriesContext';
import { MessageSquare, Plus, Clock, CheckCircle } from 'lucide-react';

const KPI_CONFIG = [
  { key: 'total',     label: 'Total Inquiries', icon: MessageSquare, color: 'text-info',    bg: 'bg-info-bg'     },
  { key: 'new',       label: 'New',             icon: Plus,          color: 'text-warning', bg: 'bg-warning-bg'  },
  { key: 'followUp',  label: 'Follow Up',       icon: Clock,         color: 'text-warning', bg: 'bg-warning-bg'  },
  { key: 'converted', label: 'Converted',       icon: CheckCircle,   color: 'text-success', bg: 'bg-success-bg'  },
] as const;

export default function ManagerInquiriesKPIs() {
  const { stats } = useInquiriesContext();
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {KPI_CONFIG.map(s => (
        <div key={s.key} className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
            <s.icon size={19} className={s.color} />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">{s.label}</p>
            <p className="text-xl font-bold text-primary">{stats[s.key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
