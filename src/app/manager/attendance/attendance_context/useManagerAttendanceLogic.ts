// RESPONSIBILITY: Central logic hook for the Attendance module. Manages state, API interactions, and URL synchronization.
// DATA FLOW: UI Components -> useManagerAttendanceLogic (State + URL) -> API (Backend)
import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ApiResponse } from '@/lib/api';
import { attendanceApi } from '@/app/manager/attendance/attendance_api/ManagerAttendanceApi';
import { hrApi } from '@/app/manager/hr/hr_api/ManagerHrApi';
import { membersApi } from '@/app/manager/members/members_api/ManagerMembersApi';
import type { Member } from '@/app/manager/members/members_types/ManagerMembersTypes';
import type { Staff } from '@/app/manager/hr/hr_types/ManagerHrTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { EMPTY_ATTENDANCE_FORM, ATTENDANCE_TABS, type AttendanceTab } from '@/app/manager/attendance/attendance_utils/ManagerAttendanceSharedConstants';
import { useDebounce } from '@/app/manager/manager_utils/useDebounce';
import { AttendanceContextType, Attendance, AttendanceStatsResponse, AttendanceResponse, FetchState } from '@/app/manager/attendance/attendance_types/ManagerAttendanceTypes';
import { useManagerAttendanceMutations } from './useManagerAttendanceMutations';

export function useManagerAttendanceLogic(): AttendanceContextType {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [search, setLocalSearch] = useState(searchParams.get('search') || '');
  const tabParam = searchParams.get('tab') as AttendanceTab | null;
  const tab: AttendanceTab = tabParam && ATTENDANCE_TABS?.includes(tabParam) ? tabParam : ATTENDANCE_TABS[0];
  const debouncedSearch = useDebounce(search, 300);

  const setUrlParam = useCallback((key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) current.set(key, value);
    else current.delete(key);
    if (key !== 'page') current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch !== currentSearch) {
      setUrlParam('search', debouncedSearch || null);
    }
  }, [debouncedSearch, searchParams, setUrlParam]);

  const setSearch = useCallback((val: string) => setLocalSearch(val), []);
  const setCurrentPage = useCallback((val: number) => setUrlParam('page', val.toString()), [setUrlParam]);
  const setTab = useCallback((val: AttendanceTab) => setUrlParam('tab', val), [setUrlParam]);

  // Local State
  const [records, setRecords] = useState<Attendance[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [todayStats, setTodayStats] = useState<AttendanceStatsResponse>({ totalCheckIns: 0, memberCheckIns: 0, staffCheckIns: 0 });
  const [members, setMembers] = useState<Member[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
 
  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
 
  const [showModal, setShowModal] = useState(false);
  const [calendarUser, setCalendarUser] = useState<{ id: string; name: string; type: 'MEMBER' | 'STAFF' } | null>(null);
  const [form, setForm] = useState(EMPTY_ATTENDANCE_FORM);

  const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
  const hideToast = useCallback(() => setToast(null), []);

  const loadAll = useCallback(async () => {
    setFetchState('loading');
    try {
      const params: Record<string, string> = {
        limit: '10',
        page: currentPage.toString()
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (tab !== 'Daily Attendance Report') params.type = tab === 'Member Attendance' ? 'MEMBER' : 'STAFF';

      // We explicitly cast the responses via our strict generic wrapper
      const [attRes, statsRes, memRes, staffRes] = await Promise.all([
        attendanceApi.getAll(params) as unknown as Promise<ApiResponse<AttendanceResponse>>,
        attendanceApi.getTodayStats() as unknown as Promise<ApiResponse<AttendanceStatsResponse>>,
        membersApi.getAll({ limit: '1000', status: 'active' }) as unknown as Promise<ApiResponse<{ members: Member[] }>>,
        hrApi.getStaff() as unknown as Promise<ApiResponse<{ staff: Staff[] } | Staff[]>>,
      ]);

      let fetchedRecords = attRes.data.attendance || ((attRes.data as unknown) as { attendances?: import("@/app/manager/attendance/attendance_types/ManagerAttendanceTypes").Attendance[] }).attendances || [];
      
      if (tab !== 'Daily Attendance Report') {
        fetchedRecords = fetchedRecords.filter((r: Attendance) => r.type === (tab === 'Member Attendance' ? 'MEMBER' : 'STAFF'));
      }
      
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        fetchedRecords = fetchedRecords.filter((r: Attendance) => 
          (r.member?.name && r.member.name?.toLowerCase().includes(q)) || 
          (r.staff?.name && r.staff.name?.toLowerCase().includes(q))
        );
      }

      // Sort by newest first
      fetchedRecords.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateB - dateA;
      });

      setRecords(fetchedRecords);
      setTotalRecords(attRes.data.total || 0);
      setTodayStats(statsRes.data);
      setMembers(memRes.data.members || []);
      
      const staffData = staffRes.data;
      setStaff(Array.isArray(staffData) ? staffData : (staffData.staff || []));
    } catch (e) { 
      showToast((e as Error).message, 'error'); 
    } finally { 
      setFetchState('success'); 
    }
  }, [showToast, currentPage, debouncedSearch, tab]);

  // Rely on URL changes to drive the fetch (plus initial mount)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAll(); }, [loadAll]);

  const { markAttendance } = useManagerAttendanceMutations(
    members, staff, setSaving, setShowModal, setForm, showToast, loadAll
  );

  const exportAttendance = useCallback(() => {
    // Basic CSV Export mockup
    const csvContent = [
      ['Date', 'Name', 'Role', 'Status', 'Check In', 'Check Out'],
      ...records.map(r => [
        r.date, 
        r.member?.name || r.staff?.name || 'Unknown', 
        r.memberId ? 'Member' : 'Staff', 
        r.status || 'Present', 
        r.checkIn || '-', 
        r.checkOut || '-'
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export successful', 'success');
  }, [records, showToast]);

  return {
    records, totalRecords, todayStats, members, staff,
    fetchState, saving, toast,
    tab, setTab,
    search, setSearch,
    currentPage, setCurrentPage,
    showModal, setShowModal,
    calendarUser, setCalendarUser,
    form, setForm,
    showToast, hideToast,
    loadAll, markAttendance, exportAttendance
  };
}
