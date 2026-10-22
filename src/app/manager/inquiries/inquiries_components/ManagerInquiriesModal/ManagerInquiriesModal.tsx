// RESPONSIBILITY: Renders the modal form for creating or editing an inquiry lead. Uses React Hook Form + Zod validation.
'use client';

import { useEffect, useState } from 'react';
import { useInquiriesContext } from '@/app/manager/inquiries/inquiries_context/ManagerInquiriesContext';
import { INQUIRY_MODAL_FIELDS, INQUIRIES_STATUS_LABELS, INQUIRY_SOURCES, InquirySchema, EMPTY_INQUIRY_FORM, type InquiryFormValues } from '@/app/manager/inquiries/inquiries_utils/ManagerInquiriesSharedConstants';
import { X, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function ManagerInquiriesModal() {
  const { showModal, setShowModal, editId, editData, saveInquiry, saving } = useInquiriesContext();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<InquiryFormValues>({
    resolver: zodResolver(InquirySchema),
    defaultValues: editData || {},
  });

  const [plans, setPlans] = useState<{ label: string, value: string }[]>([]);
  useEffect(() => {
    if (showModal) {
      import('@/app/manager/plans/plans_api/ManagerPlansApi').then(m => {
        m.plansApi.getAll().then(res => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setPlans(res.data.map((p: { name: string }) => ({ label: p.name, value: p.name })));
          } else {
            // Fallback if API returns empty
            setPlans([
              { label: 'Basic Plan', value: 'Basic Plan' },
              { label: 'Pro Plan', value: 'Pro Plan' },
              { label: 'VIP Plan', value: 'VIP Plan' }
            ]);
          }
        }).catch(err => {
          console.error("Failed to fetch plans:", err);
          // Fallback if API fails
          setPlans([
            { label: 'Basic Plan', value: 'Basic Plan' },
            { label: 'Pro Plan', value: 'Pro Plan' },
            { label: 'VIP Plan', value: 'VIP Plan' }
          ]);
        });
      }).catch(err => {
        console.error("Failed to import plansApi:", err);
      });
    }
  }, [showModal]);

  // Sync form values when modal opens with new editData
  const [newNote, setNewNote] = useState('');
  
  useEffect(() => {
    if (showModal) {
      if (editData) {
        reset(editData);
      } else {
        reset(EMPTY_INQUIRY_FORM);
      }
      setNewNote('');
    }
  }, [showModal, editData, reset]);

  const onSubmit = (data: InquiryFormValues) => {
    const payload = { ...data };
    if (!payload.email) delete payload.email;
    if (!payload.notes) delete payload.notes;
    
    if (newNote.trim()) {
      payload.followUpLogs = [...(editData?.followUpLogs || []), {
        date: new Date().toISOString(),
        note: newNote.trim()
      }];
    } else {
      payload.followUpLogs = editData?.followUpLogs || [];
    }
    
    saveInquiry(payload);
  };
  
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-xl overflow-visible border border-border max-h-full flex flex-col">
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-primary">{editId ? 'Edit Inquiry' : 'New Inquiry'}</h3>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="p-2 rounded-lg transition-colors hover:bg-primary-subtle text-secondary"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {INQUIRY_MODAL_FIELDS.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={'placeholder' in f ? (f as {placeholder?: string}).placeholder : undefined}
                  maxLength={f.type === 'tel' ? 10 : undefined}
                  onKeyDown={f.type === 'tel' ? (e) => { 
                    if (['e', 'E', '-', '+', '.'].includes(e.key)) e.preventDefault(); 
                    if (e.key.length === 1 && !/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); 
                  } : undefined}
                  pattern={f.type === 'email' ? '.*\\.com$' : undefined}
                  title={f.type === 'email' ? 'Email must end with .com' : undefined}
                  {...register(f.key as keyof InquiryFormValues)}
                  className={`w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors ${
                    errors[f.key as keyof InquiryFormValues] ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                  }`}
                />
                {errors[f.key as keyof InquiryFormValues] && (
                  <p className="text-danger text-xs mt-1">{errors[f.key as keyof InquiryFormValues]?.message}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Interest (Plan)</label>
              <Controller
                name="interest"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={[...plans, { label: 'Other', value: 'Other' }]}
                    placeholder="Select Plan..."
                  />
                )}
              />
              {errors.interest && (
                <p className="text-danger text-xs mt-1">{errors.interest.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={Object.entries(INQUIRIES_STATUS_LABELS)
                      .filter(([val]) => val !== 'CONVERTED')
                      .map(([val, label]) => ({ label, value: val }))}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Source</label>
              <Controller
                name="source"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={INQUIRY_SOURCES.map(s => ({ label: s, value: s }))}
                  />
                )}
              />
            </div>
            </div>

            {/* Follow-up Logs Section */}
            {editId && (
              <div className="pt-4 mt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-primary mb-3">Follow-up History</h4>
                
                {editData?.followUpLogs && editData.followUpLogs.length > 0 ? (
                  <div className="space-y-3 mb-4 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                    {editData.followUpLogs.map((log, i) => (
                      <div key={i} className="bg-primary-subtle p-3 rounded-lg border border-primary/20">
                        <div className="text-xs text-secondary font-medium mb-1">
                          {new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm text-foreground">{log.note}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary italic mb-4">No follow-up history yet.</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Add New Follow-up Note</label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter call notes or remarks..."
                    className="w-full border border-border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-primary transition-colors min-h-[80px]"
                  />
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-2 mt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-primary hover:bg-primary-subtle transition-all duration-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-white flex items-center justify-center gap-2 disabled:opacity-70 hover:bg-primary-hover transition-all duration-200 active:scale-95"
              >
                {saving
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                  : <><Save size={15} />{editId ? 'Update' : 'Add Inquiry'}</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
