// RESPONSIBILITY: Renders the attendance data table and pagination controls.
'use client';

import { Clock, Calendar, CalendarCheck } from 'lucide-react';
import { useAttendanceContext } from '@/app/manager/attendance/attendance_context/ManagerAttendanceContext';
import { ATTENDANCE_TABLE_HEADERS, formatDate, formatTime } from '@/app/manager/attendance/attendance_utils/ManagerAttendanceSharedConstants';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import ManagerEmptyState from '@/app/manager/manager_components/ManagerFeedback/ManagerEmptyState';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

export default function AttendanceTable() {
  const { records, totalRecords, fetchState, tab, currentPage, setCurrentPage, setCalendarUser } = useAttendanceContext();

  const filteredRecords = records.filter(r => 
    tab === 'Daily Attendance Report' || 
    (tab === 'Member Attendance' && r.type === 'MEMBER') || 
    ((tab === 'Trainer Attendance' || tab === 'Staff Attendance') && r.type === 'STAFF')
  );
  
  const totalPages = Math.ceil(filteredRecords.length / MANAGER_ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * MANAGER_ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + MANAGER_ITEMS_PER_PAGE);

  return (
 <div className="p-5">
  {fetchState === 'loading' ? (
    <div className="motion-safe:animate-pulse bg-card rounded-xl border border-border mt-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b border-border flex items-center px-4 gap-4">
          <div className="h-8 w-8 bg-muted rounded-full"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-4 bg-muted rounded-full w-16"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
      ))}
    </div>
  ) : fetchState === 'error' ? (
    <div className="text-center py-16 bg-card rounded-2xl border border-danger/30 mt-4">
      <p className="text-danger font-medium">Failed to load attendance records.</p>
      <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
    </div>
  ) : (
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-input">
 <tr>
 {ATTENDANCE_TABLE_HEADERS.map(h => (
 <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-4 py-3 whitespace-nowrap">
 {h}
 </th>
 ))}
 </tr>
 </thead>
  <tbody className="divide-y divide-border">
  {paginatedRecords.map(r => (
 <tr key={r.id} className="hover:bg-primary-subtle transition-colors">
 <td className="px-4 py-3 whitespace-nowrap">
 <div className="flex items-center gap-2">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
 r.type === 'MEMBER' ? 'bg-info' : 'bg-success'
 }`}>
 {(r.member?.name || r.staff?.name || '?').charAt(0)}
 </div>
 <span className="text-sm font-medium text-foreground">
 {r.member?.name || r.staff?.name || '—'}
 </span>
 </div>
 </td>
 <td className="px-4 py-3 whitespace-nowrap">
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
  r.type === 'MEMBER' 
  ? 'bg-info-bg text-info dark:bg-info-bg dark:text-info' 
  : 'bg-success-bg text-success dark:bg-success-bg dark:text-success'
  }`}>
  {r.type}
  </span>
  </td>
  <td className="px-4 py-3 whitespace-nowrap">
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      (r.checkIn || r.status === 'PRESENT' || r.type === 'MEMBER') ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
    }`}>
      {(r.checkIn || r.status === 'PRESENT' || r.type === 'MEMBER') ? 'Present' : 'Absent'}
    </span>
  </td>
 <td className="px-4 py-3 text-sm text-secondary whitespace-nowrap">{formatDate(r.date)}</td>
 <td className="px-4 py-3 text-sm text-secondary flex items-center gap-1 whitespace-nowrap">
 <Clock size={13} className="opacity-50" />
 {formatTime(r.checkIn)}
 </td>
 <td className="px-4 py-3 text-sm whitespace-nowrap">
  <button 
    onClick={() => setCalendarUser({ id: String(r.memberId || r.staffId || r.id), name: String(r.member?.name || r.staff?.name), type: r.type as 'MEMBER'|'STAFF' })}
    className="p-1.5 rounded-md hover:bg-primary-subtle text-primary transition-colors flex items-center gap-1 border border-transparent hover:border-border"
    title="View Monthly Calendar"
  >
    <Calendar size={14} />
    <span className="text-xs font-medium">History</span>
  </button>
 </td>
 </tr>
 ))}
 {records.length === 0 && (
 <tr>
 <td colSpan={6} className="p-0 border-b-0">
  <ManagerEmptyState 
    icon={<CalendarCheck size={32} />}
    title="No attendance records"
    subtitle="There are no check-ins for this date or filter yet."
  />
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 )}
 
 <div className="border-t border-border mt-4 pt-4">
      <ManagerPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  </div>
  );
}
