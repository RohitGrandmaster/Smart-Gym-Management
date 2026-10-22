// RESPONSIBILITY: Constants, mock data, and Zod schema for the Bulk Communications module.
import { z } from 'zod';
import type { Broadcast, BulkCommsKPIData } from '@/app/admin/bulk-communications/bulk_communications_types/bulk_communications_types';

export const CHANNEL_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
];

export const GYM_OPTIONS = [
  { value: 'all', label: 'All Gyms' },
  { value: 'g1', label: 'Andheri East' },
  { value: 'g2', label: 'Bandra West' },
  { value: 'g3', label: 'Powai' },
  { value: 'g4', label: 'Thane' },
];

export const MEMBER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Members' },
  { value: 'active', label: 'Active Members' },
  { value: 'expired', label: 'Expired Members' },
  { value: 'trial', label: 'Trial Members' },
];

export const BROADCAST_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'sent', label: 'Sent' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'failed', label: 'Failed' },
  { value: 'draft', label: 'Draft' },
];

export const BULK_COMMS_ITEMS_PER_PAGE = 10;

export const BroadcastSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  channel: z.enum(['whatsapp', 'sms', 'email']),
  gymIds: z.array(z.string()).min(1, 'Select at least one gym'),
  memberStatus: z.enum(['all', 'active', 'expired', 'trial']),
  scheduledAt: z.string(),
});

export const EMPTY_BROADCAST_FORM = {
  title: '',
  message: '',
  channel: 'whatsapp' as const,
  gymIds: ['all'],
  memberStatus: 'all' as const,
  scheduledAt: '',
};

export const MOCK_BROADCASTS: Broadcast[] = [
  { id: 'bc1', title: 'Holiday Closure — All Branches', message: 'Dear member, all GymSmart branches will be closed on 26th Jan for Republic Day. We will resume normal operations on 27th Jan. Thank you for your understanding!', channel: 'whatsapp', recipientFilter: { gymIds: ['all'], planIds: [], memberStatus: 'all' }, recipientCount: 1842, status: 'sent', sentAt: '2025-01-24T10:00:00', createdBy: 'Admin', createdAt: '2025-01-24', deliveredCount: 1798, failedCount: 44 },
  { id: 'bc2', title: 'New Year Offer — 30% Off Annual Plans', message: 'Happy New Year! Celebrate 2025 with a 30% discount on all annual memberships. Offer valid till 15th Jan. Visit your nearest branch today!', channel: 'email', recipientFilter: { gymIds: ['all'], planIds: [], memberStatus: 'expired' }, recipientCount: 423, status: 'sent', sentAt: '2025-01-01T09:00:00', createdBy: 'Admin', createdAt: '2025-01-01', deliveredCount: 418, failedCount: 5 },
  { id: 'bc3', title: 'Maintenance Notice — Powai Branch', message: 'The Powai branch will undergo scheduled maintenance on 20th June from 6AM to 10AM. We apologize for the inconvenience.', channel: 'sms', recipientFilter: { gymIds: ['g3'], planIds: [], memberStatus: 'active' }, recipientCount: 312, status: 'sent', sentAt: '2025-06-18T14:00:00', createdBy: 'Admin', createdAt: '2025-06-18', deliveredCount: 308, failedCount: 4 },
  { id: 'bc4', title: 'Renewal Reminder — Expiring This Week', message: 'Your GymSmart membership is expiring soon! Renew now and get 10% off your next plan. Visit the front desk or call us to renew.', channel: 'whatsapp', recipientFilter: { gymIds: ['all'], planIds: [], memberStatus: 'expired' }, recipientCount: 87, status: 'scheduled', scheduledAt: '2025-07-10T08:00:00', createdBy: 'Admin', createdAt: '2025-07-08' },
  { id: 'bc5', title: 'Summer Fitness Challenge', message: 'Join our 30-day Summer Fitness Challenge starting 1st July! Track your progress, win prizes, and stay motivated. Register at the front desk.', channel: 'email', recipientFilter: { gymIds: ['all'], planIds: [], memberStatus: 'active' }, recipientCount: 1420, status: 'draft', createdBy: 'Admin', createdAt: '2025-06-30' },
];

export const MOCK_BULK_COMMS_KPI: BulkCommsKPIData = {
  totalSent: 3,
  deliveryRate: 98.2,
  scheduledPending: 1,
  totalReached: 2524,
};
