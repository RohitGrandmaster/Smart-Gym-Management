// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the empty state for the dashboard recent members list.
import { Users } from 'lucide-react';

export default function TrainerDashboardEmptyState({ type = 'members' }: { type?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
        <Users className="w-5 h-5 text-secondary" />
      </div>
      <p className="text-sm text-secondary font-medium">No recent {type} found.</p>
    </div>
  );
}

