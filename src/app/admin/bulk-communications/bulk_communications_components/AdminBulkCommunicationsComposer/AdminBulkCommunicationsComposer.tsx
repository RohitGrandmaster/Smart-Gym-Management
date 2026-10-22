// RESPONSIBILITY: Compose and send a new broadcast message across gyms.
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Clock } from 'lucide-react';
import { useAdminBulkCommunicationsLogic } from '@/app/admin/bulk-communications/bulk_communications_context/useAdminBulkCommunicationsLogic';
import { BroadcastSchema, CHANNEL_OPTIONS, GYM_OPTIONS, MEMBER_STATUS_OPTIONS } from '@/app/admin/bulk-communications/bulk_communications_utils/AdminBulkCommunicationsSharedConstants';
import type { BroadcastFormValues } from '@/app/admin/bulk-communications/bulk_communications_types/bulk_communications_types';
import { EMPTY_BROADCAST_FORM } from '@/app/admin/bulk-communications/bulk_communications_utils/AdminBulkCommunicationsSharedConstants';

const CHANNEL_ICONS: Record<string, string> = { whatsapp: '💬', sms: '📱', email: '✉️' };

export default function AdminBulkCommunicationsComposer() {
  const { sendBroadcast, sending } = useAdminBulkCommunicationsLogic();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<BroadcastFormValues>({
    resolver: zodResolver(BroadcastSchema),
    defaultValues: EMPTY_BROADCAST_FORM,
  });

  const selectedChannel = watch('channel');
  const selectedGyms = watch('gymIds') ?? [];
  const message = watch('message') ?? '';

  const toggleGym = (val: string) => {
    if (val === 'all') { setValue('gymIds', ['all']); return; }
    const current = selectedGyms.filter(g => g !== 'all');
    if (current.includes(val)) {
      const next = current.filter(g => g !== val);
      setValue('gymIds', next.length ? next : ['all']);
    } else {
      setValue('gymIds', [...current, val]);
    }
  };

  const onSubmit = (data: BroadcastFormValues) => {
    sendBroadcast(data);
    reset(EMPTY_BROADCAST_FORM);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-5">
        <p className="text-base font-semibold text-foreground">Compose Broadcast</p>
        <p className="text-sm text-secondary mt-0.5">Send a message to members across all or selected gyms</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Channel */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Channel <span className="text-danger">*</span></label>
          <div className="flex gap-3">
            {CHANNEL_OPTIONS.map(c => (
              <button key={c.value} type="button" onClick={() => setValue('channel', c.value as BroadcastFormValues['channel'])}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border motion-safe:transition-all ${selectedChannel === c.value ? 'bg-primary-subtle text-primary border-primary' : 'bg-input text-secondary border-border hover:border-primary'}`}>
                {CHANNEL_ICONS[c.value]} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Broadcast Title <span className="text-danger">*</span></label>
          <input {...register('title')} placeholder="e.g. Holiday Closure — All Branches" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-secondary">Message <span className="text-danger">*</span></label>
            <span className={`text-xs ${message.length > 900 ? 'text-danger' : 'text-secondary'}`}>{message.length}/1000</span>
          </div>
          <textarea {...register('message')} rows={5} placeholder="Type your broadcast message here..." className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none" />
          {errors.message && <p className="text-xs text-danger mt-1">{errors.message.message}</p>}
        </div>

        {/* Target Gyms */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Target Gyms <span className="text-danger">*</span></label>
          <div className="flex flex-wrap gap-2">
            {GYM_OPTIONS.map(opt => {
              const isSelected = selectedGyms.includes(opt.value);
              return (
                <button key={opt.value} type="button" onClick={() => toggleGym(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border motion-safe:transition-all ${isSelected ? 'bg-primary-subtle text-primary border-primary' : 'bg-input text-secondary border-border hover:border-primary'}`}>
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errors.gymIds && <p className="text-xs text-danger mt-1">{errors.gymIds.message}</p>}
        </div>

        {/* Member Status Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Target Members</label>
          <select {...register('memberStatus')} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            {MEMBER_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Schedule (optional) */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Schedule For (optional)</label>
          <input {...register('scheduledAt')} type="datetime-local" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          <p className="text-xs text-secondary mt-1">Leave empty to send immediately</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={() => reset(EMPTY_BROADCAST_FORM)} className="px-4 py-2 bg-input border border-border rounded-lg text-sm font-medium text-secondary hover:text-foreground motion-safe:transition-colors">
            Clear
          </button>
          <button type="submit" disabled={sending} className="flex items-center gap-2 px-5 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-95">
            {sending ? <Clock size={15} className="animate-spin" /> : <Send size={15} />}
            {sending ? 'Sending...' : 'Send Broadcast'}
          </button>
        </div>
      </form>
    </div>
  );
}
