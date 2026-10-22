// RESPONSIBILITY: Centralized constants, mock data, and Zod schema for the Data Export module.
import { z } from 'zod';
import type { ExportJob, DataExportKPIData } from '@/app/admin/data-export/data_export_types/data_export_types';

export const DATA_TYPE_OPTIONS = [
  { value: 'members', label: 'Members' },
  { value: 'payments', label: 'Payments' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'staff', label: 'Staff' },
  { value: 'full_report', label: 'Full Report' },
];

export const FORMAT_OPTIONS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF' },
];

export const GYM_OPTIONS = [
  { value: 'all', label: 'All Gyms' },
  { value: 'g1', label: 'Andheri East' },
  { value: 'g2', label: 'Bandra West' },
  { value: 'g3', label: 'Powai' },
  { value: 'g4', label: 'Thane' },
];

export const EXPORT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
];

export const DATA_EXPORT_ITEMS_PER_PAGE = 10;

export const ExportFormSchema = z.object({
  dataType: z.enum(['members', 'payments', 'attendance', 'staff', 'full_report']),
  format: z.enum(['csv', 'excel', 'pdf']),
  gymIds: z.array(z.string()).min(1, 'Select at least one gym'),
  dateFrom: z.string().min(1, 'Start date is required'),
  dateTo: z.string().min(1, 'End date is required'),
});

export const EMPTY_EXPORT_FORM = {
  dataType: 'members' as const,
  format: 'csv' as const,
  gymIds: ['all'],
  dateFrom: '',
  dateTo: '',
};

export const MOCK_EXPORT_JOBS: ExportJob[] = [
  { id: 'exp1', dataType: 'members', format: 'csv', gymIds: ['all'], gymNames: ['All Gyms'], dateFrom: '2025-06-01', dateTo: '2025-06-30', status: 'completed', rowCount: 1842, fileSizeKb: 284, createdAt: '2025-07-01T10:00:00', completedAt: '2025-07-01T10:00:45', createdBy: 'Admin' },
  { id: 'exp2', dataType: 'payments', format: 'excel', gymIds: ['g1', 'g2'], gymNames: ['Andheri East', 'Bandra West'], dateFrom: '2025-06-01', dateTo: '2025-06-30', status: 'completed', rowCount: 3241, fileSizeKb: 512, createdAt: '2025-07-01T09:30:00', completedAt: '2025-07-01T09:31:10', createdBy: 'Admin' },
  { id: 'exp3', dataType: 'attendance', format: 'pdf', gymIds: ['g3'], gymNames: ['Powai'], dateFrom: '2025-05-01', dateTo: '2025-05-31', status: 'completed', rowCount: 8920, fileSizeKb: 1240, createdAt: '2025-06-02T08:00:00', completedAt: '2025-06-02T08:02:30', createdBy: 'Admin' },
  { id: 'exp4', dataType: 'full_report', format: 'pdf', gymIds: ['all'], gymNames: ['All Gyms'], dateFrom: '2025-01-01', dateTo: '2025-06-30', status: 'processing', createdAt: '2025-07-08T14:00:00', createdBy: 'Admin' },
  { id: 'exp5', dataType: 'staff', format: 'csv', gymIds: ['g4'], gymNames: ['Thane'], dateFrom: '2025-06-01', dateTo: '2025-06-30', status: 'failed', createdAt: '2025-07-05T11:00:00', createdBy: 'Admin' },
];

export const MOCK_DATA_EXPORT_KPI: DataExportKPIData = {
  totalExports: 5,
  totalRowsExported: 14003,
  lastExportDate: '2025-07-01',
  pendingJobs: 1,
};
