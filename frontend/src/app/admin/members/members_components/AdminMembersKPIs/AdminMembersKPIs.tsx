// RESPONSIBILITY: Renders the 4 KPI stat cards for the Admin Members module (total, active, expiring, outstanding).
'use client';

import { Users, UserCheck, Clock, IndianRupee } from 'lucide-react';
import { useAdminMembersLogic } from '@/app/admin/members/members_context/useAdminMembersLogic';
import { formatCurrency } from '@/lib/formatters';

export default function AdminMembersKPIs() {
  const { summary } = useAdminMembersLogic();
  if (!summary) return null;

  const cards = [
    {
      title: 'Total Members',
      value: summary.totalMembers.toLocaleString('en-IN'),
      sub: `+${summary.newThisMonth} this month`,
      subColor: 'text-success',
      icon: Users,
      iconBg: 'bg-info/20',
      iconColor: 'text-info',
    },
    {
      title: 'Active Members',
      value: summary.activeMembers.toLocaleString('en-IN'),
      sub: `${Math.round((summary.activeMembers / summary.totalMembers) * 100)}% of total`,
      subColor: 'text-secondary',
      icon: UserCheck,
      iconBg: 'bg-success/20',
      iconColor: 'text-success',
    },
    {
      title: 'Expiring This Month',
      value: summary.expiringThisMonth.toLocaleString('en-IN'),
      sub: `${summary.expiringThisWeek} expiring this week`,
      subColor: 'text-warning',
      icon: Clock,
      iconBg: 'bg-warning/20',
      iconColor: 'text-warning',
    },
    {
      title: 'Total Outstanding',
      value: formatCurrency(summary.totalOutstanding),
      sub: `${summary.pendingMembers} members with dues`,
      subColor: 'text-danger',
      icon: IndianRupee,
      iconBg: 'bg-danger/20',
      iconColor: 'text-danger',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="bg-card rounded-xl p-5 border border-border hover:border-primary motion-safe:transition-all motion-safe:duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-secondary uppercase tracking-wider">{c.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{c.value}</p>
                <p className={`text-xs mt-1 font-medium ${c.subColor}`}>{c.sub}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${c.iconBg}`}>
                <Icon size={18} strokeWidth={2} className={c.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
