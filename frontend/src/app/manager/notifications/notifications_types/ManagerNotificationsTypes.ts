// RESPONSIBILITY: All TypeScript types for the Notifications module.

export type NotificationType = 'SYSTEM' | 'PAYMENT' | 'EXPIRY' | 'ATTENDANCE' | 'INQUIRY' | 'ANNOUNCEMENT';
export type NotificationStatus = 'UNREAD' | 'READ';
export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  memberId?: string;
  memberName?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationKPIData {
  total: number;
  unread: number;
  highPriority: number;
  todayCount: number;
}
