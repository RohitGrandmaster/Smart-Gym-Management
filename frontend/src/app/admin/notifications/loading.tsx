// RESPONSIBILITY: Renders the loading fallback for the notifications module.
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';

export default function Loading() {
  return (
    <div className="flex flex-col space-y-6 w-full animate-pulse">
      
      {/* Header section skeleton */}
      <div className="flex items-center justify-between bg-skeleton-base h-20 rounded-md p-4 w-full"></div>
      
      {/* Toolbar / Actions skeleton */}
      <div className="flex items-center space-x-4 h-12 bg-skeleton-base rounded-md p-4 w-1/3"></div>

      {/* Main Table skeleton */}
      <AdminTableSkeleton rows={8} />
    </div>
  );
}
