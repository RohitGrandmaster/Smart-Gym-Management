// RESPONSIBILITY: Data logic hook for Admin Members. Fetches members + summary, applies filters, manages selected member.
// DATA FLOW: Mock API → useAdminMembersLogic → AdminMembersMain → child components
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAdminMembersStore } from '@/app/admin/members/members_store/useAdminMembersStore';
import { useAdminGlobalStore } from '@/app/admin/admin_store/useAdminGlobalStore';
import { ADMIN_MOCK_MEMBERS, ADMIN_MOCK_MEMBERS_SUMMARY, ADMIN_MEMBERS_ITEMS_PER_PAGE } from '@/app/admin/members/members_utils/AdminMembersSharedConstants';
import type { AdminMember, AdminMembersSummary, FetchState } from '@/app/admin/members/members_types/AdminMembersTypes';
import { useDebounce } from '@/app/admin/admin_utils/useDebounce';

export function useAdminMembersLogic() {
  const { selectedBranchId } = useAdminGlobalStore();
  const { search, statusFilter, branchFilter, expiryFilter, currentPage, setCurrentPage } = useAdminMembersStore();
  const [fetchState, setFetchState] = useState<FetchState>('success');
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [summary] = useState<AdminMembersSummary>(ADMIN_MOCK_MEMBERS_SUMMARY);

  const debouncedSearch = useDebounce(search, 300);

  const filteredMembers = useMemo(() => {
    const activeBranch = selectedBranchId !== 'all' ? selectedBranchId : branchFilter;
    return ADMIN_MOCK_MEMBERS.filter((m) => {
      const matchesBranch = activeBranch === 'all' || m.branchId === activeBranch;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchesSearch = !debouncedSearch ||
        m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.phone.includes(debouncedSearch);
      const matchesExpiry = expiryFilter === 'all' ||
        (expiryFilter === 'this_week' && (m.id === 'm10' || m.id === 'm11')) ||
        (expiryFilter === 'this_month' && (m.id === 'm10' || m.id === 'm11' || m.id === 'm2'));
      return matchesBranch && matchesStatus && matchesSearch && matchesExpiry;
    });
  }, [debouncedSearch, statusFilter, branchFilter, expiryFilter, selectedBranchId]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / ADMIN_MEMBERS_ITEMS_PER_PAGE));
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ADMIN_MEMBERS_ITEMS_PER_PAGE,
    currentPage * ADMIN_MEMBERS_ITEMS_PER_PAGE
  );

  const loadAll = useCallback(async () => {
    setFetchState('loading');
    await new Promise((r) => setTimeout(r, 400));
    setFetchState('success');
  }, []);

  return {
    members: paginatedMembers,
    allFilteredCount: filteredMembers.length,
    summary,
    fetchState,
    error,
    selectedMember,
    setSelectedMember,
    currentPage,
    setCurrentPage,
    totalPages,
    loadAll,
  };
}
