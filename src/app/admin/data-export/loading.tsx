// RESPONSIBILITY: Skeleton loading UI for the Data Export page.
export default function DataExportLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2 h-96 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
        <div className="xl:col-span-3 h-96 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      </div>
    </div>
  );
}
