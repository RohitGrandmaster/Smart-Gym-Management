// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the primary tabular list of members with actions, filtering state, and pagination.
'use client';

import { MessageCircle, Mail, Loader2 } from 'lucide-react';
import { useMembersContext } from '@/app/trainer/members/members_context/MembersContext';
import { useMembersStore } from '@/app/trainer/members/members_store/useMembersStore';
import { MEMBERS_STATUS_COLORS, MEMBERS_TABLE_HEADERS, formatCurrency } from '@/app/trainer/members/members_utils/MembersSharedConstants';
import { maskSensitiveData } from '@/lib/formatters';
import TrainerMembersEmptyState from '@/app/trainer/members/members_components/TrainerMembersEmptyState/TrainerMembersEmptyState';

import TrainerPagination from '@/app/trainer/trainer_components/TrainerShared/TrainerPagination';
import { TRAINER_ITEMS_PER_PAGE } from '@/app/trainer/trainer_utils/TrainerSharedConstants';

export default function TrainerMembersTable() {
  const { 
    search, debouncedSearch, statusFilter, currentPage, setCurrentPage,
    setSelectedMember, openMsg
  } = useMembersContext();

  const members = useMembersStore(s => s.members);
  const totalMembers = useMembersStore(s => s.totalMembers);
  const fetchState = useMembersStore(s => s.fetchState);
  const loadMemberProfile = useMembersStore(s => s.loadMemberProfile);

  const totalPages = Math.ceil(totalMembers / TRAINER_ITEMS_PER_PAGE);

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
                    <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3">
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
                    className="hover:bg-primary/5 motion-safe:transition-colors cursor-pointer"
                    onClick={() => { setSelectedMember(m); loadMemberProfile(m.id); }}
                  >
                    <td className="px-5 py-3.5 text-sm text-secondary font-medium">
                      #{m.id.split('-').pop()?.substring(0, 5) || m.id.substring(0, 5)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{m.name}</p>
                          <p className="text-xs text-secondary">{maskSensitiveData(m.phone, 'phone')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{m.age || 25} / {m.gender || 'Unknown'}</td>
                    <td className="px-5 py-3.5">
                      <span 
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-secondary">{new Date(m.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-3.5 text-sm text-secondary">{m.lastWorkout || '2 days ago'}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                        m.progressStatus === 'Good' ? 'bg-success-bg text-success' : 
                        m.progressStatus === 'Needs Attention' ? 'bg-danger-bg text-danger' : 
                        'bg-warning-bg text-warning'
                      }`}>
                        {m.progressStatus || 'Average'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openMsg(m, 'whatsapp'); }} className="p-1.5 rounded-lg bg-success text-white hover:opacity-80 motion-safe:transition-all motion-safe:duration-200" title="WhatsApp" aria-label={`Message ${m.name} on WhatsApp`}><MessageCircle size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); openMsg(m, 'email'); }} className="p-1.5 rounded-lg bg-info text-white hover:opacity-80 motion-safe:transition-all motion-safe:duration-200" title="Email" aria-label={`Email ${m.name}`}><Mail size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )})}
                {members.length === 0 && fetchState === 'success' && (
                  <tr>
                    <td colSpan={9} className="p-0 border-b-0">
                      <TrainerMembersEmptyState isFiltered={Boolean(search || statusFilter !== 'All')} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <TrainerPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            totalItems={totalMembers} 
            itemsPerPage={TRAINER_ITEMS_PER_PAGE} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}
    </div>
 );
}

