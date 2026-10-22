// RESPONSIBILITY: Renders interactive KPI cards for Finance module. Clicking a card filters the AdminFinancePaymentsTable by payment method (Rule 74). Reads/writes state via AdminFinanceContext.
'use client';

import { useAdminFinanceLogic } from '@/app/admin/finance/finance_context/useAdminFinanceLogic';
import { useAdminFinanceStore } from '@/app/admin/finance/finance_store/useAdminFinanceStore';
import { FileText, TrendingUp, IndianRupee, CreditCard } from 'lucide-react';

const METHOD_FILTER_MAP: Record<string, string> = {
  'Total Revenue': 'All',
  'Monthly Revenue': 'All',
  'Pending Amount': 'DUE',
  'Total Payments': 'All',
};

export default function AdminFinanceKPIs() {
  const { payments, summary, totalPayments, fetchState, saving, error, loadAll, search, setSearch, currentPage, setCurrentPage, savePayment, methodFilter, setMethodFilter } = useAdminFinanceLogic();
  const { showModal, setShowModal, toast, showToast, hideToast } = useAdminFinanceStore();
  if (!summary) return null;

  const kpis = [
    {
      label: 'Total Revenue',
      value: (summary.totalRevenue || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      icon: TrendingUp,
      colorClass: 'text-success',
      bgClass: 'bg-success/10',
      activeBorder: 'border-success',
      filterKey: 'All',
    },
    {
      label: 'Monthly Revenue',
      value: (summary.monthlyRevenue || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      icon: IndianRupee,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10',
      activeBorder: 'border-primary',
      filterKey: 'All',
    },
    {
      label: 'Pending Amount',
      value: (summary.pendingAmount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      icon: FileText,
      colorClass: 'text-warning',
      bgClass: 'bg-warning/10',
      activeBorder: 'border-warning',
      filterKey: 'DUE',
    },
    {
      label: 'Total Expenses',
      value: (summary.totalExpenses || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      icon: CreditCard,
      colorClass: 'text-danger',
      bgClass: 'bg-danger/10',
      activeBorder: 'border-danger',
      filterKey: 'All',
    },
    {
      label: 'Net Profit',
      value: (summary.netProfit || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      icon: TrendingUp,
      colorClass: 'text-success',
      bgClass: 'bg-success/10',
      activeBorder: 'border-success',
      filterKey: 'All',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {kpis.map((k) => {
        const isActive = methodFilter === k.filterKey && !(methodFilter === 'All' && k.filterKey === 'All' && k.label !== 'Total Revenue');
        // Special: "Pending Amount" card uniquely maps to 'DUE', so only it lights up when filter='DUE'
        const isThisActive = k.filterKey === 'DUE'
          ? methodFilter === 'DUE'
          : k.label === 'Total Revenue' && methodFilter === 'All';

        return (
          <button
            key={k.label}
            onClick={() => {
              setMethodFilter(isThisActive ? 'All' : k.filterKey);
              
            }}
            className={`text-left rounded-xl p-4 shadow-sm border-2 transition-all duration-200 bg-card hover:shadow-md flex items-center gap-3 ${
              isThisActive ? `${k.activeBorder}` : 'border-border hover:border-border/70'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bgClass}`}>
              <k.icon size={19} className={k.colorClass} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-secondary truncate">{k.label}</p>
              <p className={`text-lg font-bold truncate ${isThisActive ? k.colorClass : 'text-foreground'}`}>{k.value}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}



