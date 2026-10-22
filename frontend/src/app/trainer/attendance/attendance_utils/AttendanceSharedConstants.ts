// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized constants, schema, and shared utilities for the Attendance module.
import { z } from 'zod';

export const formatDate = (d: string) => 
 new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (d?: string) => 
 d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

export const ATTENDANCE_TABLE_HEADERS = [
 'Name', 'Type', 'Date', 'Check In', 'Check Out'
];

export const ATTENDANCE_TABS = ['Members', 'My Attendance'] as const;
export type AttendanceTab = typeof ATTENDANCE_TABS[number];

export const AttendanceSchema = z.object({
  type: z.enum(['MEMBER', 'STAFF']),
  memberId: z.string().optional(),
  staffId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  checkIn: z.string().min(1, 'Time is required')
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
});

export type AttendanceFormValues = z.infer<typeof AttendanceSchema>;

export const EMPTY_ATTENDANCE_FORM: AttendanceFormValues = { 
 type: 'MEMBER', 
 memberId: '', 
 staffId: '', 
 date: new Date().toISOString().split('T')[0], 
 checkIn: '06:00' 
};

