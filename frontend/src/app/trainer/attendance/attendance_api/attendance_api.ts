// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides strongly-typed network calls for attendance operations.
import { apiFetch, ApiResponse } from '@/lib/api';
import { AttendanceUrlConfig } from '@/app/trainer/attendance/attendance_url_config';
import type { Attendance } from '@/app/trainer/trainer_types/trainer_types';

export const attendanceApi = {
  createAttendanceRecord: (body: { memberId?: string; staffId?: string; date: string; checkIn?: string; type: string }) =>
    apiFetch(AttendanceUrlConfig.BACKEND_API.BASE, { method: 'POST', body: JSON.stringify(body) }),
  fetchAttendanceRecords: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<any>>(`${AttendanceUrlConfig.BACKEND_API.BASE}${q}`);
  },
  getTodayStats: () =>
    apiFetch<ApiResponse<{ totalCheckIns: number; memberCheckIns: number; staffCheckIns: number }>>(
      AttendanceUrlConfig.BACKEND_API.TODAY_STATS
    ),
};

