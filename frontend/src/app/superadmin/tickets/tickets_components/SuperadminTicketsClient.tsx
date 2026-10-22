// RESPONSIBILITY: Root orchestrator for the Tickets page. Composes isolated sub-components and passes state from useSuperadminTickets. No business logic here.
'use client';

import { useSuperadminTickets } from '@/app/superadmin/tickets/tickets_utils/useSuperadminTickets';
import SuperadminTicketsHeader from '@/app/superadmin/tickets/tickets_components/SuperadminTicketsHeader/SuperadminTicketsHeader';
import SuperadminTicketsTable from '@/app/superadmin/tickets/tickets_components/SuperadminTicketsTable/SuperadminTicketsTable';
import SuperadminPagination from '@/app/superadmin/superadmin_components/SuperadminShared/SuperadminPagination';

export default function SuperadminTicketsClient() {
  const {
    fetchState,
    error,
    search,
    setSearch,
    showFilter,
    setShowFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedTickets,
  } = useSuperadminTickets();

  if (fetchState === 'loading') return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded w-48" />
      <div className="h-96 bg-card rounded-xl border border-border" />
    </div>
  );
  if (error) return <div className="p-8 text-center text-danger">Error loading data.</div>;

  return (
    <div className="space-y-6">
      <SuperadminTicketsHeader
        search={search}
        setSearch={setSearch}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onFilterChange={() => setCurrentPage(1)}
      />

      <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-96">
        <SuperadminTicketsTable 
          tickets={paginatedTickets}
          onReply={(ticketId) => alert(`Open reply modal for ticket ${ticketId}`)}
        />
        <SuperadminPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
