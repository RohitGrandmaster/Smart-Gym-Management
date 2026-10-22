// RESPONSIBILITY: API client for the Reports module. All network calls for report data.
import type { ApiResponse } from '@/lib/api';
import type { ReportData } from '@/app/admin/reports/reports_types/reports_types';
import { MOCK_REPORT_DATA } from '@/app/admin/reports/reports_utils/AdminReportsSharedConstants';

export const reportsApi = {
  fetchReportData: async (_params?: { dateRange?: string; gymId?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<ReportData>> => {
    return { success: true, message: 'Report data fetched', data: MOCK_REPORT_DATA };
  },
  exportReport: async (_params?: { tab?: string; format?: string }): Promise<ApiResponse<{ url: string }>> => {
    return { success: true, message: 'Export ready', data: { url: '#' } };
  },
};
