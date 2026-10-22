// RESPONSIBILITY: Defines all TypeScript types, Zod schemas, and form data shapes for the Broadcasts module. Single source of truth for broadcast data contracts.
import { z } from 'zod';
export type BroadcastStatus = 'SENT' | 'SCHEDULED' | 'DRAFT';
export type BroadcastAudience = 'ALL_TENANTS' | 'PRO_ONLY' | 'SUSPENDED_ONLY';

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  status: BroadcastStatus;
  targetGymIds: string[];
  scheduledDate: string | null;
  sentDate: string | null;
}

export const BroadcastSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(5, 'Content must be at least 5 characters'),
  targetGymIds: z.array(z.string()).min(1, 'Select at least one gym'),
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENT']),
  scheduledDate: z.string().optional().nullable(),
}).refine((data) => {
  if (data.status === 'SCHEDULED' && !data.scheduledDate) return false;
  return true;
}, { message: 'Scheduled date is required when status is SCHEDULED', path: ['scheduledDate'] });

export type BroadcastFormData = z.infer<typeof BroadcastSchema>;

export interface BroadcastsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter?: 'ALL' | 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
  onStatusFilterChange?: (value: 'ALL' | 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED') => void;
  onCreateClick: () => void;
}

export interface BroadcastsTableProps {
  broadcasts: Broadcast[];
  onSend: (id: string) => void;
  onEdit: (broadcast: Broadcast) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export interface BroadcastStatusBadgeProps {
  status: BroadcastStatus;
}

export interface BroadcastsEmptyStateProps {
  onCreateClick: () => void;
}
