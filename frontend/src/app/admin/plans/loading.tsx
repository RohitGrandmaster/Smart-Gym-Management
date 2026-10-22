// RESPONSIBILITY: Provides the implementation for loading.tsx functionality within its module.
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
export default function Loading() {
 return (
 <div className="min-h-screen flex flex-col p-6 space-y-5 bg-background">
 <div className="h-20 bg-card rounded-xl motion-safe:animate-pulse"></div>
 <AdminTableSkeleton rows={8} />
 
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
 {[1, 2, 3].map(i => (
 <div key={i} className="h-96 bg-card rounded-2xl motion-safe:animate-pulse"></div>
 ))}
 </div>
 </div>
 );
}

