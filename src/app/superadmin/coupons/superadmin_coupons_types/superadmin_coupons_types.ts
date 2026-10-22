// RESPONSIBILITY: Defines all TypeScript types and interfaces for the Coupons module.
export type CouponStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'DEPLETED';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'EXACT';
  discountValue: number;
  maxUses: number;
  currentUses: number;
  status: CouponStatus;
  expiryDate: string;
  isDeleted: boolean;
}

import { z } from 'zod';

export const CouponSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Coupon code must be at least 3 characters.')
      .max(20, 'Coupon code cannot exceed 20 characters.')
      .regex(/^[A-Z0-9-]+$/, 'Code must be uppercase letters, digits, and hyphens only.'),

    discountType: z.enum(['PERCENTAGE', 'EXACT'] as const, {
      error: 'Select a discount type.',
    }),

    discountValue: z
      .number()
      .positive('Discount value must be greater than zero.'),

    maxUses: z
      .number()
      .int('Must be a whole number.')
      .min(1, 'Must allow at least 1 use.'),

    expiryDate: z
      .string()
      .min(1, 'Expiry date is required.')
      .refine((val) => new Date(val) > new Date(), {
        message: 'Expiry date must be in the future.',
      }),
  })
  .superRefine(({ discountType, discountValue }, ctx) => {
    if (discountType === 'PERCENTAGE' && discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Percentage discount cannot exceed 100%.',
        path: ['discountValue'],
      });
    }
  });

export type CouponFormData = z.infer<typeof CouponSchema>;
