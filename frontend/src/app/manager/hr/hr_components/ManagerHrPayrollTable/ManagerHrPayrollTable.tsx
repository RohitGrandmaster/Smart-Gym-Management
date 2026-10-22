// RESPONSIBILITY: Renders the payroll records table with pay status badges and mark-as-paid inline action.
'use client';

import { useHrContext } from '@/app/manager/hr/hr_context/ManagerHrContext';
import { PAYROLL_TABLE_HEADERS } from '@/app/manager/hr/hr_utils/ManagerHrSharedConstants';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import { CheckCircle2, Search, Banknote } from 'lucide-react';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';
import ManagerEmptyState from '@/app/manager/manager_components/ManagerFeedback/ManagerEmptyState';

export default function ManagerHrPayrollTable() {
  const { search, setSearch, payrollMonth, setPayrollMonth, payrolls, markPayrollPaid, setPaymentModal, currentPage, setCurrentPage, fetchState, staff } = useHrContext();

  const filtered = payrolls.filter(p => {
    const nameMatch = (p.staff?.name || '').toLowerCase().includes(search.toLowerCase());
    const roleMatch = (p.staff?.role || '').toLowerCase().includes(search.toLowerCase());
    
    // payrollMonth is YYYY-MM
    let isTargetMonth = true;
    if (payrollMonth) {
      const [y, m] = payrollMonth.split('-');
      const d = new Date(Number(y), Number(m) - 1, 1);
      const targetStr = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      isTargetMonth = (p.month === targetStr) || (p.month === payrollMonth);
    }
    
    return (nameMatch || roleMatch) && isTargetMonth;
  });

    const totalPages = Math.ceil(filtered.length / MANAGER_ITEMS_PER_PAGE);
  const currentData = filtered.slice((currentPage - 1) * MANAGER_ITEMS_PER_PAGE, currentPage * MANAGER_ITEMS_PER_PAGE);

  if (fetchState === 'loading') {
    return (
      <div className="flex flex-col h-full">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-input text-secondary">
              <tr>
                {PAYROLL_TABLE_HEADERS.map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
                <th className="text-right text-xs font-semibold uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="motion-safe:animate-pulse bg-card">
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </td>
                  <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-5 bg-muted rounded-full w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                  <td className="px-4 py-4 text-right"><div className="h-8 bg-muted rounded-lg w-24 ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="bg-input text-secondary">
            <tr>
              {PAYROLL_TABLE_HEADERS.map(h => (
                <th key={h} className={`text-xs font-semibold uppercase tracking-wider px-4 py-3 ${['Base Salary', 'Net Payable', 'Paid Amount', 'Pending'].includes(h) ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
              <th className="text-right text-xs font-semibold uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentData.map(p => (
              <tr key={p.id} className="transition-colors hover:bg-primary/5 bg-card">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-primary">
                    {p.staff?.name || `Staff #${p.staffId}`}
                  </p>
                  <div className="text-xs text-secondary">
                    {p.staff?.role}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-primary">{p.month}</td>
                <td className="px-4 py-3 text-sm font-medium text-right">
                  {((staff.find(s => String(s.id) === String(p.staffId))?.salary) || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-foreground text-right">{(p.amount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                <td className="px-4 py-3 text-sm font-bold text-success text-right">{(p.paidAmount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                <td className="px-4 py-3 text-sm font-bold text-danger text-right">{(p.pendingAmount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                <td className="px-4 py-3">
                  <span 
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === 'Paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-secondary">
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  {p.status !== 'Paid' && (
                    <button 
                      onClick={() => setPaymentModal({ payrollId: p.id, staffName: p.staff?.name || `Staff #${p.staffId}`, pendingAmount: p.pendingAmount || p.amount })}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors ml-auto"
                    >
                      <Banknote size={16} /> Pay Salary
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan={6} className="p-0 border-b-0">
                  <ManagerEmptyState 
                    icon={<Banknote size={32} />}
                    title="No payroll records found"
                    subtitle="There are no payroll records for the selected filters."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ManagerPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        totalItems={filtered.length} 
        itemsPerPage={MANAGER_ITEMS_PER_PAGE} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
}
