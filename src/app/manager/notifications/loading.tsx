// RESPONSIBILITY: Skeleton loading UI for the Notifications page — mimics KPI cards + list rows.
export default function ManagerNotificationsLoading() {
  return (
    <div className="min-h-full pb-10 animate-pulse">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="h-6 w-48 bg-skeleton-base rounded-lg" />
        <div className="h-4 w-72 bg-skeleton-base rounded mt-2" />
      </div>
      <div className="p-6 space-y-6">
        {/* KPI skeletons */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-skeleton-highlight shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-skeleton-base rounded" />
                <div className="h-7 w-12 bg-skeleton-highlight rounded" />
              </div>
            </div>
          ))}
        </div>
        {/* List skeleton */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex gap-3">
            <div className="h-9 w-72 bg-skeleton-base rounded-lg" />
            <div className="h-9 w-28 bg-skeleton-base rounded-lg" />
            <div className="h-9 w-28 bg-skeleton-base rounded-lg" />
          </div>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-border">
              <div className="w-2.5 h-2.5 rounded-full bg-skeleton-highlight mt-1.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 w-20 bg-skeleton-base rounded-full" />
                  <div className="h-4 w-16 bg-skeleton-base rounded-full" />
                </div>
                <div className="h-4 w-64 bg-skeleton-highlight rounded" />
                <div className="h-3 w-48 bg-skeleton-base rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
