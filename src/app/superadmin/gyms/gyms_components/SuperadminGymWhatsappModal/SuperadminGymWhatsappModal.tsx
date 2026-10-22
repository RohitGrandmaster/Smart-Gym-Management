'use client';
// RESPONSIBILITY: Renders the modal UI for sending a WhatsApp message to a Gym owner. Purely a view component.

import React from 'react';
import { X } from 'lucide-react';
import { maskSensitiveData } from '@/lib/formatters';
import { useSuperadminGymWhatsappModal } from '@/app/superadmin/gyms/gyms_components/SuperadminGymWhatsappModal/useSuperadminGymWhatsappModal';

export default function SuperadminGymWhatsappModal() {
  const {
    isWhatsappModalOpen,
    closeWhatsappModal,
    selectedGym,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  } = useSuperadminGymWhatsappModal();

  if (!isWhatsappModalOpen || !selectedGym) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-overlay rounded-2xl p-7 max-w-md w-full border border-border shadow-2xl relative">
        <button
          onClick={closeWhatsappModal}
          className="absolute top-5 right-5 text-secondary hover:text-foreground motion-safe:transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-foreground mb-1">WhatsApp Gym Owner</h2>
        <p className="text-sm text-secondary mb-6">Send a WhatsApp message to {selectedGym.ownerName} ({maskSensitiveData(selectedGym.phone, 'phone')}).</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Subject <span className="text-danger">*</span></label>
            <input
              type="text"
              {...register('subject')}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none motion-safe:transition-colors"
              placeholder="e.g., Important update about your subscription"
            />
            {errors.subject && <p className="text-xs text-danger mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Message <span className="text-danger">*</span></label>
            <textarea
              {...register('message')}
              rows={5}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none motion-safe:transition-colors resize-none"
              placeholder="Type your message here..."
            />
            {errors.message && <p className="text-xs text-danger mt-1">{errors.message.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6">
            <button
              type="button"
              onClick={closeWhatsappModal}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-background motion-safe:transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#25D366] hover:bg-[#20b957] motion-safe:transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
