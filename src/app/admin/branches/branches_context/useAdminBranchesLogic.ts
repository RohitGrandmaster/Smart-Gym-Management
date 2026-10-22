// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
"use client";
import { useAdminBranchesStore } from "@/app/admin/branches/branches_store/useAdminBranchesStore";
import { useAdminBranchesData } from "@/app/admin/admin_store/useAdminBranchesData";
import type { Branch } from "@/app/admin/admin_store/useAdminGlobalStore";
import type { TimeRange } from "@/app/admin/dashboard/dashboard_types/dashboard_types";

export type DetailView = "revenue" | "expenses" | "staff" | "students";

export function useAdminBranchesLogic() {
  const { data: branchesData = [], isLoading, isError } = useAdminBranchesData();
  const branches = Array.isArray(branchesData) ? branchesData : ((branchesData as any)?.branches || []);
  const {
    timeRange, setTimeRange,
    startDate, setStartDate,
    endDate, setEndDate,
    selectedBranch, setSelectedBranch,
    detailView, setDetailView
  } = useAdminBranchesStore();

  const getMultiplier = (tr: TimeRange) => {
    if (tr === "weekly") return 0.25;
    if (tr === "yearly") return 12;
    if (tr === "custom") return 0.5;
    return 1;
  };
  const multiplier = getMultiplier(timeRange);

  const openDetail = (b: Branch, v: DetailView) => {
    setSelectedBranch(b);
    setDetailView(v);
  };
  const closeDetail = () => {
    setSelectedBranch(null);
    setDetailView(null);
  };

  return {
    branches,
    isLoading,
    isError,
    timeRange,
    setTimeRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedBranch,
    detailView,
    openDetail,
    closeDetail,
    multiplier,
  };
}


