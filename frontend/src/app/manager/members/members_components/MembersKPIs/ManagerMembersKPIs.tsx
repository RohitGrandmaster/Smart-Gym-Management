// RESPONSIBILITY: Renders the four KPI stat cards (Total, Active, Pending, Expired) for the Members module.
'use client';

import { User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';

const KPI_CONFIG = [
  { label: 'Total Members', key: 'total',   color: 'text-info',    bg: 'bg-info-bg',    icon: User         },
  { label: 'Active',        key: 'active',  color: 'text-success', bg: 'bg-success-bg', icon: CheckCircle  },
  { label: 'Pending',       key: 'pending', color: 'text-warning', bg: 'bg-warning-bg', icon: Clock        },
  { label: 'Expired',       key: 'expired', color: 'text-danger',  bg: 'bg-danger-bg',  icon: XCircle      },
] as const;

export default function ManagerMembersKPIs() {
  const stats = useManagerMembersStore(s => s.stats);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {KPI_CONFIG.map(s => (
        <div key={s.label} className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
            <s.icon size={19} className={s.color} />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">{s.label}</p>
            <p className="text-xl font-bold text-primary">{stats?.[s.key] ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
