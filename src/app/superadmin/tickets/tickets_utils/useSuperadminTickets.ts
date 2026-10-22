// RESPONSIBILITY: Custom hook for managing the state and logic of the Support Tickets page
// DATA FLOW: API -> useSuperadminTicketsData -> useSuperadminTickets -> SuperadminTicketsClient

import { useState } from 'react';
import { useSuperadminTicketsData } from '@/app/superadmin/tickets/tickets_utils/useSuperadminTicketsData';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import type { SupportTicket, TicketStatus, TicketPriority } from '@/app/superadmin/tickets/superadmin_tickets_types/superadmin_tickets_types';

export function useSuperadminTickets() {
  const { data: DUMMY_SUPPORT_TICKETS, fetchState, error } = useSuperadminTicketsData<SupportTicket[]>(SuperadminUrlConfig.BACKEND_API.TICKETS_BASE);

  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = (DUMMY_SUPPORT_TICKETS || []).filter(t => {
    const matchesSearch = t.tenantName?.toLowerCase().includes(search.toLowerCase()) || 
                          t.subject?.toLowerCase().includes(search.toLowerCase()) ||
                          t.id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedTickets = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return {
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
  };
}
