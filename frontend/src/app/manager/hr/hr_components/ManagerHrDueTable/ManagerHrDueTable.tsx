'use client';

import { useState } from 'react';
import { useHrContext } from '@/app/manager/hr/hr_context/ManagerHrContext';
import { AlertCircle } from 'lucide-react';

export default function ManagerHrDueTable() {
  const { staff, payDue, saving } = useHrContext();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('Bank Transfer');

  const selectedStaff = staff.find(s => String(s.id) === String(selectedStaffId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !amount) return;
    await payDue({ staffId: selectedStaffId, amount: Number(amount), notes, paymentMode });
    setAmount('');
    setNotes('');
  };

  const staffWithDues = staff.filter(s => (s.currentDue || 0) > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {staffWithDues.length > 0 && (
        <div className="bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-xl p-4 flex gap-3 items-start">
          <AlertCircle className="text-[var(--warning)] mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-[var(--warning)] text-sm">Outstanding Dues</h4>
            <p className="text-sm text-secondary mt-1">
              You have {staffWithDues.length} staff members with pending salary dues. Total outstanding: 
              <strong className="ml-1 text-foreground">₹{staffWithDues.reduce((sum, s) => sum + (s.currentDue || 0), 0).toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="bg-card p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-6 text-foreground">Pay Outstanding Due</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Staff Member *</label>
            <select 
              required
              value={selectedStaffId}
              onChange={(e) => {
                setSelectedStaffId(e.target.value);
                const s = staff.find(st => String(st.id) === e.target.value);
                if (s && s.currentDue) setAmount(String(s.currentDue));
              }}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled>Select Staff</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role}) - Due: ₹{s.currentDue || 0}</option>
              ))}
            </select>
          </div>

          {selectedStaff && (
            <div className="p-4 bg-[var(--hr-highlight)]/10 rounded-lg border border-[var(--hr-highlight)]/30 text-sm">
              <p><strong>Current Due Amount:</strong> ₹{selectedStaff.currentDue || 0}</p>
              <p className="text-secondary text-xs mt-1">This is the unpaid portion of past payrolls.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Amount to Pay (₹) *</label>
              <input 
                type="number" required min="1" max={selectedStaff?.currentDue || undefined}
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
            <label className="block text-sm font-medium mb-1 text-foreground">Notes</label>
            <textarea 
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground min-h-[80px]"
              placeholder="e.g. Clearing Oct pending salary..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={saving || !selectedStaffId || !amount || Number(amount) <= 0 || (selectedStaff && Number(amount) > (selectedStaff.currentDue || 0))}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? 'Processing...' : 'Pay Due'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
