// RESPONSIBILITY: Skeleton loader for the page, conforming to enterprise design rules (bg-skeleton-base).
export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-64 bg-skeleton-base motion-safe:animate-pulse rounded mb-2"></div>
          <div className="h-4 w-96 bg-skeleton-base motion-safe:animate-pulse rounded"></div>
        </div>
        <div className="h-10 w-32 bg-skeleton-base motion-safe:animate-pulse rounded-lg"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-skeleton-base motion-safe:animate-pulse rounded-xl border border-border"></div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="h-14 border-b border-border bg-skeleton-base/50 motion-safe:animate-pulse"></div>
        <div className="p-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-b border-border bg-skeleton-highlight motion-safe:animate-pulse opacity-50"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

