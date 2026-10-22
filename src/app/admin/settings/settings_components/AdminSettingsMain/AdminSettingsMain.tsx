// RESPONSIBILITY: Entry component for the Settings module. Wraps the UI in the context provider and handles page layout.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminSettingsNav from '@/app/admin/settings/settings_components/AdminSettingsNav/AdminSettingsNav';
import AdminSettingsContent from '@/app/admin/settings/settings_components/AdminSettingsContent/AdminSettingsContent';
import AdminSettingsBanner from '@/app/admin/settings/settings_components/AdminSettingsBanner/AdminSettingsBanner';


export default function AdminSettingsMain() {
  return (
    <div className="min-h-full pb-10 settings-module bg-background text-foreground">
      <AdminHeader title="Settings" subtitle="Configure your gym management system" />
      <div className="p-6">
        <AdminSettingsNav />
        <AdminSettingsContent />
        <AdminSettingsBanner />
      </div>
    </div>
  );
}

