// RESPONSIBILITY: Renders the data table for the active report tab — Revenue, Attendance, Members, or Expenses.
'use client';

import { useReportsContext } from '@/app/manager/reports/reports_context/ManagerReportsContext';
import { EXPENSE_CATEGORY_STYLES } from '@/app/manager/reports/reports_utils/ManagerReportsSharedConstants';

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

function RevenueTable() {
  const { summary } = useReportsContext();
  const data = summary?.revenueData ?? [];
  return (
    <table className="w-full">
      <thead className="bg-primary/5">
        <tr>
          {['Month', 'Revenue', 'Expenses', 'Net Profit'].map(h => (
            <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map(d => (
          <tr key={d.month} className="hover:bg-primary/5 motion-safe:transition-colors">
            <td className="px-5 py-3.5 text-sm font-medium text-foreground">{d.month}</td>
            <td className="px-5 py-3.5 text-sm text-success font-semibold">{fmt(d.revenue)}</td>
            <td className="px-5 py-3.5 text-sm text-danger">{fmt(d.expenses)}</td>
            <td className={`px-5 py-3.5 text-sm font-semibold ${d.profit >= 0 ? 'text-success' : 'text-danger'}`}>{fmt(d.profit)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AttendanceTable() {
  const { summary } = useReportsContext();
  const data = (summary?.attendanceData ?? []).slice(-14);
  return (
    <table className="w-full">
      <thead className="bg-primary/5">
        <tr>
          {['Date', 'Present', 'Absent', 'Rate'].map(h => (
            <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map((d, i) => (
          <tr key={i} className="hover:bg-primary/5 motion-safe:transition-colors">
            <td className="px-5 py-3.5 text-sm text-foreground">{d.date}</td>
            <td className="px-5 py-3.5 text-sm text-success font-semibold">{d.present}</td>
            <td className="px-5 py-3.5 text-sm text-danger">{d.absent}</td>
            <td className="px-5 py-3.5 text-sm font-semibold text-primary">{d.rate}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MembersTable() {
  const { summary } = useReportsContext();
  const data = summary?.memberChurnData ?? [];
  return (
    <table className="w-full">
      <thead className="bg-primary/5">
        <tr>
          {['Month', 'New Members', 'Churned', 'Active'].map(h => (
            <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map(d => (
          <tr key={d.month} className="hover:bg-primary/5 motion-safe:transition-colors">
            <td className="px-5 py-3.5 text-sm font-medium text-foreground">{d.month}</td>
            <td className="px-5 py-3.5 text-sm text-success font-semibold">+{d.newMembers}</td>
            <td className="px-5 py-3.5 text-sm text-danger">-{d.churned}</td>
            <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{d.active}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ExpensesTable() {
  const { summary } = useReportsContext();
  const data = summary?.expenseBreakdown ?? [];
  return (
    <table className="w-full">
      <thead className="bg-primary/5">
        <tr>
          {['Category', 'Amount', 'Share'].map(h => (
            <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map(d => {
          const style = EXPENSE_CATEGORY_STYLES[d.category] ?? { bg: 'bg-secondary/10', text: 'text-secondary' };
          return (
            <tr key={d.category} className="hover:bg-primary/5 motion-safe:transition-colors">
              <td className="px-5 py-3.5">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>{d.category}</span>
              </td>
              <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{fmt(d.amount)}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-input rounded-full overflow-hidden max-w-[120px]">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${d.percentage}%` }} />
                  </div>
                  <span className="text-xs text-secondary">{d.percentage}%</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function ManagerReportsTable() {
  const { tab, summary } = useReportsContext();
  if (!summary) return null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-sm font-semibold text-foreground">{tab} Data</p>
      </div>
      <div className="overflow-x-auto">
        {tab === 'Revenue'    && <RevenueTable    />}
        {tab === 'Attendance' && <AttendanceTable />}
        {tab === 'Members'    && <MembersTable    />}
        {tab === 'Expenses'   && <ExpensesTable   />}
      </div>
    </div>
  );
}
