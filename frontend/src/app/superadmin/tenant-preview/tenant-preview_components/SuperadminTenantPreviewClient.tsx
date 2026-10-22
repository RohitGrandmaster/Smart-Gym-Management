'use client';
// RESPONSIBILITY: Tenant Self-Service Portal Preview — superadmin selects any tenant and previews
// their admin dashboard (read-only impersonation view). All data imported from constants.
// DATA FLOW: TENANT_PREVIEW_DATA + MOCK_GYMS → SuperadminTenantPreviewClient → selector + modal

import { useState } from 'react';
import {
  Eye, Users, CreditCard, BarChart2, Settings, Bell,
  ChevronRight, LogOut, Building2, TrendingUp, UserCheck,
  AlertCircle, CheckCircle2, X,
} from 'lucide-react';
import { MOCK_GYMS } from '@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants';
import {
  TENANT_PREVIEW_DATA,
  ALERT_STYLES,
  TENANT_STATUS_STYLES,
  PENDING_PAYMENTS_DANGER_THRESHOLD,
  PREVIEW_TENANTS,
} from '@/app/superadmin/tenant-preview/tenant-preview_types/tenant_preview_constants';
import type { AlertType } from '@/app/superadmin/tenant-preview/tenant-preview_types/tenant_preview_constants';

// Isolated alert icon component — avoids inline JSX in const objects (Rule 38, no React.ReactNode in consts)
function AlertIcon({ type }: { type: AlertType }) {
  if (type === 'warning') return <AlertCircle size={18} strokeWidth={2} className="shrink-0" />;
  if (type === 'info') return <Bell size={18} strokeWidth={2} className="shrink-0" />;
  return <CheckCircle2 size={18} strokeWidth={2} className="shrink-0" />;
}

export default function SuperadminTenantPreviewClient() {
  const [selectedId, setSelectedId] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedTenant = PREVIEW_TENANTS.find((g) => g.id === selectedId);
  const previewData = selectedId ? TENANT_PREVIEW_DATA[selectedId] : null;

  function handleOpenPreview() {
    if (!selectedId) return;
    setPreviewOpen(true);
  }

  const statusStyle = selectedTenant
    ? (TENANT_STATUS_STYLES[selectedTenant.status] ?? 'bg-input text-secondary border-border')
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tenant Portal Preview</h1>
        <p className="text-secondary mt-1 text-sm">
          Preview exactly what a tenant's admin dashboard looks like — without logging in as them.
        </p>
      </div>

      {/* Selector Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-xl">
        <p className="text-sm font-medium text-foreground mb-3">Select a Tenant to Preview</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">Choose a tenant...</option>
            {PREVIEW_TENANTS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} — {g.plan}
              </option>
            ))}
          </select>
          <button
            onClick={handleOpenPreview}
            disabled={!selectedId}
            aria-label="Preview tenant portal"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-black font-semibold rounded-lg text-sm shadow-lg shadow-primary/20 motion-safe:transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Eye size={18} strokeWidth={2} /> Preview
          </button>
        </div>

        {selectedTenant && (
          <div className="mt-4 p-3 bg-input/50 rounded-lg border border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 size={18} strokeWidth={2} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{selectedTenant.name}</p>
              <p className="text-xs text-secondary">{selectedTenant.adminEmail} · {selectedTenant.plan}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${statusStyle}`}>
              {selectedTenant.status}
            </span>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/20 rounded-xl text-info text-sm max-w-xl">
        <Eye size={18} strokeWidth={2} className="shrink-0 mt-0.5" />
        <p>This is a read-only preview. No actions taken here affect the tenant's actual data.</p>
      </div>

      {/* Preview Modal — Simulated Admin Dashboard */}
      {previewOpen && selectedTenant && previewData && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-overlay border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Preview Header Bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-sidebar border-b border-border rounded-t-2xl">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <Building2 size={14} strokeWidth={2} className="text-black" />
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground">{selectedTenant.name}</span>
                  <span className="ml-2 text-xs text-secondary">— Admin Portal Preview</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 font-semibold">
                  👁 Superadmin View
                </span>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Simulated Admin Layout */}
            <div className="flex min-h-[500px]">
              {/* Simulated Sidebar — hidden on mobile, visible md+ */}
              <div className="hidden md:flex w-48 shrink-0 bg-sidebar border-r border-border p-3 flex-col space-y-1">
                {([
                  { label: 'Dashboard', icon: BarChart2, active: true },
                  { label: 'Members', icon: Users, active: false },
                  { label: 'Payments', icon: CreditCard, active: false },
                  { label: 'Reports', icon: TrendingUp, active: false },
                  { label: 'Settings', icon: Settings, active: false },
                ] as const).map(({ label, icon: Icon, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-default border-l-2 pl-[10px] ${
                      active
                        ? 'bg-primary-subtle text-primary border-primary'
                        : 'text-secondary border-transparent'
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} className={active ? 'text-primary' : 'text-secondary'} />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-secondary cursor-default">
                    <LogOut size={18} strokeWidth={2} />
                    <span>Logout</span>
                  </div>
                </div>
              </div>

              {/* Simulated Dashboard Content */}
              <div className="flex-1 p-4 md:p-6 space-y-5 bg-background min-w-0">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Welcome back, {selectedTenant.ownerName}!</h2>
                  <p className="text-secondary text-sm">{selectedTenant.name} · {selectedTenant.plan} Plan</p>
                </div>

                {/* Alerts — stable keys using message content */}
                {previewData.alerts.length > 0 && (
                  <div className="space-y-2">
                    {previewData.alerts.map((alert) => (
                      <div
                        key={alert.message}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${ALERT_STYLES[alert.type]}`}
                      >
                        <AlertIcon type={alert.type} />
                        {alert.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {([
                    { label: 'Total Members', value: previewData.memberCount.toLocaleString('en-IN'), icon: Users, color: 'text-primary' },
                    { label: 'Active Members', value: previewData.activeMembers.toLocaleString('en-IN'), icon: UserCheck, color: 'text-success' },
                    { label: 'Monthly Revenue', value: `₹${previewData.monthlyRevenue.toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-warning' },
                    {
                      label: 'Pending Payments',
                      value: String(previewData.pendingPayments),
                      icon: AlertCircle,
                      color: previewData.pendingPayments > PENDING_PAYMENTS_DANGER_THRESHOLD ? 'text-danger' : 'text-secondary',
                    },
                  ] as const).map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-secondary">{label}</span>
                        <Icon size={18} strokeWidth={2} className={color} />
                      </div>
                      <p className="text-xl font-bold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Members — stable keys using member name */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Recent Members</span>
                    <span className="text-xs text-secondary flex items-center gap-1 cursor-default">
                      View all <ChevronRight size={18} strokeWidth={2} />
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {previewData.recentMembers.map((m) => (
                      <div key={m.name} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {m.name[0]}
                          </div>
                          <span className="text-sm text-foreground">{m.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-secondary">{m.plan}</span>
                          <span className="text-xs text-disabled">{m.joinedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
