// RESPONSIBILITY: Business logic hook for Announcements — queries, mutations, filtering.
'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { announcementsApi } from '@/app/admin/announcements/announcements_api/announcements_api';
import { useAdminAnnouncementsStore } from '@/app/admin/announcements/announcements_store/useAdminAnnouncementsStore';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { ANNOUNCEMENTS_ITEMS_PER_PAGE, EMPTY_ANNOUNCEMENT_FORM } from '@/app/admin/announcements/announcements_utils/AdminAnnouncementsSharedConstants';
import type { Announcement, AnnouncementFormValues, FetchState } from '@/app/admin/announcements/announcements_types/announcements_types';

export function useAdminAnnouncementsLogic() {
  const { confirm } = useAdminConfirm();
  const qc = useQueryClient();
  const {
    search, statusFilter, priorityFilter, gymFilter,
    currentPage, setCurrentPage,
    showModal, setShowModal,
    editingAnnouncement, setEditingAnnouncement,
    setForm,
  } = useAdminAnnouncementsStore();

  const { data: announcements = [], isLoading, isError } = useQuery({
    queryKey: ['adminAnnouncements'],
    queryFn: announcementsApi.fetchAnnouncements,
    staleTime: 1000 * 60 * 2,
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminAnnouncementsKPIs'],
    queryFn: announcementsApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const filtered = announcements.filter((a: Announcement) => {
    const q = search.toLowerCase();
    const matchSearch = !search || a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    const matchGym = gymFilter === 'all' || a.gymIds.includes(gymFilter) || a.gymIds.includes('all');
    return matchSearch && matchStatus && matchPriority && matchGym;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ANNOUNCEMENTS_ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ANNOUNCEMENTS_ITEMS_PER_PAGE, currentPage * ANNOUNCEMENTS_ITEMS_PER_PAGE);

  const createMutation = useMutation({
    mutationFn: (payload: AnnouncementFormValues) => announcementsApi.createAnnouncement(payload),
    onSuccess: () => {
      toast.success('Announcement created successfully');
      setShowModal(false);
      qc.invalidateQueries({ queryKey: ['adminAnnouncements'] });
      qc.invalidateQueries({ queryKey: ['adminAnnouncementsKPIs'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AnnouncementFormValues }) =>
      announcementsApi.updateAnnouncement(id, payload),
    onSuccess: () => {
      toast.success('Announcement updated');
      setShowModal(false);
      setEditingAnnouncement(null);
      qc.invalidateQueries({ queryKey: ['adminAnnouncements'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementsApi.deleteAnnouncement(id),
    onSuccess: () => {
      toast.success('Announcement deleted');
      qc.invalidateQueries({ queryKey: ['adminAnnouncements'] });
      qc.invalidateQueries({ queryKey: ['adminAnnouncementsKPIs'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const pinMutation = useMutation({
    mutationFn: (id: string) => announcementsApi.togglePin(id),
    onSuccess: (data) => {
      toast.success(data.isPinned ? 'Announcement pinned' : 'Announcement unpinned');
      qc.invalidateQueries({ queryKey: ['adminAnnouncements'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const openCreate = useCallback(() => {
    setEditingAnnouncement(null);
    setForm(EMPTY_ANNOUNCEMENT_FORM);
    setShowModal(true);
  }, [setEditingAnnouncement, setForm, setShowModal]);

  const openEdit = useCallback((a: Announcement) => {
    setEditingAnnouncement(a);
    setForm({
      title: a.title,
      body: a.body,
      priority: a.priority,
      audience: a.audience,
      gymIds: a.gymIds,
      publishedAt: a.publishedAt.slice(0, 16),
      expiresAt: a.expiresAt.slice(0, 16),
      isPinned: a.isPinned,
    });
    setShowModal(true);
  }, [setEditingAnnouncement, setForm, setShowModal]);

  const saveAnnouncement = useCallback((data: AnnouncementFormValues) => {
    if (editingAnnouncement) {
      updateMutation.mutate({ id: editingAnnouncement.id, payload: data });
    } else {
      createMutation.mutate(data);
    }
  }, [editingAnnouncement, createMutation, updateMutation]);

  const deleteAnnouncement = useCallback(async (id: string, title: string) => {
    const ok = await confirm({
      title: 'Delete Announcement',
      message: `Delete "${title}"? This cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
    });
    if (!ok) return;
    deleteMutation.mutate(id);
  }, [confirm, deleteMutation]);

  const togglePin = useCallback((id: string) => { pinMutation.mutate(id); }, [pinMutation]);

  return {
    paginated, filtered, fetchState, kpis,
    showModal, setShowModal, editingAnnouncement,
    openCreate, openEdit, saveAnnouncement, deleteAnnouncement, togglePin,
    saving: createMutation.isPending || updateMutation.isPending,
    currentPage, setCurrentPage, totalPages, totalItems: filtered.length,
  };
}
