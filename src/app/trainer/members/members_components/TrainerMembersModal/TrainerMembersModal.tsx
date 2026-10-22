// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders a modal for creating or editing a member.
'use client';

import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useMembersContext } from '@/app/trainer/members/members_context/MembersContext';
import { useMembersStore } from '@/app/trainer/members/members_store/useMembersStore';
import { MemberSchema, type MemberFormValues, EMPTY_MEMBER_FORM, GENDER_OPTIONS } from '@/app/trainer/members/members_utils/MembersSharedConstants';

export default function TrainerMembersModal() {
  const {
    showAddModal, setShowAddModal, editId, editData,
    saveMember
  } = useMembersContext();

  const saving = useMembersStore(s => s.saving);

  const useFormReturn = useForm<MemberFormValues>({
    resolver: zodResolver(MemberSchema),
    defaultValues: editData || EMPTY_MEMBER_FORM
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useFormReturn;

  // Refetch editData into form whenever modal opens for edit
  useEffect(() => {
    if (showAddModal) {
      reset({ ...EMPTY_MEMBER_FORM, ...(editData || {}) });
    }
  }, [showAddModal, editData, reset]);



  const onSubmit = (data: MemberFormValues) => saveMember(data);

  if (!showAddModal) return null;


  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-full overflow-y-auto border border-border">
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{editId ? 'Edit Member' : 'Add New Member'}</h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-2 rounded-lg hover:bg-primary-subtle text-secondary motion-safe:transition-all motion-safe:duration-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Rahul Sharma' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'rahul@gmail.com' },
            { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
            { label: 'Address', key: 'address', type: 'text', placeholder: 'Andheri, Mumbai' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                {...register(f.key as keyof MemberFormValues)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary motion-safe:transition-colors ${
                  errors[f.key as keyof MemberFormValues] ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                }`}
              />
              {errors[f.key as keyof MemberFormValues] && (
                <p className="text-danger text-xs mt-1">{errors[f.key as keyof MemberFormValues]?.message}</p>
              )}
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Gender</label>
              <Controller
                name="gender"
                control={useFormReturn.control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={GENDER_OPTIONS}
                  />
                )}
              />
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Join Date</label>
              <input
                type="date"
                {...register('joinDate')}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary motion-safe:transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Amount Paid (?)</label>
              <input
                type="number"
                min="0"
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                {...register('amount', { valueAsNumber: true })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary motion-safe:transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-primary hover:bg-primary-subtle motion-safe:transition-all motion-safe:duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-white flex items-center justify-center gap-2 disabled:opacity-70 hover:bg-primary-hover motion-safe:transition-all motion-safe:duration-200 active:scale-95"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
              ) : (
                <><Save size={15} /> {editId ? 'Update' : 'Add Member'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

