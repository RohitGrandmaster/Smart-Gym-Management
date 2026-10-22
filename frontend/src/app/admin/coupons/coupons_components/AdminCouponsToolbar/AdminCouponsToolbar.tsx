// RESPONSIBILITY: Renders the search + status filter toolbar for the Coupons module.
'use client';

import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAdminCouponsStore } from '@/app/admin/coupons/coupons_store/useAdminCouponsStore';
import { useAdminCouponsLogic } from '@/app/admin/coupons/coupons_context/useAdminCouponsLogic';
import { COUPON_STATUS_OPTIONS } from '@/app/admin/coupons/coupons_utils/AdminCouponsSharedConstants';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';

export default function AdminCouponsToolbar() {
  const { statusFilter, setStatusFilter, setSearch } = useAdminCouponsStore();
  const { openAdd } = useAdminCouponsLogic();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-64"
            aria-label="Search coupons"
          />
        </div>
        <div className="w-40">
          <AdminSearchableDropdown
            options={COUPON_STATUS_OPTIONS}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as string)}
            placeholder="All Status"
          />
        </div>
      </div>
      <button
        onClick={openAdd}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors active:scale-95 whitespace-nowrap"
      >
        <Plus size={16} />
        New Coupon
      </button>
    </div>
  );
}
