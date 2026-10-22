// RESPONSIBILITY: Orchestrator for the Finance module — KPIs, tabbed Payments table + Summary chart.
// DATA FLOW: FinanceProvider → useFinanceContext → sub-sections
'use client';

import dynamic from 'next/dynamic';
import { FinanceProvider, useFinanceContext } from '@/app/manager/finance/finance_context/ManagerFinanceContext';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';
import {
  IndianRupee, Wallet, Clock, TrendingUp,
  Search, Loader2, RefreshCw, Download,
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 motion-safe:animate-spin text-primary" /></div>,
});

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  UPI:        { bg: 'bg-primary/10',   text: 'text-primary'   },
  Cash:       { bg: 'bg-success/10',   text: 'text-success'   },
  Card:       { bg: 'bg-warning/10',   text: 'text-warning'   },
  NetBanking: { bg: 'bg-secondary/10', text: 'text-secondary' },
};

// ── KPI card ─────────────────────────────────────────────────────────────────
function KPICard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:shadow-lg">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Expense vs Revenue ApexChart ─────────────────────────────────────────────
function RevenueExpenseChart({ data }: { data: { month: string; revenue: number; expenses?: number }[] }) {
  const options = {
    chart: { background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
    colors: ['#FACC15', '#EF4444'],
    grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
    tooltip: { theme: 'dark' as const },
    xaxis: {
      categories: data.map(d => d.month),
      labels: { style: { colors: '#A1A1AA', fontSize: '11px' } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#A1A1AA', fontSize: '11px' }, formatter: (v: number) => `₹${(v / 1000).toFixed(0)}k` } },
    legend: { labels: { colors: '#A1A1AA' } },
    dataLabels: { enabled: false },
  };
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-sm font-semibold text-foreground mb-2">Revenue vs Expenses</p>
      <Chart
        type="bar"
        height={280}
        options={options}
        series={[
          { name: 'Revenue',  data: data.map(d => d.revenue) },
          { name: 'Expenses', data: data.map(d => d.expenses ?? 0) },
        ]}
      />
    </div>
  );
}

// ── Method breakdown ──────────────────────────────────────────────────────────
function MethodBreakdown({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <p className="text-sm font-semibold text-foreground">Revenue by Method</p>
      {Object.entries(data).map(([method, amount]) => {
        const pct = Math.round((amount / total) * 100);
        const s = METHOD_STYLES[method] ?? { bg: 'bg-input', text: 'text-secondary' };
        return (
          <div key={method} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className={`font-semibold ${s.text}`}>{method}</span>
              <span className="text-secondary">{fmt(amount)} ({pct}%)</span>
            </div>
            <div className="h-2 bg-input rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.bg.replace('/10', '')} motion-safe:transition-all motion-safe:duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Inner (consumes context) ──────────────────────────────────────────────────
function FinanceInner() {
  const {
    tab, setTab,
    search, setSearch,
    statusFilter, setStatusFilter,
    methodFilter, setMethodFilter,
    currentPage, setCurrentPage,
    payments, summary, totalPayments,
    fetchState, reload, exportCSV,
  } = useFinanceContext();

  const totalPages = Math.ceil(totalPayments / MANAGER_ITEMS_PER_PAGE);

  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Branch Finance" subtitle="Track payments, revenue, and financial overview" />

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Total Revenue"   value={summary ? fmt(summary.totalRevenue)   : '—'} icon={<TrendingUp  size={20} className="text-success" />} color="bg-success/10" />
          <KPICard label="This Month"      value={summary ? fmt(summary.monthlyRevenue) : '—'} icon={<IndianRupee size={20} className="text-primary" />} color="bg-primary/10" />
          <KPICard label="Total Payments"  value={summary ? String(summary.totalPayments) : '—'} icon={<Wallet  size={20} className="text-info"    />} color="bg-info/10"    />
          <KPICard label="Pending Amount"  value={summary ? fmt(summary.pendingAmount)  : '—'} icon={<Clock      size={20} className="text-warning" />} color="bg-warning/10" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-input rounded-xl p-1 w-fit">
          {(['Payments', 'Summary'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-lg motion-safe:transition-colors ${
                tab === t ? 'bg-card text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Payments Tab ── */}
        {tab === 'Payments' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-border">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary">
                  <option value="ALL">All Status</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
                <select value={methodFilter} onChange={e => { setMethodFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary">
                  <option value="ALL">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="NetBanking">NetBanking</option>
                </select>
                <button onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 motion-safe:transition-opacity">
                  <Download size={14} /> Export CSV
                </button>
                <button onClick={reload}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-input border border-border text-secondary hover:text-foreground motion-safe:transition-colors">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>

            {fetchState === 'loading' ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-7 h-7 motion-safe:animate-spin text-primary" />
              </div>
            ) : fetchState === 'error' ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-sm text-danger font-medium">Failed to load payments</p>
                <button onClick={reload} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90">Try Again</button>
              </div>
            ) : payments.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Wallet size={36} className="mx-auto text-secondary opacity-40" />
                <p className="text-sm text-secondary font-medium">No payments found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary/5">
                      <tr>
                        {['Invoice #', 'Member', 'Plan', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {payments.map(p => {
                        const ms = METHOD_STYLES[p.method] ?? { bg: 'bg-input', text: 'text-secondary' };
                        return (
                          <tr key={p.id} className="hover:bg-primary/5 motion-safe:transition-colors">
                            <td className="px-5 py-3.5 text-sm font-bold text-primary whitespace-nowrap">{p.invoiceNo}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <p className="text-sm font-semibold text-foreground">{p.member?.name ?? '—'}</p>
                              <p className="text-xs text-secondary">{p.member?.email ?? ''}</p>
                            </td>
                            <td className="px-5 py-3.5 text-sm text-secondary whitespace-nowrap">{p.member?.plan?.name ?? '—'}</td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-success whitespace-nowrap">{fmt(p.amount)}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${ms.bg} ${ms.text}`}>{p.method}</span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.status === 'PAID' ? 'bg-success/10 text-success' :
                                p.status === 'REFUNDED' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                              }`}>{p.status}</span>
                            </td>
                            <td className="px-5 py-3.5 text-sm text-secondary whitespace-nowrap">
                              {new Date(p.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <ManagerPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalPayments}
                  itemsPerPage={MANAGER_ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        )}

        {/* ── Summary Tab ── */}
        {tab === 'Summary' && (
          <div className="space-y-5">
            {!summary ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-7 h-7 motion-safe:animate-spin text-primary" />
              </div>
            ) : (
              <>
                <RevenueExpenseChart data={summary.monthlyData ?? []} />
                <MethodBreakdown data={summary.revenueByMethod} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Export wrapped in provider ────────────────────────────────────────────────
export default function ManagerFinanceMain() {
  return (
    <FinanceProvider>
      <FinanceInner />
    </FinanceProvider>
  );
}
