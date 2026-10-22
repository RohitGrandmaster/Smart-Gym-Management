// RESPONSIBILITY: Mock data, badge styles, and filter options for the Notifications module.
import type { Notification, NotificationKPIData } from '@/app/manager/notifications/notifications_types/ManagerNotificationsTypes';

export const NOTIFICATION_TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  SYSTEM:       { bg: 'bg-secondary/10', text: 'text-secondary', label: 'System'       },
  PAYMENT:      { bg: 'bg-success/10',   text: 'text-success',   label: 'Payment'      },
  EXPIRY:       { bg: 'bg-danger/10',    text: 'text-danger',    label: 'Expiry'       },
  ATTENDANCE:   { bg: 'bg-info/10',      text: 'text-info',      label: 'Attendance'   },
  INQUIRY:      { bg: 'bg-warning/10',   text: 'text-warning',   label: 'Inquiry'      },
  ANNOUNCEMENT: { bg: 'bg-primary/10',   text: 'text-primary',   label: 'Announcement' },
};

export const NOTIFICATION_PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  HIGH:   { bg: 'bg-danger/10',  text: 'text-danger'  },
  MEDIUM: { bg: 'bg-warning/10', text: 'text-warning' },
  LOW:    { bg: 'bg-info/10',    text: 'text-info'    },
};

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'EXPIRY',       priority: 'HIGH',   status: 'UNREAD', title: 'Membership Expiring Soon',    message: 'Rahul Sharma\'s membership expires in 3 days.',          memberName: 'Rahul Sharma',  createdAt: daysAgo(0) },
  { id: '2', type: 'PAYMENT',      priority: 'HIGH',   status: 'UNREAD', title: 'Payment Overdue',             message: 'Priya Patel has an overdue payment of ₹2,500.',          memberName: 'Priya Patel',   createdAt: daysAgo(0) },
  { id: '3', type: 'EXPIRY',       priority: 'HIGH',   status: 'UNREAD', title: 'Membership Expired',          message: 'Amit Kumar\'s membership expired yesterday.',            memberName: 'Amit Kumar',    createdAt: daysAgo(1) },
  { id: '4', type: 'INQUIRY',      priority: 'MEDIUM', status: 'UNREAD', title: 'New Inquiry Received',        message: 'Sneha Reddy submitted a trial session inquiry.',         memberName: 'Sneha Reddy',   createdAt: daysAgo(1) },
  { id: '5', type: 'PAYMENT',      priority: 'MEDIUM', status: 'READ',   title: 'Payment Received',            message: 'Vikram Singh paid ₹3,000 via UPI.',                     memberName: 'Vikram Singh',  createdAt: daysAgo(2) },
  { id: '6', type: 'ATTENDANCE',   priority: 'LOW',    status: 'READ',   title: 'Low Attendance Alert',        message: 'Neha Joshi has not checked in for 7 days.',             memberName: 'Neha Joshi',    createdAt: daysAgo(2) },
  { id: '7', type: 'ANNOUNCEMENT', priority: 'MEDIUM', status: 'UNREAD', title: 'New Announcement from Admin', message: 'Gym will be closed on 26th Jan for Republic Day.',                                    createdAt: daysAgo(3) },
  { id: '8', type: 'SYSTEM',       priority: 'LOW',    status: 'READ',   title: 'System Maintenance',          message: 'Scheduled maintenance on Sunday 2–4 AM.',                                            createdAt: daysAgo(4) },
  { id: '9', type: 'EXPIRY',       priority: 'HIGH',   status: 'UNREAD', title: 'Membership Expiring Soon',    message: 'Deepak Verma\'s membership expires in 5 days.',         memberName: 'Deepak Verma',  createdAt: daysAgo(0) },
  { id: '10', type: 'PAYMENT',     priority: 'MEDIUM', status: 'READ',   title: 'Partial Payment Received',    message: 'Kavya Nair paid ₹1,500 of ₹3,000 due.',                memberName: 'Kavya Nair',    createdAt: daysAgo(5) },
];

export const MOCK_NOTIFICATION_KPIS: NotificationKPIData = {
  total: MOCK_NOTIFICATIONS.length,
  unread: MOCK_NOTIFICATIONS.filter(n => n.status === 'UNREAD').length,
  highPriority: MOCK_NOTIFICATIONS.filter(n => n.priority === 'HIGH').length,
  todayCount: MOCK_NOTIFICATIONS.filter(n => n.createdAt >= daysAgo(1)).length,
};

export const NOTIFICATION_TYPE_OPTIONS = ['ALL', 'PAYMENT', 'EXPIRY', 'ATTENDANCE', 'INQUIRY', 'ANNOUNCEMENT', 'SYSTEM'];
export const NOTIFICATION_PRIORITY_OPTIONS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];
export const NOTIFICATION_STATUS_OPTIONS = ['ALL', 'UNREAD', 'READ'];
