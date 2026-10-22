// RESPONSIBILITY: Next.js loading.tsx � renders skeleton loader fallback while Diet Library module data loads.
import { TableSkeleton } from '@/app/manager/manager_components/ManagerShared/TableSkeleton';
export default function Loading() {
 return (
 <div className="min-h-screen flex flex-col p-6 space-y-5 bg-background">
 <div className="h-20 bg-card rounded-xl motion-safe:animate-pulse"></div>
 <TableSkeleton rows={8} />
 </div>
 );
}
