// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the toolbar for searching, filtering, and initiating the "Add Member" action.
'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, Plus } from 'lucide-react';
import { useMembersContext } from '@/app/trainer/members/members_context/MembersContext';
import { useMembersStore } from '@/app/trainer/members/members_store/useMembersStore';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { MEMBER_STATUS_OPTIONS } from '@/app/trainer/members/members_utils/MembersSharedConstants';

export default function TrainerMembersToolbar() {
  const { search, setSearch, statusFilter, setStatusFilter, openAdd, currentPage } = useMembersContext();
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => { setTimeout(() => setLocalSearch(search), 0); }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, search, setSearch]);
  const loadAll = useMembersStore(s => s.loadAll);

  const handleRefresh = () => {
    loadAll({ search, status: statusFilter, page: currentPage.toString() });
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 flex flex-wrap gap-3 items-center justify-between">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <input 
          value={localSearch} 
          onChange={e => setLocalSearch(e.target.value)} 
          placeholder="Search by name or phone..." 
          className="pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page  w-full sm:w-64  bg-input text-primary" 
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <SearchableDropdown
          value={statusFilter}
          onChange={(val) => setStatusFilter(String(val))}
          className="w-48"
          options={MEMBER_STATUS_OPTIONS}
        />
  <button 
  onClick={handleRefresh} 
  className="flex items-center gap-2 px-3 py-2.5 text-sm border border-border rounded-xl hover:opacity-80 text-primary"
  >
  <RefreshCw size={14} /> Refresh
  </button>
  </div>
 </div>
 );
}

