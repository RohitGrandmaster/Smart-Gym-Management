"use client";
// RESPONSIBILITY: Reusable stat card for superadmin dashboards.
import type { LucideIcon } from "lucide-react";
import { formatKPI } from "@/lib/formatters";

interface SuperadminMetricsProps {
  label: string;
  value: number;
  type?: "currency" | "number";
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "danger" | "info";
}

export default function SuperadminMetrics({ label, value, type = "number", icon: Icon, color }: SuperadminMetricsProps) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success-bg",
    warning: "text-warning bg-warning-bg",
    danger: "text-danger bg-danger-bg",
    info: "text-info bg-info-bg",
  };
  const c = colorMap[color];
  const displayValue = type === "currency" ? formatKPI(value) : value.toLocaleString("en-IN");

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md motion-safe:transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.split(" ")[1]}`}>
        <Icon className={`w-5 h-5 ${c.split(" ")[0]}`} />
      </div>
      <div>
        <p className="text-xs text-secondary font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold ${c.split(" ")[0]} mt-0.5`}>{displayValue}</p>
      </div>
    </div>
  );
}
