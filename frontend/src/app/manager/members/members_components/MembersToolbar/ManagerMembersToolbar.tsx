// RESPONSIBILITY: Renders the toolbar for searching, filtering, and initiating the "Add Member" action.
'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, Plus } from 'lucide-react';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { MEMBER_STATUS_OPTIONS } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';

export default function ManagerMembersToolbar() {
  const { search, setSearch, statusFilter, setStatusFilter, openAdd, currentPage, setCurrentPage } = useMembersContext();
  const loadAll = useManagerMembersStore(s => s.loadAll);
  const [prevSearch, setPrevSearch] = useState(search);
  const [localSearch, setLocalSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setLocalSearch(search);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, setCurrentPage]);

  const handleRefresh = () => {
    loadAll({ search, status: statusFilter, page: currentPage.toString() });
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
      <div className="relative w-full lg:w-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <input 
          value={localSearch} 
          onChange={e => setLocalSearch(e.target.value)} 
          placeholder="Search by name or phone..." 
          className="pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page w-full lg: w-full sm:w-64  bg-input text-primary" 
        />
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
        <SearchableDropdown
          value={statusFilter}
          onChange={(val) => setStatusFilter(String(val))}
          className="w-full sm:w-48"
          options={MEMBER_STATUS_OPTIONS}
        />
 <button 
 onClick={handleRefresh} 
 className="flex justify-center items-center gap-2 px-3 py-2.5 text-sm border border-border rounded-xl hover:opacity-80 text-primary w-full sm:w-auto"
 >
 <RefreshCw size={14} /> Refresh
 </button>
 <button 
 onClick={openAdd} 
 className="flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-opacity w-full sm:w-auto"
 >
 <Plus size={16} /> Add Member
 </button>
 </div>
 </div>
 );
}

