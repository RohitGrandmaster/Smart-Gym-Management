'use client';

import { useStoreContext } from '@/app/manager/store/store_context/ManagerStoreContext';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function ManagerStoreFilters() {
  const { startDate, setStartDate, endDate, setEndDate, sortOrder, setSortOrder } = useStoreContext();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 border-b border-border">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex flex-col">
          <label className="text-xs text-secondary uppercase font-semibold mb-1">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            className="text-sm px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-secondary uppercase font-semibold mb-1">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            className="text-sm px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-xs text-secondary uppercase font-semibold mb-1">Sort By Date</label>
        <SearchableDropdown
          value={sortOrder}
          onChange={(val) => setSortOrder(String(val) as 'ASC' | 'DESC')}
          options={[
            { label: 'Newest First', value: 'DESC' },
            { label: 'Oldest First', value: 'ASC' }
          ]}
        />
      </div>
    </div>
  );
}
