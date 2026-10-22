// RESPONSIBILITY: Next.js global 404 fallback page. Renders a user-friendly 'Page not found' UI when a requested route does not exist.
import Link from 'next/link';

export default function NotFound() {
 return (
 <div className="min-h-screen flex items-center justify-center bg-background">
 <div className="text-center">
 <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
 <p className="text-secondary">Page not found</p>
 <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">← Back to Dashboard</Link>
 </div>
 </div>
 );
}
