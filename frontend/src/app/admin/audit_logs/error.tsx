'use client';
import { ShieldAlert } from 'lucide-react';

export default function AdminAuditLogsError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <ShieldAlert size={40} className="text-danger opacity-60" />
      <p className="text-foreground font-semibold">Failed to load Audit Logs</p>
      <button onClick={reset} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors">
        Try Again
      </button>
    </div>
  );
}
