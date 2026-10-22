// RESPONSIBILITY: Centralized Zod validation schemas for ALL Superadmin module forms.
// Import the specific schema you need — never define schemas inline in form components.
//
// Why centralized? If a field requirement changes (e.g., phone becomes mandatory),
// update ONE schema here. The form component and all consuming hooks auto-inherit the fix.
// Supports Frontend Rule 16 (React Hook Form + Zod) and Rule 34 (Extreme Isolation).
//
// NOTE: This project uses Zod v4. In Zod v4, 'required_error' / 'invalid_type_error'
// are removed. Use .min(1, 'message') for required strings and .check() / .error()
// overloads for custom error messages. z.enum() requires 'as const' tuple syntax.
//
// DATA FLOW: SuperadminZodSchemas → useSuperadminAddGymForm / useCouponsPage / useSuperadminAffiliatesPage → RHF register

import { z } from 'zod';

// ─── Add / Onboard Gym Schema ─────────────────────────────────────────────── //

/**
 * Zod v4 schema for the "Onboard New Gym" multi-step form (SuperadminAddGymForm.tsx).
 * All required fields must pass before the form submits to the backend.
 * Password must match confirmPassword using .superRefine().
 */
export const addGymSchema = z
  .object({
    gymName: z
      .string()
      .min(2, 'Gym name must be at least 2 characters.')
      .max(100, 'Gym name cannot exceed 100 characters.'),

    ownerName: z
      .string()
      .min(2, 'Owner name must be at least 2 characters.')
      .max(80, 'Owner name cannot exceed 80 characters.'),

    adminEmail: z
      .string()
      .min(1, 'Admin email is required.')
      .email('Please enter a valid email address.'),

    phone: z
      .string()
      .min(1, 'Phone number is required.')
      .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Enter a valid Indian phone number.'),

    subdomain: z
      .string()
      .min(3, 'Subdomain must be at least 3 characters.')
      .max(63, 'Subdomain cannot exceed 63 characters.')
      .regex(
        /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/,
        'Only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.'
      ),

    planId: z
      .string()
      .min(1, 'Select a subscription plan.'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/\d/, 'Password must contain at least one number.'),

    confirmPassword: z.string().min(1, 'Please confirm the password.'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

export type AddGymFormValues = z.infer<typeof addGymSchema>;

// ─── Subscription Plan Schema ─────────────────────────────────────────────── //

/**
 * Zod v4 schema for creating / editing a Subscription Plan (SuperadminPlanCreateModal, SuperadminPlanEditModal).
 */
export const subscriptionPlanSchema = z.object({
  name: z
    .string()
    .min(2, 'Plan name must be at least 2 characters.')
    .max(60, 'Plan name cannot exceed 60 characters.'),

  priceMonthly: z
    .number()
    .min(0, 'Price cannot be negative.'),

  priceAnnual: z
    .number()
    .min(0, 'Annual price cannot be negative.'),

  maxMembers: z
    .number()
    .int('Must be a whole number.')
    .min(1, 'Must allow at least 1 member.'),

  maxStaff: z
    .number()
    .int('Must be a whole number.')
    .min(1, 'Must allow at least 1 staff member.'),

  dbLimitGb: z
    .number()
    .min(0, 'Must be at least 0 GB.'),

  binaryLimitGb: z
    .number()
    .min(0, 'Must be at least 0 GB.'),

  features: z
    .array(z.string().min(1, 'Feature text cannot be empty.'))
    .min(1, 'Add at least one feature.'),
});

export type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanSchema>;

// Coupon Schema has been moved to superadmin_coupons_types.ts

// Affiliate Schema has been moved to superadmin_affiliates_types.ts

// ─── Broadcast Schema ─────────────────────────────────────────────────────── //

/**
 * Zod v4 schema for composing a Broadcast (SuperadminBroadcastModal).
 * scheduledDate is only required when status is 'SCHEDULED'.
 */
export const broadcastSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters.')
      .max(120, 'Title cannot exceed 120 characters.'),

    content: z
      .string()
      .min(10, 'Content must be at least 10 characters.')
      .max(2000, 'Content cannot exceed 2000 characters.'),

    audience: z.enum(['ALL_TENANTS', 'PRO_ONLY', 'SUSPENDED_ONLY'] as const, {
      error: 'Select a target audience.',
    }),

    status: z.enum(['DRAFT', 'SCHEDULED', 'SENT'] as const, {
      error: 'Select a broadcast status.',
    }),

    scheduledDate: z.string().optional().nullable(),
  })
  .superRefine(({ status, scheduledDate }, ctx) => {
    if (status === 'SCHEDULED') {
      if (!scheduledDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Scheduled date is required when status is SCHEDULED.',
          path: ['scheduledDate'],
        });
      } else if (new Date(scheduledDate) <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Scheduled date must be in the future.',
          path: ['scheduledDate'],
        });
      }
    }
  });

export type BroadcastFormValues = z.infer<typeof broadcastSchema>;

// ─── Platform Setting Schema ──────────────────────────────────────────────── //

/**
 * Zod v4 schema for editing a platform-wide key-value setting (SuperadminSettingsClient).
 * Value is always stored as a string; type coercion is handled by the backend.
 */
export const platformSettingSchema = z.object({
  value: z
    .string()
    .min(1, 'Value cannot be empty.'),
});

export type PlatformSettingFormValues = z.infer<typeof platformSettingSchema>;

// ─── Email Tenant Owner Schema ─────────────────────────────────────────────── //

/**
 * Zod v4 schema for the "Email Owner" modal in the Gyms table (GymEmailModal).
 */
export const emailOwnerSchema = z.object({
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters.')
    .max(200, 'Subject cannot exceed 200 characters.'),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters.')
    .max(5000, 'Message cannot exceed 5000 characters.'),
});

export type EmailOwnerFormValues = z.infer<typeof emailOwnerSchema>;
