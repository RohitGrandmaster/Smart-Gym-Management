// RESPONSIBILITY: Defines all TypeScript types and interfaces for the Plans module.

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  maxMembers: number;
  maxStaff: number;
  dbLimitGb?: number;
  binaryLimitGb?: number;
  features: string[];
  activeTenants: number;
}

export type CreatePlanPayload = Omit<SubscriptionPlan, 'id' | 'activeTenants'>;
export type UpdatePlanPayload = Partial<CreatePlanPayload>;

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
