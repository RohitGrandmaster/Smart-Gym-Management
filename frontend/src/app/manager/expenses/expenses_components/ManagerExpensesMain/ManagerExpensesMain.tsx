// RESPONSIBILITY: Main container for the Expenses module. Owns the ExpensesProvider and assembles Header, Toolbar, KPIs, Table, and Modal.
'use client';

import { Suspense, useState } from 'react';
import { ExpensesProvider } from '@/app/manager/expenses/expenses_context/ManagerExpensesContext';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import ManagerExpensesToolbar from '@/app/manager/expenses/expenses_components/ManagerExpensesToolbar/ManagerExpensesToolbar';
import ManagerExpensesKPIs from '@/app/manager/expenses/expenses_components/ManagerExpensesKPIs/ManagerExpensesKPIs';
import ManagerExpensesTable from '@/app/manager/expenses/expenses_components/ManagerExpensesTable/ManagerExpensesTable';
import ManagerExpensesModal from '@/app/manager/expenses/expenses_components/ManagerExpensesModal/ManagerExpensesModal';
import { useManagerExpensesStore } from '@/app/manager/expenses/expenses_store/useManagerExpensesStore';

// DATA FLOW: ExpensesProvider → useManagerExpensesStore (Zustand) → ManagerExpensesTable/KPIs/Toolbar

function ExpensesContent() {
  const fetchState = useManagerExpensesStore(s => s.fetchState);

  if (fetchState === 'error') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-danger font-medium">Failed to load expenses. Please try again.</p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('View Expenses');

  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Expenses" subtitle="Track and manage operational costs" />
      <div className="p-4 sm:p-6 space-y-6 max-w-screen-2xl mx-auto w-full">
        
        <div className="flex flex-wrap gap-2 bg-card border border-border p-1 rounded-xl w-fit mb-4">
          {['Add Expense', 'View Expenses', 'Expense Report'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === t ? 'bg-primary text-primary-foreground shadow' : 'text-secondary hover:text-foreground hover:bg-accent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'View Expenses' && (
          <>
            <Suspense fallback={<div className="h-20 bg-skeleton-base motion-safe:animate-pulse rounded-xl" />}>
              <ManagerExpensesToolbar />
            </Suspense>

            <Suspense fallback={<div className="h-32 bg-skeleton-base motion-safe:animate-pulse rounded-xl" />}>
              <ManagerExpensesKPIs />
            </Suspense>

            <Suspense fallback={<div className="h-96 bg-skeleton-base motion-safe:animate-pulse rounded-xl" />}>
              <ManagerExpensesTable />
            </Suspense>
          </>
        )}

        {activeTab === 'Add Expense' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Record New Expense</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Expense Category</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Equipment Maintenance</option>
                  <option>Rent & Utilities</option>
                  <option>Marketing</option>
                  <option>Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                <input type="number" placeholder="0.00" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea rows={3} placeholder="Description..." className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"></textarea>
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2">
                Save Expense
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Expense Report' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Monthly Expense Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-input rounded-lg">
                <p className="text-sm text-secondary">Total Expenses (This Month)</p>
                <p className="text-2xl font-bold text-danger">₹45,000</p>
              </div>
              <div className="p-4 bg-input rounded-lg">
                <p className="text-sm text-secondary">Highest Category</p>
                <p className="text-2xl font-bold text-warning">Rent (₹30,000)</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-input border border-dashed border-border rounded-xl">
              <p className="text-secondary font-medium">Expense Chart Visualization Area</p>
            </div>
          </div>
        )}

        <ManagerExpensesModal />
      </div>
    </div>
  );
}

export default function ManagerExpensesMain() {
  return (
    <ExpensesProvider>
      <ExpensesContent />
    </ExpensesProvider>
  );
}
