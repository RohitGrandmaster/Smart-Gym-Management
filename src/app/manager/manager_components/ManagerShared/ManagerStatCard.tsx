// RESPONSIBILITY: Renders a single KPI stat card (icon, label, big number, trend). Used in dashboard and module KPI rows.
import type { LucideIcon } from 'lucide-react';

interface ManagerStatCardProps {
 title: string;
 value: string | number;
 change?: string;
 changeType?: 'up' | 'down' | 'neutral';
 icon: LucideIcon;
 iconBg: string;
 iconColor: string;
}

export default function ManagerStatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconBg, iconColor }: ManagerStatCardProps) {
 return (
 <div className="bg-card rounded-xl p-5 shadow-sm border border-border hover:border-primary transition-colors">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-xs font-medium text-secondary uppercase tracking-wider">{title}</p>
 <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
 {change && (
 <p className={`text-xs mt-1 font-medium ${
 changeType === 'up' ? 'text-success' :
 changeType === 'down' ? 'text-danger' : 'text-secondary'
 }`}>
 {changeType === 'up' ? '?' : changeType === 'down' ? '?' : ''} {change}
 </p>
 )}
 </div>
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ background: iconBg }}>
 <Icon size={22} style={{ color: iconColor }} />
 </div>
 </div>
 </div>
 );
}
