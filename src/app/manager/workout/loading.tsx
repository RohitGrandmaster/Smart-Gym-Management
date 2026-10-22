// RESPONSIBILITY: Next.js loading.tsx — renders skeleton loader fallback while Workout Library module data loads.
export default function Loading() {
 return (
 <div className="min-h-screen flex flex-col p-6 space-y-5 bg-background">
 <div className="h-20 bg-card rounded-xl motion-safe:animate-pulse"></div>
 
 {/* Banner Skeleton */}
 <div className="h-32 bg-card rounded-xl motion-safe:animate-pulse"></div>

 {/* Main Content Skeleton */}
 <div className="min-h-96 h-full bg-card rounded-xl motion-safe:animate-pulse mt-6"></div>
 </div>
 );
}
