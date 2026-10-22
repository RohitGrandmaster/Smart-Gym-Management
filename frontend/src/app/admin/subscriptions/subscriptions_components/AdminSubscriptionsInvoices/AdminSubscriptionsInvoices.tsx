// RESPONSIBILITY: Invoice history table with status badges and PDF download.
'use client';

import { FileText, Download, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { useAdminSubscriptionsLogic } from '@/app/admin/subscriptions/subscriptions_context/useAdminSubscriptionsLogic';
import type { InvoiceStatus } from '@/app/admin/subscriptions/subscriptions_types/subscriptions_types';

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  paid:     { label: 'Paid',     bg: 'bg-success-bg', text: 'text-success', icon: <CheckCircle size={12} /> },
  pending:  { label: 'Pending',  bg: 'bg-warning-bg', text: 'text-warning', icon: <Clock size={12} /> },
  failed:   { label: 'Failed',   bg: 'bg-danger-bg',  text: 'text-danger',  icon: <XCircle size={12} /> },
  refunded: { label: 'Refunded', bg: 'bg-info-bg',    text: 'text-info',    icon: <RotateCcw size={12} /> },
};

export default function AdminSubscriptionsInvoices() {
  const { invoices } = useAdminSubscriptionsLogic();
  const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Invoice History</h3>
        </div>
        <span className="text-xs text-secondary">{invoices.length} invoices</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary/5 border-b border-border">
              {['Invoice #', 'Date', 'Plan', 'Billing', 'Amount', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map(inv => {
              const s = STATUS_CONFIG[inv.status];
              return (
                <tr key={inv.id} className="hover:bg-input/40 motion-safe:transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-primary">{inv.invoiceNo}</td>
                  <td className="px-4 py-3 text-sm text-secondary whitespace-nowrap">
                    {new Date(inv.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{inv.planName}</td>
                  <td className="px-4 py-3 text-xs text-secondary capitalize">{inv.billingCycle}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                      {s.icon} {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => window.open(inv.pdfUrl, '_blank')}
                      className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-input motion-safe:transition-colors"
                      aria-label={`Download ${inv.invoiceNo}`}
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
