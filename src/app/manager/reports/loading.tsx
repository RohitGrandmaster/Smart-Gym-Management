// RESPONSIBILITY: Skeleton loading UI for the Reports page — mimics toolbar + KPI grid + chart + table.
export default function ManagerReportsLoading() {
  return (
    <div className="min-h-full pb-10">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="h-6 w-52 bg-skeleton-base rounded-lg motion-safe:animate-pulse" />
        <div className="h-4 w-80 bg-skeleton-base rounded mt-2 motion-safe:animate-pulse" />
      </div>
      <div className="p-6 space-y-6">
        {/* Toolbar skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-1 bg-input rounded-xl p-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-9 w-24 bg-skeleton-base rounded-lg motion-safe:animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-36 bg-skeleton-base rounded-lg motion-safe:animate-pulse" />
            <div className="h-9 w-24 bg-skeleton-base rounded-lg motion-safe:animate-pulse" />
            <div className="h-9 w-28 bg-skeleton-base rounded-lg motion-safe:animate-pulse" />
          </div>
        </div>
        {/* KPI skeletons */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-24 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="h-80 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
        {/* Table skeleton */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="h-12 bg-skeleton-base motion-safe:animate-pulse border-b border-border" />
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-12 border-b border-border px-5 flex items-center gap-4">
              <div className="h-4 w-20 bg-skeleton-base rounded motion-safe:animate-pulse" />
              <div className="h-4 w-24 bg-skeleton-highlight rounded motion-safe:animate-pulse" />
              <div className="h-4 w-20 bg-skeleton-base rounded motion-safe:animate-pulse" />
              <div className="h-4 w-20 bg-skeleton-highlight rounded motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
