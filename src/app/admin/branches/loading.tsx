// RESPONSIBILITY: Renders the skeleton loading fallback for the branches module.
export default function BranchesLoading() {
  return (
    <div className="min-h-full p-6 space-y-6 bg-page">
      {/* Header skeleton */}
      <div className="h-16 bg-card rounded-xl motion-safe:animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-64 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
        ))}
      </div>
    </div>
  );
}
