// RESPONSIBILITY: Renders the action bar for Expenses: Search, Filters, and "Add Expense" button.
'use client';

import { useExpensesContext } from '@/app/manager/expenses/expenses_context/ManagerExpensesContext';
import { Search, Plus } from 'lucide-react';
import { EXPENSE_STATUS_LABELS } from '@/app/manager/expenses/expenses_utils/ManagerExpensesSharedConstants';

export default function ManagerExpensesToolbar() {
  const { search, setSearch, statusFilter, setStatusFilter, openAdd } = useExpensesContext();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
        <h1 className="text-2xl font-bold text-foreground mr-4">Expenses</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all cursor-pointer"
        >
          <option value="All">All Statuses</option>
          {Object.entries(EXPENSE_STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>
      <button
        onClick={openAdd}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        <Plus size={18} />
        Add Expense
      </button>
    </div>
  );
}
