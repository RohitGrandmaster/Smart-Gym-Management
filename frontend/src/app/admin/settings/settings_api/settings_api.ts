// RESPONSIBILITY: Provides strongly-typed network calls for the settings module.
import { apiFetch } from '@/lib/api';
import { SettingsUrlConfig } from '@/app/admin/settings/settings_url_config';

export const settingsApi = {
  fetchSettings: () => apiFetch<{ data?: Record<string, unknown>; message?: string }>(SettingsUrlConfig.BACKEND_API.BASE),
  updateSettings: (body: Record<string, unknown>) =>
    apiFetch<{ message?: string }>(SettingsUrlConfig.BACKEND_API.BASE, { method: 'POST', body: JSON.stringify(body) }),
};
