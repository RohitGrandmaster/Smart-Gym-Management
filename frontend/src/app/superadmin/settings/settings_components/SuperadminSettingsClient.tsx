// RESPONSIBILITY: Renders the Platform Settings page. Fetches settings from API and allows inline editing per setting using TanStack Query.
'use client';

import { useState } from 'react';
import { Settings, BellRing, Loader2, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import toast from 'react-hot-toast';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import type { PlatformSetting } from '@/app/superadmin/superadmin_types/superadmin_types';
import { MOCK_PLATFORM_SETTINGS } from '@/app/superadmin/settings/settings_utils/SuperadminSettingsConstants';

export default function SuperadminSettingsClient() {
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: fetchRes, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'settings'],
    queryFn: () => superadminApi.settings.fetchSettings(),
  });

  const fetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const responseData = fetchRes as { data?: PlatformSetting[] } | undefined;
  const settings = responseData?.data && responseData.data.length > 0 ? responseData.data : MOCK_PLATFORM_SETTINGS;

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string, value: string }) => superadminApi.settings.updateSetting(id, { value }),
    onSuccess: (res, variables) => {
      toast.success(res.message || 'Setting updated successfully');
      queryClient.setQueryData(['superadmin', 'settings'], (old: { data?: PlatformSetting[] } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((s: PlatformSetting) => s.id === variables.id ? { ...s, value: variables.value } : s)
        };
      });
      setEditedValues(prev => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to update setting');
    }
  });

  const broadcastMutation = useMutation({
    mutationFn: (msg: string) => superadminApi.broadcasts.sendBroadcast(msg),
    onSuccess: (res) => {
      toast.success(res.message || 'Broadcast sent successfully!');
      setBroadcastMessage('');
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to send broadcast');
    }
  });

  const handleSave = (id: string) => {
    const newValue = editedValues[id];
    if (newValue === undefined) return;
    updateMutation.mutate({ id, value: newValue });
  };

  if (fetchState === 'loading') {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 motion-safe:animate-spin text-primary" /></div>;
  }
  
  if (fetchState === 'error') {
    return <div className="flex h-96 items-center justify-center text-danger font-medium">Error loading settings.</div>;
  }

  const groupedSettings = settings.reduce<Record<string, PlatformSetting[]>>((acc, curr) => {
    const cat = curr.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-secondary mt-1">Configure global SaaS limits, master credentials, and system defaults.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(groupedSettings).map(([category, items]) => (
            <div key={category} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground uppercase">{category}</h2>
              </div>

              <div className="space-y-4 text-sm">
                {items.map(setting => {
                  const hasChanges = editedValues[setting.id] !== undefined && editedValues[setting.id] !== setting.value;
                  const currentValue = editedValues[setting.id] !== undefined ? editedValues[setting.id] : setting.value;

                  return (
                    <div key={setting.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{setting.key}</h3>
                        <p className="text-xs text-secondary mt-1">{setting.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {setting.dataType === 'boolean' ? (
                          <SearchableDropdown
                            value={String(currentValue)}
                            onChange={(val) => setEditedValues(prev => ({ ...prev, [setting.id]: String(val) }))}
                            className="w-32"
                            options={[
                              { label: 'Enabled', value: 'true' },
                              { label: 'Disabled', value: 'false' }
                            ]}
                          />
                        ) : (
                          <input
                            type={setting.dataType === 'number' ? 'number' : 'text'}
                            value={currentValue}
                            onChange={(e) => setEditedValues(prev => ({ ...prev, [setting.id]: e.target.value }))}
                            className="bg-input border border-border text-foreground rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
                          />
                        )}
                        {hasChanges && (
                          <button
                            onClick={() => handleSave(setting.id)}
                            disabled={updateMutation.isPending && updateMutation.variables?.id === setting.id}
                            className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg motion-safe:transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <BellRing className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-bold text-foreground">Global Broadcast</h2>
            </div>
            <p className="text-sm text-secondary mb-4">Send a push notification to all Admins across all 50+ gyms.</p>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. System maintenance at 2AM EST..."
              className="w-full bg-input border border-border text-foreground rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:border-primary motion-safe:transition-colors"
            />
            <button 
              onClick={() => broadcastMutation.mutate(broadcastMessage)}
              disabled={!broadcastMessage.trim() || broadcastMutation.isPending}
              className="mt-2 w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 rounded-lg motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {broadcastMutation.isPending && <Loader2 className="w-4 h-4 motion-safe:animate-spin" />}
              Broadcast Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

