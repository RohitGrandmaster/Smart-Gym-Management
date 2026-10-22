export default function AdminSubscriptionsLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="h-24 bg-skeleton-base rounded-xl motion-safe:animate-pulse border border-border" />
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-skeleton-base rounded-xl motion-safe:animate-pulse border border-border" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 bg-skeleton-base rounded-xl motion-safe:animate-pulse border border-border" />
        ))}
      </div>
    </div>
  );
}
