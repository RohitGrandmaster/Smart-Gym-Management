'use client';
// RESPONSIBILITY: Renders the page title, search input, and "New Broadcast" CTA for the Broadcasts page. Receives all state via props — no API calls.
import { Megaphone, Plus, Search } from 'lucide-react';
import type { BroadcastsHeaderProps } from '@/app/superadmin/broadcasts/superadmin_broadcasts_types/superadmin_broadcasts_types';

export default function SuperadminBroadcastsHeader({ searchQuery, onSearchChange, statusFilter, onStatusFilterChange, onCreateClick }: BroadcastsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" />
          Announcements & Broadcasts
        </h1>
        <p className="text-sm text-secondary mt-1">Push notifications and announcements to all gym dashboards.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors  w-full sm:w-64 "
          />
        </div>
        
        {onStatusFilterChange && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'ALL' | 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED')}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="SENT">Sent</option>
            <option value="FAILED">Failed</option>
          </select>
        )}

        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Broadcast
        </button>
      </div>
    </div>
  );
}
