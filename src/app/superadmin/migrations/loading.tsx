// RESPONSIBILITY: Skeleton loader for the Migrations page. Uses bg-skeleton-base/bg-skeleton-highlight per design system.
export default function MigrationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-64 bg-skeleton-base motion-safe:animate-pulse rounded mb-2" />
          <div className="h-4 w-80 bg-skeleton-base motion-safe:animate-pulse rounded" />
        </div>
        <div className="h-10 w-36 bg-skeleton-base motion-safe:animate-pulse rounded-lg" />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Table header skeleton */}
        <div className="h-12 border-b border-border bg-skeleton-base/40 motion-safe:animate-pulse" />
        {/* Table rows skeleton — 5 rows matching migrations table layout */}
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center gap-6">
              <div className="h-4 bg-skeleton-highlight motion-safe:animate-pulse rounded w-48" />
              <div className="h-4 bg-skeleton-highlight motion-safe:animate-pulse rounded w-24" />
              <div className="h-5 bg-skeleton-highlight motion-safe:animate-pulse rounded-full w-20 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
