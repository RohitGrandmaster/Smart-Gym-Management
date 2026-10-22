// RESPONSIBILITY: TypeScript types for the Bulk Communications module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type BroadcastChannel = 'whatsapp' | 'sms' | 'email';
export type BroadcastStatus = 'sent' | 'scheduled' | 'failed' | 'draft';
export type BroadcastTab = 'compose' | 'history';

export interface BroadcastRecipientFilter {
  gymIds: string[];
  planIds: string[];
  memberStatus: 'all' | 'active' | 'expired' | 'trial';
}

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  channel: BroadcastChannel;
  recipientFilter: BroadcastRecipientFilter;
  recipientCount: number;
  status: BroadcastStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
  deliveredCount?: number;
  failedCount?: number;
}

export interface BroadcastFormValues {
  title: string;
  message: string;
  channel: BroadcastChannel;
  gymIds: string[];
  memberStatus: 'all' | 'active' | 'expired' | 'trial';
  scheduledAt: string;
}

export interface BulkCommsKPIData {
  totalSent: number;
  deliveryRate: number;
  scheduledPending: number;
  totalReached: number;
}
