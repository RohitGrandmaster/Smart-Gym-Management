// RESPONSIBILITY: Constants and mock data for the Subscriptions / Billing module.
import type {
  CurrentSubscription, SaaSPlan, Invoice, PaymentMethod, SubscriptionKPIData,
} from '@/app/admin/subscriptions/subscriptions_types/subscriptions_types';

export const MOCK_CURRENT_SUBSCRIPTION: CurrentSubscription = {
  planId: 'plan_growth',
  planName: 'Growth',
  tier: 'growth',
  monthlyPrice: 4999,
  annualPrice: 49990,
  billingCycle: 'monthly',
  status: 'active',
  currentPeriodStart: '2025-06-01',
  currentPeriodEnd: '2025-06-30',
  nextBillingDate: '2025-07-01',
  autoRenew: true,
  gymCount: 3,
  memberLimit: 500,
  staffLimit: 25,
  storageGb: 50,
};

export const MOCK_SAAS_PLANS: SaaSPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    tier: 'starter',
    monthlyPrice: 1999,
    annualPrice: 19990,
    gymLimit: 1,
    memberLimit: 100,
    staffLimit: 5,
    storageGb: 10,
    features: ['1 Gym Branch', 'Up to 100 Members', '5 Staff Accounts', '10 GB Storage', 'Basic Reports', 'Email Support'],
    isPopular: false,
    isCurrent: false,
  },
  {
    id: 'plan_growth',
    name: 'Growth',
    tier: 'growth',
    monthlyPrice: 4999,
    annualPrice: 49990,
    gymLimit: 5,
    memberLimit: 500,
    staffLimit: 25,
    storageGb: 50,
    features: ['Up to 5 Gym Branches', 'Up to 500 Members', '25 Staff Accounts', '50 GB Storage', 'Advanced Reports', 'Bulk Communications', 'Coupons & Discounts', 'Priority Support'],
    isPopular: true,
    isCurrent: true,
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    tier: 'pro',
    monthlyPrice: 9999,
    annualPrice: 99990,
    gymLimit: 15,
    memberLimit: 2000,
    staffLimit: 100,
    storageGb: 200,
    features: ['Up to 15 Gym Branches', 'Up to 2,000 Members', '100 Staff Accounts', '200 GB Storage', 'Full Analytics Suite', 'Data Export (CSV/Excel/PDF)', 'Gym Health Alerts', 'Gym Comparison', 'Dedicated Account Manager', '24/7 Support'],
    isPopular: false,
    isCurrent: false,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    monthlyPrice: 0,
    annualPrice: 0,
    gymLimit: 999,
    memberLimit: 999999,
    staffLimit: 9999,
    storageGb: 1000,
    features: ['Unlimited Gym Branches', 'Unlimited Members', 'Unlimited Staff', '1 TB Storage', 'Custom Integrations', 'White-label Option', 'SLA Guarantee', 'Dedicated Infrastructure', 'Custom Contracts'],
    isPopular: false,
    isCurrent: false,
  },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', invoiceNo: 'INV-2025-006', date: '2025-06-01', dueDate: '2025-06-07', amount: 4999, status: 'paid',    planName: 'Growth', billingCycle: 'monthly', pdfUrl: '#' },
  { id: 'inv2', invoiceNo: 'INV-2025-005', date: '2025-05-01', dueDate: '2025-05-07', amount: 4999, status: 'paid',    planName: 'Growth', billingCycle: 'monthly', pdfUrl: '#' },
  { id: 'inv3', invoiceNo: 'INV-2025-004', date: '2025-04-01', dueDate: '2025-04-07', amount: 4999, status: 'paid',    planName: 'Growth', billingCycle: 'monthly', pdfUrl: '#' },
  { id: 'inv4', invoiceNo: 'INV-2025-003', date: '2025-03-01', dueDate: '2025-03-07', amount: 4999, status: 'paid',    planName: 'Growth', billingCycle: 'monthly', pdfUrl: '#' },
  { id: 'inv5', invoiceNo: 'INV-2025-002', date: '2025-02-01', dueDate: '2025-02-07', amount: 4999, status: 'paid',    planName: 'Growth', billingCycle: 'monthly', pdfUrl: '#' },
  { id: 'inv6', invoiceNo: 'INV-2025-001', date: '2025-01-01', dueDate: '2025-01-07', amount: 3999, status: 'paid',    planName: 'Starter', billingCycle: 'monthly', pdfUrl: '#' },
  { id: 'inv7', invoiceNo: 'INV-2024-012', date: '2024-12-01', dueDate: '2024-12-07', amount: 3999, status: 'failed',  planName: 'Starter', billingCycle: 'monthly', pdfUrl: '#' },
  { id: 'inv8', invoiceNo: 'INV-2024-011', date: '2024-11-01', dueDate: '2024-11-07', amount: 3999, status: 'paid',    planName: 'Starter', billingCycle: 'monthly', pdfUrl: '#' },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', type: 'card', last4: '4242', brand: 'Visa',       expiryMonth: 12, expiryYear: 2027, isDefault: true  },
  { id: 'pm2', type: 'upi',  upiId: 'gymsmart@okaxis',                                              isDefault: false },
  { id: 'pm3', type: 'card', last4: '5555', brand: 'Mastercard', expiryMonth: 8,  expiryYear: 2026, isDefault: false },
];

export const MOCK_SUBSCRIPTION_KPI: SubscriptionKPIData = {
  currentPlan: 'Growth',
  monthlySpend: 4999,
  totalInvoices: 8,
  nextBillingAmount: 4999,
  daysUntilRenewal: 11,
  savedWithAnnual: 9998,
};

export const PLAN_TIER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  starter:    { bg: 'bg-info/10',    text: 'text-info',    border: 'border-info/30'    },
  growth:     { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  pro:        { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  enterprise: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
};
