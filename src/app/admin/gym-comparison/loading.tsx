export default function GymComparisonLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-14 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="h-80 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
    </div>
  );
}
