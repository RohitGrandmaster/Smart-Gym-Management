// RESPONSIBILITY: Centralized mock data and constants for the Admin Usage module.
import type { AdminUsageData } from '@/app/admin/usage/usage_types/AdminUsageTypes';

export const MOCK_USAGE_DATA: AdminUsageData = {
  tenantId: 'gym-1234',
  planName: 'Growth Plan',
  planTier: 'Growth',
  billingCycleEnd: '2026-02-15',
  monthlyPrice: 4999,
  smsSent: 9500,
  smsLimit: 10000,
  databaseGb: 8.0,
  mediaGb: 11.5,
  storageLimitGb: 20,
  activeMembers: 1950,
  memberLimit: 2000,
  staffCount: 15,
  staffLimit: 15,
  branchCount: 3,
  branchLimit: 5,
  apiCallsToday: 8420,
  apiCallsLimit: 10000,
};

export const PLAN_TIERS = [
  {
    name: 'Starter',
    price: 1999,
    features: ['1 Branch', '500 Members', '5 Staff', '2,000 SMS/mo', '5 GB Storage'],
    isCurrent: false,
  },
  {
    name: 'Growth',
    price: 4999,
    features: ['5 Branches', '2,000 Members', '15 Staff', '10,000 SMS/mo', '20 GB Storage'],
    isCurrent: true,
  },
  {
    name: 'Pro',
    price: 9999,
    features: ['15 Branches', '10,000 Members', '50 Staff', '50,000 SMS/mo', '100 GB Storage'],
    isCurrent: false,
  },
  {
    name: 'Enterprise',
    price: 0,
    features: ['Unlimited Branches', 'Unlimited Members', 'Unlimited Staff', 'Custom SMS', 'Custom Storage'],
    isCurrent: false,
  },
] as const;
