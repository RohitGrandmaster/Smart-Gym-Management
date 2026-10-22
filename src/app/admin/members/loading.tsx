// RESPONSIBILITY: Skeleton loading UI for Admin Members page matching the KPIs + table layout.
export default function AdminMembersLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="h-10 flex-1 min-w-48 bg-input rounded-xl motion-safe:animate-pulse" />
          <div className="h-10 w-44 bg-input rounded-xl motion-safe:animate-pulse" />
          <div className="h-10 w-48 bg-input rounded-xl motion-safe:animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-12 bg-input rounded-lg motion-safe:animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
