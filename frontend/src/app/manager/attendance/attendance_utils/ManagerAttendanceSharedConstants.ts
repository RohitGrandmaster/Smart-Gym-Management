// RESPONSIBILITY: Centralized constants, schema, and shared utilities for the Attendance module.
import { z } from 'zod';

export const formatDate = (d: string) => 
 new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (d?: string) => 
 d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

export const ATTENDANCE_TABLE_HEADERS = [
  'Name', 'Type', 'Status', 'Date', 'Check In', 'Actions'
];

export const ATTENDANCE_TABS = ['Member Attendance', 'Trainer Attendance', 'Staff Attendance', 'Daily Attendance Report'] as const;
export type AttendanceTab = typeof ATTENDANCE_TABS[number];

export const AttendanceSchema = z.object({
  type: z.enum(['MEMBER', 'STAFF']),
  memberId: z.string().optional(),
  staffId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  endDate: z.string().optional(),
  status: z.enum(['PRESENT', 'LEAVE', 'ABSENT']),
  checkIn: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.type === 'MEMBER' && !data.memberId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Member is required',
      path: ['memberId']
    });
  }
  if (data.type === 'STAFF' && !data.staffId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Staff is required',
      path: ['staffId']
    });
  }
  if (data.status === 'PRESENT' && (!data.checkIn || data.checkIn.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Time is required for Present status',
      path: ['checkIn']
    });
  }
  if (data.endDate && new Date(data.endDate) < new Date(data.date)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End date must be on or after start date',
      path: ['endDate']
    });
  }
});

export type AttendanceFormValues = z.infer<typeof AttendanceSchema>;

export const EMPTY_ATTENDANCE_FORM: AttendanceFormValues = { 
 type: 'MEMBER', 
 memberId: '', 
 staffId: '', 
 date: new Date().toISOString().split('T')[0], 
 endDate: '',
 status: 'PRESENT',
 checkIn: '06:00' 
};
