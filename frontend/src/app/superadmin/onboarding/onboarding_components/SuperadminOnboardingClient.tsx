'use client';
// RESPONSIBILITY: Full Tenant Onboarding page — email verification tracking, onboarding checklist,
// trial management (extend trial, convert to paid). All data is static/hardcoded.
// DATA FLOW: MOCK_ONBOARDINGS → SuperadminOnboardingClient → table rows + expand + modals

import { useState } from 'react';
import {
  CheckCircle2, XCircle, Clock, Mail, RefreshCw, ArrowUpCircle,
  ChevronDown, ChevronUp, Search, UserCheck, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  MOCK_ONBOARDINGS,
  ONBOARDING_STATUS_STYLES,
  TRIAL_STATUS_STYLES,
  KPI_CARD_GRADIENT,
} from '@/app/superadmin/onboarding/onboarding_types/onboarding_constants';
import type { TenantOnboarding } from '@/app/superadmin/onboarding/onboarding_types/onboarding_types';

export default function SuperadminOnboardingClient() {
  const [tenants, setTenants] = useState<TenantOnboarding[]>(MOCK_ONBOARDINGS);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [extendModalId, setExtendModalId] = useState<string | null>(null);
  const [extendDays, setExtendDays] = useState('7');
  const [convertConfirmId, setConvertConfirmId] = useState<string | null>(null);

  const filtered = tenants.filter(
    (t) =>
      t.gymName.toLowerCase().includes(search.toLowerCase()) ||
      t.adminEmail.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: tenants.length,
    completed: tenants.filter((t) => t.onboardingStatus === 'COMPLETED').length,
    inProgress: tenants.filter((t) => t.onboardingStatus === 'IN_PROGRESS').length,
    stalled: tenants.filter((t) => t.onboardingStatus === 'STALLED').length,
    trial: tenants.filter((t) => t.trialStatus === 'TRIAL').length,
  };

  const statCards = [
    { label: 'Total Signups', value: stats.total, color: 'text-foreground' },
    { label: 'Completed', value: stats.completed, color: 'text-success' },
    { label: 'In Progress', value: stats.inProgress, color: 'text-primary' },
    { label: 'Stalled', value: stats.stalled, color: 'text-danger' },
    { label: 'On Trial', value: stats.trial, color: 'text-warning' },
  ];

  function handleResendVerification(id: string) {
    toast.success('Verification email resent successfully.');
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, welcomeEmailSent: true } : t))
    );
  }

  function handleExtendTrial(id: string) {
    const days = parseInt(extendDays, 10);
    if (!days || days < 1) return;
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, trialDaysLeft: t.trialDaysLeft + days, trialStatus: 'TRIAL' };
      })
    );
    toast.success(`Trial extended by ${days} days.`);
    setExtendModalId(null);
    setExtendDays('7');
  }

  // Rule 71: Convert to Paid is a financial action — requires double confirmation
  function handleConvertToPaidConfirmed(id: string) {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, trialStatus: 'CONVERTED', onboardingStatus: 'COMPLETED', trialDaysLeft: 0 }
          : t
      )
    );
    toast.success('Tenant converted to paid plan.');
    setConvertConfirmId(null);
  }

  function handleMarkVerified(id: string) {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, emailVerified: true } : t))
    );
    toast.success('Email marked as verified.');
  }

  const completedCount = (checklist: TenantOnboarding['checklist']) =>
    checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tenant Onboarding</h1>
        <p className="text-secondary mt-1 text-sm">
          Track email verification, onboarding checklists, and trial lifecycle for every tenant.
        </p>
      </div>

      {/* Stats Bar — Design §5a: gold gradient on all KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-4 shadow-sm motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:transition-all motion-safe:duration-200"
            style={{ background: KPI_CARD_GRADIENT }}
          >
            <p className="text-xs text-secondary uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
        <input
          type="text"
          placeholder="Search gym or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-input/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Tenant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Onboarding</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Trial</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Checklist</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Actions</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((tenant) => (
                <>
                  <tr
                    key={tenant.id}
                    className="hover:bg-input/30 motion-safe:transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === tenant.id ? null : tenant.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{tenant.gymName}</p>
                      <p className="text-xs text-secondary">{tenant.ownerName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {tenant.emailVerified ? (
                          <CheckCircle2 size={18} strokeWidth={2} className="text-success shrink-0" />
                        ) : (
                          <XCircle size={18} strokeWidth={2} className="text-danger shrink-0" />
                        )}
                        <span className="text-secondary text-xs truncate max-w-[160px]">{tenant.adminEmail}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${ONBOARDING_STATUS_STYLES[tenant.onboardingStatus]}`}>
                        {tenant.onboardingStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${TRIAL_STATUS_STYLES[tenant.trialStatus]}`}>
                        {tenant.trialStatus}
                      </span>
                      {tenant.trialStatus === 'TRIAL' && (
                        <p className="text-xs text-secondary mt-0.5">{tenant.trialDaysLeft}d left</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-20 h-1.5 bg-input rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(completedCount(tenant.checklist) / tenant.checklist.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-secondary">
                          {completedCount(tenant.checklist)}/{tenant.checklist.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {!tenant.emailVerified && (
                          <button
                            onClick={() => handleMarkVerified(tenant.id)}
                            aria-label="Mark email verified"
                            title="Mark email verified"
                            className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                          >
                            <UserCheck size={18} strokeWidth={2} />
                          </button>
                        )}
                        <button
                          onClick={() => handleResendVerification(tenant.id)}
                          aria-label="Resend welcome email"
                          title="Resend welcome email"
                          className="p-1.5 rounded-lg bg-input text-secondary hover:text-foreground hover:bg-card motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Mail size={18} strokeWidth={2} />
                        </button>
                        {(tenant.trialStatus === 'TRIAL' || tenant.trialStatus === 'EXPIRED') && (
                          <button
                            onClick={() => setExtendModalId(tenant.id)}
                            aria-label="Extend trial"
                            title="Extend trial"
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <RefreshCw size={18} strokeWidth={2} />
                          </button>
                        )}
                        {tenant.trialStatus !== 'CONVERTED' && tenant.trialStatus !== 'ACTIVE' && (
                          <button
                            onClick={() => setConvertConfirmId(tenant.id)}
                            aria-label="Convert to paid"
                            title="Convert to paid"
                            className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                          >
                            <ArrowUpCircle size={18} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {expandedId === tenant.id ? <ChevronUp size={18} strokeWidth={2} /> : <ChevronDown size={18} strokeWidth={2} />}
                    </td>
                  </tr>

                  {/* Expanded Checklist Row */}
                  {expandedId === tenant.id && (
                    <tr key={`${tenant.id}-expanded`} className="bg-input/20">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Onboarding Checklist</p>
                            <div className="space-y-2">
                              {tenant.checklist.map((item) => (
                                <div key={item.key} className="flex items-center gap-2">
                                  {item.done ? (
                                    <CheckCircle2 size={18} strokeWidth={2} className="text-success shrink-0" />
                                  ) : (
                                    <Clock size={18} strokeWidth={2} className="text-secondary shrink-0" />
                                  )}
                                  <span className={`text-sm ${item.done ? 'text-foreground' : 'text-secondary'}`}>
                                    {item.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Trial Details</p>
                            <div className="space-y-1.5 text-sm">
                              <div className="flex justify-between">
                                <span className="text-secondary">Signup Date</span>
                                <span className="text-foreground">{tenant.signupDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-secondary">Trial Ends</span>
                                <span className="text-foreground">{tenant.trialEndsAt ?? '—'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-secondary">Days in Trial</span>
                                <span className="text-foreground">{tenant.daysInTrial}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-secondary">Days Remaining</span>
                                <span className={tenant.trialDaysLeft <= 3 ? 'text-danger font-medium' : 'text-foreground'}>
                                  {tenant.trialDaysLeft}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-secondary">Plan</span>
                                <span className="text-foreground font-medium">{tenant.plan}</span>
                              </div>
                            </div>
                            {tenant.trialDaysLeft <= 3 && tenant.trialStatus === 'TRIAL' && (
                              <div className="mt-3 flex items-center gap-2 text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg px-3 py-2">
                                <AlertTriangle size={18} strokeWidth={2} />
                                Trial expiring soon — consider extending or converting.
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-secondary">No tenants match your search.</div>
        )}
      </div>

      {/* Extend Trial Modal */}
      {extendModalId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-overlay border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-1">Extend Trial</h2>
            <p className="text-secondary text-sm mb-4">
              How many additional days would you like to grant?
            </p>
            {/* Rule 65: hardened numeric input — blocks -, e, + */}
            <input
              type="number"
              min={1}
              max={90}
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault();
              }}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setExtendModalId(null)}
                className="px-4 py-2 rounded-lg bg-input text-secondary hover:text-foreground text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExtendTrial(extendModalId)}
                className="px-4 py-2 rounded-lg bg-primary text-black font-semibold text-sm hover:bg-primary-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Extend Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rule 71: Convert to Paid — double confirmation modal (financial action) */}
      {convertConfirmId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-overlay border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} strokeWidth={2} className="text-warning" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Convert to Paid?</h2>
            </div>
            <p className="text-secondary text-sm mb-5">
              This will mark the tenant as a paid subscriber and end their trial. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConvertConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-input text-secondary hover:text-foreground text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConvertToPaidConfirmed(convertConfirmId)}
                className="px-4 py-2 rounded-lg bg-success text-white font-semibold text-sm hover:opacity-90 motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              >
                Yes, Convert to Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
