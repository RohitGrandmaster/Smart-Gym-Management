'use client';
// RESPONSIBILITY: Renders the Affiliates data table shell (header row + rows). Delegates each row to SuperadminAffiliatesTableRow. No API calls.
import { useState } from 'react';
import SuperadminAffiliatesTableRow from '@/app/superadmin/affiliates/affiliates_components/SuperadminAffiliatesTable/SuperadminAffiliatesTableRow';
import SuperadminAffiliatesEmptyState from '@/app/superadmin/affiliates/affiliates_components/SuperadminAffiliatesEmptyState/SuperadminAffiliatesEmptyState';
import type { Affiliate, AffiliateStatus } from '@/app/superadmin/affiliates/superadmin_affiliates_types/superadmin_affiliates_types';
import SuperadminPagination from '@/app/superadmin/superadmin_components/SuperadminShared/SuperadminPagination';

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onToggleStatus: (id: string, currentStatus: AffiliateStatus) => void;
  onEdit: (affiliate: Affiliate) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function SuperadminAffiliatesTable({ affiliates, onToggleStatus, onEdit, onDelete, onAddClick }: AffiliatesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(affiliates.length / ITEMS_PER_PAGE) || 1;
  const paginatedAffiliates = affiliates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col min-h-96">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Partner Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Referral Code</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Total Referred</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Commission Earned</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedAffiliates.length === 0 ? (
              <tr>
                <td colSpan={6}><SuperadminAffiliatesEmptyState onAddClick={onAddClick} /></td>
              </tr>
            ) : (
              paginatedAffiliates.map((aff) => (
                <SuperadminAffiliatesTableRow
                  key={aff.id}
                  affiliate={aff}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
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
