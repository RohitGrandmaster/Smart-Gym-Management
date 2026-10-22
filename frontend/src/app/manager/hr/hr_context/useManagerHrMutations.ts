import { useCallback } from 'react';
import type { Staff, Payroll, HrSummary } from '@/app/manager/hr/hr_types/ManagerHrTypes';
import { hrApi } from '@/app/manager/hr/hr_api/ManagerHrApi';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';

export function useManagerHrMutations(
  staff: Staff[],
  payrolls: Payroll[],
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>,
  setPayrolls: React.Dispatch<React.SetStateAction<Payroll[]>>,
  setSummary: React.Dispatch<React.SetStateAction<HrSummary | null>>,
  editId: string | null,
  setShowModal: (s: boolean) => void,
  setShowPayrollModal: (s: boolean) => void,
  setSaving: (s: boolean) => void,
  showToast: (msg: string, t: ToastType) => void
) {
  const { confirm } = useConfirm();

  const saveStaff = useCallback(async (data: Partial<Staff> & { joinDate?: string | Date; salary?: string | number }) => {
    setSaving(true);
    try {
      const payload: Partial<Staff> = { 
        ...data, 
        salary: Number(data.salary || 0), 
        joinDate: data.joinDate ? new Date(data.joinDate).toISOString() : new Date().toISOString(), 
        isActive: true 
      };
      
      if (editId) {
        const res = await hrApi.updateStaff(editId, payload);
        const updatedStaff = res.data || payload;
        setStaff(prev => prev.map(s => String(s.id) === String(editId) ? { ...s, ...updatedStaff } as Staff : s));
        showToast(res.message || 'Staff updated successfully', 'success'); 
      } else { 
        const res = await hrApi.createStaff(payload);
        const newStaff = res.data ? res.data : { ...payload, id: `staff-${Date.now()}` } as Staff;
        setStaff(prev => [newStaff, ...prev]);
        setSummary(prev => prev ? { ...prev, totalStaff: prev.totalStaff + 1, activeStaff: prev.activeStaff + 1 } : null);
        showToast(res.message || 'Staff created successfully', 'success'); 
      }
      setShowModal(false);
    } catch (err) { 
      showToast((err as Error).message, 'error'); 
    } finally { 
      setSaving(false); 
    }
  }, [editId, showToast, setStaff, setSummary, setShowModal, setSaving]);

  const savePayroll = useCallback(async (data: Partial<Payroll> & { amount?: string | number }) => {
    setSaving(true);
    try {
      const staffMember = staff.find(s => String(s.id) === String(data.staffId));
      
      const payrollAmount = Number(data.amount || 0);
      const paidAmount = Number(data.paidAmount || 0);
      const pendingAmount = Math.max(0, payrollAmount - paidAmount);
      const status = pendingAmount === 0 ? 'Paid' : 'PENDING';

      if (staffMember && staffMember.advanceSalary && staffMember.advanceSalary > 0) {
        const baseSalary = staffMember.salary || 0;
        const advanceDeducted = Math.min(baseSalary, staffMember.advanceSalary);
        const newAdvance = staffMember.advanceSalary - advanceDeducted;
        await hrApi.updateStaff(staffMember.id, { advanceSalary: newAdvance });
        setStaff(prev => prev.map(s => String(s.id) === String(staffMember.id) ? { ...s, advanceSalary: newAdvance } as Staff : s));
      }

      const newPayrollData = {
        ...data,
        amount: payrollAmount,
        paidAmount: paidAmount,
        pendingAmount: pendingAmount,
        status: status,
        paidAt: paidAmount > 0 ? new Date().toISOString() : undefined,
        staff: staffMember ? { name: staffMember.name, role: staffMember.role } : undefined
      };
      
      const res = await hrApi.createPayroll(newPayrollData);
      const newPayroll = res.data ? res.data : { ...newPayrollData, id: `pay-${Date.now()}` } as Payroll;

      setPayrolls(prev => [newPayroll, ...prev]);
      setSummary(prev => prev ? { 
        ...prev, 
        totalPayrollThisMonth: prev.totalPayrollThisMonth + (newPayroll.amount || 0),
        paidCount: prev.paidCount + 1 
      } : null);
      showToast('Payroll recorded successfully', 'success');
      setShowPayrollModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast, staff, setPayrolls, setSummary, setShowPayrollModal, setSaving, setStaff]);

  const deleteStaff = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Remove Staff', message: 'Remove this staff member?', confirmText: 'Remove', type: 'danger' });
    if (!isConfirmed) return;
    try { 
      const res = await hrApi.removeStaff(id);
      setStaff(prev => prev.filter(s => String(s.id) !== String(id)));
      setSummary(prev => prev ? { ...prev, totalStaff: Math.max(0, prev.totalStaff - 1), activeStaff: Math.max(0, prev.activeStaff - 1) } : null);
      showToast(res.message || 'Staff removed successfully', 'success'); 
    } catch (err) { 
      showToast((err as Error).message, 'error'); 
    }
  }, [showToast, confirm, setStaff, setSummary]);

  const toggleStaffStatus = useCallback(async (s: Staff) => {
    const newStatus = !s.isActive;
    const actionName = newStatus ? 'Activate' : 'Suspend';
    const isConfirmed = await confirm({ 
      title: `${actionName} Staff`, 
      message: `Are you sure you want to ${actionName.toLowerCase()} ${s.name}?`, 
      confirmText: actionName, 
      type: newStatus ? 'info' : 'danger' 
    });
    if (!isConfirmed) return;
    setSaving(true);
    try {
      const payload: Partial<Staff> = { isActive: newStatus };
      const res = await hrApi.updateStaff(s.id, payload);
      setStaff(prev => prev.map(staff => String(staff.id) === String(s.id) ? { ...staff, isActive: newStatus } as Staff : staff));
      setSummary(prev => prev ? { ...prev, activeStaff: newStatus ? prev.activeStaff + 1 : Math.max(0, prev.activeStaff - 1) } : null);
      showToast(res.message || `Staff ${newStatus ? 'activated' : 'suspended'} successfully`, 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast, confirm, setSaving, setStaff, setSummary]);

  const markPayrollPaid = useCallback(async (id: string, amount: number) => {
    try {
      const payroll = payrolls.find(p => String(p.id) === String(id));
      if (!payroll) return;

      const newPaid = (payroll.paidAmount || 0) + amount;
      const newPending = Math.max(0, payroll.amount - newPaid);
      const newStatus = newPending === 0 ? 'Paid' : 'PENDING';
      
      const payload = {
        paidAmount: newPaid,
        pendingAmount: newPending,
        status: newStatus
      };
      
      await hrApi.updatePayroll(id, payload);

      setPayrolls(prev => prev.map(p => {
        if (String(p.id) === String(id)) {
          return { ...p, ...payload };
        }
        return p;
      }));
      // We could update summary here, but let's just show success
      showToast('Salary payment recorded successfully', 'success'); 
    } catch (err) { 
      showToast((err as Error).message, 'error'); 
    }
  }, [showToast, setPayrolls, payrolls]);

  const giveAdvance = useCallback(async (data: { staffId: string; amount: number; notes?: string; date?: string; paymentMode?: string }) => {
    setSaving(true);
    try {
      await hrApi.giveAdvance(data);
      setStaff(prev => prev.map(s => String(s.id) === String(data.staffId) ? { ...s, advanceSalary: (s.advanceSalary || 0) + data.amount } as Staff : s));
      showToast('Advance recorded successfully', 'success');
      // Typically we'd reload summary or let it reload on demand
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast, setSaving, setStaff]);

  const payDue = useCallback(async (data: { staffId: string; amount: number; notes?: string; date?: string; paymentMode?: string }) => {
    setSaving(true);
    try {
      await hrApi.payDue(data);
      setStaff(prev => prev.map(s => String(s.id) === String(data.staffId) ? { ...s, currentDue: Math.max(0, (s.currentDue || 0) - data.amount) } as Staff : s));
      showToast('Due paid successfully', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [showToast, setSaving, setStaff]);

  return {
    saveStaff,
    savePayroll,
    deleteStaff,
    toggleStaffStatus,
    markPayrollPaid,
    giveAdvance,
    payDue
  };
}
