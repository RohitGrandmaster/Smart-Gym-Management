// RESPONSIBILITY: Zustand store — owns async server state for the Notifications module.
import { create } from 'zustand';
import { notificationsApi } from '@/app/manager/notifications/notifications_api/ManagerNotificationsApi';
import type { Notification, NotificationKPIData } from '@/app/manager/notifications/notifications_types/ManagerNotificationsTypes';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

interface NotificationsState {
  notifications: Notification[];
  kpis: NotificationKPIData;
  total: number;
  fetchState: FetchState;
  saving: boolean;
  loadAll: (params?: Record<string, string>) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useManagerNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  kpis: { total: 0, unread: 0, highPriority: 0, todayCount: 0 },
  total: 0,
  fetchState: 'idle',
  saving: false,

  loadAll: async (params) => {
    set({ fetchState: 'loading' });
    try {
      const [listRes, kpis] = await Promise.all([
        notificationsApi.getAll(params),
        notificationsApi.getKPIs(),
      ]);
      let items = listRes.data;
      if (params?.type && params.type !== 'ALL') items = items.filter(n => n.type === params.type);
      if (params?.priority && params.priority !== 'ALL') items = items.filter(n => n.priority === params.priority);
      if (params?.status && params.status !== 'ALL') items = items.filter(n => n.status === params.status);
      if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter(n => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || n.memberName?.toLowerCase().includes(q));
      }
      set({ notifications: items, total: listRes.total, kpis, fetchState: 'success' });
    } catch {
      set({ fetchState: 'error' });
    }
  },

  markRead: async (id) => {
    set({ saving: true });
    try {
      await notificationsApi.markRead(id);
      await get().loadAll();
    } finally {
      set({ saving: false });
    }
  },

  markAllRead: async () => {
    set({ saving: true });
    try {
      await notificationsApi.markAllRead();
      await get().loadAll();
    } finally {
      set({ saving: false });
    }
  },

  deleteNotification: async (id) => {
    set({ saving: true });
    try {
      await notificationsApi.deleteNotification(id);
      await get().loadAll();
    } finally {
      set({ saving: false });
    }
  },
}));
