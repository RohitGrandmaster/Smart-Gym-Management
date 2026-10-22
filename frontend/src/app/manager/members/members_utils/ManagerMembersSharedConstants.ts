// RESPONSIBILITY: Centralized constants, Zod schema, and shared utilities for the Members module. Single source of truth for form defaults, status colors, billing labels, and message templates.
import type { PlanWithCustom } from '@/app/manager/members/members_types/ManagerMembersTypes';
import { z } from 'zod';

export const MemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  address: z.string().optional(),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits").optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  billingCycle: z.string(),
  customDays: z.coerce.number().min(1, "Please enter valid days").optional().or(z.literal(0)),
  planId: z.string().min(1, "Please select a plan"),
  totalAmount: z.coerce.number().min(0).optional(),
  paidAmount: z.coerce.number().min(0, "Amount must be valid").optional(),
  pendingAmount: z.coerce.number().optional(),
  advanceAmount: z.coerce.number().optional(),
  joinDate: z.string().optional(),
  expiryDate: z.string().optional(),
  medicalHistory: z.string().optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'EXPIRED', 'FROZEN', 'SUSPENDED', 'BANNED']).optional(),
});

export type MemberFormValues = z.infer<typeof MemberSchema>;

export const MEMBERS_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: 'bg-success-bg', text: 'text-success' },
  PENDING: { bg: 'bg-warning-bg', text: 'text-warning' },
  EXPIRED: { bg: 'bg-danger-bg', text: 'text-danger' },
  FROZEN: { bg: 'bg-info-bg', text: 'text-info' },
  SUSPENDED: { bg: 'bg-danger', text: 'text-white' },
  BANNED: { bg: 'bg-gray-800', text: 'text-white' },
};

export const MEMBERS_CYCLE_LABELS: Record<string, string> = {
 ONE_MONTH: '1 Month',
 THREE_MONTHS: '3 Months',
 SIX_MONTHS: '6 Months',
 TWELVE_MONTHS: '12 Months',
 CUSTOM: 'Custom (Days)',
};

export const MEMBER_STATUS_OPTIONS = [
  { label: 'All Status', value: 'All' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Frozen', value: 'FROZEN' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Banned', value: 'BANNED' }
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' }
];

const today = new Date();
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

export const EMPTY_MEMBER_FORM: MemberFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  aadhaar: '',
  gender: 'MALE',
  billingCycle: 'ONE_MONTH',
  planId: '',
  joinDate: today.toISOString().split('T')[0],
  expiryDate: nextMonth.toISOString().split('T')[0],
  medicalHistory: '',
};

export const formatCurrency = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');

/** Fixed 30-day display grid for the attendance calendar UI */
export const ATTENDANCE_CALENDAR_DAYS = 30;

export function getPriceForCycle(plan: PlanWithCustom | undefined, cycle: string, customDays: number = 0): number {
  if (!plan) return 0;
  const map: Record<string, number> = {
    ONE_MONTH: plan.price1Month,
    THREE_MONTHS: plan.price3Month,
    SIX_MONTHS: plan.price6Month,
    TWELVE_MONTHS: plan.price12Month,
    CUSTOM: (plan.priceCustom || 0) * (customDays || 0),
  };
  return map[cycle] || 0;
}

export const MSG_TEMPLATES = {
  EXPIRED: (name: string) => `Hi ${name}! 🔔\n\nYour membership has expired. Renew today to continue your fitness journey!\n\n— Team GymSmart`,
  PENDING: (name: string, formattedAmount: string) => `Hi ${name} 🙏\n\nFriendly reminder: You have a pending amount of ${formattedAmount}. Please clear your dues at the earliest.\n\n— Team GymSmart`,
  DEFAULT: (name: string) => `Hi ${name}! 👋\n\nThis is a message from GymSmart. We hope you're enjoying your fitness journey!\n\n— Team GymSmart`
};

export const MEMBERS_TABLE_HEADERS = ['ID', 'MEMBER', 'PLAN', 'STATUS', 'CYCLE', 'PAID', 'PENDING', 'EXPIRY', 'DIET', 'WORKOUT', 'TRAINER', 'ACTIONS'];
export const PROFILE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'payments', label: 'Payments' },
  { id: 'workout', label: 'Workout Plan' },
  { id: 'diet', label: 'Diet Plan' }
];
