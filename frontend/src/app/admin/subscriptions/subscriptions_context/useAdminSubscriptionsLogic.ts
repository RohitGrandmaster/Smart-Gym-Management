// RESPONSIBILITY: Business logic hook for Subscriptions — queries and mutations.
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { subscriptionsApi } from '@/app/admin/subscriptions/subscriptions_api/subscriptions_api';
import { useAdminSubscriptionsStore } from '@/app/admin/subscriptions/subscriptions_store/useAdminSubscriptionsStore';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import type { FetchState } from '@/app/admin/subscriptions/subscriptions_types/subscriptions_types';

export function useAdminSubscriptionsLogic() {
  const { confirm } = useAdminConfirm();
  const qc = useQueryClient();
  const { showUpgradeConfirm, setShowUpgradeConfirm } = useAdminSubscriptionsStore();

  const { data: subscription, isLoading: subLoading, isError: subError } = useQuery({
    queryKey: ['adminSubscription'],
    queryFn: subscriptionsApi.fetchSubscription,
    staleTime: 1000 * 60 * 5,
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['adminSaaSPlans'],
    queryFn: subscriptionsApi.fetchPlans,
    staleTime: 1000 * 60 * 10,
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['adminInvoices'],
    queryFn: subscriptionsApi.fetchInvoices,
    staleTime: 1000 * 60 * 5,
  });

  const { data: paymentMethods = [], isLoading: pmLoading } = useQuery({
    queryKey: ['adminPaymentMethods'],
    queryFn: subscriptionsApi.fetchPaymentMethods,
    staleTime: 1000 * 60 * 5,
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminSubscriptionKPIs'],
    queryFn: subscriptionsApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = subLoading ? 'loading' : subError ? 'error' : 'success';

  const upgradeMutation = useMutation({
    mutationFn: (planId: string) => subscriptionsApi.upgradePlan(planId),
    onSuccess: (data) => {
      toast.success(`Upgraded to ${data.planName} plan successfully!`);
      setShowUpgradeConfirm(null);
      qc.invalidateQueries({ queryKey: ['adminSubscription'] });
      qc.invalidateQueries({ queryKey: ['adminSubscriptionKPIs'] });
      qc.invalidateQueries({ queryKey: ['adminSaaSPlans'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const autoRenewMutation = useMutation({
    mutationFn: subscriptionsApi.toggleAutoRenew,
    onSuccess: (data) => {
      toast.success(data.autoRenew ? 'Auto-renew enabled' : 'Auto-renew disabled');
      qc.invalidateQueries({ queryKey: ['adminSubscription'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const setDefaultPMMutation = useMutation({
    mutationFn: (id: string) => subscriptionsApi.setDefaultPaymentMethod(id),
    onSuccess: () => { toast.success('Default payment method updated'); qc.invalidateQueries({ queryKey: ['adminPaymentMethods'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const removePMMutation = useMutation({
    mutationFn: (id: string) => subscriptionsApi.removePaymentMethod(id),
    onSuccess: () => { toast.success('Payment method removed'); qc.invalidateQueries({ queryKey: ['adminPaymentMethods'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  async function handleUpgrade(planId: string, planName: string) {
    const ok = await confirm({
      title: `Upgrade to ${planName}`,
      message: `You are about to upgrade your subscription to the ${planName} plan. Your billing will be updated immediately.`,
      confirmText: 'Confirm Upgrade',
      type: 'info',
    });
    if (!ok) return;
    upgradeMutation.mutate(planId);
  }

  async function handleRemovePaymentMethod(id: string) {
    const ok = await confirm({
      title: 'Remove Payment Method',
      message: 'Are you sure you want to remove this payment method?',
      confirmText: 'Remove',
      type: 'danger',
    });
    if (!ok) return;
    removePMMutation.mutate(id);
  }

  return {
    subscription, plans, invoices, paymentMethods, kpis,
    fetchState,
    isLoading: subLoading || plansLoading || invoicesLoading || pmLoading,
    handleUpgrade, upgrading: upgradeMutation.isPending,
    toggleAutoRenew: () => autoRenewMutation.mutate(),
    togglingAutoRenew: autoRenewMutation.isPending,
    setDefaultPaymentMethod: (id: string) => setDefaultPMMutation.mutate(id),
    handleRemovePaymentMethod,
    showUpgradeConfirm, setShowUpgradeConfirm,
  };
}
