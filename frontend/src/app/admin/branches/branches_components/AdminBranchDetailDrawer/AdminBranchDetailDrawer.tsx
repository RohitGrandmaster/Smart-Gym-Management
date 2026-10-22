// RESPONSIBILITY: Core UI component/route for the admin module orchestrating views and displaying sub-components.
"use client";
import { Building2, TrendingUp, TrendingDown, Users, Activity, X } from "lucide-react";
import { useAdminBranchesLogic } from "@/app/admin/branches/branches_context/useAdminBranchesLogic";
import { formatCurrency } from "@/lib/formatters";

export default function AdminBranchDetailDrawer() {
  const { selectedBranch: branch, detailView: view, closeDetail } = useAdminBranchesLogic();
  if (!branch || !view) return null;

  const methodColor: Record<string, string> = { UPI: "bg-pay-upi-bg text-pay-upi", Cash: "bg-pay-cash-bg text-pay-cash", Card: "bg-pay-card-bg text-pay-card" };
  const titles = { revenue: "Revenue Breakdown", expenses: "Expense Breakdown", staff: "Staff List", students: "Students" };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeDetail} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border z-40 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div><h2 className="font-bold text-foreground text-lg">{titles[view]}</h2><p className="text-sm text-secondary flex items-center gap-1.5 mt-0.5"><Building2 size={13} /> {branch.name}</p></div>
          <button onClick={closeDetail} className="w-8 h-8 rounded-lg bg-input hover:bg-border flex items-center justify-center transition-colors"><X size={16} className="text-secondary" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {view === "revenue" && (
            <>{branch.revenueItems?.map(i => <div key={i.id} className="flex justify-between p-3.5 bg-input/40 rounded-xl border border-border"><div><p className="text-sm font-medium text-foreground">{i.label}</p><p className="text-xs text-secondary">{i.date}</p></div><div className="flex items-center gap-2"><span className={`text-xs px-2 py-0.5 rounded-full ${methodColor[i.method] ?? "bg-border text-secondary"}`}>{i.method}</span><span className="font-bold text-success">{formatCurrency(i.amount)}</span></div></div>)}</>
          )}
          {view === "expenses" && (
            <>{branch.expenseItems?.map(i => <div key={i.id} className="flex justify-between p-3.5 bg-input/40 rounded-xl border border-border"><div><p className="text-sm font-medium text-foreground">{i.label}</p><p className="text-xs text-secondary">{i.date}</p></div><span className="font-bold text-danger">{formatCurrency(i.amount)}</span></div>)}</>
          )}
          {view === "staff" && (
            <>{branch.staffList?.map(s => <div key={s.id} className="flex justify-between p-3.5 bg-input/40 rounded-xl border border-border"><div><p className="text-sm font-medium text-foreground">{s.name}</p><p className="text-xs text-secondary">{s.role}</p></div><span className="text-xs">{s.status}</span></div>)}</>
          )}
          {view === "students" && (
            <>{branch.studentList?.map(s => <div key={s.id} className="flex justify-between p-3.5 bg-input/40 rounded-xl border border-border"><div><p className="text-sm font-medium text-foreground">{s.name}</p><p className="text-xs text-secondary">{s.plan}</p></div><span className="text-xs">{s.status}</span></div>)}</>
          )}
        </div>
      </div>
    </>
  );
}


