// RESPONSIBILITY: React Context — bridges Zustand notifications store with UI state (filters, pagination).
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useManagerNotificationsStore } from '@/app/manager/notifications/notifications_store/useManagerNotificationsStore';
import toast from 'react-hot-toast';

interface NotificationsContextValue {
  notifications: ReturnType<typeof useManagerNotificationsStore.getState>['notifications'];
  kpis: ReturnType<typeof useManagerNotificationsStore.getState>['kpis'];
  fetchState: ReturnType<typeof useManagerNotificationsStore.getState>['fetchState'];
  saving: boolean;
  search: string;
  setSearch: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  priorityFilter: string;
  setPriorityFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  handleMarkRead: (id: string) => Promise<void>;
  handleMarkAllRead: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

const ManagerNotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { notifications, kpis, fetchState, saving, loadAll, markRead, markAllRead, deleteNotification } = useManagerNotificationsStore();

  const reload = useCallback(() => {
    loadAll({ search, type: typeFilter, priority: priorityFilter, status: statusFilter });
  }, [search, typeFilter, priorityFilter, statusFilter, loadAll]);

  useEffect(() => {
    const t = setTimeout(reload, 300);
    return () => clearTimeout(t);
  }, [reload]);

  const handleMarkRead = useCallback(async (id: string) => {
    await markRead(id);
    toast.success('Marked as read.');
  }, [markRead]);

  const handleMarkAllRead = useCallback(async () => {
    await markAllRead();
    toast.success('All notifications marked as read.');
  }, [markAllRead]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteNotification(id);
    toast.success('Notification dismissed.');
  }, [deleteNotification]);

  return (
    <ManagerNotificationsContext.Provider value={{
      notifications, kpis, fetchState, saving,
      search, setSearch,
      typeFilter, setTypeFilter,
      priorityFilter, setPriorityFilter,
      statusFilter, setStatusFilter,
      handleMarkRead, handleMarkAllRead, handleDelete,
    }}>
      {children}
    </ManagerNotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const ctx = useContext(ManagerNotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
  return ctx;
}
