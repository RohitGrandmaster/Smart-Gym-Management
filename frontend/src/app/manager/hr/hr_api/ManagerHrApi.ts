// RESPONSIBILITY: Provides strongly-typed network calls for the hr module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { HrUrlConfig } from '@/app/manager/hr/ManagerHrUrlConfig';
import type { Staff, Payroll, HrSummary, LedgerEntry } from '@/app/manager/hr/hr_types/ManagerHrTypes';

export const hrApi = {
  getStaff: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ staff: Staff[]; total: number }>>(`${HrUrlConfig.BACKEND_API.STAFF_BASE}${q}`);
  },
  getOneStaff: (id: string) => apiFetch<ApiResponse<Staff>>(HrUrlConfig.BACKEND_API.STAFF_GET_ONE(id)),
  createStaff: (body: Partial<Staff>) =>
    apiFetch<ApiResponse<Staff>>(HrUrlConfig.BACKEND_API.STAFF_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateStaff: (id: string, body: Partial<Staff>) =>
    apiFetch<ApiResponse<Staff>>(HrUrlConfig.BACKEND_API.STAFF_UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  removeStaff: (id: string) => apiFetch<ApiResponse<{ id: string }>>(HrUrlConfig.BACKEND_API.STAFF_DELETE(id), { method: 'DELETE' }),
  getPayrolls: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ payrolls: Payroll[]; total: number }>>(`${HrUrlConfig.BACKEND_API.PAYROLLS_BASE}${q}`);
  },
  createPayroll: (body: Partial<Payroll>) =>
    apiFetch<ApiResponse<Payroll>>(HrUrlConfig.BACKEND_API.PAYROLLS_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updatePayroll: (id: string, body: Partial<Payroll>) =>
    apiFetch<ApiResponse<Payroll>>(`${HrUrlConfig.BACKEND_API.PAYROLLS_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  updatePayrollStatus: (id: string, status: string) =>
    apiFetch<ApiResponse<Payroll>>(HrUrlConfig.BACKEND_API.PAYROLL_STATUS_UPDATE(id), { method: 'PATCH', body: JSON.stringify({ status }) }),
  getSummary: () => apiFetch<ApiResponse<HrSummary>>(HrUrlConfig.BACKEND_API.SUMMARY),
  getLedger: (staffId: string) => 
    apiFetch<ApiResponse<{ ledger: LedgerEntry[]; total: number }>>(`${HrUrlConfig.BACKEND_API.STAFF_BASE}/ledger/${staffId}`),
  giveAdvance: (data: { staffId: string; amount: number; notes?: string; date?: string; paymentMode?: string }) =>
    apiFetch<ApiResponse<{ advanceAmount: number }>>(`${HrUrlConfig.BACKEND_API.STAFF_BASE}/advance`, { method: 'POST', body: JSON.stringify(data) }),
  payDue: (data: { staffId: string; amount: number; notes?: string; date?: string; paymentMode?: string }) =>
    apiFetch<ApiResponse<{ paidAmount: number }>>(`${HrUrlConfig.BACKEND_API.STAFF_BASE}/due/pay`, { method: 'POST', body: JSON.stringify(data) }),
};

