// RESPONSIBILITY: Contains constants for Superadmin Tickets
import type { TicketPriority, TicketStatus } from '@/app/superadmin/tickets/superadmin_tickets_types/superadmin_tickets_types';

export const PriorityColors: Record<TicketPriority, string> = {
  LOW: 'text-success bg-success/10 border-success/20',
  MEDIUM: 'text-primary bg-primary/10 border-primary/20',
  HIGH: 'text-warning bg-warning/10 border-warning/20',
  CRITICAL: 'text-danger bg-danger-bg/10 border-destructive/20'
};

export const StatusColors: Record<TicketStatus, string> = {
  OPEN: 'text-warning',
  IN_PROGRESS: 'text-primary',
  RESOLVED: 'text-success'
};
