// RESPONSIBILITY: Defines all TypeScript types and interfaces for the Affiliates module.
export type AffiliateStatus = 'ACTIVE' | 'INACTIVE';

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalReferred: number;
  commissionEarned: number;
  status: AffiliateStatus;
  joinedAt: string;
}

import { z } from 'zod';

export const AffiliateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name cannot exceed 80 characters.'),

  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),

  referralCode: z
    .string()
    .min(4, 'Referral code must be at least 4 characters.')
    .max(16, 'Referral code cannot exceed 16 characters.')
    .regex(/^[A-Za-z0-9]+$/, 'Referral code must be alphanumeric only.'),
});

export type AffiliateFormData = z.infer<typeof AffiliateSchema>;
