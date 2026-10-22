// RESPONSIBILITY: Renders the tabbed view switching between Diet Plans and Exercises in the Diet Library.
'use client';

import { RefreshCw, Plus, Search } from 'lucide-react';
import { useLibraryContext } from '@/app/manager/library/library_context/ManagerLibraryContext';
export default function ManagerLibraryTabs() {
  const { loadAll, openAddDiet, search, setSearch, setCurrentPage } = useLibraryContext();

  return (
    <div className="border-b border-border flex flex-wrap gap-4 justify-between items-center bg-card p-2 sm:p-0">
      <div className="flex overflow-x-auto">
        <h2 className="px-5 py-3.5 text-lg font-bold text-foreground whitespace-nowrap">View Diet Plans</h2>
      </div>
      <div className="px-4 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input 
            value={search} 
            onChange={e => { setSearch(e.target.value);  }} 
            placeholder="Search diet plans..." 
            className="pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-40 sm:w-full sm:max-w-[16rem] bg-input text-foreground" 
          />
        </div>
 <button 
 onClick={loadAll} 
 className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-primary-subtle text-secondary transition-colors"
 >
 <RefreshCw size={14} />
 </button>
 <button 
 onClick={openAddDiet} 
 className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg transition-colors hover:bg-primary/90" 
 >
 <Plus size={14} /> Add Diet Plan
 </button>
 </div>
 </div>
 );
}

