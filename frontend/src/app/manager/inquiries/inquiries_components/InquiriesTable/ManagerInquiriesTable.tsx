// RESPONSIBILITY: Renders the paginated, filterable table of inquiries with row actions, status updates, and bulk selection.
'use client';

import { useInquiriesContext } from '@/app/manager/inquiries/inquiries_context/ManagerInquiriesContext';
import { FetchState } from '@/app/manager/inquiries/inquiries_types/ManagerInquiriesTypes';
import { INQUIRIES_TABLE_HEADERS, INQUIRIES_STATUS_LABELS, INQUIRIES_STATUS_STYLES } from '@/app/manager/inquiries/inquiries_utils/ManagerInquiriesSharedConstants';
import { MessageCircle, Mail, Edit2, Trash2 } from 'lucide-react';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

export default function ManagerInquiriesTable() {
  const { confirm } = useConfirm();
  const {
    inquiries, fetchState, search, statusFilter, currentPage, setCurrentPage,
    openEdit, openMsg, deleteInquiry, updateStatus, totalInquiries,
    selectedIds, toggleSelectAll, toggleSelectOne,
  } = useInquiriesContext();

  const allSelected = inquiries.length > 0 && selectedIds.length === inquiries.length;
  const isSelected = (id: string) => selectedIds?.includes(id);

  const totalPages = Math.ceil(totalInquiries / MANAGER_ITEMS_PER_PAGE);

  if (fetchState === FetchState.LOADING) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col h-full min-h-96">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5">
              <tr>
                <th className="px-5 py-3 w-12" />
                {INQUIRIES_TABLE_HEADERS.map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="motion-safe:animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-muted rounded w-4"></div></td>
                  <td className="px-5 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </td>
                  <td className="px-5 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
                  <td className="px-5 py-4"><div className="h-8 bg-muted rounded-lg w-28"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                  <td className="px-5 py-4"><div className="h-8 bg-muted rounded-lg w-32"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (fetchState === FetchState.ERROR) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-danger/30 overflow-hidden flex flex-col h-full min-h-96 justify-center items-center py-16 text-center">
        <p className="text-danger font-medium">Failed to load inquiries.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col h-full min-h-96">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/5">
            <tr>
              <th className="px-5 py-3 w-12 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                />
              </th>
              {INQUIRIES_TABLE_HEADERS.map(h => (
                <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inquiries.map(inq => {
              // const statusStyle = INQUIRIES_STATUS_STYLES[inq.status] || { bg: 'bg-input', text: 'text-secondary' };
              const selected = isSelected(inq.id);

              return (
                <tr
                  key={inq.id}
                  className={`transition-colors cursor-pointer ${selected ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
                  onClick={() => openEdit(inq)}
                >
                  <td className="px-5 py-3.5 w-12" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSelectOne(inq.id)}
                      className="w-4 h-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-warning-bg text-warning">
                        {(inq.name || '').charAt(0)}
                      </div>
                      <p className="text-sm font-semibold text-primary">{inq.name || 'Unknown'}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-primary">{inq.phone}</p>
                    <p className="text-xs text-secondary">{inq.email || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-secondary">{inq.source || '—'}</td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="w-32">
                      <SearchableDropdown
                        value={inq.status}
                        onChange={(val) => updateStatus(inq.id, String(val))}
                        options={Object.entries(INQUIRIES_STATUS_LABELS).map(([val, label]) => ({ label, value: val }))}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-secondary">
                    {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openMsg(inq, 'whatsapp'); }}
                        className="p-1.5 rounded-lg bg-success text-white hover:opacity-80 transition-all duration-200"
                        title="WhatsApp"
                        aria-label={`Message ${inq.name} on WhatsApp`}
                      >
                        <MessageCircle size={13} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openMsg(inq, 'email'); }}
                        className="p-1.5 rounded-lg bg-info text-white hover:opacity-80 transition-all duration-200"
                        title="Email"
                        aria-label={`Email ${inq.name}`}
                      >
                        <Mail size={13} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(inq.id, 'CONVERTED'); }}
                        className="p-1.5 rounded-lg bg-primary-subtle text-primary hover:opacity-80 transition-all duration-200"
                        title="Convert to Member"
                        aria-label={`Convert ${inq.name} to Member`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(inq); }}
                        className="p-1.5 rounded-lg bg-input text-secondary hover:bg-primary-subtle transition-all duration-200"
                        title="Edit"
                        aria-label={`Edit ${inq.name}`}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const ok = await confirm({
                            title: 'Delete Inquiry',
                            message: `Are you sure you want to delete inquiry from "${inq.name}"? This action cannot be undone.`,
                            type: 'danger',
                            confirmText: 'Delete'
                          });
                          if (ok) {
                            deleteInquiry(inq.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-danger-bg text-danger hover:opacity-80 transition-all duration-200"
                        title="Delete"
                        aria-label={`Delete ${inq.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {inquiries.length === 0 && fetchState === FetchState.SUCCESS && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-secondary">
                  {search || statusFilter !== 'All' ? 'No inquiries match the filter.' : 'No inquiries yet. Add your first lead!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ManagerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalInquiries}
        itemsPerPage={MANAGER_ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
