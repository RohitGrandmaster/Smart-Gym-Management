// RESPONSIBILITY: API client for the Subscriptions / Billing module.
import type { CurrentSubscription, SaaSPlan, Invoice, PaymentMethod, SubscriptionKPIData } from '@/app/admin/subscriptions/subscriptions_types/subscriptions_types';
import {
  MOCK_CURRENT_SUBSCRIPTION, MOCK_SAAS_PLANS, MOCK_INVOICES,
  MOCK_PAYMENT_METHODS, MOCK_SUBSCRIPTION_KPI,
} from '@/app/admin/subscriptions/subscriptions_utils/AdminSubscriptionsSharedConstants';

let mockSubscription = { ...MOCK_CURRENT_SUBSCRIPTION };
let mockPaymentMethods = [...MOCK_PAYMENT_METHODS];

export const subscriptionsApi = {
  fetchSubscription: async (): Promise<CurrentSubscription> => {
    await new Promise(r => setTimeout(r, 300));
    return mockSubscription;
  },
  fetchPlans: async (): Promise<SaaSPlan[]> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_SAAS_PLANS;
  },
  fetchInvoices: async (): Promise<Invoice[]> => {
    await new Promise(r => setTimeout(r, 250));
    return MOCK_INVOICES;
  },
  fetchPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockPaymentMethods;
  },
  fetchKPIs: async (): Promise<SubscriptionKPIData> => {
    await new Promise(r => setTimeout(r, 150));
    return MOCK_SUBSCRIPTION_KPI;
  },
  upgradePlan: async (planId: string): Promise<CurrentSubscription> => {
    await new Promise(r => setTimeout(r, 800));
    const plan = MOCK_SAAS_PLANS.find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');
    mockSubscription = {
      ...mockSubscription,
      planId: plan.id,
      planName: plan.name,
      tier: plan.tier,
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice,
    };
    return mockSubscription;
  },
  toggleAutoRenew: async (): Promise<CurrentSubscription> => {
    await new Promise(r => setTimeout(r, 400));
    mockSubscription = { ...mockSubscription, autoRenew: !mockSubscription.autoRenew };
    return mockSubscription;
  },
  setDefaultPaymentMethod: async (id: string): Promise<PaymentMethod[]> => {
    await new Promise(r => setTimeout(r, 400));
    mockPaymentMethods = mockPaymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id }));
    return mockPaymentMethods;
  },
  removePaymentMethod: async (id: string): Promise<PaymentMethod[]> => {
    await new Promise(r => setTimeout(r, 400));
    mockPaymentMethods = mockPaymentMethods.filter(pm => pm.id !== id);
    return mockPaymentMethods;
  },
};
