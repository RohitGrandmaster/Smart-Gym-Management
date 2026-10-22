/**
 * RESPONSIBILITY: Manages the logic for the Gyms search toolbar, including search debouncing.
 * DATA FLOW: SuperadminGymsToolbar -> useSuperadminGymsToolbar -> useSuperadminGymsStore -> API
 */

/**
 * RESPONSIBILITY: Manages the logic for the Gyms search toolbar, including search debouncing.
 * DATA FLOW: SuperadminGymsToolbar -> useSuperadminGymsToolbar -> useSuperadminGymsStore -> API
 */

// DATA FLOW: Component -> useSuperadminGymsToolbar.ts -> API/Store
import { useEffect, useState, useMemo } from 'react';

import { useSuperadminGymsStore } from '@/app/superadmin/gyms/gyms_store/useSuperadminGymsStore';

export function useSuperadminGymsToolbar() {
  const search = useSuperadminGymsStore(state => state.search);
  const setSearch = useSuperadminGymsStore(state => state.setSearch);
  const statusFilter = useSuperadminGymsStore(state => state.statusFilter);
  const setStatusFilter = useSuperadminGymsStore(state => state.setStatusFilter);

  const handleSearchChange = (value: string) => {
    setSearch(value); // useQuery in useSuperadminGymsTable will handle the debouncing/refetching
  };

  return {
    search,
    handleSearchChange,
    statusFilter,
    setStatusFilter
  };
}
