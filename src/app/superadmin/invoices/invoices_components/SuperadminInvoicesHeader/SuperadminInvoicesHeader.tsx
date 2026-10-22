// RESPONSIBILITY: Renders the SuperadminInvoicesHeader component.
import { Plus, ArrowUpRight } from 'lucide-react';

interface InvoicesHeaderProps {
  onLogPaymentClick: () => void;
}

export default function SuperadminInvoicesHeader({ onLogPaymentClick }: InvoicesHeaderProps) {
  const handleExportCSV = () => {
    // Generate simple CSV payload simulation
    const blob = new Blob(['InvoiceID,Tenant,Plan,Amount,Status,Date\nINV-001,Test Gym,Pro,299,PAID,2023-10-01'], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SaaS Revenue & Invoices</h1>
        <p className="text-secondary mt-1">Track actual payments from gym owners via Stripe/Razorpay.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onLogPaymentClick}
          className="bg-input text-foreground border border-border px-4 py-2 rounded-lg font-medium hover:bg-border motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out flex items-center gap-2"
        >
          <Plus size={18} /> Log Manual Payment
        </button>
        <button 
          onClick={handleExportCSV}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out flex items-center gap-2"
        >
          <ArrowUpRight size={18} /> Export CSV
        </button>
      </div>
    </div>
  );
}
