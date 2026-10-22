// RESPONSIBILITY: Renders the collapsible left navigation sidebar with nav items, user identity footer, and mobile drawer. No API calls.
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUser } from '@/lib/api';
import { MANAGER_NAV_ITEMS } from '@/app/manager/manager_utils/ManagerSharedConstants';

import type { ManagerSidebarProps } from '@/app/manager/manager_components/ManagerLayout/ManagerLayoutTypes';

export default function ManagerSidebar({ isCollapsed, setIsCollapsed }: ManagerSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = getUser();

  // Sets mounted=true once on client-side hydration to safely read user data (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Listens for the global 'toggle-sidebar' event dispatched by ManagerHeader's hamburger button.
  // On mobile (<1024px) toggles the drawer; on desktop toggles the collapsed icon-only mode.
  useEffect(() => {
    const handleToggle = () => {
      if (window.innerWidth < 1024) {
        setIsMobileOpen(v => !v);
      } else {
        setIsCollapsed(!isCollapsed);
      }
    };
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, [isCollapsed, setIsCollapsed]);

  // Closes the mobile drawer whenever the route changes (user navigated to a new page).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full bg-sidebar border-r border-border z-50 flex flex-col motion-safe:transition-all motion-safe:duration-300 ${
        isCollapsed ? 'lg:w-23' : 'lg:w-64'
      } ${
        isMobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'
      }`}>

        {/* Logo & Toggle */}
        <div className="flex items-center justify-center px-4 py-5 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image src="/logo.png" alt="GymSmart MANAGER" width={44} height={44} className="object-contain min-w-11 rounded-lg" />
            {(!isCollapsed || isMobileOpen) && (
              <div className="whitespace-nowrap transition-opacity duration-300 flex flex-col">
                <span className="text-foreground font-bold text-lg leading-tight tracking-tight">GymSmart</span>
                <span className="text-xs text-warning font-bold uppercase tracking-wider -mt-0.5">MANAGER System</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {MANAGER_NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            const showLabel = !isCollapsed || isMobileOpen;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!showLabel ? item.label : ''}
                className={`flex items-center gap-3 py-2.5 rounded-xl font-medium motion-safe:transition-all motion-safe:duration-200 group cursor-pointer ${
                  !showLabel ? 'justify-center px-0' : 'px-3.5'
                } ${
                  active
                    ? 'bg-primary-subtle text-primary border-l-2 border-primary'
                    : 'text-secondary hover:text-primary hover:bg-primary-subtle border-l-2 border-transparent'
                }`}
                style={active ? { boxShadow: '0 0 15px rgba(250,204,21,0.15)' } : undefined}
              >
                <Icon size={18} strokeWidth={2} className={active ? 'text-primary' : 'text-secondary group-hover:text-primary motion-safe:transition-colors'} />
                {showLabel && <span className="text-sm whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className={`px-4 py-4 border-t border-border bg-header flex items-center ${(!isCollapsed || isMobileOpen) ? 'gap-3' : 'justify-center'}`}>
          <div className="w-10 h-10 min-w-10 rounded-full flex items-center justify-center text-white text-sm font-bold border border-white/10 bg-primary">
            {mounted ? (user?.name?.charAt(0)?.toUpperCase() || 'A') : 'A'}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="whitespace-nowrap overflow-hidden flex-1">
              <div className="text-foreground text-sm font-bold truncate">{mounted ? (user?.name || 'Manager User') : 'Manager User'}</div>
              <div className="text-secondary text-xs truncate">{mounted ? (user?.role || 'Gym Manager') : 'Gym Manager'}</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
