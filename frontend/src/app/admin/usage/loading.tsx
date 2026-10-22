// RESPONSIBILITY: Skeleton loading UI for Admin Usage page.
export default function AdminUsageLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-24 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
        ))}
      </div>
      <div className="h-64 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
    </div>
  );
}
