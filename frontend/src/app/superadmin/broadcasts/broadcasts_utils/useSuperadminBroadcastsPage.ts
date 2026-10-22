// RESPONSIBILITY: useSuperadminBroadcastsPage.ts encapsulates all state and async logic for the Broadcasts page.
// DATA FLOW: superadminApi Ã¢â€ â€™ useSuperadminBroadcastsPage Ã¢â€ â€™ SuperadminBroadcastsClient
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuperadminMutation } from '@/app/superadmin/superadmin_utils/hooks/useSuperadminMutation';
import { BroadcastSchema, type BroadcastFormData, type Broadcast, type BroadcastStatus } from '@/app/superadmin/broadcasts/superadmin_broadcasts_types/superadmin_broadcasts_types';
import toast from 'react-hot-toast';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useQuery } from '@tanstack/react-query';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import type { Tenant } from '@/app/superadmin/superadmin_types/superadmin_types';
import { MOCK_GYMS } from '@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants';

/** LocalStorage key for persisting broadcasts across refreshes (TC-28/29 fix) */
const BROADCASTS_STORAGE_KEY = 'superadmin_broadcasts_v1';

const DEFAULT_BROADCASTS: Broadcast[] = [
  { id: '1', title: 'System Maintenance', content: 'Scheduled downtime this weekend.', targetGymIds: ['1', '2'], status: 'SENT', scheduledDate: null, sentDate: '2023-08-10' }
];

export const useSuperadminBroadcastsPage = () => {
  const [persistedBroadcasts, setPersistedBroadcasts] = useLocalStorage<Broadcast[] | null>(BROADCASTS_STORAGE_KEY, null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  
  useEffect(() => {
    if (!persistedBroadcasts) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPersistedBroadcasts(DEFAULT_BROADCASTS);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBroadcasts(DEFAULT_BROADCASTS);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBroadcasts(persistedBroadcasts);
    }
  }, [persistedBroadcasts, setPersistedBroadcasts]);

  const updateBroadcasts = useCallback((newBroadcasts: Broadcast[] | ((prev: Broadcast[]) => Broadcast[])) => {
    setBroadcasts(prev => {
      const updated = typeof newBroadcasts === 'function' ? newBroadcasts(prev) : newBroadcasts;
      setPersistedBroadcasts(updated);
      return updated;
    });
  }, [setPersistedBroadcasts]);

  const fetchState = 'success';
  const error = null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED'>('ALL');

  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [queueRecipients, setQueueRecipients] = useState<{id: string; name: string; phone: string}[]>([]);
  const [queueTitle, setQueueTitle] = useState('');

  const { data: fetchRes } = useQuery({
    queryKey: ['superadmin', 'gyms'],
    queryFn: () => superadminApi.gyms.fetchGyms(),
  });

  const rawGyms = (fetchRes?.data as Tenant[]) ?? [];
  const gyms = rawGyms.length > 0 ? rawGyms : MOCK_GYMS;

  const form = useForm<BroadcastFormData>({
    resolver: zodResolver(BroadcastSchema),
    defaultValues: {
      title: '',
      content: '',
      targetGymIds: [],
      status: 'DRAFT',
      scheduledDate: '',
    },
  });

  const { mutate, isMutating } = useSuperadminMutation();

  const handleCreateBroadcast = useCallback(async (data: BroadcastFormData) => {
    const { scheduledDate, ...rest } = data;
    const payload = scheduledDate ? { ...rest, scheduledDate } : rest;
    const isSendingNow = payload.status === 'SENT';

    let newB: Broadcast | null = null;
    
    if (editingId) {
      updateBroadcasts(prev => prev.map(b => b.id === editingId ? { ...b, ...payload } as Broadcast : b));
      setIsModalOpen(false);
      setEditingId(null);
      form.reset();
      if (!isSendingNow) toast.success('Broadcast updated successfully');
    } else {
      newB = { ...payload, id: `b-${Date.now()}`, sentDate: isSendingNow ? new Date().toISOString() : undefined } as Broadcast;
      updateBroadcasts(prev => [newB!, ...prev]);
      setIsModalOpen(false);
      form.reset();
      if (!isSendingNow) toast.success('Broadcast created successfully');
    }

    if (isSendingNow) {
      const selectedGyms = gyms?.filter((g: Tenant) => payload.targetGymIds?.includes(g.id)) || [];
      const recipients = selectedGyms.map((g: Tenant) => ({ id: g.id, name: g.name, phone: g.phone }));
      setQueueRecipients(recipients);
      setQueueTitle(payload.title);
      setQueueModalOpen(true);
    }
  }, [form, editingId, updateBroadcasts, gyms]);

  const handleDeleteBroadcast = useCallback(async (id: string) => {
    updateBroadcasts(prev => prev.filter(b => b.id !== id));
    toast.success('Broadcast deleted successfully');
  }, [updateBroadcasts]);

  const handleSendBroadcast = useCallback(async (id: string) => {
    const b = broadcasts.find(b => b.id === id);
    if (!b) return;

    updateBroadcasts(prev => prev.map(item => item.id === id ? { ...item, status: 'SENT', sentDate: new Date().toISOString() } : item));
    
    const selectedGyms = gyms?.filter((g: Tenant) => b.targetGymIds?.includes(g.id)) || [];
    const recipients = selectedGyms.map((g: Tenant) => ({ id: g.id, name: g.name, phone: g.phone }));
    setQueueRecipients(recipients);
    setQueueTitle(b.title);
    setQueueModalOpen(true);
  }, [updateBroadcasts, broadcasts, gyms]);

  const onQueueComplete = useCallback(() => {
    setQueueModalOpen(false);
    toast.success('Automated broadcast finished successfully!');
  }, []);

  const openEditModal = useCallback((broadcast: Broadcast) => {
    setEditingId(broadcast.id);
    form.reset({
      title: broadcast.title,
      content: broadcast.content,
      targetGymIds: broadcast.targetGymIds || [],
      status: broadcast.status as BroadcastStatus,
      scheduledDate: broadcast.scheduledDate
        ? new Date(broadcast.scheduledDate).toISOString().slice(0, 16)
        : '',
    });
    setIsModalOpen(true);
  }, [form]);

  const openCreateModal = useCallback(() => {
    setEditingId(null);
    form.reset({
      title: '',
      content: '',
      targetGymIds: [],
      status: 'DRAFT',
      scheduledDate: '',
    });
    setIsModalOpen(true);
  }, [form]);

  const filteredBroadcasts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return broadcasts.filter(b => {
      const matchesSearch = (b.title || '').toLowerCase().includes(lowerQuery) ||
                            (b.content || '').toLowerCase().includes(lowerQuery);
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [broadcasts, searchQuery, statusFilter]);

  return {
    fetchState,
    error,
    broadcasts: filteredBroadcasts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    setIsModalOpen,
    form,
    handleCreateBroadcast,
    handleDeleteBroadcast,
    handleSendBroadcast,
    openEditModal,
    openCreateModal,
    editingId,
    isMutating,
    queueModalOpen,
    queueRecipients,
    queueTitle,
    onQueueComplete
  };
};

