'use client';
// RESPONSIBILITY: Renders the Coupons data table shell (header row + rows). Delegates each row to CouponsTableRow. No API calls.

import { useState } from 'react';
import SuperadminCouponsTableRow from '@/app/superadmin/coupons/coupons_components/SuperadminCouponsTable/SuperadminCouponsTableRow';
import SuperadminCouponsEmptyState from '@/app/superadmin/coupons/coupons_components/SuperadminCouponsEmptyState/SuperadminCouponsEmptyState';
import type { Coupon, CouponStatus } from '@/app/superadmin/coupons/superadmin_coupons_types/superadmin_coupons_types';
import SuperadminPagination from '@/app/superadmin/superadmin_components/SuperadminShared/SuperadminPagination';

interface CouponsTableProps {
  coupons: Coupon[];
  onToggleStatus: (id: string, currentStatus: CouponStatus) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onCreateClick: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function SuperadminCouponsTable({ coupons, onToggleStatus, onEdit, onDelete, onRestore, onCreateClick }: CouponsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(coupons.length / ITEMS_PER_PAGE) || 1;
  const paginatedCoupons = coupons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col min-h-96">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Discount</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Usage</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedCoupons.length === 0 ? (
              <tr>
                <td colSpan={6}><SuperadminCouponsEmptyState onCreateClick={onCreateClick} /></td>
              </tr>
            ) : (
              paginatedCoupons.map((cpn) => (
                <SuperadminCouponsTableRow
                  key={cpn.id}
                  coupon={cpn}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onRestore={onRestore}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <SuperadminPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
