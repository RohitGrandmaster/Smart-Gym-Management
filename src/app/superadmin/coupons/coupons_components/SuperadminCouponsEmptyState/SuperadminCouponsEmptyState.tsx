'use client';
// RESPONSIBILITY: Renders the empty state UI for the Coupons table when no coupons exist. Shows icon, message, and CTA to create first coupon.
import { Tag } from 'lucide-react';
interface CouponsEmptyStateProps {
  onCreateClick: () => void;
}

export default function SuperadminCouponsEmptyState({ onCreateClick }: CouponsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
        <Tag className="w-8 h-8 text-secondary opacity-50" />
      </div>
      <h3 className="text-base font-semibold text-foreground">No Coupons Yet</h3>
      <p className="text-sm text-secondary mt-1 max-w-xs">Create your first promotional coupon to offer discounts on new SaaS subscriptions.</p>
      <button
        onClick={onCreateClick}
        className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:active:scale-95"
      >
        Create First Coupon
      </button>
    </div>
  );
}
