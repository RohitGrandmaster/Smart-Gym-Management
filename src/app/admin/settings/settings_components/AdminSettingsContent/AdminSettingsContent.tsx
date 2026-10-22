// RESPONSIBILITY: Renders the active settings section content based on the selected nav tab.
'use client';

import { useState } from 'react';
import { RefreshCw, Save, CheckCircle, XCircle, Shield, Smartphone, Bell, Settings, Copy, ExternalLink, Users, Plus } from 'lucide-react';
import { useAdminSettingsLogic } from '@/app/admin/settings/settings_context/useAdminSettingsLogic';
import {
  MOCK_NOTIFICATION_SETTINGS,
  MOCK_ROLES,
  MOCK_APP_INTEGRATION,
  MOCK_GENERAL_SETTINGS,
  TIMEZONE_OPTIONS,
  LANGUAGE_OPTIONS,
  BACKUP_FREQUENCY_OPTIONS,
} from '@/app/admin/settings/settings_utils/AdminSettingsSharedConstants';
import toast from 'react-hot-toast';

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <span className="text-sm text-foreground group-hover:text-primary motion-safe:transition-colors">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full motion-safe:transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-input border border-border'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow motion-safe:transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </label>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState(MOCK_NOTIFICATION_SETTINGS);
  const toggle = (key: keyof typeof MOCK_NOTIFICATION_SETTINGS) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const channels = [
    { key: 'sms', label: 'SMS', color: 'text-info' },
    { key: 'email', label: 'Email', color: 'text-warning' },
    { key: 'whatsapp', label: 'WhatsApp', color: 'text-success' },
  ] as const;

  const events = [
    { key: 'OnJoin', label: 'New Member Joins' },
    { key: 'OnExpiry', label: 'Membership Expiry Reminder' },
    { key: 'OnPayment', label: 'Payment Received' },
    { key: 'OnAbsence', label: 'Member Absence Alert' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-border">
              <th className="px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Event</th>
              {channels.map(c => (
                <th key={c.key} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center ${c.color}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map(ev => (
              <tr key={ev.key} className="hover:bg-input/30 motion-safe:transition-colors">
                <td className="px-4 py-3 text-sm text-foreground font-medium">{ev.label}</td>
                {channels.map(c => {
                  const k = `${c.key}${ev.key}` as keyof typeof MOCK_NOTIFICATION_SETTINGS;
                  return (
                    <td key={c.key} className="px-4 py-3 text-center">
                      <button onClick={() => toggle(k)} aria-label={`Toggle ${c.label} for ${ev.label}`}>
                        {settings[k]
                          ? <CheckCircle size={20} className="text-success mx-auto" />
                          : <XCircle size={20} className="text-secondary mx-auto" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-border">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Expiry Reminder (days before)</label>
          <input
            type="number" min="1" max="30"
            value={settings.expiryReminderDays}
            onChange={e => setSettings(prev => ({ ...prev, expiryReminderDays: e.target.value }))}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Absence Alert Threshold (days)</label>
          <input
            type="number" min="1" max="30"
            value={settings.absenceThresholdDays}
            onChange={e => setSettings(prev => ({ ...prev, absenceThresholdDays: e.target.value }))}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

function RolesTab() {
  const [roles] = useState(MOCK_ROLES);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary">{roles.length} roles configured</p>
        <button
          onClick={() => toast.success('Role creation coming soon!')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover motion-safe:transition-colors"
        >
          <Plus size={14} /> Add Role
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => setSelected(selected === role.id ? null : role.id)}
            className={`text-left p-4 rounded-xl border motion-safe:transition-all ${selected === role.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${role.bg}`}>
                <Shield size={18} className={role.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-foreground text-sm">{role.name}</p>
                  <span className="flex items-center gap-1 text-xs text-secondary">
                    <Users size={12} /> {role.memberCount}
                  </span>
                </div>
                <p className="text-xs text-secondary mt-1 leading-relaxed">{role.description}</p>
              </div>
            </div>
            {selected === role.id && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map(p => (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{p}</span>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={e => { e.stopPropagation(); toast.success(`Editing ${role.name}...`); }}
                    className="flex-1 py-1.5 text-xs font-semibold border border-border rounded-lg text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors"
                  >
                    Edit Role
                  </button>
                  {role.name !== 'Super Admin' && (
                    <button
                      onClick={e => { e.stopPropagation(); toast.error(`Cannot delete role with ${role.memberCount} members`); }}
                      className="flex-1 py-1.5 text-xs font-semibold border border-danger/30 rounded-lg text-danger hover:bg-danger-bg motion-safe:transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function AppIntegrationTab() {
  const [settings, setSettings] = useState(MOCK_APP_INTEGRATION);
  const toggle = (key: keyof typeof MOCK_APP_INTEGRATION) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const features = [
    { key: 'memberAppEnabled' as const, label: 'Member Mobile App' },
    { key: 'qrCheckInEnabled' as const, label: 'QR Code Check-In' },
    { key: 'onlinePaymentsEnabled' as const, label: 'Online Payments' },
    { key: 'dietPlanEnabled' as const, label: 'Diet Plan Module' },
    { key: 'workoutPlanEnabled' as const, label: 'Workout Plan Module' },
    { key: 'progressTrackingEnabled' as const, label: 'Progress Tracking' },
    { key: 'pushNotificationsEnabled' as const, label: 'Push Notifications' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map(f => (
          <div key={f.key} className="flex items-center justify-between p-3 bg-input/40 rounded-xl border border-border">
            <ToggleSwitch
              checked={settings[f.key] as boolean}
              onChange={() => toggle(f.key)}
              label={f.label}
            />
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-2 border-t border-border">
        <p className="text-sm font-semibold text-foreground">App Store Links</p>
        {[
          { label: 'App Store (iOS)', key: 'appStoreLink' as const, icon: ExternalLink },
          { label: 'Play Store (Android)', key: 'playStoreLink' as const, icon: ExternalLink },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={settings[f.key]}
                onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="flex-1 px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
              />
              <a href={settings[f.key]} target="_blank" rel="noopener noreferrer"
                className="p-2.5 border border-border rounded-lg text-secondary hover:text-primary hover:bg-input motion-safe:transition-colors"
                aria-label="Open link">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-2 border-t border-border">
        <p className="text-sm font-semibold text-foreground">API Configuration</p>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">API Key</label>
          <div className="flex gap-2">
            <input
              type="text" readOnly value={settings.apiKey}
              className="flex-1 px-3 py-2.5 text-sm border border-border rounded-lg bg-input text-secondary cursor-default"
            />
            <button
              onClick={() => { navigator.clipboard.writeText('gsk_live_demo_key'); toast.success('API key copied!'); }}
              className="p-2.5 border border-border rounded-lg text-secondary hover:text-primary hover:bg-input motion-safe:transition-colors"
              aria-label="Copy API key"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Webhook URL</label>
          <input
            type="url"
            value={settings.webhookUrl}
            onChange={e => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

function GeneralSettingsTab() {
  const [settings, setSettings] = useState(MOCK_GENERAL_SETTINGS);
  const set = (key: keyof typeof MOCK_GENERAL_SETTINGS, value: string | boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const selectFields = [
    { label: 'Timezone', key: 'timezone' as const, options: TIMEZONE_OPTIONS },
    { label: 'Language', key: 'language' as const, options: LANGUAGE_OPTIONS },
    { label: 'Backup Frequency', key: 'backupFrequency' as const, options: BACKUP_FREQUENCY_OPTIONS },
  ];

  const toggleFields = [
    { key: 'autoBackup' as const, label: 'Automatic Daily Backup' },
    { key: 'maintenanceMode' as const, label: 'Maintenance Mode' },
    { key: 'twoFactorAuth' as const, label: 'Two-Factor Authentication (2FA)' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {selectFields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
            <select
              value={settings[f.key] as string}
              onChange={e => set(f.key, e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
            >
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Date Format</label>
          <select
            value={settings.dateFormat}
            onChange={e => set('dateFormat', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Session Timeout (minutes)</label>
          <input
            type="number" min="15" max="480"
            value={settings.sessionTimeoutMinutes}
            onChange={e => set('sessionTimeoutMinutes', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Data Retention (months)</label>
          <input
            type="number" min="6" max="120"
            value={settings.dataRetentionMonths}
            onChange={e => set('dataRetentionMonths', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-border">
        <p className="text-sm font-semibold text-foreground">System Toggles</p>
        {toggleFields.map(f => (
          <div key={f.key} className="flex items-center justify-between p-3 bg-input/40 rounded-xl border border-border">
            <ToggleSwitch
              checked={settings[f.key] as boolean}
              onChange={v => set(f.key, v)}
              label={f.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSettingsContent() {
  const { activeTab, form, handleChange, saving, handleSave, fetchSettings } = useAdminSettingsLogic();

  const gymProfileFields = [
    { label: 'Gym Name', field: 'gymName', type: 'text' },
    { label: 'Owner Name', field: 'ownerName', type: 'text' },
    { label: 'Phone Number', field: 'phone', type: 'tel' },
    { label: 'Email', field: 'email', type: 'email' },
    { label: 'City', field: 'city', type: 'text' },
    { label: 'GST Number', field: 'gstNumber', type: 'text' },
  ];

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border mt-6">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bold text-foreground text-lg">{activeTab}</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchSettings}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-input text-secondary flex items-center gap-2 motion-safe:transition-colors"
          >
            <RefreshCw size={14} /> Reset
          </button>
          <button
            onClick={() => { handleSave(); toast.success('Settings saved!'); }}
            disabled={saving}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 hover:bg-primary-hover motion-safe:transition-colors"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Gym Profile' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gymProfileFields.map(f => (
              <div key={f.field}>
                <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as Record<string, string>)[f.field] || ''}
                  onChange={e => handleChange(f.field, e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Notifications' && <NotificationsTab />}
        {activeTab === 'Roles & Permissions' && <RolesTab />}
        {activeTab === 'App Integration' && <AppIntegrationTab />}
        {activeTab === 'General Settings' && <GeneralSettingsTab />}
      </div>
    </div>
  );
}
