// RESPONSIBILITY: Renders the top KPI stat cards (total products, orders, revenue) for the Store module.
'use client';

import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStoreContext } from '@/app/manager/store/store_context/ManagerStoreContext';
import { formatCurrency } from '@/app/manager/store/store_utils/ManagerStoreSharedConstants';

export default function ManagerStoreKPIs() {
 const { summary } = useStoreContext();

 const kpis = [
 { label: 'Total Products', value: summary?.totalProducts || 0, icon: Package, color: 'text-info', bg: 'bg-info-bg dark:bg-info-bg' },
 { label: 'Total Orders', value: summary?.totalOrders || 0, icon: ShoppingCart, color: 'text-success', bg: 'bg-success-bg dark:bg-success-bg' },
 { label: 'Store Revenue', value: formatCurrency(summary?.totalRevenue || 0), icon: TrendingUp, color: 'text-warning', bg: 'bg-warning-bg dark:bg-warning-bg' },
 { label: 'Low Stock', value: summary?.lowStockProducts?.length || 0, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger-bg dark:bg-danger-bg' },
 ];

 return (
 <div className="space-y-5">
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {kpis.map((s, i) => (
 <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center gap-3">
 <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
 <s.icon size={19} className={s.color} />
 </div>
 <div>
 <p className="text-xs text-secondary font-medium">{s.label}</p>
 <p className="text-xl font-bold text-foreground">{s.value}</p>
 </div>
 </div>
 ))}
 </div>

 {(summary?.lowStockProducts?.length ?? 0) > 0 && (
 <div className="bg-danger-bg dark:bg-danger-bg border border-destructive rounded-xl p-4 flex items-center gap-3">
 <AlertTriangle size={18} className="text-danger flex-shrink-0" />
 <p className="text-sm text-danger dark:text-danger font-medium">
 Low stock alert: {summary!.lowStockProducts.map(p => p.name).join(', ')}
 </p>
 </div>
 )}
 </div>
 );
}
