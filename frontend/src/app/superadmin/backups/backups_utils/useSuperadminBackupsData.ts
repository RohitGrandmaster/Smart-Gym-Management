// DATA FLOW: Component -> useSuperadminBackupsData.ts -> API/Store
import { useQuery } from '@tanstack/react-query';
import { backupsApi } from '@/app/superadmin/backups/superadmin_backups_api/superadmin_backups_api';
import type { BackupRecord } from '@/app/superadmin/backups/superadmin_backups_types/superadmin_backups_types';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

export function useSuperadminBackupsData() {
  const query = useQuery({
    queryKey: ['superadmin', 'backups'],
    queryFn: async () => {
      const res = await backupsApi.fetchBackups();
      if (!res.data) throw new Error(res.message || 'Failed to fetch backups data');
      return res.data;
    }
  });

  const fetchState: FetchState = query.isLoading ? 'loading' : query.isError ? 'error' : 'success';

  return {
    data: query.data,
    fetchState,
    error: query.isError ? new Error('Failed to fetch backups data') : null,
    setFetchState: (state: React.SetStateAction<FetchState>) => {}, // mock to keep signature
    setData: (updater: React.SetStateAction<BackupRecord[] | null>) => {} // mock to keep signature
  };
}
