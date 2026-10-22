// RESPONSIBILITY: Renders the SuperadminInvoicesTableRow component.
import React from 'react';
import { Receipt, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { WhatsAppFormatter } from '@/lib/whatsapp_formatter';
import type { SaaSInvoice } from '@/app/superadmin/invoices/superadmin_invoices_types/superadmin_invoices_types';

const STATUS_COLORS: Record<SaaSInvoice['status'], string> = {
  PAID: 'text-success bg-success/10',
  PENDING: 'text-warning bg-warning/10',
  FAILED: 'text-danger bg-danger-bg/10',
};

interface InvoicesTableRowProps {
  invoice: SaaSInvoice;
}

export default function SuperadminInvoicesTableRow({ invoice: inv }: InvoicesTableRowProps) {
  const handleShareWhatsApp = (e: React.MouseEvent, inv: SaaSInvoice) => {
    e.stopPropagation();
    const dateStr = new Date(inv.date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    const waText = WhatsAppFormatter.formatReceipt({
      title: 'Smart Gym 360',
      subtitle: 'SaaS Invoice / Receipt',
      date: dateStr,
      customerInfo: {
        'Tenant': inv.tenantName,
        'Invoice ID': inv.id,
      },
      sections: [
        {
          items: {
            'Plan': inv.planName,
            'Amount': `₹${inv.amount.toFixed(2)}`,
            'Status': inv.status
          }
        }
      ],
      footer: inv.status === 'PAID' ? 'Thank you for your business!' : 'Please pay the pending amount.'
    });

    window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <tr className="hover:bg-input motion-safe:transition-colors">
      <td className="p-4 text-sm font-mono text-secondary">{inv.id}</td>
      <td className="p-4 text-sm font-bold text-foreground">{inv.tenantName}</td>
      <td className="p-4 text-sm text-secondary">{inv.planName}</td>
      <td className="p-4 text-sm font-bold text-foreground">₹{inv.amount.toFixed(2)}</td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${STATUS_COLORS[inv.status]}`}>
          {inv.status}
        </span>
      </td>
      <td className="p-4 text-sm text-secondary">{new Date(inv.date).toLocaleDateString()}</td>
      <td className="p-4 text-right flex items-center justify-end gap-2">
        <button 
          title="Share via WhatsApp"
          onClick={(e) => handleShareWhatsApp(e, inv)}
          className="text-secondary hover:text-[#25D366] motion-safe:transition-colors p-1.5 bg-input hover:bg-[#25D366]/10 rounded-md border border-border"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); toast.success(`Downloading PDF for invoice ${inv.id}`); }}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          <Receipt size={14} /> View
        </button>
      </td>
    </tr>
  );
}
