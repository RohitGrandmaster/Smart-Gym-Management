// RESPONSIBILITY: Server Component — entry point for the Expenses module. Fetches no initial data (expenses use client-side fetching via Zustand store). Delegates rendering to ManagerExpensesMain which owns its own Provider.
import type { Metadata } from 'next';
import ManagerExpensesMain from '@/app/manager/expenses/expenses_components/ManagerExpensesMain/ManagerExpensesMain';

export const metadata: Metadata = {
  title: 'Expenses | GymSmart Manager',
  description: 'Manage gym operational expenses and inventory.',
};

export default function ExpensesPage() {
  return <ManagerExpensesMain />;
}
