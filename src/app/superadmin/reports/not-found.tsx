import Link from 'next/link';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';

export default function ReportsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-full bg-input flex items-center justify-center">
        <span className="text-3xl font-bold text-secondary">404</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Report not found</h2>
        <p className="text-secondary text-sm max-w-sm">
          The report you are looking for does not exist or is no longer available.
        </p>
      </div>
      <Link
        href={SuperadminUrlConfig.PAGES.DASHBOARD}
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-black font-semibold rounded-lg text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
