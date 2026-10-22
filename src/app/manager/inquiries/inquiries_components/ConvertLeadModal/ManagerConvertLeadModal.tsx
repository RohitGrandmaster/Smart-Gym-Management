// RESPONSIBILITY: Renders the Add Member form specifically for converting a lead within the Inquiries page.
'use client';

import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useInquiriesContext } from '@/app/manager/inquiries/inquiries_context/ManagerInquiriesContext';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { MEMBERS_CYCLE_LABELS, getPriceForCycle, formatCurrency, MemberSchema, type MemberFormValues, EMPTY_MEMBER_FORM, GENDER_OPTIONS } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import type { PlanWithCustom } from '@/app/manager/members/members_types/ManagerMembersTypes';
import ManagerConvertLeadSuccess from './ManagerConvertLeadSuccess';
import ManagerConvertLeadForm from './ManagerConvertLeadForm';

export default function ManagerConvertLeadModal() {
  const { convertLead, closeConvert, updateStatus } = useInquiriesContext();
  const isOpen = !!convertLead;
  
  const loadAll = useManagerMembersStore(s => s.loadAll);
  const saveMember = useManagerMembersStore(s => s.saveMember);
  const plans = useManagerMembersStore(s => s.plans);
  const fetchState = useManagerMembersStore(s => s.fetchState);
  const [saving, setSaving] = useState(false);
  const [successData, setSuccessData] = useState<{
    gymId: string;
    name: string;
    phone: string;
    planName: string;
    joinDate: string;
    expiryDate: string;
    paidAmount: number;
    pendingAmount: number;
    aadhaar?: string;
  } | null>(null);

  useEffect(() => {
    // We only need plans to render the dropdown properly
    if (convertLead && plans.length === 0 && fetchState !== 'loading') {
      loadAll({ page: '1' }).catch(() => { /* handled */ });
    }
  }, [convertLead, plans.length, fetchState, loadAll]);

  const useFormReturn = useForm<MemberFormValues>({
    resolver: zodResolver(MemberSchema) as any,
    defaultValues: EMPTY_MEMBER_FORM
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useFormReturn;

  useEffect(() => {
    if (convertLead) {
      reset({
        ...EMPTY_MEMBER_FORM,
        name: convertLead.name,
        phone: convertLead.phone,
        email: convertLead.email || '',
      });
    }
  }, [convertLead, reset]);

  const watchPlanId = watch('planId') as string | undefined;
  const watchBillingCycle = watch('billingCycle') as string;
  const watchCustomDays = watch('customDays') as number;
  const watchJoinDate = watch('joinDate') as string;

  useEffect(() => {
    if (watchPlanId && watchBillingCycle) {
      const selectedPlan = plans.find(p => p.id.toString() === watchPlanId.toString()) as PlanWithCustom | undefined;
      const price = getPriceForCycle(selectedPlan, watchBillingCycle, Number(watchCustomDays) || 0);
      useFormReturn.setValue('totalAmount', price, { shouldValidate: true });
      useFormReturn.setValue('paidAmount', price, { shouldValidate: true });
    }
  }, [watchPlanId, watchBillingCycle, watchCustomDays, plans, useFormReturn]);

  useEffect(() => {
    if (watchJoinDate && watchBillingCycle) {
      const jd = new Date(watchJoinDate);
      if (!isNaN(jd.getTime())) {
        const ed = new Date(jd);
        if (watchBillingCycle === 'ONE_MONTH') ed.setMonth(ed.getMonth() + 1);
        else if (watchBillingCycle === 'THREE_MONTHS') ed.setMonth(ed.getMonth() + 3);
        else if (watchBillingCycle === 'SIX_MONTHS') ed.setMonth(ed.getMonth() + 6);
        else if (watchBillingCycle === 'TWELVE_MONTHS') ed.setMonth(ed.getMonth() + 12);
        else if (watchBillingCycle === 'CUSTOM' && watchCustomDays) ed.setDate(ed.getDate() + Number(watchCustomDays));
        
        useFormReturn.setValue('expiryDate', ed.toISOString().split('T')[0], { shouldValidate: true });
      }
    }
  }, [watchJoinDate, watchBillingCycle, watchCustomDays, useFormReturn]);

  const onSubmit = async (data: MemberFormValues) => {
    setSaving(true);
    try {
      const total = data.totalAmount || 0;
      const paid = data.paidAmount || 0;
      const pendingAmount = total - paid;
      const res = await saveMember({ ...data, pendingAmount }, null);
      
      // Update the inquiry status to CONVERTED locally and via API
      if (convertLead) {
        await updateStatus(convertLead.id, 'CONVERTED');
        
        const planName = plans.find(p => p.id.toString() === data.planId?.toString())?.name || 'Membership';
        setSuccessData({
          gymId: res.memberId || 'N/A',
          name: data.name,
          phone: data.phone,
          planName,
          joinDate: data.joinDate || '',
          expiryDate: data.expiryDate || '',
          paidAmount: paid,
          pendingAmount: pendingAmount,
          aadhaar: data.aadhaar,
        });
      } else {
        closeConvert();
      }
    } catch (e) {
      // Error handled by the api wrapper in catch block
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-xl overflow-visible border border-border max-h-full flex flex-col">
        
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between z-10 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-primary">Convert to Member</h3>
            <p className="text-xs text-secondary mt-0.5">Complete admission for {convertLead?.name}</p>
          </div>
          <button onClick={closeConvert} className="p-2 rounded-full hover:bg-primary/10 transition-colors text-secondary hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {successData ? (
          <ManagerConvertLeadSuccess 
            successData={successData} 
            closeConvert={closeConvert} 
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 custom-scrollbar p-4 flex flex-col gap-4">
            <ManagerConvertLeadForm 
              useFormReturn={useFormReturn}
              plans={plans}
              watchPlanId={watchPlanId}
              watchBillingCycle={watchBillingCycle}
              watchCustomDays={watchCustomDays}
            />

            <div className="flex gap-3 pt-4 border-t border-border mt-2">
              <button
                type="button"
                onClick={closeConvert}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-primary hover:bg-primary-subtle transition-all duration-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-white flex items-center justify-center gap-2 disabled:opacity-70 hover:bg-primary-hover transition-all duration-200 active:scale-95"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                ) : (
                  <><Save size={15} /> Convert Lead</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
