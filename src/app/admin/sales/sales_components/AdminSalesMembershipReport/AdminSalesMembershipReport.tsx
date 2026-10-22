// RESPONSIBILITY: Provides the implementation for AdminSalesMembershipReport.tsx functionality within its module.
'use client';


import { useAdminSalesLogic } from '@/app/admin/sales/sales_context/useAdminSalesLogic';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import { Loader2 } from 'lucide-react';
import { ADMIN_ITEMS_PER_PAGE } from '@/app/admin/admin_utils/AdminSharedConstants';
import type { MembershipReportItem } from '@/app/admin/sales/sales_types/sales_types';

export default function AdminSalesMembershipReport() {
  const { search, currentPage, setCurrentPage, membershipReport, membershipTotals, fetchState } = useAdminSalesLogic();
  
  const filtered = membershipReport.filter((r: MembershipReportItem) => 
    (r.plan || '').toLowerCase().includes(search.toLowerCase())
  );

  
  const totalPages = Math.ceil(filtered.length / ADMIN_ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((currentPage - 1) * ADMIN_ITEMS_PER_PAGE, currentPage * ADMIN_ITEMS_PER_PAGE);

  if (fetchState === 'loading') {
    return (
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
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="motion-safe:animate-pulse bg-card">
                <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
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
  {paginated.map((r, i) => (
  <tr key={i} className="hover:bg-primary-subtle transition-colors">
  <td className="px-4 py-3 text-sm font-medium text-foreground">{r.plan || ''}</td>
  <td className="px-4 py-3 text-sm text-secondary">₹{(r.receivable || 0).toLocaleString()}</td>
  <td className="px-4 py-3 text-sm font-medium text-success dark:text-success">₹{(r.received || 0).toLocaleString()}</td>
  <td className="px-4 py-3 text-sm font-medium text-warning dark:text-warning">₹{(r.remaining || 0).toLocaleString()}</td>
  <td className="px-4 py-3 text-sm text-danger">₹{(r.refund || 0).toLocaleString()}</td>
  </tr>
  ))}
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
      <AdminPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  </>
  );
}

