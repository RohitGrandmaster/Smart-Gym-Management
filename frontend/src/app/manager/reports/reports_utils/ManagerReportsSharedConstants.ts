// RESPONSIBILITY: Mock data, styles, and shared constants for the Manager Reports module.
import type { ReportSummary } from '@/app/manager/reports/reports_types/ManagerReportsTypes';

export const REPORT_TABS = ['Revenue', 'Attendance', 'Members', 'Expenses'] as const;

export const REPORT_DATE_RANGE_OPTIONS = [
  { label: 'Last 7 Days',   value: '7d'  },
  { label: 'Last 30 Days',  value: '30d' },
  { label: 'Last 3 Months', value: '3m'  },
  { label: 'Last 6 Months', value: '6m'  },
  { label: 'Last 12 Months',value: '12m' },
];

export const EXPENSE_CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  Rent:        { bg: 'bg-danger/10',   text: 'text-danger'   },
  Salaries:    { bg: 'bg-warning/10',  text: 'text-warning'  },
  Equipment:   { bg: 'bg-info/10',     text: 'text-info'     },
  Utilities:   { bg: 'bg-primary/10',  text: 'text-primary'  },
  Marketing:   { bg: 'bg-success/10',  text: 'text-success'  },
  Maintenance: { bg: 'bg-purple/10',   text: 'text-purple'   },
  Other:       { bg: 'bg-secondary/10',text: 'text-secondary'},
};

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const MOCK_REPORT_SUMMARY: ReportSummary = {
  kpis: {
    totalRevenue: 1248000,
    totalMembers: 342,
    avgAttendanceRate: 68,
    totalExpenses: 487000,
    netProfit: 761000,
    newMembersThisMonth: 24,
    churnRate: 4.2,
    activeMembers: 298,
  },
  revenueData: months.map((month, i) => ({
    month,
    revenue: 80000 + Math.round(Math.random() * 40000) + i * 3000,
    expenses: 35000 + Math.round(Math.random() * 10000),
    profit: 0,
  })).map(d => ({ ...d, profit: d.revenue - d.expenses })),
  attendanceData: Array.from({ length: 30 }, (_, i) => {
    const present = 60 + Math.round(Math.random() * 80);
    const absent = 20 + Math.round(Math.random() * 30);
    return {
      date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      present,
      absent,
      rate: Math.round((present / (present + absent)) * 100),
    };
  }),
  memberChurnData: months.map(month => ({
    month,
    newMembers: 15 + Math.round(Math.random() * 20),
    churned: 3 + Math.round(Math.random() * 8),
    active: 280 + Math.round(Math.random() * 40),
  })),
  expenseBreakdown: [
    { category: 'Rent',        amount: 120000, percentage: 24.6 },
    { category: 'Salaries',    amount: 180000, percentage: 36.9 },
    { category: 'Equipment',   amount: 60000,  percentage: 12.3 },
    { category: 'Utilities',   amount: 45000,  percentage: 9.2  },
    { category: 'Marketing',   amount: 35000,  percentage: 7.2  },
    { category: 'Maintenance', amount: 28000,  percentage: 5.7  },
    { category: 'Other',       amount: 19000,  percentage: 3.9  },
  ],
};
