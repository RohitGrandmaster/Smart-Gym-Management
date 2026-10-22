import AdminTableSkeleton from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';

export default function AdminAnnouncementsLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-skeleton-base rounded-xl motion-safe:animate-pulse border border-border" />
        ))}
      </div>
      <div className="h-20 bg-skeleton-base rounded-xl motion-safe:animate-pulse border border-border" />
      <AdminTableSkeleton rows={7} cols={7} />
    </div>
  );
}
