// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Next.js Loading UI for the Login route, displayed while the server component fetches initial session data.
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
  <div className="min-h-screen flex bg-page items-center justify-center">
  <Loader2 className="w-10 h-10 text-primary motion-safe:animate-spin" />
  </div>
  );
}

