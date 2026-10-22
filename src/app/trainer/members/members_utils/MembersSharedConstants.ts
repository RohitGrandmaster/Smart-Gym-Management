// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized constants, Zod schema, and shared utilities for the Members module. Single source of truth for form defaults, status colors, billing labels, and message templates.

import { z } from 'zod';

export const MemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  planId: z.string().min(1, "Please select a plan").optional(),
  amount: z.number().min(0, "Amount must be valid").optional(),
  joinDate: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof MemberSchema>;

export const MEMBERS_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
 ACTIVE: { bg: 'bg-success-bg', text: 'text-success' },
 PENDING: { bg: 'bg-warning-bg', text: 'text-warning' },
 EXPIRED: { bg: 'bg-danger-bg', text: 'text-danger' },
};

export const MEMBER_STATUS_OPTIONS = [
  { label: 'All Status', value: 'All' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Expiring Soon', value: 'EXPIRING_SOON' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'New Members', value: 'NEW' }
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' }
];

export const EMPTY_MEMBER_FORM: MemberFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  gender: 'MALE',
};

export const formatCurrency = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');

/** Fixed 30-day display grid for the attendance calendar UI */
export const ATTENDANCE_CALENDAR_DAYS = 30;

export const MSG_TEMPLATES = {
  EXPIRED: (name: string) => `Hi ${name}! 🔔\n\nYour membership has expired. Renew today to continue your fitness journey!\n\n— Team GymSmart`,
  PENDING: (name: string, formattedAmount: string) => `Hi ${name} 🙏\n\nFriendly reminder: You have a pending amount of ${formattedAmount}. Please clear your dues at the earliest.\n\n— Team GymSmart`,
  DEFAULT: (name: string) => `Hi ${name}! 👋\n\nThis is a message from GymSmart. We hope you're enjoying your fitness journey!\n\n— Team GymSmart`
};

export const MEMBERS_TABLE_HEADERS = ['ID', 'MEMBER', 'AGE/GENDER', 'STATUS', 'EXPIRY', 'LAST WORKOUT', 'PROGRESS', 'ACTIONS'];
export const PROFILE_TABS = [
  { id: 'overview', label: 'Basic Info' },
  { id: 'fitness', label: 'Fitness Info' },
  { id: 'progress', label: 'Progress & Measurements' },
  { id: 'workout', label: 'Workout Plan' },
  { id: 'diet', label: 'Diet Plan' },
  { id: 'attendance', label: 'Attendance Calendar' }
];

