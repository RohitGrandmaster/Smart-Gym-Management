// RESPONSIBILITY: Renders the empty state for the system logs table.
import { TerminalSquare } from 'lucide-react';

export default function SuperadminSystemEmptyState() {
  return (
    <tr>
      <td colSpan={7} className="py-16">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <TerminalSquare className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">No logs found</h3>
          <p className="text-sm text-secondary max-w-sm">
            System logs will appear here once background activities or errors are recorded.
          </p>
        </div>
      </td>
    </tr>
  );
}
