// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the fixed top navigation bar — page title, global search, theme toggle, notifications dropdown, and user profile dropdown. No API calls.
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, Settings, User, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { getUser, logout } from '@/lib/api';
import { TRAINER_PLACEHOLDER_NOTIFICATIONS } from '@/app/trainer/trainer_utils/TrainerSharedConstants';
import { ThemeToggle } from '@/components/ThemeToggle';

import type { TrainerHeaderProps } from '@/app/trainer/trainer_components/TrainerLayout/TrainerLayoutTypes';

export default function TrainerHeader({ title, subtitle }: TrainerHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(TRAINER_PLACEHOLDER_NOTIFICATIONS);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const user = getUser();

  // Sets mounted=true once on client-side hydration to safely read user data (avoids SSR mismatch).
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // Attaches click-outside listener once on mount to close notification/profile dropdowns on outside click.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex flex-wrap items-center gap-4">
        <button
          className="p-2 -ml-3 text-secondary hover:text-foreground motion-safe:transition-colors bg-input hover:bg-background rounded-lg border border-border"
          onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">


        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-secondary hover:text-foreground hover:bg-input rounded-lg motion-safe:transition-colors border border-transparent hover:border-border"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-popover rounded-xl shadow-2xl border border-border overflow-hidden z-30">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-header">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-secondary hover:text-foreground"><X size={16} /></button>
              </div>
              <div className="max-h-75 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`group px-4 py-3 border-b border-border hover:bg-input motion-safe:transition-colors ${n.unread ? 'bg-primary-subtle' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="cursor-pointer flex-1">
                          <p className={`text-sm ${n.unread ? 'text-foreground font-medium' : 'text-secondary'}`}>{n.text}</p>
                          <span className="text-xs text-secondary mt-1 block">{n.time}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setNotifications(prev => prev.filter(notif => notif.id !== n.id)); }}
                          className="text-secondary hover:text-foreground opacity-0 group-hover:opacity-100 motion-safe:transition-opacity p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-secondary">
                    No new notifications
                  </div>
                )}
              </div>
              <div className="p-3 text-center border-t border-border bg-header">
                <Link 
                  href="/trainer/notifications"
                  onClick={() => setShowNotifications(false)} 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer motion-safe:transition-transform motion-safe:hover:scale-105 border border-white/10 bg-primary"
          >
            {mounted ? (user?.name?.charAt(0)?.toUpperCase() || 'A') : 'A'}
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-popover rounded-xl shadow-2xl border border-border overflow-hidden z-30">
              <div className="px-4 py-3 border-b border-border bg-header">
                <p className="text-sm font-semibold text-foreground">{mounted ? (user?.name || 'Trainer') : 'Trainer'}</p>
                <p className="text-xs text-secondary">{mounted ? (user?.email || '') : ''}</p>
                {(mounted && user?.role) && <p className="text-xs text-warning font-medium mt-0.5">{user.role}</p>}
              </div>
              <div className="py-1">
                <Link href="/trainer/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors" onClick={() => setShowProfile(false)}>
                  <User size={15} /> My Profile
                </Link>
                <Link href="/trainer/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors" onClick={() => setShowProfile(false)}>
                  <Settings size={15} /> Settings
                </Link>
              </div>
              <div className="border-t border-border py-1 bg-header">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger-bg font-medium motion-safe:transition-colors"
                  onClick={() => { setShowProfile(false); logout(); }}
                >
                  <LogOut size={15} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

