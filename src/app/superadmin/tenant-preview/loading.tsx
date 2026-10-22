export default function TenantPreviewLoading() {
  return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded w-64" />
      <div className="h-32 bg-card rounded-xl border border-border max-w-xl" />
      <div className="h-10 bg-card rounded-xl border border-border max-w-xl" />
      {['kpi-1', 'kpi-2', 'kpi-3', 'kpi-4'].map((key) => (
        <div key={key} className="h-20 bg-card rounded-xl border border-border" />
      ))}
    </div>
  );
}
