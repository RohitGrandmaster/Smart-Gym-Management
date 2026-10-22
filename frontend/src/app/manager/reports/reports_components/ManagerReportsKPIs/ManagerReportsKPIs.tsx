// RESPONSIBILITY: KPI stat cards row for the Manager Reports module.
'use client';

import { useReportsContext } from '@/app/manager/reports/reports_context/ManagerReportsContext';
import { TrendingUp, Users, CalendarCheck, TrendingDown, IndianRupee, UserPlus, UserMinus, Activity } from 'lucide-react';

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sub?: string;
  subColor?: string;
}

function KPICard({ label, value, icon: Icon, iconBg, iconColor, sub, subColor }: KPICardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:shadow-lg">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-xs font-medium text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className={`text-xs mt-0.5 ${subColor ?? 'text-secondary'}`}>{sub}</p>}
      </div>
    </div>
  );
}

export default function ManagerReportsKPIs() {
  const { summary } = useReportsContext();
  const k = summary?.kpis;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard label="Total Revenue"    value={k ? fmt(k.totalRevenue)    : '—'} icon={TrendingUp}   iconBg="bg-success/10"   iconColor="var(--color-success)"   sub={k ? `Net: ${fmt(k.netProfit)}` : undefined} subColor="text-success" />
      <KPICard label="Total Expenses"   value={k ? fmt(k.totalExpenses)   : '—'} icon={TrendingDown} iconBg="bg-danger/10"    iconColor="var(--color-danger)"    />
      <KPICard label="Active Members"   value={k ? String(k.activeMembers): '—'} icon={Users}        iconBg="bg-info/10"      iconColor="var(--color-info)"      sub={k ? `+${k.newMembersThisMonth} this month` : undefined} subColor="text-success" />
      <KPICard label="Avg Attendance"   value={k ? `${k.avgAttendanceRate}%` : '—'} icon={CalendarCheck} iconBg="bg-primary/10" iconColor="var(--color-primary)" />
      <KPICard label="New Members"      value={k ? String(k.newMembersThisMonth) : '—'} icon={UserPlus}  iconBg="bg-success/10"  iconColor="var(--color-success)"  />
      <KPICard label="Churn Rate"       value={k ? `${k.churnRate}%`      : '—'} icon={UserMinus}    iconBg="bg-warning/10"   iconColor="var(--color-warning)"   />
      <KPICard label="Total Members"    value={k ? String(k.totalMembers) : '—'} icon={Activity}     iconBg="bg-purple/10"    iconColor="var(--color-purple)"    />
      <KPICard label="Net Profit"       value={k ? fmt(k.netProfit)       : '—'} icon={IndianRupee}  iconBg="bg-success/10"   iconColor="var(--color-success)"   />
    </div>
  );
}
