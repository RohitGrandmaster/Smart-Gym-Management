// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Skeleton loading state for the /landing route (Next.js Suspense boundary).
// Mimics the Navbar bar + Hero section shape with motion-safe:animate-pulse to avoid layout shift on load.
// Rule 26: Skeleton loaders over generic spinners.
export default function LandingLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar Skeleton */}
      <div className="h-16 border-b border-white/10 bg-black/50" />

      {/* Hero Skeleton */}
      <div className="flex-1 flex items-center justify-center relative bg-card">
        <div className="absolute inset-0 bg-white/5 motion-safe:animate-pulse" />
        <div className="relative z-10 w-full max-w-4xl px-4 space-y-6 flex flex-col items-center">
          <div className="h-8 w-48 bg-white/10 rounded-full motion-safe:animate-pulse" />
          <div className="h-16 w-3/4 sm:w-1/2 bg-white/10 rounded-2xl motion-safe:animate-pulse" />
          <div className="h-16 w-full sm:w-2/3 bg-white/10 rounded-2xl motion-safe:animate-pulse" />
          <div className="h-24 w-full sm:w-3/4 bg-white/10 rounded-2xl motion-safe:animate-pulse mt-4" />
          <div className="flex gap-4 mt-8 w-full justify-center">
            <div className="h-14 w-40 bg-white/10 rounded-2xl motion-safe:animate-pulse" />
            <div className="h-14 w-40 bg-white/10 rounded-2xl motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

