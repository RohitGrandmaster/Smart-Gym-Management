// RESPONSIBILITY: Provides the implementation for AdminFinanceSharedConstants.ts functionality within its module.
import { z } from 'zod';

export const FINANCE_METHOD_STYLES: Record<string, { bg: string; text: string }> = {
 UPI: { bg: 'bg-primary/10', text: 'text-primary' },
 Cash: { bg: 'bg-success/10', text: 'text-success' },
 Card: { bg: 'bg-warning/10', text: 'text-warning' },
 NetBanking: { bg: 'bg-secondary/10', text: 'text-secondary' },
};

export const FINANCE_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
 PAID: { bg: 'bg-success/10', text: 'text-success' },
 DUE: { bg: 'bg-danger/10', text: 'text-danger' },
 REFUNDED: { bg: 'bg-warning/10', text: 'text-warning' },
};

export const FINANCE_PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'NetBanking'];

export const PAYMENTS_TABLE_HEADERS = ['Invoice No', 'Member', 'Amount', 'Method', 'Status', 'Date'];

export const FINANCE_TABS = ['Payments', 'Expenses', 'Summary'];

export const EXPENSE_CATEGORIES = ['Rent', 'Salaries', 'Utilities', 'Equipment', 'Marketing', 'Maintenance', 'Supplies', 'Other'];

export const MOCK_EXPENSES = [
  { id: 'e1', amount: 45000, category: 'Rent', branchId: 'b1', branchName: 'Downtown Core', date: '2025-01-01', notes: 'Monthly rent', recordedBy: 'Manager A' },
  { id: 'e2', amount: 12000, category: 'Utilities', branchId: 'b1', branchName: 'Downtown Core', date: '2025-01-05', notes: 'Electricity bill', recordedBy: 'Manager A' },
  { id: 'e3', amount: 32000, category: 'Rent', branchId: 'b2', branchName: 'Uptown Plaza', date: '2025-01-01', notes: 'Monthly rent', recordedBy: 'Manager B' },
  { id: 'e4', amount: 8500, category: 'Equipment', branchId: 'b2', branchName: 'Uptown Plaza', date: '2025-01-10', notes: 'Treadmill repair', recordedBy: 'Manager B' },
  { id: 'e5', amount: 55000, category: 'Rent', branchId: 'b3', branchName: 'Westside Mall', date: '2025-01-01', notes: 'Monthly rent', recordedBy: 'Manager C' },
  { id: 'e6', amount: 18000, category: 'Marketing', branchId: 'b3', branchName: 'Westside Mall', date: '2025-01-12', notes: 'Social media ads', recordedBy: 'Manager C' },
  { id: 'e7', amount: 6200, category: 'Supplies', branchId: 'b1', branchName: 'Downtown Core', date: '2025-01-15', notes: 'Cleaning supplies', recordedBy: 'Manager A' },
  { id: 'e8', amount: 9800, category: 'Maintenance', branchId: 'b2', branchName: 'Uptown Plaza', date: '2025-01-18', notes: 'AC servicing', recordedBy: 'Manager B' },
];

export const AddExpenseSchema = z.object({
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Valid positive amount required'),
  category: z.string().min(1, 'Category is required'),
  branchId: z.string().min(1, 'Branch is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});
export type AddExpenseFormValues = z.infer<typeof AddExpenseSchema>;

export const EMPTY_EXPENSE_FORM: AddExpenseFormValues = {
  amount: '',
  category: 'Rent',
  branchId: '',
  date: new Date().toISOString().split('T')[0] ?? '',
  notes: '',
};

export const AddPaymentSchema = z.object({
  memberId: z.string().min(1, 'Valid Member ID required'),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Valid positive amount required'),
  method: z.string(),
  notes: z.string().optional()
});
export type AddPaymentFormValues = z.infer<typeof AddPaymentSchema>;

export const EMPTY_PAYMENT_FORM: AddPaymentFormValues = {
  memberId: '',
  amount: '',
  method: 'UPI',
  notes: ''
};

