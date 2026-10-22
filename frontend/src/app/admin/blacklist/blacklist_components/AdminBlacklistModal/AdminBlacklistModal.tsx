// RESPONSIBILITY: Modal for adding a member to the blacklist.
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useAdminBlacklistLogic } from '@/app/admin/blacklist/blacklist_context/useAdminBlacklistLogic';
import { BlacklistSchema, BLACKLIST_GYM_OPTIONS } from '@/app/admin/blacklist/blacklist_utils/AdminBlacklistSharedConstants';
import type { BlacklistFormValues } from '@/app/admin/blacklist/blacklist_types/blacklist_types';

export default function AdminBlacklistModal() {
  const { showModal, setShowModal, form, saveBlacklist, saving } = useAdminBlacklistLogic();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<BlacklistFormValues>({
    resolver: zodResolver(BlacklistSchema),
    defaultValues: form,
  });

  useEffect(() => { if (showModal) reset(form); }, [showModal, form, reset]);

  const scope = watch('scope');
  const selectedGyms = watch('assignedGyms') ?? [];

  const toggleGym = (val: string) => {
    if (val === 'all') { setValue('assignedGyms', ['all']); return; }
    const current = selectedGyms.filter(g => g !== 'all');
    if (current.includes(val)) {
      const next = current.filter(g => g !== val);
      setValue('assignedGyms', next.length ? next : ['all']);
    } else {
      setValue('assignedGyms', [...current, val]);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
      <div className="relative bg-overlay border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-overlay z-10">
          <h2 className="text-lg font-bold text-foreground">Blacklist Member</h2>
          <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-input text-secondary hover:text-foreground motion-safe:transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(saveBlacklist)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Member ID <span className="text-danger">*</span></label>
              <input {...register('memberId')} placeholder="e.g. M1042" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
              {errors.memberId && <p className="text-xs text-danger mt-1">{errors.memberId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Full Name <span className="text-danger">*</span></label>
              <input {...register('memberName')} placeholder="Member name" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
              {errors.memberName && <p className="text-xs text-danger mt-1">{errors.memberName.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Phone <span className="text-danger">*</span></label>
              <input {...register('memberPhone')} placeholder="+91 98765 43210" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
              {errors.memberPhone && <p className="text-xs text-danger mt-1">{errors.memberPhone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Email <span className="text-danger">*</span></label>
              <input {...register('memberEmail')} placeholder="member@email.com" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
              {errors.memberEmail && <p className="text-xs text-danger mt-1">{errors.memberEmail.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Reason <span className="text-danger">*</span></label>
            <textarea {...register('reason')} rows={3} placeholder="Describe the reason for blacklisting..." className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none" />
            {errors.reason && <p className="text-xs text-danger mt-1">{errors.reason.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Ban Scope <span className="text-danger">*</span></label>
            <div className="flex gap-3">
              {(['global', 'specific'] as const).map(s => (
                <button key={s} type="button" onClick={() => setValue('scope', s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border motion-safe:transition-all capitalize ${scope === s ? 'bg-danger-bg text-danger border-danger' : 'bg-input text-secondary border-border hover:border-danger'}`}>
                  {s === 'global' ? 'Global (All Gyms)' : 'Specific Gyms'}
                </button>
              ))}
            </div>
          </div>
          {scope === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Select Gyms <span className="text-danger">*</span></label>
              <div className="flex flex-wrap gap-2">
                {BLACKLIST_GYM_OPTIONS.filter(o => o.value !== 'all').map(opt => {
                  const isSelected = selectedGyms.includes(opt.value);
                  return (
                    <button key={opt.value} type="button" onClick={() => toggleGym(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border motion-safe:transition-all ${isSelected ? 'bg-danger-bg text-danger border-danger' : 'bg-input text-secondary border-border hover:border-danger'}`}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {errors.assignedGyms && <p className="text-xs text-danger mt-1">{errors.assignedGyms.message}</p>}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-input border border-border rounded-lg text-sm font-medium text-secondary hover:text-foreground motion-safe:transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-danger text-white rounded-lg text-sm font-semibold hover:opacity-90 motion-safe:transition-opacity disabled:opacity-60 disabled:cursor-not-allowed active:scale-95">
              {saving ? 'Blacklisting...' : 'Blacklist Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
