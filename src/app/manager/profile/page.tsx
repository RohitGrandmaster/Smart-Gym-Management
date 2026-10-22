'use client';

import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { getUser } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function ManagerSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const user = getUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-full">
      <ManagerHeader title="My Profile & Settings" subtitle="Manage your personal account details" />
      
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {mounted ? (user?.name?.charAt(0)?.toUpperCase() || 'M') : 'M'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{mounted ? (user?.name || 'Manager') : 'Manager'}</h2>
              <p className="text-secondary mt-1">{mounted ? (user?.role || 'GYM MANAGER') : 'GYM MANAGER'}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-bg text-success text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                Active Account
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <User size={18} className="text-primary" /> Personal Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={mounted ? (user?.name || 'Manager') : 'Manager'}
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-3 text-secondary" />
                  <input 
                    type="email" 
                    defaultValue={mounted ? (user?.email || 'manager@gymsmart.in') : 'manager@gymsmart.in'}
                    className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-3 text-secondary" />
                  <input 
                    type="tel" 
                    defaultValue="+91 9876543210"
                    className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock size={18} className="text-primary" /> Security
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password"
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-border flex justify-end">
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary/20">
              <Save size={18} /> Save Changes
            </button>
          </div>

          <div className="mt-8 bg-warning-bg border border-warning/30 rounded-xl p-4 text-sm text-warning flex items-start gap-3">
            <div className="mt-0.5">⚠️</div>
            <div>
              <strong className="block mb-1">Manager Access Note:</strong>
              You do not have permission to modify global gym settings, roles, billing configurations, or backup data. To request a change in global gym configuration, please contact the Super Admin using the Help & Support module.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
