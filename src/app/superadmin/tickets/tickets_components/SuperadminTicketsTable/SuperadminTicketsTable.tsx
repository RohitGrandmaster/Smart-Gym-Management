// RESPONSIBILITY: Renders the data table for Support Tickets
import { MessageSquare } from 'lucide-react';
import type { SupportTicket } from '@/app/superadmin/tickets/superadmin_tickets_types/superadmin_tickets_types';
import { PriorityColors, StatusColors } from '@/app/superadmin/tickets/tickets_utils/SuperadminTicketsConstants';
import SuperadminTicketsEmptyState from '@/app/superadmin/tickets/tickets_components/SuperadminTicketsEmptyState/SuperadminTicketsEmptyState';

interface SuperadminTicketsTableProps {
  tickets: SupportTicket[];
  onReply: (ticketId: string) => void;
}

export default function SuperadminTicketsTable({ tickets, onReply }: SuperadminTicketsTableProps) {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="bg-header border-b border-border text-sm">
            <th className="p-4 font-semibold text-secondary">Ticket ID</th>
            <th className="p-4 font-semibold text-secondary">Gym (Tenant)</th>
            <th className="p-4 font-semibold text-secondary">Subject</th>
            <th className="p-4 font-semibold text-secondary">Priority</th>
            <th className="p-4 font-semibold text-secondary">Status</th>
            <th className="p-4 font-semibold text-secondary">Last Updated</th>
            <th className="p-4 font-semibold text-secondary text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={7}><SuperadminTicketsEmptyState /></td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-input motion-safe:transition-colors">
                <td className="p-4 text-sm font-medium text-foreground">{ticket.id}</td>
                <td className="p-4 text-sm text-secondary">{ticket.tenantName}</td>
                <td className="p-4 text-sm text-foreground font-medium">{ticket.subject}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${PriorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold">
                  <span className={StatusColors[ticket.status]}>{ticket.status.replace('_', ' ')}</span>
                </td>
                <td className="p-4 text-sm text-secondary">{new Date(ticket.lastUpdated).toLocaleString()}</td>
                <td className="p-4 text-sm text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onReply(ticket.id);
                    }}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg motion-safe:transition-colors inline-flex items-center justify-center font-medium"
                    title="Reply"
                  >
                    <MessageSquare size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
