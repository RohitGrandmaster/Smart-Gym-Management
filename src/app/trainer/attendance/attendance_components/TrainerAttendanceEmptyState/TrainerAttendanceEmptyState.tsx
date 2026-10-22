// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the empty state for attendance records.
import { CalendarX } from 'lucide-react';

export default function TrainerAttendanceEmptyState({ isFiltered }: { isFiltered?: boolean }) {
  return (
    <tr>
      <td colSpan={5} className="py-12">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <CalendarX className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {isFiltered ? 'No matches found' : 'No attendance records'}
          </h3>
          <p className="text-sm text-secondary max-w-sm">
            {isFiltered 
              ? 'Try adjusting your search or filters to find what you are looking for.'
              : 'Attendance records for members will appear here once they check in.'}
          </p>
        </div>
      </td>
    </tr>
  );
}

