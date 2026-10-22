// RESPONSIBILITY: Renders the payment history and transaction records for a specific member profile.
'use client';

import { Printer, MessageCircle } from 'lucide-react';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { formatCurrency } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';

export default function ManagerProfilePayments() {
  const { handlePrint, handleSharePaymentWhatsApp, setShowRenewModal, setShowPaymentModal, selectedMember } = useMembersContext();
  const payments = useManagerMembersStore(s => s.payments);

  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0);
  const totalDue = selectedMember?.pendingAmount || 0;

  // Sort payments chronologically (newest first)
  const sortedPayments = [...payments].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  return (
  <div>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
  <div className="bg-success-bg rounded-xl p-4 border border-success/20">
  <p className="text-xs text-success">Total Paid</p>
  <p className="text-xl font-bold text-success">{formatCurrency(totalPaid)}</p>
  </div>
  <div className="bg-danger-bg rounded-xl p-4 border border-destructive/20">
  <p className="text-xs text-danger">Total Due</p>
  <p className="text-xl font-bold text-danger">{formatCurrency(totalDue)}</p>
  </div>
  <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
  <p className="text-xs text-primary">Advance</p>
  <p className="text-xl font-bold text-primary">{formatCurrency(selectedMember?.advanceAmount || 0)}</p>
  </div>
  <div className="bg-info-bg rounded-xl p-4 border border-info/20">
  <p className="text-xs text-info">Transactions</p>
  <p className="text-xl font-bold text-info">{payments.length}</p>
  </div>
  </div>
  <div className="flex justify-end mb-4 gap-3">
    <button onClick={() => setShowPaymentModal(true)} className="px-4 py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors shadow-sm">
      Record Payment
    </button>
    <button onClick={() => setShowRenewModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
      Renew Membership
    </button>
  </div>
  <div className="space-y-3">
  {sortedPayments.length === 0 && (
  <p className="text-center text-secondary text-sm py-4">No payment records found.</p>
  )}
  {sortedPayments.map(p => (
  <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
  <div>
  <p className="text-sm font-medium text-foreground">{p.invoiceNo}</p>
  <p className="text-xs text-secondary">{p.method} · {new Date(p.paidAt).toLocaleDateString('en-IN')}</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="text-right">
 <p className="text-sm font-bold text-success">{formatCurrency(p.amount)}</p>
 <span className={`text-xs px-2 py-0.5 rounded-full ${
 p.status === 'PAID' ? 'bg-success-bg text-success' 
 : 'bg-danger-bg text-danger'
 }`}>
 {p.status}
 </span>
 </div>
 <div className="flex items-center gap-2">
 <button 
 onClick={() => handleSharePaymentWhatsApp(p)} 
 className="p-2 rounded-lg bg-input hover:bg-green-500/10 text-secondary hover:text-green-500 transition-colors"
 title="Share via WhatsApp"
 >
 <MessageCircle size={14} />
 </button>
 <button 
 onClick={() => handlePrint(p)} 
 className="p-2 rounded-lg bg-input hover:bg-primary-subtle text-secondary transition-colors"
 title="Print Receipt"
 >
 <Printer size={14} />
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}

