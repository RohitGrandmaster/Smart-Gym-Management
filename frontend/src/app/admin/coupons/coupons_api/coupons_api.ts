// RESPONSIBILITY: API client for the Coupons module.
import type { ApiResponse } from '@/lib/api';
import type { Coupon } from '@/app/admin/coupons/coupons_types/coupons_types';
import { MOCK_COUPONS } from '@/app/admin/coupons/coupons_utils/AdminCouponsSharedConstants';

let mockCoupons = [...MOCK_COUPONS];

export const couponsApi = {
  fetchCoupons: async (): Promise<ApiResponse<Coupon[]>> => ({
    success: true, message: 'Coupons fetched', data: mockCoupons,
  }),
  createCoupon: async (payload: Partial<Coupon>): Promise<ApiResponse<Coupon>> => {
    const newCoupon = { ...payload, id: `c${Date.now()}`, usedCount: 0, createdAt: new Date().toISOString(), status: 'active' as const } as Coupon;
    mockCoupons = [newCoupon, ...mockCoupons];
    return { success: true, message: 'Coupon created successfully', data: newCoupon };
  },
  updateCoupon: async (id: string, payload: Partial<Coupon>): Promise<ApiResponse<Coupon>> => {
    mockCoupons = mockCoupons.map(c => c.id === id ? { ...c, ...payload } : c);
    const updated = mockCoupons.find(c => c.id === id)!;
    return { success: true, message: 'Coupon updated successfully', data: updated };
  },
  deleteCoupon: async (id: string): Promise<ApiResponse<null>> => {
    mockCoupons = mockCoupons.filter(c => c.id !== id);
    return { success: true, message: 'Coupon deleted successfully', data: null };
  },
  toggleCoupon: async (id: string): Promise<ApiResponse<Coupon>> => {
    mockCoupons = mockCoupons.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' as const : 'active' as const } : c);
    const updated = mockCoupons.find(c => c.id === id)!;
    return { success: true, message: `Coupon ${updated.status === 'active' ? 'activated' : 'deactivated'}`, data: updated };
  },
};
