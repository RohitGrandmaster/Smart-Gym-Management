// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Staff, Payroll, HrSummary, HrContextType, HrInitialData } from '@/app/admin/hr/hr_types/AdminHrTypes';
import { hrApi } from '@/app/admin/hr/hr_api/AdminHrApi';
import type { ToastType } from '@/app/admin/admin_components/AdminFeedback/AdminToast';
import { EMPTY_STAFF } from '@/app/admin/hr/hr_utils/AdminHrSharedConstants';
import { useDebounce } from '@/app/admin/admin_utils/useDebounce';
import { useAdminHrMutations } from './useAdminHrMutations';
import { useAdminGlobalStore } from '@/app/admin/admin_store/useAdminGlobalStore';

export function useAdminHrLogic(initialData?: HrInitialData | null): HrContextType {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [staff, setStaff] = useState<Staff[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [summary, setSummary] = useState<HrSummary | null>(null);
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const search = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const roleFilter = searchParams.get('role') || 'All';
  const branchFilter = searchParams.get('branch') || 'All';
  const payrollMonth = searchParams.get('month') || new Date().toISOString().substring(0, 7);
  const debouncedSearch = useDebounce(search, 300);
  const currentSearch = search;

  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (initialData) {
      setStaff(initialData.staff);
      setPayrolls(initialData.payrolls);
      setSummary(initialData.summary);
      setFetchState('success');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setUrlParam = useCallback((key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) current.set(key, value);
    else current.delete(key);
    if (key !== 'page' && key !== 'month') current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`);
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      setUrlParam('search', debouncedSearch || null);
    }
  }, [debouncedSearch, searchParams, setUrlParam, currentSearch]);

  const setSearch = useCallback((val: string) => setUrlParam('search', val || null), [setUrlParam]);
  const setCurrentPage = useCallback((val: number) => setUrlParam('page', val.toString()), [setUrlParam]);
  const setRoleFilter = useCallback((val: string) => setUrlParam('role', val === 'All' ? null : val), [setUrlParam]);
  const setBranchFilter = useCallback((val: string) => setUrlParam('branch', val === 'All' ? null : val), [setUrlParam]);
  const setPayrollMonth = useCallback((val: string) => setUrlParam('month', val), [setUrlParam]);

  const [showModal, setShowModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ payrollId: string; staffName: string; pendingAmount: number; } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Staff> | null>(null);
  const [viewProfileData, setViewProfileData] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
  const hideToast = useCallback(() => setToast(null), []);

  const { selectedBranchId } = useAdminGlobalStore();

  const loadAll = useCallback(async () => {
    setFetchState('loading');
    setError('');
    try {
      const staffParams: Record<string, string> = { search: debouncedSearch, page: String(currentPage), branchId: selectedBranchId };
      if (roleFilter !== 'All') staffParams.role = roleFilter;
      if (branchFilter !== 'All') staffParams.branch = branchFilter;
      
      const [staffRes, payrollsRes, summaryRes] = await Promise.all([
        hrApi.getStaff(staffParams),
        hrApi.getPayrolls({ search: debouncedSearch, page: String(currentPage), month: payrollMonth, branchId: selectedBranchId }),
        hrApi.getSummary(selectedBranchId)
      ]);
      
      let fetchedStaff = staffRes.data.staff || [];
      let fetchedPayrolls = payrollsRes.data.payrolls || [];

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        fetchedStaff = fetchedStaff.filter((s: Staff) => 
          (s.name && s.name?.toLowerCase().includes(q)) || 
          (s.phone && s.phone?.includes(q)) || 
          (s.email && s.email?.toLowerCase().includes(q))
        );
        fetchedPayrolls = fetchedPayrolls.filter((p: Payroll) => 
          p.staff?.name && p.staff.name?.toLowerCase().includes(q)
        );
      }

      if (roleFilter !== 'All') {
        fetchedStaff = fetchedStaff.filter((s: Staff) => s.role === roleFilter);
      }
      
      setStaff(fetchedStaff);
      setPayrolls(fetchedPayrolls);
      setSummary(summaryRes.data || { totalSalaryThisMonth: 0, totalSalaryPaid: 0, totalSalaryDue: 0, totalAdvanceGiven: 0, pendingPaymentsCount: 0, totalStaff: 0, activeStaff: 0, totalPayrollThisMonth: 0, paidCount: 0, pendingCount: 0 });
      setFetchState('success');
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      showToast(msg, 'error');
      setFetchState('error');
    }
  }, [showToast, debouncedSearch, currentPage, roleFilter, branchFilter, payrollMonth, selectedBranchId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
    }
    loadAll(); 
  }, [loadAll, initialData]);

  const openAdd = useCallback(() => {
    setEditId(null);
    setEditData(EMPTY_STAFF);
    setShowModal(true);
  }, []);

  const openEdit = useCallback((s: Staff) => {
    setEditId(s.id);
    setEditData({ 
      name: s.name, 
      email: s.email, 
      phone: s.phone, 
      role: s.role, 
      salary: s.salary, 
      branch: s.branch, 
      gender: s.gender, 
      address: s.address || '', 
      joinDate: new Date(s.joinDate).toISOString().split('T')[0],
      assignedBranches: s.assignedBranches || [],
      primaryBranchId: s.primaryBranchId || s.branch
    });
    setShowProfileModal(false); // Close profile if open
    setShowModal(true);
  }, []);

  const openProfile = useCallback((s: Staff) => {
    setEditId(s.id);
    setEditData({ 
      ...s,
      joinDate: new Date(s.joinDate).toISOString().split('T')[0]
    });
    setShowProfileModal(true);
  }, []);

  const openAddPayroll = useCallback(() => {
    setShowPayrollModal(true);
  }, []);

  const { saveStaff, savePayroll, deleteStaff, toggleStaffStatus, markPayrollPaid, giveAdvance, payDue } = useAdminHrMutations(
    staff, payrolls, setStaff, setPayrolls, setSummary, editId, setShowModal, setShowPayrollModal, setSaving, showToast
  );

  return {
    staff, payrolls, summary, fetchState, error, toast, showToast, hideToast, loadAll,
    search, debouncedSearch, setSearch, branchFilter, setBranchFilter, roleFilter, setRoleFilter, currentPage, setCurrentPage,
    showModal, setShowModal, showPayrollModal, setShowPayrollModal, showProfileModal, setShowProfileModal, paymentModal, setPaymentModal, editId, editData, viewProfileData, setViewProfileData, saving, 
    openAdd, openEdit, openProfile, openAddPayroll, saveStaff, savePayroll, deleteStaff, toggleStaffStatus, markPayrollPaid, giveAdvance, payDue, payrollMonth, setPayrollMonth
  };
}


