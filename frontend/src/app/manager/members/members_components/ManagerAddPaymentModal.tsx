// RESPONSIBILITY: Renders a modal to record a new payment for a member.
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';

export default function ManagerAddPaymentModal() {
  const { showPaymentModal, setShowPaymentModal, recordPayment, selectedMember } = useMembersContext();
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showPaymentModal || !selectedMember) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setIsSubmitting(true);
    await recordPayment({
      amount: Number(amount),
      method,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Record Payment</h2>
          <button onClick={() => setShowPaymentModal(false)} className="p-2 text-secondary hover:text-foreground rounded-full hover:bg-input transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(selectedMember.pendingAmount > 0 || (selectedMember.advanceAmount && selectedMember.advanceAmount > 0)) && (
            <div className={`p-3 rounded-lg border mb-4 ${selectedMember.pendingAmount > 0 ? 'bg-danger-bg border-destructive/20' : 'bg-success-bg border-success/20'}`}>
              <p className={`text-sm font-semibold ${selectedMember.pendingAmount > 0 ? 'text-danger' : 'text-success'}`}>
                {selectedMember.pendingAmount > 0 
                  ? `Current Dues: ₹${selectedMember.pendingAmount}` 
                  : `Advance Balance: ₹${selectedMember.advanceAmount}`}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Amount (₹)</label>
            <input 
              type="number" 
              required 
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. 1500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="CASH">Cash</option>
              <option value="NET_BANKING">Net Banking</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-secondary hover:text-foreground bg-input hover:bg-input/80 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
