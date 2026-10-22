// RESPONSIBILITY: Renders the empty state for the jobs table.
import { Activity } from 'lucide-react';

export default function SuperadminJobsEmptyState({ isFiltered }: { isFiltered?: boolean }) {
  return (
    <tr>
      <td colSpan={7} className="py-16">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {isFiltered ? 'No jobs found' : 'No jobs available'}
          </h3>
          <p className="text-sm text-secondary max-w-sm">
            {isFiltered 
              ? 'Try adjusting your filters to find the jobs you are looking for.' 
              : 'Background jobs and tasks will be listed here when scheduled.'}
          </p>
        </div>
      </td>
    </tr>
  );
}
