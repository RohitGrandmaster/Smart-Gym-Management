// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the top KPI stat cards (total check-ins, member check-ins, staff check-ins) for the Attendance module.
'use client';

import { CalendarCheck, Users } from 'lucide-react';
import { useAttendanceContext } from '@/app/trainer/attendance/attendance_context/AttendanceContext';

export default function TrainerAttendanceKPIs() {
 const { todayStats } = useAttendanceContext();

 const kpis = [
 { label: "Today's Check-ins", value: todayStats.totalCheckIns, icon: CalendarCheck, color: 'text-warning', bg: 'bg-warning/10' },
 { label: 'Member Check-ins', value: todayStats.memberCheckIns, icon: Users, color: 'text-info', bg: 'bg-info/10' },
 ];

 return (
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {kpis.map((s) => (
 <div key={s.label} className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center gap-3">
 <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
 <s.icon size={19} className={s.color} />
 </div>
 <div>
 <p className="text-xs text-secondary font-medium">{s.label}</p>
 <p className="text-xl font-bold text-primary">{s.value}</p>
 </div>
 </div>
 ))}
 </div>
 );
}

