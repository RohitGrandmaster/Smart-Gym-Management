// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Server Component — fetches initial SSR data and renders the Attendance tracking module entry point.
import TrainerAttendanceMain from '@/app/trainer/attendance/attendance_components/TrainerAttendanceMain/TrainerAttendanceMain';

export default function AttendancePage() {
 return <TrainerAttendanceMain />;
}

