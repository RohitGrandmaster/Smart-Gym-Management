// RESPONSIBILITY: Renders the search, status filter, branch filter, and expiry filter toolbar for Admin Members.
'use client';

import { Search } from 'lucide-react';
import { useAdminMembersStore } from '@/app/admin/members/members_store/useAdminMembersStore';
import { useAdminBranchesData } from '@/app/admin/admin_store/useAdminBranchesData';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';
import { MEMBER_STATUS_OPTIONS, EXPIRY_FILTER_OPTIONS } from '@/app/admin/members/members_utils/AdminMembersSharedConstants';
import type { MemberStatus } from '@/app/admin/members/members_types/AdminMembersTypes';
import type { Branch } from '@/app/admin/admin_store/useAdminGlobalStore';

export default function AdminMembersToolbar() {
  const { search, setSearch, statusFilter, setStatusFilter, branchFilter, setBranchFilter, expiryFilter, setExpiryFilter } = useAdminMembersStore();
  const { data: branches = [] } = useAdminBranchesData();

  const branchOptions = [
    { value: 'all', label: 'All Branches' },
    ...(branches as Branch[]).map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="relative flex-1 min-w-48">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-secondary"
          aria-label="Search members"
        />
      </div>
      <div className="w-full sm:w-44">
        <AdminSearchableDropdown
          options={MEMBER_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as MemberStatus | 'all')}
          placeholder="All Status"
        />
      </div>
      <div className="w-full sm:w-48">
        <AdminSearchableDropdown
          options={branchOptions}
          value={branchFilter}
          onChange={(v) => setBranchFilter(v as string)}
          placeholder="All Branches"
        />
      </div>
      <div className="w-full sm:w-52">
        <AdminSearchableDropdown
          options={EXPIRY_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={expiryFilter}
          onChange={(v) => setExpiryFilter(v as 'all' | 'this_week' | 'this_month')}
          placeholder="All Members"
        />
      </div>
    </div>
  );
}
