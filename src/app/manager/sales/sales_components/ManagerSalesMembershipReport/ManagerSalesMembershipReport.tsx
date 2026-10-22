// RESPONSIBILITY: Provides the implementation for ManagerSalesMembershipReport.tsx functionality within its module.
'use client';


import { useSalesContext } from '@/app/manager/sales/sales_context/ManagerSalesContext';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import { Loader2 } from 'lucide-react';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';
import type { MembershipReportItem } from '@/app/manager/sales/sales_types/ManagerSalesTypes';

export default function ManagerSalesMembershipReport() {
  const { search, currentPage, setCurrentPage, membershipReport, membershipTotals, fetchState } = useSalesContext();
  
  const filtered = membershipReport.filter((r: MembershipReportItem) => 
    (r.plan || '').toLowerCase().includes(search.toLowerCase())
  );

  
  const totalPages = Math.ceil(filtered.length / MANAGER_ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((currentPage - 1) * MANAGER_ITEMS_PER_PAGE, currentPage * MANAGER_ITEMS_PER_PAGE);

  if (fetchState === 'loading') {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 motion-safe:animate-spin text-primary" />
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-danger/30">
        <p className="text-danger font-medium">Failed to load membership report.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
  <>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-input">
 <tr>
 {['Plan', 'Total Receivable', 'Amount Received', 'Remaining', 'Refund'].map(h => (
 <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-4 py-3">
 {h}
 </th>
 ))}
 </tr>
 </thead>
  <tbody className="divide-y divide-border">
  {paginated.length > 0 ? (
    paginated.map((r, i) => (
      <tr key={i} className="hover:bg-primary-subtle transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-foreground">{r.plan || ''}</td>
      <td className="px-4 py-3 text-sm text-secondary">₹{(r.receivable || 0).toLocaleString()}</td>
      <td className="px-4 py-3 text-sm font-medium text-success dark:text-success">₹{(r.received || 0).toLocaleString()}</td>
      <td className="px-4 py-3 text-sm font-medium text-warning dark:text-warning">₹{(r.remaining || 0).toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-danger">₹{(r.refund || 0).toLocaleString()}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="px-4 py-8 text-center text-sm text-secondary">
        No membership report data available.
      </td>
    </tr>
  )}
 <tr className="bg-input font-semibold border-t-2 border-border">
 <td className="px-4 py-3 text-sm text-foreground">Total</td>
 <td className="px-4 py-3 text-sm text-foreground">₹{(membershipTotals.totalReceivable || 0).toLocaleString()}</td>
 <td className="px-4 py-3 text-sm text-success dark:text-success">₹{(membershipTotals.totalReceived || 0).toLocaleString()}</td>
 <td className="px-4 py-3 text-sm text-warning dark:text-warning">₹{(membershipTotals.remaining || 0).toLocaleString()}</td>
 <td className="px-4 py-3 text-sm text-danger dark:text-danger">₹{(membershipTotals.refunds || 0).toLocaleString()}</td>
 </tr>
  </tbody>
  </table>
  </div>
  <div className="mt-4 pt-4 border-t border-border">
      <ManagerPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  </>
  );
}
