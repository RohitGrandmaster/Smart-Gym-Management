// RESPONSIBILITY: Provides the implementation for AdminFinanceRevenueSummary.tsx functionality within its module.
'use client';

import { useAdminFinanceLogic } from '@/app/admin/finance/finance_context/useAdminFinanceLogic';
import { useAdminFinanceStore } from '@/app/admin/finance/finance_store/useAdminFinanceStore';

const fmt = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');

export default function AdminFinanceRevenueSummary() {
 const { payments, summary, totalPayments, fetchState, saving, error, loadAll, search, setSearch, currentPage, setCurrentPage, savePayment, methodFilter, setMethodFilter } = useAdminFinanceLogic();
  const { showModal, setShowModal, toast, showToast, hideToast } = useAdminFinanceStore();
 if (!summary) return null;

 return (
 <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
 <h3 className="font-semibold text-foreground">Monthly Revenue (Last 6 Months)</h3>
 <div className="space-y-2">
 {summary.monthlyData.map((d, i) => {
 const max = Math.max(...summary.monthlyData.map(x => x.revenue), 1);
 return (
 <div key={d.month} className="flex items-center gap-3">
 <span className="text-xs w-20 text-secondary">{d.month}</span>
 <div className="flex-1 h-6 rounded-full overflow-hidden bg-input">
 <div 
 className="h-full bg-primary transition-all duration-500 rounded-full" 
 style={{ width: `${(d.revenue / max) * 100}%` }}
 />
 {d.revenue > 0 && <span className="text-xs text-white font-medium">{fmt(d.revenue)}</span>}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
}


