export interface BackupRecord {
  id: string;
  tenantName: string;
  databaseName: string;
  sizeMB: number;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
  timestamp: string;
}
