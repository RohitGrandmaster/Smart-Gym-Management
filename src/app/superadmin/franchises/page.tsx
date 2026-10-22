// RESPONSIBILITY: Core infrastructure component for routing, loading, and error boundaries in the module.
import { Users } from 'lucide-react';

export default function FranchisesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Franchises Management</h1>
          <p className="text-secondary mt-1">This module is currently under development.</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-2">Coming Soon</h2>
        <p className="text-secondary max-w-md mx-auto">
          The Franchises management dashboard will provide aggregated analytics and controls for franchise networks.
        </p>
      </div>
    </div>
  );
}

