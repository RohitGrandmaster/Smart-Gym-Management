// RESPONSIBILITY: Custom hook encapsulating UI state and orchestrating actions for the members module. Async state is in useManagerMembersStore.
// DATA FLOW: UI Interactions -> useManagerMembersLogic -> useManagerMembersStore -> API
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Member, MembersContextType, MembersInitialData } from '@/app/manager/members/members_types/ManagerMembersTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { MessageType, ManagerMessageRecipient } from '@/app/manager/manager_components/ManagerFeedback/ManagerMessageModal';
import { EMPTY_MEMBER_FORM, formatCurrency, MSG_TEMPLATES, MemberFormValues } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import { useDebounce } from '@/app/manager/manager_utils/useDebounce';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { useManagerMembersMutations } from './useManagerMembersMutations';
import { useManagerMembersPrintLogic } from './useManagerMembersPrintLogic';

export function useManagerMembersLogic(initialData?: MembersInitialData | null): MembersContextType {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Zustand Store
  const hydrate = useManagerMembersStore((s) => s.hydrate);
  const loadAll = useManagerMembersStore((s) => s.loadAll);
  const trainers = useManagerMembersStore((s) => s.trainers);

  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (initialData) {
      hydrate(initialData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<MemberFormValues | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'attendance' | 'payments' | 'workout' | 'diet'>('overview');
  const [msgModal, setMsgModal] = useState<{ open: boolean; recipient: ManagerMessageRecipient; type: MessageType; message: string; subject?: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
  const hideToast = useCallback(() => setToast(null), []);
  const closeMsg = useCallback(() => setMsgModal(null), []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
    }
    loadAll({ search: debouncedSearch, status: statusFilter, page: currentPage.toString() }).catch(() => {
      showToast('Failed to load members', 'error');
    });
  }, [loadAll, debouncedSearch, statusFilter, currentPage, showToast, initialData]);

  useEffect(() => {
    if (searchParams.get('action') === 'add_member') {
      const name = searchParams.get('name') || '';
      const phone = searchParams.get('phone') || '';
      const email = searchParams.get('email') || '';
      setTimeout(() => {
        setEditId(null);
        setEditData({
          ...EMPTY_MEMBER_FORM,
          name, phone, email
        });
        setShowAddModal(true);
        
        setUrlParam('action', null);
        setUrlParam('name', null);
        setUrlParam('phone', null);
        setUrlParam('email', null);
      }, 0);
    }
  }, [searchParams, setUrlParam]);

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
      aadhaar: m.aadhaar || '',
      medicalHistory: m.medicalHistory || '',
      gender: (m.gender || 'MALE') as "MALE"|"FEMALE"|"OTHER", 
      billingCycle: m.billingCycle, 
      customDays: 0,
      planId: String(m.planId),
      joinDate: m.joinDate ? m.joinDate.split('T')[0] : '',
      expiryDate: m.expiryDate ? m.expiryDate.split('T')[0] : '',
      paidAmount: m.paidAmount || 0,
      totalAmount: (m.paidAmount || 0) + (m.pendingAmount || 0)
    } as MemberFormValues);
    setShowAddModal(true);
  }, []);

  const { saveMember, deleteMember, assignDiet, assignWorkout, renewMember, recordPayment, freezeMember, toggleSuspend, assignTrainer } = useManagerMembersMutations(
    showToast, selectedMember, setSelectedMember, editId, setShowAddModal, setShowRenewModal, setShowPaymentModal
  );

  const { printData, setPrintData, handlePrint, handleSharePaymentWhatsApp } = useManagerMembersPrintLogic(
    selectedMember, showToast
  );

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
    selectedMember, setSelectedMember, profileTab, setProfileTab, trainers,
    showAddModal, setShowAddModal, editId, editData,
    showRenewModal, setShowRenewModal,
    showPaymentModal, setShowPaymentModal,
    openAdd, openEdit, saveMember, deleteMember, assignDiet, assignWorkout, renewMember, recordPayment, freezeMember, toggleSuspend, assignTrainer,
    msgModal, openMsg, closeMsg,
    printData, handlePrint, handleSharePaymentWhatsApp, setPrintData
  };
}
