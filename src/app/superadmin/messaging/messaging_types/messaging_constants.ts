// RESPONSIBILITY: Static hardcoded data and style constants for the Messaging module.
// All mock data lives here so the client component stays pure UI. Replace with API calls tomorrow.

import type { TenantMessage, SuperadminNotification, MessageChannel, MessageStatus, MessagingTenant } from '@/app/superadmin/messaging/messaging_types/messaging_types';

export const CHANNEL_STYLES: Record<MessageChannel, string> = {
  EMAIL: 'bg-primary/10 text-primary border border-primary/30',
  SMS: 'bg-success/10 text-success border border-success/30',
  IN_APP: 'bg-info/10 text-info border border-info/30',
};

export const MESSAGE_STATUS_STYLES: Record<MessageStatus, string> = {
  SENT: 'bg-success/10 text-success border border-success/30',
  DRAFT: 'bg-input text-secondary border border-border',
  FAILED: 'bg-danger/10 text-danger border border-danger/30',
  SCHEDULED: 'bg-warning/10 text-warning border border-warning/30',
};

export const INITIAL_MESSAGES: TenantMessage[] = [
  {
    id: 'msg-001', tenantId: 'gym-1234', tenantName: 'Flex Fitness Central',
    channel: 'EMAIL', subject: 'Your invoice is ready', body: 'Hi Sarah, your invoice for May 2024 is ready.',
    status: 'SENT', sentAt: '2024-05-01T10:00:00Z', scheduledAt: null, createdAt: '2024-05-01T09:55:00Z',
  },
  {
    id: 'msg-002', tenantId: 'gym-5678', tenantName: 'Iron Temple Barbell Club',
    channel: 'SMS', subject: 'Trial expiring soon', body: 'Your trial ends in 3 days. Upgrade now to keep access.',
    status: 'SENT', sentAt: '2024-05-18T08:00:00Z', scheduledAt: null, createdAt: '2024-05-18T07:58:00Z',
  },
  {
    id: 'msg-003', tenantId: 'gym-9012', tenantName: 'Zenith Yoga & Pilates',
    channel: 'EMAIL', subject: 'Welcome to GymSmart 360!', body: 'Hi Mia, welcome aboard! Here is how to get started.',
    status: 'DRAFT', sentAt: null, scheduledAt: null, createdAt: '2024-05-20T11:00:00Z',
  },
  {
    id: 'msg-004', tenantId: 'gym-3456', tenantName: 'PowerHouse Gym Koramangala',
    channel: 'IN_APP', subject: 'Action required: Payment overdue', body: 'Your subscription payment is overdue. Please update your billing.',
    status: 'SENT', sentAt: '2024-04-20T09:00:00Z', scheduledAt: null, createdAt: '2024-04-20T08:55:00Z',
  },
];

/**
 * Self-contained tenant list for the messaging module.
 * Rule 63: Zero cross-module imports — never import from gyms module.
 * Replace with API call to GET /superadmin/tenants when backend is ready.
 */
export const MESSAGING_TENANTS: MessagingTenant[] = [
  { id: 'gym-1234', name: 'Flex Fitness Central', plan: 'ENTERPRISE' },
  { id: 'gym-5678', name: 'Iron Temple Barbell Club', plan: 'PRO' },
  { id: 'gym-9012', name: 'Zenith Yoga & Pilates', plan: 'STARTER' },
  { id: 'gym-3456', name: 'PowerHouse Gym Koramangala', plan: 'PRO' },
  { id: 'gym-7890', name: 'FitZone Indiranagar', plan: 'STARTER' },
];

export const INITIAL_NOTIFICATIONS: SuperadminNotification[] = [
  { id: 'notif-1', title: 'New tenant signup', body: 'FitZone Indiranagar just signed up for a trial.', type: 'INFO', read: false, createdAt: '2024-05-22T10:00:00Z' },
  { id: 'notif-2', title: 'Payment failed', body: 'Invoice #INV-0042 for PowerHouse Gym failed to process.', type: 'WARNING', read: false, createdAt: '2024-05-21T14:30:00Z' },
  { id: 'notif-3', title: 'System alert: High DB load', body: 'Database CPU exceeded 85% for 10 minutes.', type: 'CRITICAL', read: false, createdAt: '2024-05-21T03:15:00Z' },
  { id: 'notif-4', title: 'Backup completed', body: 'Daily backup for all tenants completed successfully.', type: 'INFO', read: true, createdAt: '2024-05-20T02:00:00Z' },
  { id: 'notif-5', title: 'Trial expiring', body: 'Iron Temple Barbell Club trial expires in 6 days.', type: 'WARNING', read: true, createdAt: '2024-05-19T09:00:00Z' },
];
