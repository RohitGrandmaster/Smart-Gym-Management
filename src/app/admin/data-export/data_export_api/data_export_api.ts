// RESPONSIBILITY: API client for the Data Export module.
import type { ExportJob, ExportFormValues, DataExportKPIData } from '@/app/admin/data-export/data_export_types/data_export_types';
import { MOCK_EXPORT_JOBS, MOCK_DATA_EXPORT_KPI } from '@/app/admin/data-export/data_export_utils/AdminDataExportSharedConstants';

let mockJobs = [...MOCK_EXPORT_JOBS];

export const dataExportApi = {
  fetchJobs: async (): Promise<ExportJob[]> => mockJobs,
  fetchKPIs: async (): Promise<DataExportKPIData> => MOCK_DATA_EXPORT_KPI,
  createExport: async (payload: ExportFormValues): Promise<ExportJob> => {
    const gymNames = payload.gymIds.includes('all') ? ['All Gyms'] : payload.gymIds.map(id => {
      const map: Record<string, string> = { g1: 'Andheri East', g2: 'Bandra West', g3: 'Powai', g4: 'Thane' };
      return map[id] ?? id;
    });
    const job: ExportJob = {
      id: `exp${Date.now()}`,
      dataType: payload.dataType,
      format: payload.format,
      gymIds: payload.gymIds,
      gymNames,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      status: 'processing',
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
    };
    mockJobs = [job, ...mockJobs];
    // Simulate completion after 2s
    setTimeout(() => {
      const found = mockJobs.find(j => j.id === job.id);
      if (found) {
        found.status = 'completed';
        found.rowCount = Math.floor(Math.random() * 5000) + 100;
        found.fileSizeKb = Math.floor(Math.random() * 1000) + 50;
        found.completedAt = new Date().toISOString();
      }
    }, 2000);
    return job;
  },
  deleteJob: async (id: string): Promise<void> => {
    mockJobs = mockJobs.filter(j => j.id !== id);
  },
};
