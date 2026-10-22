'use client';

import { useState } from 'react';
import { useHrContext } from '@/app/manager/hr/hr_context/ManagerHrContext';

export default function ManagerHrAdvanceTable() {
  const { staff, giveAdvance, saving } = useHrContext();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('Bank Transfer');

  const selectedStaff = staff.find(s => String(s.id) === String(selectedStaffId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !amount) return;
    await giveAdvance({ staffId: selectedStaffId, amount: Number(amount), notes, paymentMode });
    setAmount('');
    setNotes('');
  };

  return (
    <div className="max-w-2xl mx-auto bg-card p-6 rounded-xl border border-border">
      <h2 className="text-xl font-bold mb-6 text-foreground">Give Advance Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Staff Member *</label>
          <select 
            required
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>Select Staff</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.role}) - Balance: ₹{s.advanceSalary || 0}</option>
            ))}
          </select>
        </div>

        {selectedStaff && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-sm">
            <p><strong>Current Advance Balance:</strong> ₹{selectedStaff.advanceSalary || 0}</p>
            <p className="text-secondary text-xs mt-1">Advances are automatically deducted from the next payroll calculation.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Amount (₹) *</label>
            <input 
              type="number" required min="1"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Payment Mode</label>
            <select 
              value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Notes / Reason</label>
          <textarea 
            value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground min-h-[80px]"
            placeholder="e.g. Festival advance, medical emergency..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving || !selectedStaffId || !amount}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'Processing...' : 'Give Advance'}
          </button>
        </div>
      </form>
    </div>
  );
}
