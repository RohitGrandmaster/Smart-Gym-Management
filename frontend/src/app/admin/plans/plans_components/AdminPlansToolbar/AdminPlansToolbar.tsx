// RESPONSIBILITY: Renders the search input and "Create Plan" CTA button for the Plans module toolbar.
'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Plus, Search } from 'lucide-react';
import { useAdminPlansLogic } from '@/app/admin/plans/plans_context/useAdminPlansLogic';
import { useAdminPlansStore } from '@/app/admin/plans/plans_store/useAdminPlansStore';
import { TIERS } from '@/app/admin/plans/plans_utils/AdminPlansSharedConstants';

export default function AdminPlansToolbar() {
  const { plans, fetchState, saving, search, setSearch, tierFilter, setTierFilter, currentPage, setCurrentPage, loadPlans, openAdd, openEdit, savePlan, deletePlan } = useAdminPlansLogic();
  const { showModal, setShowModal, editId, form, setForm, toast, showToast, hideToast } = useAdminPlansStore();

  const [localSearch, setLocalSearch] = useState(search);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, setCurrentPage]);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 flex flex-wrap gap-3 justify-between items-center mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-secondary hidden sm:block">
          Active Plans: <span className="font-bold text-primary">{plans.length}</span>
        </p>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input 
            value={localSearch} 
            onChange={e => setLocalSearch(e.target.value)} 
            placeholder="Search plans..." 
            className="pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page w-48 sm: w-full sm:w-64  bg-input text-primary" 
          />
        </div>
        <select 
          value={tierFilter} 
          onChange={e => setTierFilter(e.target.value)} 
          className="px-3 py-2 border border-border rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-foreground"
        >
          <option value="All">All Tiers</option>
          {TIERS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
 <button 
 onClick={loadPlans} 
 className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-primary-subtle text-secondary transition-colors"
 >
 <RefreshCw size={14} />
 </button>
 <button 
 onClick={openAdd} 
 className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg transition-colors hover:bg-primary/90" 
 >
 <Plus size={16} /> Create Plan
 </button>
 </div>
 </div>
 );
}



