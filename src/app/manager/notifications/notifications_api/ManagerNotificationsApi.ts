// RESPONSIBILITY: Strongly-typed API calls for the Notifications module (mock until backend ready).
import type { Notification, NotificationKPIData } from '@/app/manager/notifications/notifications_types/ManagerNotificationsTypes';
import { MOCK_NOTIFICATIONS, MOCK_NOTIFICATION_KPIS } from '@/app/manager/notifications/notifications_utils/ManagerNotificationsSharedConstants';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const notificationsApi = {
  getAll: async (_params?: Record<string, string>): Promise<{ data: Notification[]; total: number }> => {
    await delay(350);
    return { data: [...MOCK_NOTIFICATIONS], total: MOCK_NOTIFICATIONS.length };
  },

  getKPIs: async (): Promise<NotificationKPIData> => {
    await delay(200);
    return { ...MOCK_NOTIFICATION_KPIS };
  },

  markRead: async (id: string): Promise<void> => {
    await delay(150);
    const n = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (n) { n.status = 'READ'; n.readAt = new Date().toISOString(); }
  },

  markAllRead: async (): Promise<void> => {
    await delay(300);
    MOCK_NOTIFICATIONS.forEach(n => { n.status = 'READ'; n.readAt = new Date().toISOString(); });
  },

  deleteNotification: async (id: string): Promise<void> => {
    await delay(200);
    const idx = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
    if (idx !== -1) MOCK_NOTIFICATIONS.splice(idx, 1);
  },
};
