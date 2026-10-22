// RESPONSIBILITY: Renders the paginated, filterable table of all gym memberships. KPI cards (Rule 74) double as interactive filters. Receives data via SalesContext. No API calls.
'use client';

import { useState, useMemo } from 'react';
import { useAdminSalesLogic } from '@/app/admin/sales/sales_context/useAdminSalesLogic';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import AdminSalesEmptyState from '@/app/admin/sales/sales_components/AdminSalesEmptyState/AdminSalesEmptyState';
import type { Member } from '@/app/admin/sales/sales_types/sales_types';
import { ADMIN_ITEMS_PER_PAGE } from '@/app/admin/admin_utils/AdminSharedConstants';
import { Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type MembershipFilter = 'All' | 'Active' | 'Expiring Soon' | 'Expired';

const MEMBERSHIP_FILTERS: MembershipFilter[] = ['All', 'Active', 'Expiring Soon', 'Expired'];
const TABLE_HEADERS = ['Member', 'Plan', 'Start', 'End Date', 'Status', 'Amount', 'Days Left'] as const;

function getDaysLeft(expiryDate: string): number {
  return Math.floor((new Date(expiryDate).getTime() - Date.now()) / 86400000);
}

function getDaysLeftColorClass(daysLeft: number): string {
  if (daysLeft <= 0) return 'text-danger';
  if (daysLeft <= 7) return 'text-danger';
  if (daysLeft <= 30) return 'text-warning';
  return 'text-success';
}

function getMembershipFilter(member: Member): MembershipFilter {
  if (member.status?.toUpperCase() === 'EXPIRED') return 'Expired';
  const days = getDaysLeft(member.expiryDate);
  if (days <= 0) return 'Expired';
  if (days <= 30) return 'Expiring Soon';
  return 'Active';
}

export default function AdminSalesAllMemberships() {
  const [activeFilter, setActiveFilter] = useState<MembershipFilter>('All');
  const { currentPage, setCurrentPage, allMemberships, allMembershipsTotal, fetchState } = useAdminSalesLogic();

  // Compute per-status counts for the KPI bar (Rule 74)
  const counts = useMemo(() => ({
    All: allMemberships.length,
    Active: allMemberships.filter(m => getMembershipFilter(m) === 'Active').length,
    'Expiring Soon': allMemberships.filter(m => getMembershipFilter(m) === 'Expiring Soon').length,
    Expired: allMemberships.filter(m => getMembershipFilter(m) === 'Expired').length,
  }), [allMemberships]);

  // Apply client-side filter
  const filtered = useMemo(() => {
    if (activeFilter === 'All') return allMemberships;
    return allMemberships.filter(m => getMembershipFilter(m) === activeFilter);
  }, [allMemberships, activeFilter]);

  const totalPages = Math.ceil((activeFilter === 'All' ? allMembershipsTotal : filtered.length) / ADMIN_ITEMS_PER_PAGE) || 1;

  const kpiCards = [
    { filter: 'All' as MembershipFilter, label: 'Total Members', count: counts.All, icon: Users, color: 'text-primary', bg: 'bg-primary/10', activeBorder: 'border-primary' },
    { filter: 'Active' as MembershipFilter, label: 'Active', count: counts.Active, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', activeBorder: 'border-success' },
    { filter: 'Expiring Soon' as MembershipFilter, label: 'Expiring Soon', count: counts['Expiring Soon'], icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', activeBorder: 'border-warning' },
    { filter: 'Expired' as MembershipFilter, label: 'Expired', count: counts.Expired, icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', activeBorder: 'border-danger' },
  ];

  if (fetchState === 'loading') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="motion-safe:animate-pulse h-20 bg-input rounded-xl border border-border" />)}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="motion-safe:animate-pulse h-12 bg-card rounded border border-border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* KPI Filter Cards (Rule 74) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map(({ filter, label, count, icon: Icon, color, bg, activeBorder }) => (
          <button
            key={filter}
            onClick={() => { setActiveFilter(filter);  }}
            className={`text-left p-4 rounded-xl border-2 transition-all duration-200 bg-card hover:shadow-md ${
              activeFilter === filter
                ? `${activeBorder} shadow-sm`
                : 'border-border hover:border-border/80'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon size={14} className={color} />
              </div>
              <span className="text-xs font-medium text-secondary">{label}</span>
            </div>
            <div className={`text-2xl font-bold ${activeFilter === filter ? color : 'text-foreground'}`}>
              {count}
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-input">
            <tr>
              {TABLE_HEADERS.map(h => (
                <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r: Member) => {
              const daysLeft = getDaysLeft(r.expiryDate);
              return (
                <tr key={r.id} className="hover:bg-primary/5 transition-colors bg-card cursor-pointer">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-sm text-secondary">{r.plan?.name ?? `Plan #${r.planId}`}</td>
                  <td className="px-4 py-3 text-sm text-secondary">{new Date(r.joinDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-sm text-secondary">{new Date(r.expiryDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      r.status?.toUpperCase() === 'ACTIVE'
                        ? 'bg-success-bg text-success'
                        : 'bg-danger-bg text-danger'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">₹{r.paidAmount?.toLocaleString('en-IN') || 0}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${getDaysLeftColorClass(daysLeft)}`}>
                    {daysLeft <= 0 ? 'Expired' : `${daysLeft}d`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <AdminSalesEmptyState message={`No ${activeFilter === 'All' ? '' : activeFilter} memberships found`} subtext="Try selecting a different filter." />
      )}

      <div className="pt-2 border-t border-border">
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}


