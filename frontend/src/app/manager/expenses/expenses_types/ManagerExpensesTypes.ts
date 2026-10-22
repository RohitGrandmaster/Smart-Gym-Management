// RESPONSIBILITY: Defines TypeScript interfaces and types for the Expenses module.
export type ExpenseStatus = 'PAID' | 'PENDING';

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  referenceNo?: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ExpenseStats {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  thisMonthAmount: number;
}
