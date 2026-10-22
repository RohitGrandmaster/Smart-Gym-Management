// RESPONSIBILITY: Defines strict types and API response interfaces for the Attendance module to ensure type safety.
import type { Member } from '@/app/manager/members/members_types/ManagerMembersTypes';
import type { Staff } from '@/app/manager/hr/hr_types/ManagerHrTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { AttendanceTab, EMPTY_ATTENDANCE_FORM } from '@/app/manager/attendance/attendance_utils/ManagerAttendanceSharedConstants';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface Attendance {
  id: string;
  memberId?: number;
  staffId?: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  type: string;
  status?: string;
  member?: { name: string };
  staff?: { name: string };
}

export interface AttendanceStatsResponse {
  totalCheckIns: number;
  memberCheckIns: number;
  staffCheckIns: number;
}

export interface AttendanceResponse {
  attendance?: Attendance[];
  attendances?: Attendance[];
  total: number;
}

export interface AttendanceContextType {
  records: Attendance[];
  todayStats: AttendanceStatsResponse;
  members: Member[];
  staff: Staff[];
  totalRecords: number;
  fetchState: FetchState;
  saving: boolean;
  toast: { message: string; type: ToastType } | null;
 
  tab: AttendanceTab;
  setTab: (t: AttendanceTab) => void;
  
  search: string;
  setSearch: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
 
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  
  calendarUser: { id: string; name: string; type: 'MEMBER' | 'STAFF' } | null;
  setCalendarUser: (user: { id: string; name: string; type: 'MEMBER' | 'STAFF' } | null) => void;
 
  form: typeof EMPTY_ATTENDANCE_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_ATTENDANCE_FORM>>;
 
  showToast: (msg: string, t: ToastType) => void;
  hideToast: () => void;
 
  loadAll: () => Promise<void>;
  markAttendance: (data: typeof EMPTY_ATTENDANCE_FORM) => Promise<void>;
  exportAttendance: () => void;
}
