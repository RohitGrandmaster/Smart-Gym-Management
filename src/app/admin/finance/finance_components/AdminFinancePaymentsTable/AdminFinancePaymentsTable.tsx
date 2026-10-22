// RESPONSIBILITY: Provides the implementation for AdminFinancePaymentsTable.tsx functionality within its module.
'use client';

import { useAdminFinanceLogic } from '@/app/admin/finance/finance_context/useAdminFinanceLogic';
import { useAdminFinanceStore } from '@/app/admin/finance/finance_store/useAdminFinanceStore';
import { PAYMENTS_TABLE_HEADERS, FINANCE_METHOD_STYLES, FINANCE_STATUS_STYLES } from '@/app/admin/finance/finance_utils/AdminFinanceSharedConstants';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import { ADMIN_ITEMS_PER_PAGE } from '@/app/admin/admin_utils/AdminSharedConstants';

export default function AdminFinancePaymentsTable() {
  const { payments, summary, totalPayments, fetchState, saving, error, loadAll, search, setSearch, currentPage, setCurrentPage, savePayment, methodFilter, setMethodFilter } = useAdminFinanceLogic();
  const { showModal, setShowModal, toast, showToast, hideToast } = useAdminFinanceStore();

  // Apply client-side filter by payment status (DUE = Pending Amount KPI card)
  const filteredPayments = methodFilter === 'All'
    ? payments
    : payments.filter(p => p.status === methodFilter);

  const totalPages = Math.ceil((methodFilter === 'All' ? totalPayments : filteredPayments.length) / ADMIN_ITEMS_PER_PAGE) || 1;

 if (fetchState === 'loading') {
 return (
 <>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-input text-secondary">
 <tr>
 {PAYMENTS_TABLE_HEADERS.map(h => (
 <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {[...Array(5)].map((_, i) => (
 <tr key={i} className="motion-safe:animate-pulse bg-card">
 <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
 <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
 <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
 <td className="px-4 py-4"><div className="h-5 bg-muted rounded-full w-20"></div></td>
 <td className="px-4 py-4"><div className="h-5 bg-muted rounded-full w-24"></div></td>
 <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </>
 );
 }

 if (fetchState === 'error') {
   return (
     <div className="text-center py-16 bg-card rounded-2xl border border-danger/30">
       <p className="text-danger font-medium">Failed to load payments.</p>
       <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
     </div>
   );
 }

 return (
 <>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-input text-secondary">
 <tr>
 {PAYMENTS_TABLE_HEADERS.map(h => (
 <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {filteredPayments.map(p => {
 const mStyle = FINANCE_METHOD_STYLES[p.method] || { bg: 'bg-input', text: 'text-secondary' };
 const sStyle = FINANCE_STATUS_STYLES[p.status] || { bg: 'bg-input', text: 'text-secondary' };
 return (
 <tr key={p.id} className="transition-colors hover:bg-primary/5 bg-card">
 <td className="px-4 py-3 text-sm font-mono text-secondary">{p.invoiceNo}</td>
 <td className="px-4 py-3 text-sm font-medium text-primary">{p.member?.name || `Member #${p.memberId}`}</td>
 <td className="px-4 py-3 text-sm font-bold text-success">{(p.amount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
 <td className="px-4 py-3">
 <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${mStyle.bg} ${mStyle.text}`}>
 {p.method}
 </span>
 </td>
 <td className="px-4 py-3">
 <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${sStyle.bg} ${sStyle.text}`}>
 {p.status}
 </span>
 </td>
 <td className="px-4 py-3 text-sm text-secondary">
 {new Date(p.paidAt).toLocaleDateString('en-IN')}
 </td>
 </tr>
 );
 })}
 {filteredPayments.length === 0 && (
 <tr>
 <td colSpan={6} className="text-center py-10 text-sm text-secondary">
 No payments recorded yet.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 <div className="mt-4 pt-4 border-t border-border">
      <AdminPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalPayments}
        itemsPerPage={ADMIN_ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
 </>
 );
}


