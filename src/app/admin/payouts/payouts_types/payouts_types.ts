// RESPONSIBILITY: TypeScript types for the Payouts module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type PayoutTab = 'summary' | 'pnl';

export interface GymPayout {
  gymId: string;
  gymName: string;
  month: string;
  grossRevenue: number;
  staffPayroll: number;
  operationalExpenses: number;
  platformFee: number;
  netProfit: number;
  payoutStatus: 'paid' | 'pending' | 'processing';
  paidOn?: string;
}

export interface PnLEntry {
  gymId: string;
  gymName: string;
  month: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  staffCost: number;
  rentUtilities: number;
  marketing: number;
  miscExpenses: number;
  ebitda: number;
  tax: number;
  netProfit: number;
}

export interface PayoutsKPIData {
  totalNetProfit: number;
  totalGrossRevenue: number;
  totalExpenses: number;
  pendingPayouts: number;
}
