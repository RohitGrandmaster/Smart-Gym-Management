'use client';
// RESPONSIBILITY: Renders the form UI for onboarding a new gym tenant. Receives logic from useSuperadminAddGymForm hook.

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { ArrowLeft, Database, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { useSuperadminAddGymForm } from '@/app/superadmin/gyms/gyms_components/SuperadminAddGymForm/useSuperadminAddGymForm';
import { useWarnIfUnsavedChanges } from '@/app/superadmin/superadmin_utils/useWarnIfUnsavedChanges';

export default function SuperadminAddGymForm() {
  const {
    register,
    handleSubmit,
    onSubmit,
    control,
    errors,
    isDirty,
    isProvisioning,
    provisioningLogs,
    showPassword,
    setShowPassword,
    plans,
    loadingPlans,
  } = useSuperadminAddGymForm();

  useWarnIfUnsavedChanges(isDirty && !isProvisioning);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={SuperadminUrlConfig.PAGES.GYMS_LIST}
          className="p-2 bg-card border border-border rounded-lg text-secondary hover:text-white motion-safe:transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Provision New Tenant</h1>
          <p className="text-secondary mt-1">This will spin up a completely isolated database for the new gym.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Gym Name</label>
                <input 
                  {...register('gymName')}
                  className="w-full bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-primary motion-safe:transition-colors"
                  placeholder="e.g. Titan Fitness"
                />
                {errors.gymName && <p className="text-danger text-xs">{errors.gymName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Owner Name</label>
                <input 
                  {...register('ownerName')}
                  className="w-full bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-primary motion-safe:transition-colors"
                  placeholder="e.g. John Doe"
                />
                {errors.ownerName && <p className="text-danger text-xs">{errors.ownerName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Admin Email</label>
                <input 
                  type="email"
                  {...register('adminEmail')}
                  className="w-full bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-primary motion-safe:transition-colors"
                  placeholder="admin@titanfitness.com"
                />
                {errors.adminEmail && <p className="text-danger text-xs">{errors.adminEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Phone Number</label>
                <input 
                  {...register('phone')}
                  className="w-full bg-card border border-border text-foreground rounded-lg px-4 py-2 focus:outline-none focus:border-primary motion-safe:transition-colors"
                  placeholder="+1 555-0000"
                />
                {errors.phone && <p className="text-danger text-xs">{errors.phone.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Temporary Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...register('temporaryPassword')}
                    className="w-full bg-card border border-border text-foreground rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-primary motion-safe:transition-colors"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground motion-safe:transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.temporaryPassword && <p className="text-danger text-xs">{errors.temporaryPassword.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">SaaS Plan</label>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <SearchableDropdown
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={plans ? plans.map(p => ({ label: `${p.name} ($${Number(p.priceMonthly).toFixed(2)}/mo)`, value: p.name })) : []}
                      disabled={loadingPlans}
                      placeholder={loadingPlans ? "Loading plans..." : "Select a plan"}
                    />
                  )}
                />
                {errors.plan && <p className="text-danger text-xs">{errors.plan.message}</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button 
                type="submit"
                disabled={isProvisioning}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white px-6 py-2.5 rounded-lg font-medium motion-safe:transition-colors"
              >
                {isProvisioning ? (
                  <><Loader2 className="w-5 h-5 motion-safe:animate-spin" /> Provisioning DB...</>
                ) : (
                  <><Save className="w-5 h-5" /> Provision Tenant</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Provisioning Console / Status */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground font-bold border-b border-border pb-4">
            <Database className="w-5 h-5 text-primary" />
            Provisioning Console
          </div>
          <div className="bg-card rounded-lg p-4 font-mono text-xs text-secondary h-64 overflow-y-auto space-y-2 border border-border">
            {provisioningLogs.length === 0 ? (
              <p className="text-secondary italic">Awaiting submit...</p>
            ) : (
              provisioningLogs.map((log, i) => (
                <p key={`log-${i}-${log.slice(0, 12)}`} className="motion-safe:animate-in motion-safe:fade-in slide-in-from-bottom-1 text-success">
                  <span className="text-secondary mr-2">{'>'}</span>{log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




