// DATA FLOW: Component -> useSuperadminFeaturesData.ts -> API/Store
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featuresApi } from '@/app/superadmin/features/superadmin_features_api/superadmin_features_api';
import type { FeatureFlag, ReleaseNote } from '@/app/superadmin/features/superadmin_features_types/superadmin_features_types';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

export function useSuperadminFeaturesData() {
  const queryClient = useQueryClient();
  const queryKey = ['superadmin', 'features'];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await featuresApi.fetchFeatures();
      return res.data;
    }
  });

  const toggleFlagMutation = useMutation({
    mutationFn: (id: string) => featuresApi.toggleFlag(id),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          flags: old.flags.map((f: FeatureFlag) => f.id === res.data.id ? res.data : f)
        };
      });
    }
  });

  const updateFlagMutation = useMutation({
    mutationFn: ({ id, body }: { id: string, body: Partial<FeatureFlag> }) => featuresApi.updateFlag(id, body),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          flags: old.flags.map((f: FeatureFlag) => f.id === res.data.id ? res.data : f)
        };
      });
    }
  });

  const fetchState: FetchState = query.isLoading ? 'loading' : query.isError ? 'error' : 'success';

  return {
    data: query.data as { flags: FeatureFlag[]; notes: ReleaseNote[] } | undefined,
    fetchState,
    error: query.isError ? new Error('Failed to fetch product data') : null,
    
    // Legacy setters maintained to not break existing component code completely, 
    // but the component should ideally be migrated to use mutations directly
    setData: (updater: any) => queryClient.setQueryData(queryKey, updater),
    setFetchState: () => {}, 

    // New mutation exports
    toggleFlag: toggleFlagMutation.mutateAsync,
    updateFlag: updateFlagMutation.mutateAsync
  };
}
