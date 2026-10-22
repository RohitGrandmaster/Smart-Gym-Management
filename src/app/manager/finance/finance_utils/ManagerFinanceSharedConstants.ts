// RESPONSIBILITY: Provides the implementation for ManagerFinanceSharedConstants.ts functionality within its module.
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

export const FINANCE_TABS = ['Payments', 'Summary'];

export const AddPaymentSchema = z.object({
  memberId: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Valid Member ID required'),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Valid amount required'),
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
