export default function MessagingLoading() {
  return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded w-64" />
      <div className="h-10 bg-card rounded w-48" />
      {['row-1', 'row-2', 'row-3', 'row-4', 'row-5'].map((key) => (
        <div key={key} className="h-12 bg-card rounded-lg border border-border" />
      ))}
    </div>
  );
}
