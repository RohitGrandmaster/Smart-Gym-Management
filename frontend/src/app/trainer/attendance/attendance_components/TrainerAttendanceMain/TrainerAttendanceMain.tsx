// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Entry component for the Attendance module that wraps the UI in the context provider and handles the core page layout.
'use client';

import TrainerHeader from '@/app/trainer/trainer_components/TrainerLayout/TrainerHeader';
import TrainerToast from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';

import { AttendanceProvider, useAttendanceContext } from '@/app/trainer/attendance/attendance_context/AttendanceContext';
import TrainerAttendanceKPIs from '@/app/trainer/attendance/attendance_components/TrainerAttendanceKPIs/TrainerAttendanceKPIs';
import TrainerAttendanceToolbar from '@/app/trainer/attendance/attendance_components/TrainerAttendanceToolbar/TrainerAttendanceToolbar';
import TrainerAttendanceTable from '@/app/trainer/attendance/attendance_components/TrainerAttendanceTable/TrainerAttendanceTable';
import TrainerMyAttendanceCalendar from '@/app/trainer/attendance/attendance_components/TrainerMyAttendanceCalendar/TrainerMyAttendanceCalendar';

function AttendanceContent() {
  const { toast, hideToast, tab, viewMode } = useAttendanceContext();

  return (
    <div className="min-h-full pb-10 attendance-module bg-background text-foreground">
      <TrainerHeader title="Attendance" subtitle="Track daily member and staff check-ins" />
      <div className="p-6 space-y-5">
        <TrainerAttendanceKPIs />
        
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <TrainerAttendanceToolbar />
          {tab === 'My Attendance' && viewMode === 'calendar' ? (
            <TrainerMyAttendanceCalendar />
          ) : (
            <TrainerAttendanceTable />
          )}
        </div>
      </div>

 {toast && (
 <TrainerToast message={toast.message} type={toast.type} onClose={hideToast} />
 )}
 </div>
 );
}

export default function TrainerAttendanceMain() {
 return (
 <AttendanceProvider>
 <AttendanceContent />
 </AttendanceProvider>
 );
}

