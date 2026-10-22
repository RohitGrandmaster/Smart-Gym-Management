// RESPONSIBILITY: Centralized constants, mock data, Zod schema, and shared config for the Coupons module.
import { z } from 'zod';
import type { Coupon, CouponsKPIData } from '@/app/admin/coupons/coupons_types/coupons_types';

export const COUPON_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat Amount (₹)' },
];

export const COUPON_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
];

export const GYM_OPTIONS = [
  { value: 'all', label: 'All Gyms' },
  { value: 'b1', label: 'Andheri East' },
  { value: 'b2', label: 'Bandra West' },
  { value: 'b3', label: 'Powai' },
  { value: 'b4', label: 'Thane' },
];

export const COUPONS_ITEMS_PER_PAGE = 10;

export const formatCurrency = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');

export const CouponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20, 'Code too long').toUpperCase(),
  description: z.string().min(5, 'Description required'),
  type: z.enum(['percentage', 'flat']),
  value: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Must be a positive number'),
  minOrderAmount: z.string().refine(v => !isNaN(Number(v)) && Number(v) >= 0, 'Must be 0 or more'),
  maxDiscount: z.string().refine(v => !isNaN(Number(v)) && Number(v) >= 0, 'Must be 0 or more'),
  usageLimit: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Must be at least 1'),
  assignedGyms: z.array(z.string()).min(1, 'Assign to at least one gym'),
  validFrom: z.string().min(1, 'Start date required'),
  validUntil: z.string().min(1, 'End date required'),
});

export const EMPTY_COUPON_FORM = {
  code: '',
  description: '',
  type: 'percentage' as const,
  value: '',
  minOrderAmount: '0',
  maxDiscount: '0',
  usageLimit: '100',
  assignedGyms: ['all'],
  validFrom: '',
  validUntil: '',
};

export const MOCK_COUPONS: Coupon[] = [
  { id: 'c1', code: 'WELCOME20', description: '20% off for new members', type: 'percentage', value: 20, minOrderAmount: 1000, maxDiscount: 500, usageLimit: 200, usedCount: 87, assignedGyms: ['all'], assignedGymNames: ['All Gyms'], validFrom: '2025-01-01', validUntil: '2025-06-30', status: 'active', createdAt: '2025-01-01' },
  { id: 'c2', code: 'FLAT500', description: '₹500 flat off on annual plans', type: 'flat', value: 500, minOrderAmount: 5000, maxDiscount: 500, usageLimit: 100, usedCount: 43, assignedGyms: ['b1', 'b2'], assignedGymNames: ['Andheri East', 'Bandra West'], validFrom: '2025-01-15', validUntil: '2025-03-31', status: 'active', createdAt: '2025-01-15' },
  { id: 'c3', code: 'SUMMER15', description: '15% summer discount', type: 'percentage', value: 15, minOrderAmount: 2000, maxDiscount: 800, usageLimit: 150, usedCount: 150, assignedGyms: ['all'], assignedGymNames: ['All Gyms'], validFrom: '2024-05-01', validUntil: '2024-08-31', status: 'expired', createdAt: '2024-04-20' },
  { id: 'c4', code: 'POWAI10', description: '10% off at Powai branch', type: 'percentage', value: 10, minOrderAmount: 0, maxDiscount: 300, usageLimit: 50, usedCount: 12, assignedGyms: ['b3'], assignedGymNames: ['Powai'], validFrom: '2025-02-01', validUntil: '2025-04-30', status: 'active', createdAt: '2025-01-28' },
  { id: 'c5', code: 'REFER200', description: '₹200 off for referrals', type: 'flat', value: 200, minOrderAmount: 1500, maxDiscount: 200, usageLimit: 500, usedCount: 231, assignedGyms: ['all'], assignedGymNames: ['All Gyms'], validFrom: '2025-01-01', validUntil: '2025-12-31', status: 'active', createdAt: '2025-01-01' },
  { id: 'c6', code: 'THANE25', description: '25% off to boost Thane memberships', type: 'percentage', value: 25, minOrderAmount: 0, maxDiscount: 1000, usageLimit: 80, usedCount: 0, assignedGyms: ['b4'], assignedGymNames: ['Thane'], validFrom: '2025-03-01', validUntil: '2025-05-31', status: 'inactive', createdAt: '2025-02-20' },
];

export const MOCK_COUPONS_KPI: CouponsKPIData = {
  totalCoupons: 6,
  activeCoupons: 4,
  totalRedeemed: 523,
  revenueLost: 184500,
};
