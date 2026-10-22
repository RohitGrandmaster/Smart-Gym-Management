// RESPONSIBILITY: Skeleton loading UI for the Gym Health Alerts page.
export default function GymHealthAlertsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="flex gap-3 flex-wrap">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-40 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="h-96 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
    </div>
  );
}
