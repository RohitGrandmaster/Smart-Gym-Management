// RESPONSIBILITY: Renders the list of members with pending payments, including skeleton loader, pagination, and overdue details. Receives data via ManagerSalesContext.
'use client';

import { useSalesContext } from '@/app/manager/sales/sales_context/ManagerSalesContext';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import ManagerSalesEmptyState from '@/app/manager/sales/sales_components/ManagerSalesEmptyState/ManagerSalesEmptyState';
import type { PendingPaymentMember } from '@/app/manager/sales/sales_types/ManagerSalesTypes';
import { MANAGER_ITEMS_PER_PAGE, GYM_DETAILS } from '@/app/manager/manager_utils/ManagerSharedConstants';
import { WhatsAppFormatter } from '@/lib/whatsapp_formatter';

export default function PendingPayments() {
  const { currentPage, setCurrentPage, pendingPayments, pendingTotal, fetchState, showToast } = useSalesContext();

  const totalPages = Math.ceil(pendingTotal / MANAGER_ITEMS_PER_PAGE) || 1;

  if (fetchState === 'loading') {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="motion-safe:animate-pulse flex items-center justify-between p-4 border border-border rounded-xl bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-input rounded-full"></div>
              <div>
                <div className="h-4 bg-input rounded w-24 mb-1"></div>
                <div className="h-3 bg-input rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="h-4 bg-input rounded w-16 mb-1 ml-auto"></div>
                <div className="h-3 bg-input rounded w-20"></div>
              </div>
              <div className="w-24 h-8 bg-input rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-danger/30">
        <p className="text-danger font-medium">Failed to load pending payments.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-secondary mb-4">
        {pendingTotal} members with pending payments
      </p>
      <div className="space-y-3">
        {pendingPayments.map((p: PendingPaymentMember) => (
          <div key={p.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-warning transition-all duration-200 ease-in-out motion-safe:hover:-translate-y-1 hover:shadow-lg bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-danger-bg rounded-full flex items-center justify-center text-danger font-semibold text-sm">
                {p.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-secondary">{p.plan || 'Standard'} Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-danger">₹{p.pendingAmount?.toLocaleString() || 0}</p>
                <p className="text-xs text-secondary opacity-80">{p.daysOverdue || 0} days overdue</p>
              </div>
              <button
                onClick={() => {
                  const waText = WhatsAppFormatter.formatReceipt({
                    title: GYM_DETAILS.name,
                    subtitle: 'Payment Reminder',
                    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    customerInfo: {
                      'Member': p.name,
                      'Plan': p.plan || 'Standard',
                    },
                    sections: [
                      {
                        title: 'Outstanding Dues',
                        items: {
                          'Pending Amount': `Rs ${p.pendingAmount?.toLocaleString() || 0}`,
                          'Overdue By': `${p.daysOverdue || 0} days`,
                        }
                      }
                    ],
                    footer: 'Please clear dues ASAP to avoid service interruption.'
                  });
                  window.open(`https://wa.me/91${p.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(waText)}`, '_blank');
                  showToast(`Reminder sent via WhatsApp to ${p.name}`, 'success');
                }}
                className="px-3 py-1.5 text-xs text-white bg-primary rounded-lg font-medium transition-all duration-200 ease-in-out hover:bg-primary-hover active:scale-95"
              >
                Send Reminder
              </button>
            </div>
          </div>
        ))}
        {pendingPayments.length === 0 && (
          <ManagerSalesEmptyState message="No pending payments" subtext="All members are up to date." />
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
          <ManagerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
    </div>
  );
}
