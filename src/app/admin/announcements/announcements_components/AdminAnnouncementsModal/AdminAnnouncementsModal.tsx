// RESPONSIBILITY: Create / Edit modal for Announcements — RHF + Zod validation.
'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Megaphone } from 'lucide-react';
import { useAdminAnnouncementsLogic } from '@/app/admin/announcements/announcements_context/useAdminAnnouncementsLogic';
import { useAdminAnnouncementsStore } from '@/app/admin/announcements/announcements_store/useAdminAnnouncementsStore';
import {
  AnnouncementSchema,
  ANNOUNCEMENT_PRIORITY_OPTIONS,
  ANNOUNCEMENT_AUDIENCE_OPTIONS,
  ANNOUNCEMENT_GYM_OPTIONS,
} from '@/app/admin/announcements/announcements_utils/AdminAnnouncementsSharedConstants';
import type { AnnouncementFormValues } from '@/app/admin/announcements/announcements_types/announcements_types';

export default function AdminAnnouncementsModal() {
  const { showModal, setShowModal, editingAnnouncement, saveAnnouncement, saving } = useAdminAnnouncementsLogic();
  const { form: storeForm } = useAdminAnnouncementsStore();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: storeForm,
  });

  useEffect(() => { if (showModal) reset(storeForm); }, [showModal, storeForm, reset]);

  if (!showModal) return null;

  const isEdit = !!editingAnnouncement;

  function toggleArrayValue<T extends string>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="bg-overlay border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Megaphone size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{isEdit ? 'Edit Announcement' : 'New Announcement'}</h3>
                <p className="text-xs text-secondary">{isEdit ? 'Update announcement details' : 'Broadcast to members, staff, or trainers'}</p>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-input hover:bg-border flex items-center justify-center motion-safe:transition-colors" aria-label="Close">
              <X size={16} className="text-secondary" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(saveAnnouncement)} className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Title *</label>
              <input
                {...register('title')}
                placeholder="e.g. Grand Opening — New Branch!"
                className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              />
              {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Message Body *</label>
              <textarea
                {...register('body')}
                rows={4}
                placeholder="Write the full announcement message here..."
                className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary resize-none"
              />
              {errors.body && <p className="text-xs text-danger mt-1">{errors.body.message}</p>}
            </div>

            {/* Priority + Pin row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Priority *</label>
                <select
                  {...register('priority')}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {ANNOUNCEMENT_PRIORITY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-input border border-border rounded-xl hover:border-primary motion-safe:transition-colors">
                  <input type="checkbox" {...register('isPinned')} className="w-4 h-4 accent-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pin Announcement</p>
                    <p className="text-xs text-secondary">Always show at top</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Target Audience *</label>
              <Controller
                name="audience"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {ANNOUNCEMENT_AUDIENCE_OPTIONS.map(o => {
                      const selected = field.value.includes(o.value as any);
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => field.onChange(toggleArrayValue(field.value, o.value as any))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border motion-safe:transition-colors ${
                            selected
                              ? 'bg-primary text-white border-primary'
                              : 'bg-input text-secondary border-border hover:border-primary hover:text-foreground'
                          }`}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.audience && <p className="text-xs text-danger mt-1">{errors.audience.message}</p>}
            </div>

            {/* Gyms */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Target Gyms *</label>
              <Controller
                name="gymIds"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {ANNOUNCEMENT_GYM_OPTIONS.map(o => {
                      const selected = field.value.includes(o.value);
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => field.onChange(toggleArrayValue(field.value, o.value))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border motion-safe:transition-colors ${
                            selected
                              ? 'bg-primary text-white border-primary'
                              : 'bg-input text-secondary border-border hover:border-primary hover:text-foreground'
                          }`}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.gymIds && <p className="text-xs text-danger mt-1">{errors.gymIds.message}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Publish Date & Time *</label>
                <input
                  type="datetime-local"
                  {...register('publishedAt')}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
                {errors.publishedAt && <p className="text-xs text-danger mt-1">{errors.publishedAt.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Expiry Date & Time *</label>
                <input
                  type="datetime-local"
                  {...register('expiresAt')}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
                {errors.expiresAt && <p className="text-xs text-danger mt-1">{errors.expiresAt.message}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 size={15} className="motion-safe:animate-spin" /> : null}
                {isEdit ? 'Save Changes' : 'Publish Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
