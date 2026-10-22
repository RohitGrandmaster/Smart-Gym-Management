// RESPONSIBILITY: SaaS plan comparison cards with upgrade CTA.
'use client';

import { CheckCircle, Zap, Star } from 'lucide-react';
import { useAdminSubscriptionsLogic } from '@/app/admin/subscriptions/subscriptions_context/useAdminSubscriptionsLogic';
import { PLAN_TIER_STYLES } from '@/app/admin/subscriptions/subscriptions_utils/AdminSubscriptionsSharedConstants';
import type { SaaSPlan } from '@/app/admin/subscriptions/subscriptions_types/subscriptions_types';

function PlanCard({ plan, onUpgrade, upgrading }: { plan: SaaSPlan; onUpgrade: (id: string, name: string) => void; upgrading: boolean }) {
  const style = PLAN_TIER_STYLES[plan.tier];
  const fmt = (v: number) => v === 0 ? 'Custom' : `₹${v.toLocaleString('en-IN')}`;

  return (
    <div className={`relative bg-card border rounded-xl p-5 flex flex-col gap-4 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:shadow-lg ${plan.isCurrent ? 'border-primary shadow-md' : 'border-border'}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow">
            <Star size={10} fill="currentColor" /> Most Popular
          </span>
        </div>
      )}
      {plan.isCurrent && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 bg-success-bg text-success text-xs font-bold rounded-full border border-success/30">Current</span>
        </div>
      )}

      <div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>{plan.name}</span>
        <div className="mt-3">
          <span className="text-3xl font-bold text-foreground">{fmt(plan.monthlyPrice)}</span>
          {plan.monthlyPrice > 0 && <span className="text-secondary text-sm">/month</span>}
        </div>
        {plan.monthlyPrice > 0 && (
          <p className="text-xs text-success mt-1">or {fmt(plan.annualPrice)}/year (save 2 months)</p>
        )}
      </div>

      <ul className="space-y-2 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-secondary">
            <CheckCircle size={13} className="text-success shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {plan.isCurrent ? (
        <div className="py-2.5 text-center text-sm font-semibold text-primary border border-primary/30 rounded-xl bg-primary/5">
          ✓ Your Current Plan
        </div>
      ) : plan.tier === 'enterprise' ? (
        <a
          href="mailto:sales@gymsmart.in"
          className="py-2.5 text-center text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-input motion-safe:transition-colors block"
        >
          Contact Sales
        </a>
      ) : (
        <button
          onClick={() => onUpgrade(plan.id, plan.name)}
          disabled={upgrading}
          className="py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-hover motion-safe:transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Zap size={14} /> Upgrade to {plan.name}
        </button>
      )}
    </div>
  );
}

export default function AdminSubscriptionsPlanCards() {
  const { plans, handleUpgrade, upgrading } = useAdminSubscriptionsLogic();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} onUpgrade={handleUpgrade} upgrading={upgrading} />
      ))}
    </div>
  );
}
