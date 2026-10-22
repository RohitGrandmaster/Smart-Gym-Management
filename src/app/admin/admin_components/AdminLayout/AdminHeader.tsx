// RESPONSIBILITY: Renders the fixed top navigation bar — page title, global search, theme toggle, notifications dropdown, and user profile dropdown. No API calls.
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Search, LogOut, Settings, User, X, Menu, Building2 } from 'lucide-react';
import Link from 'next/link';
import { getUser, logout } from '@/lib/api';
import { ADMIN_PLACEHOLDER_NOTIFICATIONS } from '@/app/admin/admin_utils/AdminSharedConstants';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAdminGlobalStore } from '@/app/admin/admin_store/useAdminGlobalStore';
import { useAdminBranchesData } from '@/app/admin/admin_store/useAdminBranchesData';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';
import { ADMIN_MOCK_MEMBERS } from '@/app/admin/members/members_utils/AdminMembersSharedConstants';
import type { AdminHeaderProps } from '@/app/admin/admin_components/AdminLayout/AdminLayoutTypes';
import type { Branch } from '@/app/admin/admin_store/useAdminGlobalStore';

const STATUS_STYLES: Record<string, string> = {
  active: 'text-success bg-success/10 border-success/20',
  expired: 'text-danger bg-danger/10 border-danger/20',
  pending: 'text-warning bg-warning/10 border-warning/20',
  frozen: 'text-info bg-info/10 border-info/20',
};

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState(ADMIN_PLACEHOLDER_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const user = getUser();
  const { selectedBranchId, setSelectedBranchId } = useAdminGlobalStore();
  const { data: branchesData = [] } = useAdminBranchesData();
  const branches = Array.isArray(branchesData) ? branchesData : [];

  // Filter real mock members by search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ADMIN_MOCK_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.email.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const removeNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const branchOptions = [
    { value: 'all', label: 'All Branches (Aggregate)' },
    ...(branches as Branch[]).map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          className="p-2 -ml-3 text-secondary hover:text-foreground motion-safe:transition-colors bg-input hover:bg-background rounded-lg border border-border"
          onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
          aria-label="Toggle Sidebar"
        >
          <Menu size={18} strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">

        {/* Global Member Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={15} className="text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            className="w-56 pl-9 pr-4 py-2 bg-input border border-border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground placeholder:text-secondary"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            aria-label="Search members globally"
          />
          {showSearch && searchQuery && (
            <div className="absolute top-full mt-2 w-72 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex justify-between items-center px-3 py-2 border-b border-border">
                <p className="text-xs text-secondary uppercase font-bold tracking-wider">
                  {searchResults.length > 0 ? `${searchResults.length} result${searchResults.length > 1 ? 's' : ''}` : 'No results'}
                </p>
                <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="text-secondary hover:text-foreground" aria-label="Clear search">
                  <X size={13} />
                </button>
              </div>
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-secondary">No members found for "{searchQuery}"</div>
              ) : (
                <>
                  {searchResults.map((m) => (
                    <Link
                      key={m.id}
                      href="/admin/members"
                      onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                      className="flex items-center justify-between px-3 py-2.5 hover:bg-input motion-safe:transition-colors border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {m.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                          <p className="text-xs text-secondary truncate">{m.branchName}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ml-2 ${STATUS_STYLES[m.status] ?? 'text-secondary bg-input border-border'}`}>
                        {m.status}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/admin/members"
                    onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                    className="block px-3 py-2.5 text-center text-xs font-bold text-primary hover:bg-input motion-safe:transition-colors border-t border-border"
                  >
                    View all members →
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Branch Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5">
          <Building2 size={15} className="text-primary flex-shrink-0" />
          <AdminSearchableDropdown
            options={branchOptions}
            value={selectedBranchId}
            onChange={(val) => setSelectedBranchId(val as string)}
            className="w-52"
          />
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-secondary hover:text-foreground hover:bg-input rounded-lg motion-safe:transition-colors border border-transparent hover:border-border"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={2} />
            {notifications.some((n) => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-popover rounded-xl shadow-2xl border border-border overflow-hidden z-30">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-secondary hover:text-foreground" aria-label="Close notifications"><X size={15} /></button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-secondary">No new notifications</div>
                ) : notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 border-b border-border hover:bg-input motion-safe:transition-colors cursor-pointer relative group ${n.unread ? 'bg-primary-subtle' : ''}`}>
                    <p className={`text-sm pr-6 ${n.unread ? 'text-foreground font-medium' : 'text-secondary'}`}>{n.text}</p>
                    <span className="text-xs text-secondary mt-1 block">{n.time}</span>
                    <button onClick={(e) => removeNotification(n.id, e)} className="absolute right-3 top-3 text-secondary hover:text-danger opacity-0 group-hover:opacity-100 motion-safe:transition-opacity" aria-label="Remove notification">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-border">
                <Link href="/admin/notifications" onClick={() => setShowNotifications(false)} className="text-sm font-medium text-primary hover:underline">
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer motion-safe:transition-transform hover:scale-105 border border-primary/30 bg-primary"
            aria-label="Profile menu"
          >
            {mounted ? (user?.name?.charAt(0)?.toUpperCase() ?? 'A') : 'A'}
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-popover rounded-xl shadow-2xl border border-border overflow-hidden z-30">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{mounted ? (user?.name ?? 'Admin') : 'Admin'}</p>
                <p className="text-xs text-secondary">{mounted ? (user?.email ?? '') : ''}</p>
                {mounted && user?.role && <p className="text-xs text-warning font-medium mt-0.5">{user.role}</p>}
              </div>
              <div className="py-1">
                <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors" onClick={() => setShowProfile(false)}>
                  <User size={15} /> My Profile
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors" onClick={() => setShowProfile(false)}>
                  <Settings size={15} /> Settings
                </Link>
              </div>
              <div className="border-t border-border py-1">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger-bg font-medium motion-safe:transition-colors" onClick={() => { setShowProfile(false); logout(); }}>
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
