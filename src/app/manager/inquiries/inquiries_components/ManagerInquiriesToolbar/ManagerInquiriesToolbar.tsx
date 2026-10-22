// RESPONSIBILITY: Renders the search/filter toolbar and bulk-action bar for the Inquiries module.
'use client';

import { useState, useEffect } from 'react';
import { useInquiriesContext } from '@/app/manager/inquiries/inquiries_context/ManagerInquiriesContext';
import { INQUIRIES_STATUS_LABELS } from '@/app/manager/inquiries/inquiries_utils/ManagerInquiriesSharedConstants';
import { RefreshCw, Plus, MessageCircle, Mail } from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function ManagerInquiriesToolbar() {
  const { search, setSearch, statusFilter, setStatusFilter, loadAll, openAdd, selectedIds, clearSelection, openBulkMsg, setCurrentPage } = useInquiriesContext();
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

  if (selectedIds.length > 0) {
    return (
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between transition-all">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-primary">
            {selectedIds.length} {selectedIds.length === 1 ? 'inquiry' : 'inquiries'} selected
          </span>
          <button onClick={clearSelection} className="text-sm font-medium text-secondary hover:text-primary transition-colors">
            Clear Selection
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => openBulkMsg('whatsapp')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-success hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={15} /> Bulk WhatsApp
          </button>
          <button
            onClick={() => openBulkMsg('email')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-info hover:opacity-90 transition-opacity"
          >
            <Mail size={15} /> Bulk Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 flex flex-wrap gap-3 items-center justify-between">
      <input
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        placeholder="Search name or phone..."
        className="border border-border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page  w-full sm:w-64  bg-input text-primary"
      />
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="w-48">
          <SearchableDropdown
            value={statusFilter}
            onChange={(val) => setStatusFilter(String(val))}
            options={[
              { label: 'All Status', value: 'All' },
              ...Object.entries(INQUIRIES_STATUS_LABELS)
                .filter(([val]) => val !== 'CONVERTED')
                .map(([val, label]) => ({ label, value: val })),
            ]}
          />
        </div>
        <button
          onClick={loadAll}
          className="flex items-center gap-2 px-3 py-2.5 text-sm border border-border rounded-xl hover:opacity-80 transition-opacity text-secondary"
          aria-label="Refresh inquiries"
        >
          <RefreshCw size={14} />
        </button>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover transition-all duration-200 active:scale-95"
        >
          <Plus size={16} /> Add Inquiry
        </button>
      </div>
    </div>
  );
}
