// RESPONSIBILITY: Renders the empty state for the Coupons table when no coupons match filters.
'use client';

import { Tag } from 'lucide-react';
import { useAdminCouponsLogic } from '@/app/admin/coupons/coupons_context/useAdminCouponsLogic';

export default function AdminCouponsEmptyState() {
  const { openAdd } = useAdminCouponsLogic();
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center">
        <Tag size={28} className="text-primary" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">No coupons found</p>
        <p className="text-sm text-secondary mt-1">Create your first discount coupon to get started</p>
      </div>
      <button
        onClick={openAdd}
        className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors"
      >
        Create Coupon
      </button>
    </div>
  );
}
