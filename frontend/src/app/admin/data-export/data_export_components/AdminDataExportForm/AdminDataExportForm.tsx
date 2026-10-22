// RESPONSIBILITY: Form for creating a new data export job with data type, format, gym, and date range filters.
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download } from 'lucide-react';
import { useAdminDataExportLogic } from '@/app/admin/data-export/data_export_context/useAdminDataExportLogic';
import {
  ExportFormSchema,
  EMPTY_EXPORT_FORM,
  DATA_TYPE_OPTIONS,
  FORMAT_OPTIONS,
  GYM_OPTIONS,
} from '@/app/admin/data-export/data_export_utils/AdminDataExportSharedConstants';
import type { ExportFormValues } from '@/app/admin/data-export/data_export_types/data_export_types';

export default function AdminDataExportForm() {
  const { createExport, creating } = useAdminDataExportLogic();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ExportFormValues>({
    resolver: zodResolver(ExportFormSchema),
    defaultValues: EMPTY_EXPORT_FORM,
  });

  const selectedFormat = watch('format');
  const selectedDataType = watch('dataType');
  const selectedGyms = watch('gymIds') ?? [];

  const toggleGym = (val: string) => {
    if (val === 'all') { setValue('gymIds', ['all']); return; }
    const current = selectedGyms.filter(g => g !== 'all');
    const next = current.includes(val) ? current.filter(g => g !== val) : [...current, val];
    setValue('gymIds', next.length ? next : ['all']);
  };

  const onSubmit = (data: ExportFormValues) => {
    createExport(data);
    reset(EMPTY_EXPORT_FORM);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-5">
        <p className="text-base font-semibold text-foreground">New Export</p>
        <p className="text-sm text-secondary mt-0.5">Select data type, format, gyms, and date range</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Data Type */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Data Type <span className="text-danger">*</span></label>
          <div className="flex flex-wrap gap-2">
            {DATA_TYPE_OPTIONS.map(opt => (
              <button key={opt.value} type="button" onClick={() => setValue('dataType', opt.value as ExportFormValues['dataType'])}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border motion-safe:transition-all ${selectedDataType === opt.value ? 'bg-primary-subtle text-primary border-primary' : 'bg-input text-secondary border-border hover:border-primary'}`}>
                {opt.label}
              </button>
            ))}
          </div>
          {errors.dataType && <p className="text-xs text-danger mt-1">{errors.dataType.message}</p>}
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Export Format <span className="text-danger">*</span></label>
          <div className="flex gap-3">
            {FORMAT_OPTIONS.map(opt => (
              <button key={opt.value} type="button" onClick={() => setValue('format', opt.value as ExportFormValues['format'])}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border motion-safe:transition-all ${selectedFormat === opt.value ? 'bg-primary-subtle text-primary border-primary' : 'bg-input text-secondary border-border hover:border-primary'}`}>
                {opt.label}
              </button>
            ))}
          </div>
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

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">From Date <span className="text-danger">*</span></label>
            <input {...register('dateFrom')} type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
            {errors.dateFrom && <p className="text-xs text-danger mt-1">{errors.dateFrom.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">To Date <span className="text-danger">*</span></label>
            <input {...register('dateTo')} type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
            {errors.dateTo && <p className="text-xs text-danger mt-1">{errors.dateTo.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={() => reset(EMPTY_EXPORT_FORM)} className="px-4 py-2 bg-input border border-border rounded-lg text-sm font-medium text-secondary hover:text-foreground motion-safe:transition-colors">
            Clear
          </button>
          <button type="submit" disabled={creating} className="flex items-center gap-2 px-5 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-95">
            <Download size={15} />
            {creating ? 'Starting Export...' : 'Start Export'}
          </button>
        </div>
      </form>
    </div>
  );
}
