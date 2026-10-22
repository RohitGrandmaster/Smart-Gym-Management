// RESPONSIBILITY: Shared constants and form schemas for the Expenses module.
import { z } from 'zod';

export const ExpenseSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(2, 'Category is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['PAID', 'PENDING']),
  referenceNo: z.string().optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

export type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

export const EMPTY_EXPENSE_FORM = {
  title: '',
  category: 'Miscellaneous',
  amount: 0,
  date: '',
  status: 'PENDING',
  referenceNo: '',
  notes: '',
  receiptUrl: ''
};

export const EXPENSE_CATEGORIES = [
  'Electricity',
  'Rent',
  'Water Bill',
  'Equipment Maintenance',
  'Salary/Payroll',
  'Marketing',
  'Office Supplies',
  'Miscellaneous'
];

export const EXPENSE_STATUS_LABELS: Record<string, string> = {
  PAID: 'Paid',
  PENDING: 'Pending',
};

export const EXPENSE_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  PAID: { bg: 'bg-success-bg', text: 'text-success' },
  PENDING: { bg: 'bg-danger-bg', text: 'text-danger' },
};

export const EXPENSES_TABLE_HEADERS = [
  'ID', 'Title', 'Category', 'Amount', 'Date', 'Status', 'Actions'
];
