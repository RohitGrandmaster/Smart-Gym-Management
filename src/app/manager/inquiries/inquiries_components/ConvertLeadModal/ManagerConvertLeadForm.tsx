// RESPONSIBILITY: Renders the form fields for converting a lead.
import { Controller, UseFormReturn } from 'react-hook-form';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { MEMBERS_CYCLE_LABELS, getPriceForCycle, formatCurrency, MemberFormValues, GENDER_OPTIONS } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import type { PlanWithCustom } from '@/app/manager/members/members_types/ManagerMembersTypes';

interface ManagerConvertLeadFormProps {
  useFormReturn: any;
  plans: PlanWithCustom[];
  watchPlanId?: string;
  watchBillingCycle?: string;
  watchCustomDays?: number;
}

export default function ManagerConvertLeadForm({
  useFormReturn,
  plans,
  watchPlanId,
  watchBillingCycle,
  watchCustomDays
}: ManagerConvertLeadFormProps) {
  const { register, formState: { errors }, control } = useFormReturn;
  const selectedPlan = plans.find(p => p.id.toString() === watchPlanId?.toString());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
      {[
        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Rahul Sharma', fullWidth: true },
        { label: 'Email', key: 'email', type: 'email', placeholder: 'rahul@gmail.com' },
        { label: 'Phone', key: 'phone', type: 'tel', placeholder: '9876543210' },
        { label: 'Address', key: 'address', type: 'text', placeholder: 'Andheri, Mumbai' },
        { label: 'Aadhaar Card', key: 'aadhaar', type: 'text', placeholder: '12-digit Aadhaar (Optional)' },
      ].map(f => (
        <div key={f.key} className={f.fullWidth ? 'sm:col-span-2' : ''}>
          <label className="block text-sm font-medium text-secondary mb-0.5">{f.label}</label>
          <input
            type={f.type}
            placeholder={f.placeholder}
            maxLength={f.key === 'phone' ? 10 : f.key === 'aadhaar' ? 12 : undefined}
            onKeyDown={(e) => {
              if (f.key === 'phone' || f.key === 'aadhaar') {
                if (['e', 'E', '-', '+', '.'].includes(e.key)) e.preventDefault();
                if (e.key.length === 1 && !/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault();
              }
            }}
            {...register(f.key as keyof MemberFormValues)}
            className={`w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200 ${
              errors[f.key as keyof MemberFormValues] ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
            }`}
          />
          {errors[f.key as keyof MemberFormValues] && (
            <p className="text-danger text-xs mt-0.5">{errors[f.key as keyof MemberFormValues]?.message as string}</p>
          )}
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-secondary mb-0.5">Gender</label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <SearchableDropdown value={field.value || ''} onChange={field.onChange} options={GENDER_OPTIONS} />
          )}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary mb-0.5">Plan</label>
        <Controller
          name="planId"
          control={control}
          render={({ field }) => (
            <SearchableDropdown
              options={plans.map(p => ({ value: p.id, label: p.name }))}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select plan..."
            />
          )}
        />
        {errors.planId && <p className="text-danger text-xs mt-0.5">{errors.planId?.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-0.5">Billing Cycle</label>
        <Controller
          name="billingCycle"
          control={control}
          render={({ field }) => (
            <SearchableDropdown
              value={field.value || ''}
              onChange={field.onChange}
              options={Object.entries(MEMBERS_CYCLE_LABELS).map(([val, label]) => ({ label, value: val }))}
            />
          )}
        />
      </div>
      {watchBillingCycle === 'CUSTOM' && (
        <div>
          <label className="block text-sm font-medium text-secondary mb-0.5">Custom Days</label>
          <input
            type="number"
            min="0"
            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
            {...register('customDays')}
            placeholder="e.g. 15"
            className={`w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200 ${
              errors.customDays ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
            }`}
          />
          {errors.customDays && <p className="text-danger text-xs mt-0.5">{errors.customDays?.message as string}</p>}
        </div>
      )}

      {watchPlanId && (
        <div className="sm:col-span-2 bg-warning-bg rounded-xl p-3 text-sm border border-warning/30 flex justify-between items-center">
          <div>
            <span className="font-semibold text-warning">Calculated Price:</span>
            <span className="text-warning ml-1 font-bold">
              {formatCurrency(getPriceForCycle(selectedPlan, watchBillingCycle || '', Number(watchCustomDays) || 0))}
            </span>
          </div>
          {watchBillingCycle === 'CUSTOM' && (
            <div className="text-warning text-xs opacity-80">
              (Per Day: {formatCurrency(selectedPlan?.priceCustom || 0)} × {watchCustomDays || 0} days)
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-secondary mb-0.5">Join Date</label>
        <input type="date" min={new Date().toISOString().split('T')[0]} {...register('joinDate')} className="w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary mb-0.5">Expiry Date <span className="text-danger">*</span></label>
        <input type="date" disabled min={new Date().toISOString().split('T')[0]} {...register('expiryDate')} className="w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none bg-input text-primary opacity-80 cursor-not-allowed transition-all duration-200" />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-0.5">Total Plan Amount (₹)</label>
        <input type="number" disabled {...register('totalAmount', { valueAsNumber: true })} className="w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none bg-input opacity-80 cursor-not-allowed text-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary mb-0.5">Amount Paid (₹)</label>
        <input type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }} {...register('paidAmount', { valueAsNumber: true })} className="w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200" />
      </div>
    </div>
  );
}
