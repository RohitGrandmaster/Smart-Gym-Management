// RESPONSIBILITY: Provides the implementation for loading.tsx functionality within its module.
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
export default function Loading() {
 return (
 <div className="min-h-screen flex flex-col p-6 space-y-5 bg-background">
 {/* Header Skeleton */}
 <div className="h-10 bg-skeleton-base animate-pulse rounded-md w-1/4"></div>
 {/* Table Skeleton */}
 <AdminTableSkeleton rows={8} />
 </div>
 );
}
