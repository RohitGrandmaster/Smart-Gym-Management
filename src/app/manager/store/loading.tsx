// RESPONSIBILITY: Next.js loading.tsx — renders skeleton loader fallback while Gym Store module data loads.
export default function Loading() {
 return (
 <div className="min-h-screen flex flex-col p-6 space-y-5 bg-background">
 <div className="h-20 bg-card rounded-xl motion-safe:animate-pulse"></div>
 
 {/* KPI Skeletons */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {[1, 2, 3, 4].map(i => (
 <div key={i} className="h-24 bg-card rounded-xl motion-safe:animate-pulse"></div>
 ))}
 </div>

 {/* Main Content Skeleton */}
 <div className="min-h-96 h-full bg-card rounded-xl motion-safe:animate-pulse mt-6"></div>
 </div>
 );
}
