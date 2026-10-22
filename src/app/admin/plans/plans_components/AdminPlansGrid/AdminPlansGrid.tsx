// RESPONSIBILITY: Renders the grid of membership plan cards with edit/delete actions and pagination.
'use client';

import { Edit2, Trash2, Tag, CheckCircle, Loader2 } from 'lucide-react';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { useAdminPlansLogic } from '@/app/admin/plans/plans_context/useAdminPlansLogic';
import { useAdminPlansStore } from '@/app/admin/plans/plans_store/useAdminPlansStore';
import { formatCurrency } from '@/app/admin/plans/plans_utils/AdminPlansSharedConstants';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import { ADMIN_ITEMS_PER_PAGE } from '@/app/admin/admin_utils/AdminSharedConstants';


export default function AdminPlansGrid() {
  const { plans, fetchState, saving, search, setSearch, currentPage, setCurrentPage, loadPlans, openAdd, openEdit, savePlan, deletePlan } = useAdminPlansLogic();
  const { showModal, setShowModal, editId, form, setForm, toast, showToast, hideToast } = useAdminPlansStore();
  const { confirm } = useAdminConfirm();

  // Client-side filter on the already-fetched plans list (plans count is typically small, <100)
  const filtered = plans.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / ADMIN_ITEMS_PER_PAGE);
  const currentData = filtered.slice((currentPage - 1) * ADMIN_ITEMS_PER_PAGE, currentPage * ADMIN_ITEMS_PER_PAGE);

  if (fetchState === 'loading') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-96 bg-card rounded-2xl border border-border motion-safe:animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-danger/30">
        <p className="text-danger font-medium">Failed to load membership plans.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <p className="text-secondary">No membership plans created yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-96">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {currentData.map((p, i) => (
          <div
            key={p.id}
            className={`bg-card border-2 rounded-2xl p-6 relative transition-all hover:scale-105 motion-safe:hover:-translate-y-1 ${
              i === 1 ? 'border-warning shadow-lg shadow-warning/20' : 'border-border'
            }`}
          >
            {i === 1 && (
              <div className="bg-warning text-white text-xs font-bold uppercase tracking-wider text-center py-1 absolute top-0 w-full left-0 rounded-t-2xl">
                Most Popular
              </div>
            )}
            <div className={`p-6 ${i === 1 ? 'pt-8' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">{p.name}</h3>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-input text-secondary mt-1">
                    {p.tier}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-primary-subtle transition-all duration-200"
                    title="Edit Plan"
                    aria-label={`Edit ${p.name}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = await confirm({
                      title: 'Delete Plan',
                      message: `Are you sure you want to delete plan "${p.name}"?`,
                      type: 'danger',
                      confirmText: 'Delete'
                    });
                    if (ok) {
                      deletePlan(p.id);
                    }
                  }}
                    className="p-1.5 rounded-lg text-danger hover:bg-danger-bg transition-all duration-200"
                    title="Delete Plan"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 bg-input p-4 rounded-xl">
                <div>
                  <p className="text-xs text-secondary">1 Month</p>
                  <p className="font-bold text-primary">{formatCurrency(p.price1Month)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary">3 Months</p>
                  <p className="font-bold text-primary">{formatCurrency(p.price3Month)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary">6 Months</p>
                  <p className="font-bold text-primary">{formatCurrency(p.price6Month)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary">12 Months</p>
                  <p className="font-bold text-success">{formatCurrency(p.price12Month)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Tag size={12} /> Features
                </p>
                <ul className="space-y-2.5">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                      <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ADMIN_ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
