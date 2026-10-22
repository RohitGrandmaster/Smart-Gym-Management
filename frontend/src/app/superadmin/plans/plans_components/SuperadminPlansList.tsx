// RESPONSIBILITY: Renders the grid of subscription plan cards using TanStack Query.
// DATA FLOW: superadminApi -> useQuery -> SuperadminPlansList

'use client';

import { Check, Edit2, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import { useSuperadminPlansStore } from '@/app/superadmin/plans/plans_store/useSuperadminPlansStore';
import { useSuperadminConfirm } from '@/app/superadmin/superadmin_components/SuperadminFeedback/SuperadminConfirmProvider';

export default function SuperadminPlansList() {
  const openEditModal = useSuperadminPlansStore(state => state.openEditModal);
  const queryClient = useQueryClient();
  const { confirm } = useSuperadminConfirm();

  const { data: fetchRes, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'plans'],
    queryFn: () => superadminApi.plans.fetchPlans(),
  });

  const fetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const deleteMutation = useMutation({
    mutationFn: (id: string) => superadminApi.plans.deletePlan(id),
    onSuccess: (res) => {
      toast.success(res.message || 'Plan deleted');
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'plans'] });
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to delete plan');
    }
  });

  const plans = fetchRes?.data || [];

  if (fetchState === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={`skeleton-${i}`} className="h-64 bg-card border border-border rounded-2xl motion-safe:animate-pulse" />
        ))}
      </div>
    );
  }

  if (fetchState === 'error') {
    return <div className="p-8 text-center text-danger">Error loading plans.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isDeleting = deleteMutation.isPending && deleteMutation.variables === plan.id;
        return (
          <div
            key={plan.id}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-primary motion-safe:transition-colors motion-safe:duration-200"
          >
            <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 text-xs font-bold rounded-bl-lg">
              {plan.activeTenants ?? 0} Gyms Active
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-extrabold text-foreground">₹{Number(plan.priceMonthly).toFixed(2)}</span>
                <span className="text-secondary font-medium mb-1">/ mo</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 mb-6">
              <p className="text-sm text-secondary font-medium pb-2 border-b border-border">
                Max Members: <span className="text-foreground">{plan.maxMembers}</span>
              </p>
              <p className="text-sm text-secondary font-medium pb-2 border-b border-border">
                Max Staff: <span className="text-foreground">{plan.maxStaff}</span>
              </p>
              <p className="text-sm text-secondary font-medium pb-2 border-b border-border">
                DB Limit (GB): <span className="text-foreground">{plan.dbLimitGb ?? 'Unlimited'}</span>
              </p>
              <p className="text-sm text-secondary font-medium pb-2 border-b border-border">
                Binary Limit (GB): <span className="text-foreground">{plan.binaryLimitGb ?? 'Unlimited'}</span>
              </p>
              <div className="pt-2">
                {plan.features?.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 mb-2 text-sm text-secondary">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(plan)}
                disabled={isDeleting || deleteMutation.isPending}
                aria-label={`Edit ${plan.name}`}
                className="flex-1 py-2.5 flex items-center justify-center bg-input hover:bg-primary hover:text-white text-foreground rounded-xl motion-safe:transition-colors border border-border disabled:opacity-50"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={async () => {
                  const ok = await confirm({
                    title: 'Delete Plan',
                    message: `Are you sure you want to delete the plan "${plan.name}"? This action cannot be undone.`,
                    type: 'danger',
                    confirmText: 'Delete'
                  });
                  if (ok) {
                    deleteMutation.mutate(plan.id);
                  }
                }}
                disabled={isDeleting || deleteMutation.isPending}
                aria-label={`Delete ${plan.name}`}
                className="flex-1 py-2.5 flex items-center justify-center bg-input hover:bg-danger hover:text-white text-secondary rounded-xl motion-safe:transition-colors border border-border disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={18} className="motion-safe:animate-spin" /> : <Trash2 size={18} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
