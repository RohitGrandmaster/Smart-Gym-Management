// RESPONSIBILITY: Defines all TypeScript types for the Coupons module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type CouponType = 'percentage' | 'flat';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  assignedGyms: string[];
  assignedGymNames: string[];
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
  createdAt: string;
}

export interface CouponFormValues {
  code: string;
  description: string;
  type: CouponType;
  value: string;
  minOrderAmount: string;
  maxDiscount: string;
  usageLimit: string;
  assignedGyms: string[];
  validFrom: string;
  validUntil: string;
}

export interface CouponsKPIData {
  totalCoupons: number;
  activeCoupons: number;
  totalRedeemed: number;
  revenueLost: number;
}
