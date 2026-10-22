// RESPONSIBILITY: Renders the header and filter/search controls for Support Tickets
import { Search, Filter } from 'lucide-react';
import type { TicketStatus, TicketPriority } from '@/app/superadmin/tickets/superadmin_tickets_types/superadmin_tickets_types';

interface SuperadminTicketsHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  statusFilter: TicketStatus | 'ALL';
  setStatusFilter: (status: TicketStatus | 'ALL') => void;
  priorityFilter: TicketPriority | 'ALL';
  setPriorityFilter: (priority: TicketPriority | 'ALL') => void;
  onFilterChange: () => void;
}

export default function SuperadminTicketsHeader({
  search,
  setSearch,
  showFilter,
  setShowFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onFilterChange,
}: SuperadminTicketsHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-secondary mt-1">Manage incoming issues from SaaS tenants.</p>
        </div>
      </div>

      <div className="p-4 border-b border-border flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input 
            type="text" 
            placeholder="Search tickets or gyms..." 
            className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onFilterChange();
            }}
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-input border border-border rounded-lg text-sm font-medium text-secondary hover:text-foreground motion-safe:transition-colors"
          >
            <Filter size={16} /> Filter
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full mt-2  w-full sm:w-64  bg-card border border-border rounded-xl shadow-lg p-4 z-10 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as TicketStatus | 'ALL');
                    setShowFilter(false);
                    onFilterChange();
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Priority</label>
                <select 
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value as TicketPriority | 'ALL');
                    setShowFilter(false);
                    onFilterChange();
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
