// RESPONSIBILITY: Strongly-typed API calls for the Manager Reports module (mock until backend ready).
import type { ReportSummary } from '@/app/manager/reports/reports_types/ManagerReportsTypes';
import { MOCK_REPORT_SUMMARY } from '@/app/manager/reports/reports_utils/ManagerReportsSharedConstants';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const reportsApi = {
  fetchSummary: async (_params?: Record<string, string>): Promise<ReportSummary> => {
    await delay(400);
    return { ...MOCK_REPORT_SUMMARY };
  },

  exportReportCSV: async (tab: string, _params?: Record<string, string>): Promise<Blob> => {
    await delay(300);
    const summary = MOCK_REPORT_SUMMARY;
    let csv = '';
    if (tab === 'Revenue') {
      csv = 'Month,Revenue,Expenses,Profit\n' +
        summary.revenueData.map(d => `${d.month},${d.revenue},${d.expenses},${d.profit}`).join('\n');
    } else if (tab === 'Attendance') {
      csv = 'Date,Present,Absent,Rate(%)\n' +
        summary.attendanceData.map(d => `${d.date},${d.present},${d.absent},${d.rate}`).join('\n');
    } else if (tab === 'Members') {
      csv = 'Month,New Members,Churned,Active\n' +
        summary.memberChurnData.map(d => `${d.month},${d.newMembers},${d.churned},${d.active}`).join('\n');
    } else {
      csv = 'Category,Amount,Percentage\n' +
        summary.expenseBreakdown.map(d => `${d.category},${d.amount},${d.percentage}`).join('\n');
    }
    return new Blob([csv], { type: 'text/csv' });
  },
};
