'use client';
// RESPONSIBILITY: Renders the status badge pill for a single broadcast. Purely presentational — maps BroadcastStatus to design system colors.
import type { BroadcastStatusBadgeProps } from '@/app/superadmin/broadcasts/superadmin_broadcasts_types/superadmin_broadcasts_types';

export default function SuperadminBroadcastStatusBadge({ status }: BroadcastStatusBadgeProps) {
  switch (status) {
    case 'SENT':
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-success-bg text-success">SENT</span>;
    case 'SCHEDULED':
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-bg text-warning">SCHEDULED</span>;
    case 'DRAFT':
    default:
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-input text-secondary">DRAFT</span>;
  }
}
