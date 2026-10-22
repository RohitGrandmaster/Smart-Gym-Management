// RESPONSIBILITY: Renders the primary tabular list of members with actions, filtering state, and pagination.
'use client';

import { Edit, MessageCircle, Mail, Trash2, Loader2, Users, Banknote, Ban } from 'lucide-react';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { MEMBERS_STATUS_COLORS, MEMBERS_CYCLE_LABELS, MEMBERS_TABLE_HEADERS, formatCurrency } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import { maskSensitiveData } from '@/lib/formatters';
import ManagerEmptyState from '@/app/manager/manager_components/ManagerFeedback/ManagerEmptyState';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';

export default function ManagerMembersTable() {
  // useConfirm provides the design-system confirm modal (Rule 71 — no window.confirm)
  const { confirm } = useConfirm();
  const { 
    search, statusFilter, currentPage, setCurrentPage,
    setSelectedMember, openEdit, openMsg, deleteMember, setShowPaymentModal, toggleSuspend
  } = useMembersContext();

  const members = useManagerMembersStore(s => s.members);
  const totalMembers = useManagerMembersStore(s => s.totalMembers);
  const fetchState = useManagerMembersStore(s => s.fetchState);
  const loadMemberProfile = useManagerMembersStore(s => s.loadMemberProfile);

  const totalPages = Math.ceil(totalMembers / MANAGER_ITEMS_PER_PAGE);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col h-full min-h-96">
      {fetchState === 'loading' ? (
        <div className="flex items-center justify-center py-16 flex-1">
          <Loader2 className="w-8 h-8 motion-safe:animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5">
                <tr>
                  {MEMBERS_TABLE_HEADERS.map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-secondary uppercase tracking-wider px-2 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map(m => {
                  const statusStyle = MEMBERS_STATUS_COLORS[m.status] || { bg: 'bg-input', text: 'text-secondary' };
                  return (
                  <tr 
                    key={m.id} 
                    className="hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => { setSelectedMember(m); loadMemberProfile(m.id); }}
                  >
                    <td className="px-2 py-3 text-xs text-secondary font-medium whitespace-nowrap">
                      <span className="font-bold text-primary">{m.id}</span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-primary/10 text-primary shrink-0">
                          {m.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{m.name || 'Unknown'}</p>
                          <p className="text-[11px] text-secondary">{maskSensitiveData(m.phone || '', 'phone')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-foreground whitespace-nowrap">{m.plan?.name || `Plan #${m.planId}`}</td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <span 
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs text-secondary whitespace-nowrap">{MEMBERS_CYCLE_LABELS[m.billingCycle] || m.billingCycle}</td>
                    <td className="px-2 py-3 text-xs font-semibold text-success whitespace-nowrap">{formatCurrency(m.paidAmount)}</td>
                    <td className="px-2 py-3 text-xs font-semibold text-danger whitespace-nowrap">{m.pendingAmount > 0 ? formatCurrency(m.pendingAmount) : '—'}</td>
                    <td className="px-2 py-3 text-xs text-secondary whitespace-nowrap">{new Date(m.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-2 py-3 text-xs whitespace-nowrap">
                      {m.assignedDiet?.name ? (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-semibold" title={m.assignedDiet.name}>
                          {m.assignedDiet.name.length > 10 ? m.assignedDiet.name.substring(0, 10) + '...' : m.assignedDiet.name}
                        </span>
                      ) : <span className="text-secondary">—</span>}
                    </td>
                    <td className="px-2 py-3 text-xs whitespace-nowrap">
                      {m.assignedWorkout?.name ? (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-semibold" title={m.assignedWorkout.name}>
                          {m.assignedWorkout.name.length > 10 ? m.assignedWorkout.name.substring(0, 10) + '...' : m.assignedWorkout.name}
                        </span>
                      ) : <span className="text-secondary">—</span>}
                    </td>
                    <td className="px-2 py-3 text-xs whitespace-nowrap">
                      {m.assignedTrainerName ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground">{m.assignedTrainerName.length > 15 ? m.assignedTrainerName.substring(0, 15) + '...' : m.assignedTrainerName}</span>
                          {m.isPT && <span className="text-[9px] font-bold text-primary uppercase tracking-wide">PT</span>}
                        </div>
                      ) : <span className="text-secondary">—</span>}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {m.pendingAmount > 0 && (
                          <button onClick={(e) => { e.stopPropagation(); setSelectedMember(m); setShowPaymentModal(true); }} className="p-1.5 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-all duration-200" title="Collect Dues" aria-label={`Collect Dues for ${m.name}`}><Banknote size={14} /></button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); openEdit(m); }} className="p-1.5 rounded-lg bg-input text-secondary hover:bg-primary-subtle transition-all duration-200" title="Edit" aria-label={`Edit ${m.name}`}><Edit size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); openMsg(m, 'whatsapp'); }} className="p-1.5 rounded-lg bg-success text-white hover:opacity-80 transition-all duration-200" title="WhatsApp" aria-label={`Message ${m.name} on WhatsApp`}><MessageCircle size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); openMsg(m, 'email'); }} className="p-1.5 rounded-lg bg-info text-white hover:opacity-80 transition-all duration-200" title="Email" aria-label={`Email ${m.name}`}><Mail size={14} /></button>
                        {m.status !== 'SUSPENDED' && m.pendingAmount > 0 ? (
                          <button onClick={(e) => { e.stopPropagation(); setSelectedMember(m); toggleSuspend(true); }} className="p-1.5 rounded-lg bg-danger-bg text-danger hover:bg-danger/20 transition-all duration-200" title="Suspend Member" aria-label={`Suspend ${m.name}`}><Ban size={14} /></button>
                        ) : m.status === 'SUSPENDED' ? (
                          <button onClick={(e) => { e.stopPropagation(); setSelectedMember(m); toggleSuspend(false); }} className="p-1.5 rounded-lg bg-success-bg text-success hover:bg-success/20 transition-all duration-200" title="Unsuspend Member" aria-label={`Unsuspend ${m.name}`}><Ban size={14} /></button>
                        ) : null}
                        <button
                          onClick={async (e) => { 
                            e.stopPropagation();
                            const confirmed = await confirm({
                              title: 'Delete Member',
                              message: `Are you sure you want to permanently delete "${m.name}"? This action cannot be undone.`,
                              confirmText: 'Delete',
                              type: 'danger',
                            });
                            if (confirmed) deleteMember(m.id);
                          }}
                          className="p-1.5 rounded-lg bg-danger-bg text-danger hover:opacity-80 transition-all duration-200"
                          title="Delete"
                          aria-label={`Delete ${m.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
                {members.length === 0 && fetchState === 'success' && (
                  <tr>
                    <td colSpan={12} className="p-0 border-b-0">
                      <ManagerEmptyState 
                        icon={<Users size={32} />}
                        title={Boolean(search || statusFilter !== 'All') ? 'No members found' : 'No members yet'}
                        subtitle={Boolean(search || statusFilter !== 'All') ? 'Try adjusting your filters.' : 'Add your first member to get started.'}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ManagerPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            totalItems={totalMembers} 
            itemsPerPage={MANAGER_ITEMS_PER_PAGE} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}
    </div>
 );
}
