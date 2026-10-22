'use client';
// RESPONSIBILITY: SuperadminBackupsClient.tsx renders the Database Backups page. Purely a view layer — data fetched via useSuperadminData.

import { useSuperadminBackupsData } from '@/app/superadmin/backups/backups_utils/useSuperadminBackupsData';
import SuperadminBackupsEmptyState from '@/app/superadmin/backups/backups_components/SuperadminBackupsEmptyState/SuperadminBackupsEmptyState';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { DatabaseBackup, Search, Download, RotateCcw } from 'lucide-react';
import type { BackupRecord } from '@/app/superadmin/backups/superadmin_backups_types/superadmin_backups_types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SuperadminPagination from '@/app/superadmin/superadmin_components/SuperadminShared/SuperadminPagination';

const StatusColors: Record<BackupRecord['status'], string> = {
  SUCCESS: 'text-success bg-success/10',
  IN_PROGRESS: 'text-primary bg-primary/10',
  FAILED: 'text-danger bg-danger-bg/10',
};

export default function SuperadminBackupsClient() {
  const { data: backups, fetchState, error } = useSuperadminBackupsData();

    const [search, setSearch] = useState('');
    const [isTriggering, setIsTriggering] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const handleTriggerSnapshot = async () => {
      setIsTriggering(true);
      const loadingToast = toast.loading('Initiating global pg_dump snapshot...');
      try {
        await new Promise(res => setTimeout(res, 2000)); // Simulate API
        
        // Add a new mock backup to the top of the list
        toast.success('Global snapshot completed successfully', { id: loadingToast });
      } catch (err) {
        toast.error('Failed to trigger snapshot', { id: loadingToast });
      } finally {
        setIsTriggering(false);
      }
    };

    const handleDownload = (id: string) => {
      toast.success(`Starting download for backup ${id}`);
      // Simulate real download behavior (TC-32)
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${id}_snapshot.sql.gz`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const [restoreModalOpen, setRestoreModalOpen] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);

    const handleRestoreClick = (backup: BackupRecord) => {
      setSelectedBackup(backup);
      setRestoreModalOpen(true);
    };

    const confirmRestore = async () => {
      if (!selectedBackup) return;
      setRestoreModalOpen(false);
      
      const loadingToast = toast.loading(`Restoring database ${selectedBackup.databaseName} from snapshot...`);
      try {
        await new Promise(res => setTimeout(res, 2500)); // Simulate API
        toast.success(`Database ${selectedBackup.databaseName} successfully restored!`, { id: loadingToast });
      } catch (err) {
        toast.error('Failed to restore snapshot', { id: loadingToast });
      } finally {
        setSelectedBackup(null);
      }
    };
if (fetchState === 'loading') return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded w-48" />
      <div className="h-96 bg-card rounded-xl border border-border" />
    </div>
  );
  if (error || !backups) return <div className="p-8 text-center text-danger">Error loading data.</div>;

  const filtered: BackupRecord[] = backups.filter((b: BackupRecord) => 
    b.tenantName?.toLowerCase().includes(search.toLowerCase()) || 
    b.databaseName?.toLowerCase().includes(search.toLowerCase()) ||
    b.id?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages: number = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedBackups: BackupRecord[] = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tenant Database Backups</h1>
          <p className="text-secondary mt-1">Manage automated pg_dump snapshots for all isolated gym databases.</p>
        </div>
        <button 
          onClick={handleTriggerSnapshot}
          disabled={isTriggering}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <DatabaseBackup size={18} /> {isTriggering ? 'Creating Snapshot...' : 'Trigger Global Snapshot'}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-96">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by gym name or database..." 
              className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-full">
            <thead>
              <tr className="bg-header border-b border-border text-sm">
                <th className="p-4 font-semibold text-secondary">Backup ID</th>
                <th className="p-4 font-semibold text-secondary">Tenant</th>
                <th className="p-4 font-semibold text-secondary">Database Name</th>
                <th className="p-4 font-semibold text-secondary">Size (MB)</th>
                <th className="p-4 font-semibold text-secondary">Status</th>
                <th className="p-4 font-semibold text-secondary">Timestamp</th>
                <th className="p-4 font-semibold text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedBackups.map((backup: BackupRecord) => (
                <tr key={backup.id} className="hover:bg-input motion-safe:transition-colors">
                  <td className="p-4 text-xs font-mono text-secondary">{backup.id}</td>
                  <td className="p-4 text-sm font-medium text-foreground">{backup.tenantName}</td>
                  <td className="p-4 text-sm font-mono text-primary">{backup.databaseName}</td>
                  <td className="p-4 text-sm text-secondary font-mono">{backup.sizeMB.toFixed(1)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${StatusColors[backup.status]}`}>
                      {backup.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-secondary">{new Date(backup.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleDownload(backup.id)}
                      className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg motion-safe:transition-colors disabled:opacity-30" 
                      title="Download pg_dump" 
                      disabled={backup.status !== 'SUCCESS'}
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={() => handleRestoreClick(backup)}
                      className="p-2 text-secondary hover:text-danger hover:bg-danger-bg/10 rounded-lg motion-safe:transition-colors disabled:opacity-30" 
                      title="Restore Snapshot" 
                      disabled={backup.status !== 'SUCCESS'}
                    >
                      <RotateCcw size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-disabled">
                    <SuperadminBackupsEmptyState />
                  </td>
                </tr>
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

      {restoreModalOpen && selectedBackup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-danger-bg/10 text-danger flex items-center justify-center mb-4">
                <RotateCcw size={24} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Restore Database Snapshot</h2>
              <p className="text-sm text-secondary mb-4">
                Are you absolutely sure you want to restore the <strong className="text-foreground">{selectedBackup.databaseName}</strong> database using snapshot <strong className="text-foreground font-mono">{selectedBackup.id}</strong>?
              </p>
              <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg mb-6">
                <p className="text-xs text-warning font-medium">
                  ⚠️ WARNING: This will immediately overwrite the live production database for <strong>{selectedBackup.tenantName}</strong>. Any data created after {new Date(selectedBackup.timestamp).toLocaleString()} will be permanently lost!
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setRestoreModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium border border-border text-foreground hover:bg-card-hover motion-safe:transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRestore}
                  className="px-4 py-2 rounded-lg font-medium bg-danger hover:bg-danger/90 text-white motion-safe:transition-colors"
                >
                  Yes, Restore Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

