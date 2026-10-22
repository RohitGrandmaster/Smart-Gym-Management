'use client';
// RESPONSIBILITY: Renders the status badge pill for a single affiliate. Purely presentational — maps AffiliateStatus to design system colors.
import type { AffiliateStatus } from '@/app/superadmin/affiliates/superadmin_affiliates_types/superadmin_affiliates_types';

interface AffiliateStatusBadgeProps {
  status: AffiliateStatus;
}

export default function SuperadminAffiliateStatusBadge({ status }: AffiliateStatusBadgeProps) {
  switch (status) {
    case 'ACTIVE':
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-success-bg text-success">ACTIVE</span>;
    case 'INACTIVE':
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-input text-secondary">INACTIVE</span>;
    default:
      return null;
  }
}
