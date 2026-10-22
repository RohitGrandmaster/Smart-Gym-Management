// RESPONSIBILITY: Next.js loading.tsx � renders skeleton loader fallback while Settings module data loads.
export default function Loading() {
 return (
 <div className="min-h-screen flex flex-col p-6 space-y-5 bg-background">
 <div className="h-20 bg-card rounded-xl motion-safe:animate-pulse"></div>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
 {[1, 2, 3, 4, 5].map(i => (
 <div key={i} className="h-32 bg-card rounded-xl motion-safe:animate-pulse"></div>
 ))}
 </div>

 <div className="h-96 bg-card rounded-xl motion-safe:animate-pulse mt-6"></div>
 </div>
 );
}
