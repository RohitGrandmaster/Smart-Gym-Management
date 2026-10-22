// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Custom hook encapsulating UI state and orchestrating actions for the members module. Async state is in useMembersStore.
// DATA FLOW: UI Interactions -> useMembersLogic -> useMembersStore -> API
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { MembersContextType } from '@/app/trainer/members/members_types/members_types';
import type { Member } from '@/app/trainer/trainer_types/trainer_types';
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import type { MessageType, TrainerMessageRecipient } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerMessageModal';
import type { TrainerReceiptData } from '@/app/trainer/trainer_components/TrainerShared/TrainerThermalReceipt';
import { useConfirm } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerConfirmProvider';
import { EMPTY_MEMBER_FORM, formatCurrency, MSG_TEMPLATES, MemberFormValues } from '@/app/trainer/members/members_utils/MembersSharedConstants';
import { GYM_DETAILS } from '@/app/trainer/trainer_utils/TrainerSharedConstants';
import { useDebounce } from '@/app/trainer/trainer_utils/useDebounce';
import { useMembersStore } from '@/app/trainer/members/members_store/useMembersStore';

export function useMembersLogic(initialData?: any | null): MembersContextType {
  const { confirm } = useConfirm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Zustand Store
  const hydrate = useMembersStore((s) => s.hydrate);
  const loadAll = useMembersStore((s) => s.loadAll);
  const storeSaveMember = useMembersStore((s) => s.saveMember);
  const storeDeleteMember = useMembersStore((s) => s.deleteMember);
  const storeAssignWorkout = useMembersStore((s) => s.assignWorkout);
  const storeAssignDiet = useMembersStore((s) => s.assignDiet);

  const isFirstRender = React.useRef(true);

  // Hydrate Zustand with SSR data exactly once on mount.
  // useEffect: SSR hydration runs once on mount only.
  useEffect(() => {
    if (initialData) {
      hydrate(initialData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally empty: SSR hydration runs once on mount only

  // URL State
  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const debouncedSearch = useDebounce(search, 300);

  const setUrlParam = useCallback((key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) current.set(key, value);
    else current.delete(key);
    if (key !== 'page') current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`);
  }, [searchParams, pathname, router]);

  const setSearch = useCallback((val: string) => setUrlParam('search', val || null), [setUrlParam]);
  const setStatusFilter = useCallback((val: string) => setUrlParam('status', val === 'All' ? null : val), [setUrlParam]);
  const setCurrentPage = useCallback((val: number) => setUrlParam('page', val.toString()), [setUrlParam]);

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<MemberFormValues | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'attendance' | 'progress' | 'workout' | 'diet' | 'fitness'>('overview');
  const [msgModal, setMsgModal] = useState<{ open: boolean; recipient: TrainerMessageRecipient; type: MessageType; message: string; subject?: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);


  const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
  const hideToast = useCallback(() => setToast(null), []);
  const closeMsg = useCallback(() => setMsgModal(null), []);

  // Refetch when URL params change after initial SSR hydration.
  // showToast is defined above so the closure captures the correct reference.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
    }
    loadAll({ search: debouncedSearch, status: statusFilter, page: currentPage.toString() }).catch(() => {
      showToast('Failed to load members', 'error');
    });
  }, [loadAll, debouncedSearch, statusFilter, currentPage, showToast]);

  const openAdd = useCallback(() => { 
    setEditId(null); 
    setEditData(EMPTY_MEMBER_FORM); 
    setShowAddModal(true); 
  }, []);
  
  const openEdit = useCallback((m: Member) => {
    setEditId(m.id);
    setEditData({ 
      name: m.name, 
      email: m.email || '', 
      phone: m.phone, 
      address: m.address || '', 
      gender: (m.gender || 'MALE') as "MALE"|"FEMALE"|"OTHER", 
    } as MemberFormValues);
    setShowAddModal(true);
  }, []);

  const saveMember = useCallback(async (data: MemberFormValues) => {
    try {
      const res = await storeSaveMember(data, editId);
      showToast(res.message, 'success');
      setShowAddModal(false);
    } catch (err: unknown) { 
      showToast(err instanceof Error ? err.message : 'Save failed', 'error'); 
    }
  }, [editId, loadAll, showToast, storeSaveMember, debouncedSearch, statusFilter, currentPage]);

  const deleteMember = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Delete Member', message: 'Are you sure you want to delete this member? This action cannot be undone.', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await storeDeleteMember(id);
      showToast(res.message, 'success');
      if (selectedMember?.id === id) setSelectedMember(null);
    } catch (err: unknown) { 
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error'); 
    }
  }, [loadAll, showToast, selectedMember, confirm, storeDeleteMember, debouncedSearch, statusFilter, currentPage]);

  const assignWorkout = useCallback(async (memberId: string, workout: any | null) => {
    try {
      await storeAssignWorkout(memberId, workout);
      showToast('Workout plan assigned successfully', 'success');
      if (selectedMember?.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, assignedWorkoutId: workout?.id || '', assignedWorkout: workout || undefined } as Member : null);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to assign workout plan', 'error');
    }
  }, [storeAssignWorkout, showToast, selectedMember]);

  const assignDiet = useCallback(async (memberId: string, diet: any | null) => {
    try {
      await storeAssignDiet(memberId, diet);
      showToast('Diet plan assigned successfully', 'success');
      if (selectedMember?.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, assignedDietId: diet?.id || '', assignedDiet: diet || undefined } as Member : null);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to assign diet plan', 'error');
    }
  }, [storeAssignDiet, showToast, selectedMember]);

  const openMsg = useCallback((m: Member, type: MessageType) => {
    const tpl = m.status === 'EXPIRED'
      ? MSG_TEMPLATES.EXPIRED(m.name)
      : m.pendingAmount > 0
      ? MSG_TEMPLATES.PENDING(m.name, formatCurrency(m.pendingAmount))
      : MSG_TEMPLATES.DEFAULT(m.name);
    setMsgModal({ open: true, type, recipient: { name: m.name, phone: m.phone, email: m.email }, message: tpl });
  }, []);


  return {
    search, debouncedSearch, setSearch, statusFilter, setStatusFilter, currentPage, setCurrentPage,
    toast, showToast, hideToast,
    selectedMember, setSelectedMember, profileTab, setProfileTab,
    showAddModal, setShowAddModal, editId, editData,
    openAdd, openEdit, saveMember, deleteMember,
    assignWorkout, assignDiet,
    msgModal, openMsg, closeMsg
  };
}


