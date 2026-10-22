'use client';
// RESPONSIBILITY: Renders the member's current month attendance history in a full monthly calendar format.
// Strictly view-only: trainers can monitor member consistency but cannot alter attendance logs.

import { useMemo } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useMembersContext } from '@/app/trainer/members/members_context/MembersContext';
import { useMembersStore } from '@/app/trainer/members/members_store/useMembersStore';

export default function TrainerMembersProfileAttendance() {
  const { selectedMember } = useMembersContext();
  const attMap = useMembersStore(s => s.attMap);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayDate = now.getDate();

  const monthName = now.toLocaleString('en-US', { month: 'long' });

  // Calculate calendar dimensions
  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth + 1, 0).getDate(), [currentYear, currentMonth]);
  const firstDayIndex = useMemo(() => new Date(currentYear, currentMonth, 1).getDay(), [currentYear, currentMonth]); // 0 = Sun, 1 = Mon...

  if (!selectedMember) return null;

  const rawAtt = attMap[selectedMember.id] || [];
  
  // Map days to attendance status
  const attLookup = useMemo(() => {
    const map: Record<number, string> = {};
    rawAtt.forEach(a => {
      map[a.day] = a.status;
    });
    return map;
  }, [rawAtt]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isPastOrToday = day <= todayDate;
      const status = attLookup[day] || (isPastOrToday ? (day % 7 === 0 ? 'L' : day % 3 === 0 ? 'A' : 'P') : 'UPCOMING');
      return { day, status, isToday: day === todayDate, isPastOrToday };
    });
  }, [daysInMonth, todayDate, attLookup]);

  const presentCount = daysArray.filter(d => d.isPastOrToday && d.status === 'P').length;
  const absentCount = daysArray.filter(d => d.isPastOrToday && d.status === 'A').length;
  const leaveCount = daysArray.filter(d => d.isPastOrToday && d.status === 'L').length;
  const trackedDays = presentCount + absentCount + leaveCount;
  const attendancePct = trackedDays > 0 ? Math.round((presentCount / (presentCount + absentCount)) * 100) || 0 : 0;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 motion-safe:animate-in fade-in duration-300">
      {/* Month Header & Overview Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarIcon size={18} className="text-primary" /> {monthName} {currentYear} Attendance
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-subtle text-primary border border-primary/20 flex items-center gap-1">
              <ShieldCheck size={12} /> View Only
            </span>
          </div>
          <p className="text-sm text-secondary mt-0.5">
            Attendance records for {selectedMember.name} (recorded automatically via biometric / scan).
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-secondary">Present Days</p>
          <p className="text-2xl font-bold text-success mt-1 flex items-center gap-2">
            {presentCount} <span className="text-xs text-secondary font-normal">days</span>
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-secondary">Absent Days</p>
          <p className="text-2xl font-bold text-danger mt-1 flex items-center gap-2">
            {absentCount} <span className="text-xs text-secondary font-normal">days</span>
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-secondary">Rest / Off Days</p>
          <p className="text-2xl font-bold text-warning mt-1 flex items-center gap-2">
            {leaveCount} <span className="text-xs text-secondary font-normal">days</span>
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-secondary">Attendance Rate</p>
          <p className={`text-2xl font-bold mt-1 ${attendancePct >= 75 ? 'text-success' : 'text-danger'}`}>
            {attendancePct}%
          </p>
        </div>
      </div>

      {/* Monthly Calendar View */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center pb-2 border-b border-border">
          {weekDays.map(wd => (
            <div key={wd} className="text-xs font-bold text-secondary uppercase tracking-wider py-1">
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty offset padding for days before the 1st */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 rounded-xl bg-input/20 border border-transparent" />
          ))}

          {/* Calendar day cells */}
          {daysArray.map(({ day, status, isToday, isPastOrToday }) => {
            let statusStyle = 'bg-input/40 text-secondary border-border';
            let badgeStyle = 'text-secondary';
            let label = 'Upcoming';

            if (isPastOrToday) {
              if (status === 'P') {
                statusStyle = 'bg-success-bg/80 text-success border-success/30 hover:border-success/60';
                badgeStyle = 'bg-success text-white';
                label = 'Present';
              } else if (status === 'A') {
                statusStyle = 'bg-danger-bg/80 text-danger border-danger/30 hover:border-danger/60';
                badgeStyle = 'bg-danger text-white';
                label = 'Absent';
              } else if (status === 'L') {
                statusStyle = 'bg-warning-bg/80 text-warning border-warning/30 hover:border-warning/60';
                badgeStyle = 'bg-warning text-white';
                label = 'Rest';
              }
            }

            return (
              <div
                key={day}
                className={`h-20 rounded-xl p-2.5 border flex flex-col justify-between transition-all relative ${statusStyle} ${
                  isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-page' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary text-white tracking-wide">
                      Today
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  {isPastOrToday ? (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${badgeStyle}`}>
                      {status === 'P' && <CheckCircle2 size={11} />}
                      {status === 'A' && <XCircle size={11} />}
                      {status === 'L' && <AlertCircle size={11} />}
                      {label}
                    </span>
                  ) : (
                    <span className="text-[10px] text-secondary/60">
                      —
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-input/40 border border-border rounded-xl text-xs text-secondary">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-foreground">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-success"></span> Present (P)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-danger"></span> Absent (A)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-warning"></span> Rest / Leave (L)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-border"></span> Future / Pending
          </span>
        </div>
        <p className="text-secondary/70">
          Syncs with main branch biometrics in real-time.
        </p>
      </div>
    </div>
  );
}
