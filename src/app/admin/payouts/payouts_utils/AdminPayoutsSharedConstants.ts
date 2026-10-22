// RESPONSIBILITY: Centralized constants and mock data for the Payouts module.
import type { GymPayout, PnLEntry, PayoutsKPIData } from '@/app/admin/payouts/payouts_types/payouts_types';

export const PAYOUT_MONTH_OPTIONS = [
  { value: 'all', label: 'All Months' },
  { value: '2025-06', label: 'June 2025' },
  { value: '2025-05', label: 'May 2025' },
  { value: '2025-04', label: 'April 2025' },
  { value: '2025-03', label: 'March 2025' },
];

export const PAYOUT_GYM_OPTIONS = [
  { value: 'all', label: 'All Gyms' },
  { value: 'g1', label: 'Andheri East' },
  { value: 'g2', label: 'Bandra West' },
  { value: 'g3', label: 'Powai' },
  { value: 'g4', label: 'Thane' },
];

export const PAYOUT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
];

export const PAYOUTS_ITEMS_PER_PAGE = 10;

export const fmt = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');

export const MOCK_PAYOUTS: GymPayout[] = [
  { gymId: 'g1', gymName: 'Andheri East', month: '2025-06', grossRevenue: 420000, staffPayroll: 85000, operationalExpenses: 42000, platformFee: 12600, netProfit: 280400, payoutStatus: 'paid', paidOn: '2025-07-03' },
  { gymId: 'g2', gymName: 'Bandra West', month: '2025-06', grossRevenue: 380000, staffPayroll: 78000, operationalExpenses: 38000, platformFee: 11400, netProfit: 252600, payoutStatus: 'paid', paidOn: '2025-07-03' },
  { gymId: 'g3', gymName: 'Powai', month: '2025-06', grossRevenue: 310000, staffPayroll: 65000, operationalExpenses: 31000, platformFee: 9300, netProfit: 204700, payoutStatus: 'processing' },
  { gymId: 'g4', gymName: 'Thane', month: '2025-06', grossRevenue: 195000, staffPayroll: 52000, operationalExpenses: 22000, platformFee: 5850, netProfit: 115150, payoutStatus: 'pending' },
  { gymId: 'g1', gymName: 'Andheri East', month: '2025-05', grossRevenue: 405000, staffPayroll: 85000, operationalExpenses: 40000, platformFee: 12150, netProfit: 267850, payoutStatus: 'paid', paidOn: '2025-06-04' },
  { gymId: 'g2', gymName: 'Bandra West', month: '2025-05', grossRevenue: 362000, staffPayroll: 78000, operationalExpenses: 36000, platformFee: 10860, netProfit: 237140, payoutStatus: 'paid', paidOn: '2025-06-04' },
  { gymId: 'g3', gymName: 'Powai', month: '2025-05', grossRevenue: 298000, staffPayroll: 65000, operationalExpenses: 30000, platformFee: 8940, netProfit: 194060, payoutStatus: 'paid', paidOn: '2025-06-05' },
  { gymId: 'g4', gymName: 'Thane', month: '2025-05', grossRevenue: 182000, staffPayroll: 52000, operationalExpenses: 20000, platformFee: 5460, netProfit: 104540, payoutStatus: 'paid', paidOn: '2025-06-05' },
];

export const MOCK_PNL: PnLEntry[] = [
  { gymId: 'g1', gymName: 'Andheri East', month: '2025-06', revenue: 420000, cogs: 42000, grossProfit: 378000, staffCost: 85000, rentUtilities: 28000, marketing: 8000, miscExpenses: 6000, ebitda: 251000, tax: 50200, netProfit: 200800 },
  { gymId: 'g2', gymName: 'Bandra West', month: '2025-06', revenue: 380000, cogs: 38000, grossProfit: 342000, staffCost: 78000, rentUtilities: 25000, marketing: 7000, miscExpenses: 6000, ebitda: 226000, tax: 45200, netProfit: 180800 },
  { gymId: 'g3', gymName: 'Powai', month: '2025-06', revenue: 310000, cogs: 31000, grossProfit: 279000, staffCost: 65000, rentUtilities: 22000, marketing: 5000, miscExpenses: 4000, ebitda: 183000, tax: 36600, netProfit: 146400 },
  { gymId: 'g4', gymName: 'Thane', month: '2025-06', revenue: 195000, cogs: 19500, grossProfit: 175500, staffCost: 52000, rentUtilities: 18000, marketing: 3000, miscExpenses: 3500, ebitda: 99000, tax: 19800, netProfit: 79200 },
];

export const MOCK_PAYOUTS_KPI: PayoutsKPIData = {
  totalNetProfit: 852850,
  totalGrossRevenue: 1305000,
  totalExpenses: 452150,
  pendingPayouts: 2,
};
