// RESPONSIBILITY: Orchestrator for the Plans module — plan cards with change-request modal.
// DATA FLOW: PlansProvider → usePlansContext → plan cards + modal
'use client';

import { useState } from 'react';
import { PlansProvider, usePlansContext } from '@/app/manager/plans/plans_context/ManagerPlansContext';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import { Search, CheckCircle, XCircle, IndianRupee, Send, X, Loader2, Users } from 'lucide-react';
import { formatCurrency } from '@/app/manager/plans/plans_utils/ManagerPlansSharedConstants';
import type { Plan } from '@/app/manager/plans/plans_types/ManagerPlansTypes';

const TIER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  BASIC:   { bg: 'bg-info/10',    text: 'text-info',    label: 'Basic'   },
  GOLD:    { bg: 'bg-warning/10', text: 'text-warning', label: 'Gold'    },
  PREMIUM: { bg: 'bg-primary/10', text: 'text-primary', label: 'Premium' },
};

// ── Change Request Modal ──────────────────────────────────────────────────────
function ChangeRequestModal() {
  const { requestModalPlan, closeRequestModal, submitChangeRequest, saving } = usePlansContext();
  const [note, setNote] = useState('');

  if (!requestModalPlan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    await submitChangeRequest(note);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-foreground">Request Plan Change</h3>
            <p className="text-xs text-secondary mt-0.5">{requestModalPlan.name} — {requestModalPlan.tier}</p>
          </div>
          <button onClick={closeRequestModal} className="p-2 rounded-lg hover:bg-input text-secondary motion-safe:transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
              Describe the change needed
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              placeholder="e.g. Increase 1-month price to ₹1500, add sauna access feature..."
              className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={closeRequestModal}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-border text-secondary hover:text-foreground motion-safe:transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving || !note.trim()}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:opacity-90 motion-safe:transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={15} className="motion-safe:animate-spin" /> : <Send size={15} />}
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan }: { plan: Plan }) {
  const { openRequestModal } = usePlansContext();
  const tier = TIER_STYLES[plan.tier] ?? TIER_STYLES['BASIC'];
  const features = Array.isArray(plan.features)
    ? plan.features
    : (plan.features as string ?? '').split(',').map(f => f.trim()).filter(Boolean);

  return (
    <div className={`bg-card border rounded-xl p-5 flex flex-col gap-4 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:shadow-lg ${plan.isActive ? 'border-border' : 'border-border opacity-60'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tier.bg} ${tier.text}`}>{tier.label}</span>
            {plan.isActive
              ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-1"><CheckCircle size={11} />Active</span>
              : <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger flex items-center gap-1"><XCircle size={11} />Inactive</span>
            }
          </div>
          <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
        </div>
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <IndianRupee size={18} className="text-primary" />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '1 Month',   price: plan.price1Month  },
          { label: '3 Months',  price: plan.price3Month  },
          { label: '6 Months',  price: plan.price6Month  },
          { label: '12 Months', price: plan.price12Month },
        ].map(row => (
          <div key={row.label} className="bg-input rounded-lg px-3 py-2">
            <p className="text-xs text-secondary">{row.label}</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(row.price)}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-border">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-secondary">
              <CheckCircle size={13} className="text-success shrink-0" />
              <span className="truncate">{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* Request change CTA */}
      <button
        onClick={() => openRequestModal(plan)}
        className="mt-auto flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold rounded-lg border border-primary/40 text-primary hover:bg-primary/10 motion-safe:transition-colors"
      >
        <Send size={12} /> Request Change
      </button>
    </div>
  );
}

// ── Inner ─────────────────────────────────────────────────────────────────────
function PlansInner() {
  const { plans, filteredPlans, fetchState, search, setSearch, tierFilter, setTierFilter, statusFilter, setStatusFilter } = usePlansContext();

  const [activeTab, setActiveTab] = useState('View Plans');

  const PLANS_TABS = ['View Plans', 'Membership Activate', 'Membership Renew', 'Membership Freeze', 'Expiry Check'];

  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Membership / Plans" subtitle="View and manage available gym membership plans" />

      <div className="p-6 space-y-6">

        {/* Tabs to exactly match checklist */}
        <div className="flex flex-wrap gap-2 mb-4 bg-card border border-border p-1 rounded-xl w-fit">
          {PLANS_TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === t ? 'bg-primary text-primary-foreground shadow' : 'text-secondary hover:text-foreground hover:bg-accent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Membership Activate' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Activate New Membership</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Select Member</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Select a member...</option>
                  <option>Rahul Kumar (9876543210)</option>
                  <option>Priya Singh (8765432109)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Plan</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Select a plan...</option>
                  {plans.map(p => <option key={p.id}>{p.name} - {p.tier}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                Activate Membership
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Membership Renew' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Renew Memberships</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Member Name</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Current Plan</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Expiry Date</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 px-4 text-sm text-foreground">Amit Sharma</td>
                    <td className="py-3 px-4 text-sm text-secondary">Basic Monthly</td>
                    <td className="py-3 px-4 text-sm text-danger font-medium">Tomorrow</td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Renew Now</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Membership Freeze' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Freeze Membership</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Select Active Member</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Select a member...</option>
                  <option>Neha Verma</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Freeze From</label>
                  <input type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Freeze Until</label>
                  <input type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
              </div>
              <button className="w-full py-2 bg-info text-info-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                Apply Freeze
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Expiry Check' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Expiring in next 30 days</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Member Name</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Phone</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Plan</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Expires On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 px-4 text-sm text-foreground">Amit Sharma</td>
                    <td className="py-3 px-4 text-sm text-secondary">9876543210</td>
                    <td className="py-3 px-4 text-sm text-secondary">Basic Monthly</td>
                    <td className="py-3 px-4 text-sm text-danger font-medium">10 Sept 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-foreground">Priya Singh</td>
                    <td className="py-3 px-4 text-sm text-secondary">8765432109</td>
                    <td className="py-3 px-4 text-sm text-secondary">Gold Yearly</td>
                    <td className="py-3 px-4 text-sm text-warning font-medium">25 Sept 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'View Plans' && (
          <>
            {/* KPI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Plans',    value: plans.length,                          colorClass: 'text-primary' },
                { label: 'Active Plans',   value: plans.filter(p => p.isActive).length,  colorClass: 'text-success' },
                { label: 'Inactive Plans', value: plans.filter(p => !p.isActive).length, colorClass: 'text-danger'  },
              ].map(stat => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                  style={{ background: 'linear-gradient(180deg, rgba(250,204,21,0.06), rgba(255,255,255,0.01))' }}>
                  <p className="text-sm text-secondary">{stat.label}</p>
                  <p className={`text-2xl font-bold ml-auto ${stat.colorClass}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input type="text" placeholder="Search plans..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary">
            <option value="ALL">All Tiers</option>
            <option value="BASIC">Basic</option>
            <option value="GOLD">Gold</option>
            <option value="PREMIUM">Premium</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary">
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Grid */}
        {fetchState === 'loading' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
          </div>
        ) : fetchState === 'error' ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm text-danger font-medium">Failed to load plans</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <IndianRupee size={36} className="mx-auto text-secondary opacity-40" />
            <p className="text-sm text-secondary font-medium">{search ? `No plans found for "${search}"` : 'No plans available'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredPlans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
          </div>
            )}
          </>
        )}
      </div>

      <ChangeRequestModal />
    </div>
  );
}

export default function ManagerPlansMain() {
  return (
    <PlansProvider>
      <PlansInner />
    </PlansProvider>
  );
}
