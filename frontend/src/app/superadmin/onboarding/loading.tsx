export default function OnboardingLoading() {
  return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded w-64" />
      {/* Rule 64: mobile-first — 2 cols on mobile, 5 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {['total', 'completed', 'in-progress', 'stalled', 'trial'].map((key) => (
          <div key={key} className="h-20 bg-card rounded-xl border border-border" />
        ))}
      </div>
      <div className="h-96 bg-card rounded-xl border border-border" />
    </div>
  );
}
