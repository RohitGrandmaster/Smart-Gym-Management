'use client';

import { useState, useEffect } from 'react';
import { useHrContext } from '@/app/manager/hr/hr_context/ManagerHrContext';
import { hrApi } from '@/app/manager/hr/hr_api/ManagerHrApi';
import type { LedgerEntry } from '@/app/manager/hr/hr_types/ManagerHrTypes';
import { FileText, Search } from 'lucide-react';

export default function ManagerHrLedgerTable() {
  const { staff, showToast } = useHrContext();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff.length > 0 && !selectedStaffId) {
      setSelectedStaffId(staff[0].id);
    }
  }, [staff, selectedStaffId]);

  useEffect(() => {
    if (!selectedStaffId) return;
    const fetchLedger = async () => {
      setLoading(true);
      try {
        const res = await hrApi.getLedger(selectedStaffId);
        setLedger(res.data?.ledger || []);
      } catch (e: any) {
        showToast(e.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, [selectedStaffId, showToast]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const selectedStaff = staff.find(s => String(s.id) === String(selectedStaffId));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-end">
        <div>
          <h2 className="text-lg font-bold text-foreground">Staff Ledger</h2>
          <p className="text-sm text-secondary">View detailed transaction history for staff members.</p>
        </div>
        <div className="w-full sm:w-64">
          <label className="block text-xs text-secondary mb-1">Select Staff Member</label>
          <select 
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground"
          >
            <option value="" disabled>Select Staff</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedStaff && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-xs text-secondary uppercase">Base Salary</p>
            <p className="text-xl font-bold text-foreground">{formatMoney(selectedStaff.salary || 0)}/mo</p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-xs text-secondary uppercase">Advance Balance</p>
            <p className="text-xl font-bold text-[var(--danger)]">{formatMoney(selectedStaff.advanceSalary || 0)}</p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-xs text-secondary uppercase">Due Amount</p>
            <p className="text-xl font-bold text-[var(--hr-highlight)]">{formatMoney(selectedStaff.currentDue || 0)}</p>
          </div>
        </div>
      )}

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-border text-sm">
                <th className="p-4 font-medium text-secondary whitespace-nowrap">Date</th>
                <th className="p-4 font-medium text-secondary whitespace-nowrap">Transaction Type</th>
                <th className="p-4 font-medium text-secondary">Notes</th>
                <th className="p-4 font-medium text-secondary text-right">Credit (₹)</th>
                <th className="p-4 font-medium text-secondary text-right">Debit (₹)</th>
                <th className="p-4 font-medium text-secondary text-right bg-primary/5">Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-8 text-secondary">Loading ledger...</td></tr>
              ) : ledger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-secondary">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={32} className="opacity-20" />
                      <p>No transactions found for this staff member.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                ledger.map(l => (
                  <tr key={l.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="p-4 text-foreground whitespace-nowrap">{new Date(l.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                        ${l.type.includes('Advance') ? 'bg-[var(--danger)]/10 text-[var(--danger)]' : 
                          l.type.includes('Salary Generated') ? 'bg-blue-500/10 text-blue-500' : 
                          l.type.includes('Due') ? 'bg-[var(--warning)]/10 text-[var(--warning)]' :
                          'bg-[var(--success)]/10 text-[var(--success)]'}`}>
                        {l.type}
                      </span>
                    </td>
                    <td className="p-4 text-secondary max-w-[200px] truncate" title={l.notes}>{l.notes || '-'}</td>
                    <td className="p-4 text-right text-[var(--success)] font-medium">{l.credit > 0 ? `+${l.credit.toLocaleString('en-IN')}` : '-'}</td>
                    <td className="p-4 text-right text-[var(--danger)] font-medium">{l.debit > 0 ? `-${l.debit.toLocaleString('en-IN')}` : '-'}</td>
                    <td className="p-4 text-right font-bold text-foreground bg-primary/5">{l.balance.toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
