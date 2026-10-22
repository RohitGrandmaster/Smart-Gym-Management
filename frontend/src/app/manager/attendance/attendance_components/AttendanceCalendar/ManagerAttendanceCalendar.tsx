// RESPONSIBILITY: Renders a month-wise calendar view of attendance for a specific user.
'use client';

import React, { useEffect, useState } from 'react';
import { useAttendanceContext } from '@/app/manager/attendance/attendance_context/ManagerAttendanceContext';
import { attendanceApi } from '@/app/manager/attendance/attendance_api/ManagerAttendanceApi';
import type { Attendance } from '@/app/manager/attendance/attendance_types/ManagerAttendanceTypes';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function AttendanceCalendar() {
  const { calendarUser, setCalendarUser, showToast } = useAttendanceContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [history, setHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async (date: Date) => {
    if (!calendarUser) return;
    setLoading(true);
    try {
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const res = await attendanceApi.getHistory(calendarUser.id, calendarUser.type, monthStr);
      if (res.success && res.data) {
        setHistory(res.data as any); // Assuming ApiResponse structure
      }
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (calendarUser) {
      loadHistory(currentDate);
    }
  }, [calendarUser, currentDate]);



  if (!calendarUser) return null;

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getStatusForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = history.find(r => r.date === dateStr || r.date.startsWith(dateStr));
    if (record) {
      return record.status === 'LEAVE' ? 'LEAVE' : 'PRESENT';
    }
    // If date is in future, return NONE, else ABSENT
    const isFuture = new Date(dateStr) > new Date();
    return isFuture ? 'NONE' : 'ABSENT';
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  let totalP = 0;
  let totalA = 0;
  let totalL = 0;
  days.forEach(day => {
    const st = getStatusForDay(day);
    if (st === 'PRESENT') totalP++;
    else if (st === 'ABSENT') totalA++;
    else if (st === 'LEAVE') totalL++;
  });

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 motion-safe:animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card shadow-xl flex flex-col max-h-[90vh] rounded-2xl border-2 border-primary overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Attendance History
            </h2>
            <p className="text-sm text-secondary">
              {calendarUser.name} ({calendarUser.type})
            </p>
          </div>
          <button
            onClick={() => setCalendarUser(null)}
            className="p-2 rounded-md hover:bg-background text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 pb-2 flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 rounded-md hover:bg-background border border-border">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xl font-bold text-foreground">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-md hover:bg-background border border-border">
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Stats */}
        <div className={`px-4 pb-2 grid ${calendarUser.type === 'STAFF' ? 'grid-cols-3' : 'grid-cols-2 gap-4 max-w-[75%]'} text-xs font-bold text-secondary`}>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-success"></div> Present: {totalP}</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-danger"></div> Absent: {totalA}</div>
          {calendarUser.type === 'STAFF' && (
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div> Leave: {totalL}</div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="p-4 overflow-y-auto">
          {loading ? (
            <div>
              <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-bold text-secondary">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1.5 motion-safe:animate-pulse">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-md bg-muted" />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-bold text-secondary">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {blanks.map(b => (
                  <div key={`blank-${b}`} className="aspect-square rounded-md bg-background/30" />
                ))}
                {days.map(day => {
                  const status = getStatusForDay(day);
                  const isPresent = status === 'PRESENT';
                  const isAbsent = status === 'ABSENT';
                  const isLeave = status === 'LEAVE';
                  return (
                    <div
                      key={day}
                      className={`
                        aspect-square flex items-center justify-center rounded-md border-none text-xs font-bold transition-all
                        ${isPresent ? 'bg-success text-white hover:scale-110' : ''}
                        ${isAbsent ? 'bg-danger text-white hover:scale-110' : ''}
                        ${isLeave ? 'bg-primary text-black hover:scale-110' : ''}
                        ${status === 'NONE' ? 'bg-background border border-border text-secondary' : ''}
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
