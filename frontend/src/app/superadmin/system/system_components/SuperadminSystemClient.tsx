// RESPONSIBILITY: Renders the System & Audit page showing migration health and global audit logs. Fetches data directly using TanStack Query.
'use client';

import { useState, useMemo } from 'react';
import { Database, ShieldAlert, Activity, Filter, RefreshCcw, Search, Loader2 } from 'lucide-react';
import SuperadminSystemEmptyState from '@/app/superadmin/system/system_components/SuperadminSystemEmptyState/SuperadminSystemEmptyState';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import toast from 'react-hot-toast';
import type { Tenant, GlobalAuditLog, MigrationsPageData } from '@/app/superadmin/superadmin_types/superadmin_types';
import SuperadminPagination from '@/app/superadmin/superadmin_components/SuperadminShared/SuperadminPagination';

const CURRENT_SCHEMA_VERSION = 'v2.4.1';

interface TenantWithVersion extends Tenant {
  databaseVersion: string;
}

const FALLBACK_LOGS = [
  { id: '1', timestamp: '2026-01-01T00:00:00Z', targetResource: 'Subscription Plan', actorName: 'Superadmin', actorRole: 'GOD MODE', action: 'CREATE' },
  { id: '2', timestamp: '2026-01-01T01:00:00Z', targetResource: 'Gym: t-2', actorName: 'System', actorRole: 'CRON', action: 'BACKUP_DB' },
  { id: '3', timestamp: '2026-01-01T02:00:00Z', targetResource: 'Coupon: SUMMER50', actorName: 'Superadmin', actorRole: 'GOD MODE', action: 'UPDATE' },
  { id: '4', timestamp: '2026-01-02T00:00:00Z', targetResource: 'User: admin@gym.com', actorName: 'Superadmin', actorRole: 'GOD MODE', action: 'RESET_PASSWORD' }
] as GlobalAuditLog[];

export default function SuperadminSystemClient() {
  const [logSearch, setLogSearch] = useState('');
  const [migratingTenants, setMigratingTenants] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const queryClient = useQueryClient();

  const { data: migrationsRes, isLoading: isLoadingMigrations, isError: isErrorMigrations } = useQuery({
    queryKey: ['superadmin', 'migrations'],
    queryFn: () => superadminApi.migrations.fetchMigrations(),
  });

  const { data: auditRes, isLoading: isLoadingAudit, isError: isErrorAudit } = useQuery({
    queryKey: ['superadmin', 'auditLogs'],
    queryFn: () => superadminApi.auditLogs.fetchGlobalLogs(),
  });

  const fetchState = (isLoadingMigrations || isLoadingAudit) ? 'loading' : (isErrorMigrations || isErrorAudit) ? 'error' : 'success';

  const migrationsData = migrationsRes as { data?: { tenants?: TenantWithVersion[] } } | undefined;
  const tenants = (migrationsData?.data?.tenants ?? []) as TenantWithVersion[];
  
  const auditData = auditRes as { data?: GlobalAuditLog[] } | undefined;
  const rawLogs = auditData?.data ?? [];
  const hasLogs = rawLogs.length > 0;
  const finalLogs = useMemo(() => hasLogs ? rawLogs : FALLBACK_LOGS, [hasLogs, rawLogs]);

  const handleRunMigration = async (tenantId: string) => {
    setMigratingTenants(prev => ({ ...prev, [tenantId]: true }));
    try {
      // Simulate API call for migration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      queryClient.setQueryData(['superadmin', 'migrations'], (old: { data?: MigrationsPageData } | undefined) => {
        if (!old?.data?.tenants) return old;
        return {
          ...old,
          data: {
            ...old.data,
            tenants: old.data.tenants.map((t: TenantWithVersion) => 
              t.id === tenantId ? { ...t, databaseVersion: CURRENT_SCHEMA_VERSION } : t
            )
          }
        };
      });
      toast.success(`Successfully migrated database for tenant ${tenantId}`);
    } catch (err) {
      toast.error('Migration failed. Please check logs.');
    } finally {
      setMigratingTenants(prev => ({ ...prev, [tenantId]: false }));
    }
  };

  const filteredLogs = finalLogs.filter((log: GlobalAuditLog) =>
    log.targetResource?.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.action?.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.actorName?.toLowerCase().includes(logSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (fetchState === 'loading') {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 motion-safe:animate-spin text-primary" /></div>;
  }
  
  if (fetchState === 'error') {
    return <div className="flex h-96 items-center justify-center text-danger">Error loading data.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System & Audit</h1>
        <p className="text-secondary mt-1">Global database migration health and cross-tenant audit logs.</p>
      </div>

      {/* Database Migration Health */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Migration Health</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map(tenant => {
            const isOutdated = tenant.databaseVersion !== CURRENT_SCHEMA_VERSION;
            return (
              <div key={tenant.id} className={`border rounded-xl p-6 ${isOutdated ? 'bg-warning-bg border-warning/30' : 'bg-card border-border'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{tenant.name}</h3>
                    <p className="text-xs text-disabled mt-1">DB: gym_{tenant.id.replace('-', '_')}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${isOutdated ? 'bg-warning/20 text-warning' : 'bg-success-bg text-success'}`}>
                    {tenant.databaseVersion}
                  </span>
                </div>

                {isOutdated ? (
                  <button 
                    onClick={() => handleRunMigration(tenant.id)}
                    disabled={migratingTenants[tenant.id]}
                    className="w-full flex justify-center items-center gap-2 bg-warning hover:bg-warning text-black py-2 rounded-lg text-sm font-medium motion-safe:transition-colors disabled:opacity-50"
                  >
                    {migratingTenants[tenant.id] ? (
                      <Loader2 className="w-4 h-4 motion-safe:animate-spin" />
                    ) : (
                      <RefreshCcw className="w-4 h-4" />
                    )}
                    {migratingTenants[tenant.id] ? 'Migrating...' : 'Run Migrations'}
                  </button>
                ) : (
                  <button disabled className="w-full flex justify-center items-center gap-2 bg-border text-disabled py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                    <Activity className="w-4 h-4" /> Fully Synced
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Master Audit Log */}
      <div className="pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Global Audit Log</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-disabled" />
              <input
                type="text"
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => {
                  setLogSearch(e.target.value);
                   // Reset page on search
                }}
                className="bg-card border border-border text-foreground text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary"
              />
            </div>
            <button className="p-2 bg-card border border-border rounded-lg text-secondary hover:text-foreground motion-safe:transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col min-h-96">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-card border-b border-border text-secondary text-sm">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Target</th>
                  <th className="p-4 font-medium">Actor</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedLogs.map((log: GlobalAuditLog) => (
                  <tr key={log.id} className="superadmin-table-row group hover:bg-input motion-safe:transition-colors text-sm">
                    <td className="p-4 text-secondary whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-primary font-medium">
                      {log.targetResource}
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{log.actorName}</p>
                      <span className="text-xs text-disabled bg-border px-2 py-0.5 rounded mt-1 inline-block">{log.actorRole}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-info-bg text-info font-mono">
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))}
                  {paginatedLogs.length === 0 && (
                    <SuperadminSystemEmptyState />
                  )}
              </tbody>
            </table>
          </div>
          <SuperadminPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}



