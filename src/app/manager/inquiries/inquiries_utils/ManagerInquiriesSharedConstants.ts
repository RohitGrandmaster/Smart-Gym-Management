// RESPONSIBILITY: Centralized constants, Zod schema, and shared data for the Inquiries module. Single source of truth for all hardcoded values.
import { z } from 'zod';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

export const InquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  interest: z.string().min(2, "Interest is required"),
  status: z.enum(['NEW', 'FOLLOW_UP', 'CONVERTED', 'LOST']),
  source: z.string(),
  notes: z.string().optional(),
  followUpLogs: z.array(z.object({
    date: z.string(),
    note: z.string()
  })).optional()
});

export type InquiryFormValues = z.infer<typeof InquirySchema>;

export const INQUIRIES_STATUS_LABELS: Record<string, string> = {
 NEW: 'New', 
 FOLLOW_UP: 'Follow Up', 
 CONVERTED: 'Converted', 
 LOST: 'Lost',
};

export const INQUIRIES_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  NEW: { bg: 'bg-info-bg', text: 'text-info' },
  FOLLOW_UP: { bg: 'bg-warning-bg', text: 'text-warning' },
  CONVERTED: { bg: 'bg-success-bg', text: 'text-success' },
  LOST: { bg: 'bg-danger-bg', text: 'text-danger' },
};

export const EMPTY_INQUIRY_FORM: InquiryFormValues = { 
 name: '', 
 phone: '', 
 email: '', 
 interest: '', 
 status: 'NEW', 
 source: 'Walk-in', 
 notes: '' 
};

export const INQUIRY_SOURCES = [
 'Walk-in', 'Call', 'Website', 'WhatsApp', 'Referral', 'Facebook', 'Instagram'
];



export const INQUIRIES_TABLE_HEADERS = [
 'Lead', 'Contact', 'Source', 'Status', 'Date', 'Actions'
];

export const INQUIRY_MODAL_FIELDS = [
 { label: 'Full Name', key: 'name', type: 'text', req: true },
 { label: 'Phone', key: 'phone', type: 'tel', req: true },
 { label: 'Email (optional)', key: 'email', type: 'email', req: false },
 { label: 'Notes', key: 'notes', type: 'text', req: false },
];

export const generateDefaultMessage = (name: string, interest: string) => {
 return `Hi ${name}! 👋\n\nThank you for your interest in GymSmart!\n\nWe received your inquiry about ${interest}. Our team will get in touch shortly.\n\n— Team GymSmart`;
};
