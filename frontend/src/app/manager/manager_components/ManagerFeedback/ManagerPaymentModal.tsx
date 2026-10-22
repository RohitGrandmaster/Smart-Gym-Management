// RESPONSIBILITY: Renders a modal to collect pending dues from members.
'use client';

import { useState } from 'react';
import { IndianRupee, X } from 'lucide-react';
import { formatCurrency } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';

interface ManagerPaymentModalProps {
  isOpen: boolean;
  memberId: string;
  memberName: string;
  pendingAmount: number;
  onClose: () => void;
  onSubmit: (amount: number, method: string) => void;
}

export default function ManagerPaymentModal({ isOpen, memberId, memberName, pendingAmount, onClose, onSubmit }: ManagerPaymentModalProps) {
  const [amount, setAmount] = useState<number | ''>(pendingAmount);
  const [method, setMethod] = useState('UPI');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm overflow-hidden motion-safe:animate-in fade-in zoom-in duration-200 border border-border">
        <div className="p-5 flex justify-between items-center border-b border-border">
          <h3 className="font-bold text-foreground">Collect Dues</h3>
          <button onClick={onClose} className="p-1 text-secondary hover:bg-input rounded-md transition-colors"><X size={18} /></button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-secondary mb-4">
            Recording payment for <strong className="text-foreground">{memberName}</strong>.
            <br/>Total Pending: <strong className="text-danger">{formatCurrency(pendingAmount)}</strong>
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1.5">Amount Paying</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee size={14} className="text-secondary" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  max={pendingAmount}
                  className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1.5">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-2 bg-input border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                if (Number(amount) > 0) onSubmit(Number(amount), method);
              }}
              disabled={Number(amount) <= 0}
              className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
