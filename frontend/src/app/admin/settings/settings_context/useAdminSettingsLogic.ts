// RESPONSIBILITY: Custom hook encapsulating all UI state and API orchestration for the Settings module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { useCallback, useEffect } from 'react';
import { settingsApi } from '@/app/admin/settings/settings_api/settings_api';
import toast from 'react-hot-toast';
import { EMPTY_SETTINGS_FORM } from '@/app/admin/settings/settings_utils/SettingsSharedConstants';
import type { SettingsContextType } from '@/app/admin/settings/settings_types/settings_types';
import { useAdminSettingsStore } from '@/app/admin/settings/settings_store/useAdminSettingsStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdminSettingsLogic() {
  const { activeTab, setActiveTab, form, setForm } = useAdminSettingsStore();
 const queryClient = useQueryClient();

 const { data: settingsData, isLoading, isError } = useQuery({
   queryKey: ['adminSettings'],
   queryFn: () => settingsApi.fetchSettings(),
 });

 // Initialize form when data loads
 useEffect(() => {
   if (settingsData?.data) {
     setForm(settingsData.data as typeof form);
   }
 }, [settingsData]);

 const updateMutation = useMutation({
   mutationFn: (body: Record<string, unknown>) => settingsApi.updateSettings(body),
   onSuccess: (res) => {
     toast.success(res.message || 'Saved');
     queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
   },
   onError: (err) => {
     toast.error((err as Error).message);
   }
 });

 const handleSave = useCallback(async () => {
   updateMutation.mutate(form);
 }, [form, updateMutation]);

 const handleChange = useCallback((field: string, value: string) => {
   setForm({ ...useAdminSettingsStore.getState().form, [field]: value });
 }, [setForm]);

 return {
   activeTab, setActiveTab,
   fetchState: (isLoading ? 'loading' : isError ? 'error' : 'success') as 'idle' | 'loading' | 'success' | 'error',
   saving: updateMutation.isPending, 
   form,
   handleChange, 
   fetchSettings: async () => {}, // Mocked for context compatibility
   handleSave
 };
}



