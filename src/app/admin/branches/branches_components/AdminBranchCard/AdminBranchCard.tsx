// RESPONSIBILITY: Renders each branch card with revenue/expense/student/staff tiles and the "Open as Manager" impersonation CTA.
"use client";
import { Building2, TrendingUp, TrendingDown, Users, Activity, ChevronRight, LogIn } from "lucide-react";
import { useAdminBranchesLogic } from "@/app/admin/branches/branches_context/useAdminBranchesLogic";
import { formatCurrency } from "@/lib/formatters";
import { useAdminImpersonationStore } from "@/app/admin/admin_store/useAdminImpersonationStore";
import type { Branch } from "@/app/admin/admin_store/useAdminGlobalStore";

function AdminBranchCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-input flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-input rounded w-3/4" />
              <div className="h-3 bg-input rounded w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="bg-input/50 rounded-xl p-3 h-16" />
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <div className="h-4 w-16 bg-input rounded" />
            <div className="h-4 w-20 bg-input rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminBranchCard() {
  const { branches, isLoading, isError, multiplier, openDetail } = useAdminBranchesLogic();

  if (isLoading) return <AdminBranchCardSkeleton />;

  if (isError) return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-danger-bg flex items-center justify-center">
        <Building2 size={22} className="text-danger" />
      </div>
      <p className="text-sm font-medium text-foreground">Failed to load branches</p>
      <p className="text-xs text-secondary">Please refresh the page or try again later.</p>
    </div>
  );

  const { startImpersonation } = useAdminImpersonationStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(branches as Branch[]).map((branch) => (
        <div key={branch.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary"><Building2 size={24} /></div>
            <div>
              <h3 className="font-bold text-foreground text-lg leading-tight">{branch.name}</h3>
              <p className="text-sm text-secondary mt-1">{branch.location}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={() => openDetail(branch, "revenue")} className="bg-input/50 hover:bg-success/10 hover:border-success/40 border border-transparent rounded-xl p-3 transition-all duration-200 text-left group">
              <span className="text-xs font-medium text-secondary flex items-center gap-1.5 mb-1"><TrendingUp size={12} className="text-success" /> Revenue</span>
              <div className="font-bold text-foreground group-hover:text-success transition-colors">{formatCurrency(branch.revenue * multiplier)}</div>
              <div className="flex items-center gap-0.5 mt-1 text-success opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs">View details</span><ChevronRight size={11} /></div>
            </button>
            <button onClick={() => openDetail(branch, "expenses")} className="bg-input/50 hover:bg-danger/10 hover:border-danger/40 border border-transparent rounded-xl p-3 transition-all duration-200 text-left group">
              <span className="text-xs font-medium text-secondary flex items-center gap-1.5 mb-1"><TrendingDown size={12} className="text-danger" /> Expenses</span>
              <div className="font-bold text-foreground group-hover:text-danger transition-colors">{formatCurrency(branch.expenses * multiplier)}</div>
              <div className="flex items-center gap-0.5 mt-1 text-danger opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs">View details</span><ChevronRight size={11} /></div>
            </button>
            <button onClick={() => openDetail(branch, "students")} className="bg-input/50 hover:bg-warning/10 hover:border-warning/40 border border-transparent rounded-xl p-3 transition-all duration-200 text-left group">
              <span className="text-xs font-medium text-secondary flex items-center gap-1.5 mb-1"><Users size={12} className="text-warning" /> Students</span>
              <div className="font-bold text-foreground group-hover:text-warning transition-colors">{branch.studentsCount}</div>
              <div className="flex items-center gap-0.5 mt-1 text-warning opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs">View details</span><ChevronRight size={11} /></div>
            </button>
            <button onClick={() => openDetail(branch, "staff")} className="bg-input/50 hover:bg-primary/10 hover:border-primary/40 border border-transparent rounded-xl p-3 transition-all duration-200 text-left group">
              <span className="text-xs font-medium text-secondary flex items-center gap-1.5 mb-1"><Activity size={12} className="text-primary" /> Staff</span>
              <div className="font-bold text-foreground group-hover:text-primary transition-colors">{branch.staffCount}</div>
              <div className="flex items-center gap-0.5 mt-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs">View details</span><ChevronRight size={11} /></div>
            </button>
          </div>
          <div className="mt-5 border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${branch.status === "active" ? "bg-success-bg text-success" : "bg-input text-secondary"}`}>{branch.status}</span>
              <span className="text-xs text-secondary font-medium">ID: {branch.id.toUpperCase()}</span>
            </div>
            <button
              onClick={() => startImpersonation({ id: branch.id, name: branch.name, location: branch.location })}
              className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 rounded-xl text-xs font-bold text-primary motion-safe:transition-all motion-safe:duration-200 active:scale-95"
              aria-label={`Open ${branch.name} as manager`}
            >
              <LogIn size={14} />
              Open as Manager
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
