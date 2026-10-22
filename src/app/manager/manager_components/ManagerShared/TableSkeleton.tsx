// RESPONSIBILITY: Renders animated skeleton loader rows that match the data table layout. Used as placeholder while API data loads (Rule 26).
import React from 'react';

export const TableSkeleton = ({ rows = 6 }: { rows?: number }) => {
  return (
    <div className="w-full bg-card border border-border rounded-xl overflow-hidden mt-4">
      <div className="w-full h-12 bg-primary/10 border-b border-border"></div>
      <div className="flex flex-col">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 h-15 border-b border-border motion-safe:animate-pulse">
            <div className="h-4 bg-input rounded w-1/4"></div>
            <div className="h-4 bg-input rounded w-1/5"></div>
            <div className="h-4 bg-input rounded w-1/6"></div>
            <div className="h-4 bg-input rounded w-1/4"></div>
            <div className="h-4 bg-input rounded w-12 ml-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
