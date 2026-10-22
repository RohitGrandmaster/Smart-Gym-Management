// RESPONSIBILITY: Reusable empty state component for tables and lists across the manager module.
'use client';

import { ReactNode } from 'react';

interface ManagerEmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export default function ManagerEmptyState({ icon, title, subtitle }: ManagerEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center motion-safe:animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-5 text-primary/40 shadow-sm border border-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-secondary max-w-sm leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
