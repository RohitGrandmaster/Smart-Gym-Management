// RESPONSIBILITY: Provides isolated data fetching methods for the expenses module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { ExpensesUrlConfig } from '@/app/manager/expenses/ManagerExpensesUrlConfig';
import type { Expense, ExpenseStats } from '@/app/manager/expenses/expenses_types/ManagerExpensesTypes';

export const expensesApi = {
  getAll: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ expenses: Expense[]; total: number; page: number; limit: number }>>(`${ExpensesUrlConfig.BACKEND_API.BASE}${q}`);
  },
  getOne: (id: string) => apiFetch<ApiResponse<Expense>>(ExpensesUrlConfig.BACKEND_API.GET_ONE(id)),
  getStats: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<ExpenseStats>>(`${ExpensesUrlConfig.BACKEND_API.STATS}${q}`);
  },
  create: (body: Partial<Expense>) =>
    apiFetch<ApiResponse<Expense>>(ExpensesUrlConfig.BACKEND_API.BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Expense>) =>
    apiFetch<ApiResponse<Expense>>(ExpensesUrlConfig.BACKEND_API.UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => apiFetch<ApiResponse<{ id: string }>>(ExpensesUrlConfig.BACKEND_API.DELETE(id), { method: 'DELETE' }),
};
