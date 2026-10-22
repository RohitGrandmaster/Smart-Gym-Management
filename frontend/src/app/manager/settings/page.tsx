'use client';

import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import { Settings as SettingsIcon, Bell, Moon, Globe, Save } from 'lucide-react';
import { useState } from 'react';

export default function ManagerSettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="min-h-full">
      <ManagerHeader title="App Settings" subtitle="Manage your preferences and app behavior" />
      
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          
          <div className="space-y-8">
            {/* Preferences */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-3">
                <Globe size={18} className="text-primary" /> Region & Language
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Language</label>
                  <select className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all">
                    <option>English (US)</option>
                    <option>Hindi (IN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Timezone</label>
                  <select className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-3">
                <Bell size={18} className="text-primary" /> Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-3 bg-input rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-xs text-secondary mt-0.5">Receive alerts for new members and payments</p>
                  </div>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-primary' : 'bg-gray-400'}`} onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 bg-input rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-foreground">Email Daily Reports</p>
                    <p className="text-xs text-secondary mt-0.5">Get daily summary of collections and attendance</p>
                  </div>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${emailAlerts ? 'bg-primary' : 'bg-gray-400'}`} onClick={() => setEmailAlerts(!emailAlerts)}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </label>
              </div>
            </div>

          </div>
          
          <div className="mt-10 pt-6 border-t border-border flex justify-end">
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary/20">
              <Save size={18} /> Save Settings
            </button>
          </div>

          <div className="mt-8 bg-info-bg border border-info/30 rounded-xl p-4 text-sm text-info flex items-start gap-3">
            <div className="mt-0.5">ℹ️</div>
            <div>
              <strong className="block mb-1">Note:</strong>
              Theme (Dark/Light mode) can be toggled instantly using the moon/sun icon in the top navigation bar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
