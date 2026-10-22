// RESPONSIBILITY: Renders the plan tier cards showing current plan and upgrade options.
'use client';

import { Check, Zap } from 'lucide-react';
import { PLAN_TIERS } from '@/app/admin/usage/usage_utils/AdminUsageSharedConstants';
import { formatCurrency } from '@/lib/formatters';

export default function AdminUsagePlanCard() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/20 rounded-xl">
          <Zap size={18} className="text-primary" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Subscription Plans</h2>
          <p className="text-xs text-secondary">Upgrade anytime to unlock more capacity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLAN_TIERS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-4 space-y-3 motion-safe:transition-all motion-safe:duration-200 ${
              plan.isCurrent
                ? 'border-primary bg-primary/10'
                : 'border-border bg-input/30 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">{plan.name}</p>
              {plan.isCurrent && (
                <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">Current</span>
              )}
            </div>
            <p className="text-xl font-bold text-foreground">
              {plan.price === 0 ? 'Custom' : `${formatCurrency(plan.price)}/mo`}
            </p>
            <ul className="space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-secondary">
                  <Check size={12} className="text-success flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {!plan.isCurrent && (
              <button className="w-full py-2 rounded-lg text-xs font-bold border border-primary/40 text-primary hover:bg-primary/10 motion-safe:transition-all motion-safe:duration-200 active:scale-95">
                {plan.price === 0 ? 'Contact Sales' : 'Upgrade'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
