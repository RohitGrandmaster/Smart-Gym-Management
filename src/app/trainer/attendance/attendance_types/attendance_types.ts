// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Defines strict types and API response interfaces for the Attendance module to ensure type safety.
import type { Member, Attendance, FetchState } from '@/app/trainer/trainer_types/trainer_types';
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import type { AttendanceTab, EMPTY_ATTENDANCE_FORM } from '@/app/trainer/attendance/attendance_utils/AttendanceSharedConstants';



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
  totalRecords: number;
  fetchState: FetchState;
  saving: boolean;
  toast: { message: string; type: ToastType } | null;
 
  tab: AttendanceTab;
  setTab: (tab: AttendanceTab) => void;
  viewMode: 'calendar' | 'table';
  setViewMode: (v: 'calendar' | 'table') => void;
  search: string;
  setSearch: (s: string) => void;
  filterDate: string;
  setFilterDate: (d: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
 
  showModal: boolean;
  setShowModal: (show: boolean) => void;
 
  form: typeof EMPTY_ATTENDANCE_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_ATTENDANCE_FORM>>;
 
  showToast: (msg: string, t: ToastType) => void;
  hideToast: () => void;
 
  loadAll: () => Promise<void>;
  markAttendance: (data: typeof EMPTY_ATTENDANCE_FORM) => Promise<void>;
}

