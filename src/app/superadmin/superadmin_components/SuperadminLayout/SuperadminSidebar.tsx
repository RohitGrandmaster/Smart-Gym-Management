'use client';
// RESPONSIBILITY: SuperadminSidebar.tsx renders the collapsible sidebar navigation for the SaaS Master Control Panel.
// Active state: gold left border + bg-primary-subtle + gold glow (Design §3).
// Sidebar footer: logout button per standard ERP shell layout.
// No business logic, no API calls — pure navigation component.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  ServerCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Ticket,
  Activity,
  HardDrive,
  DatabaseBackup,
  Receipt,
  ToggleLeft,
  DatabaseZap,
  ShieldAlert,
  Megaphone,
  Tag,
  Users,
  BarChart2,
  BarChart3,
  Gauge,
  Settings,
  Network,
  Store,
  History,
  UserPlus,
  MessageSquare,
  FileBarChart,
  Eye,
} from 'lucide-react';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { logout } from '@/lib/api';

interface SuperadminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export default function SuperadminSidebar({ isCollapsed, setIsCollapsed }: SuperadminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Listens for the global 'toggle-sidebar' event dispatched by SuperadminHeader's hamburger button.
  // Dependency: [isCollapsed, setIsCollapsed] — toggle logic needs current collapse state.
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

  // Closes the mobile drawer whenever the route changes to avoid stale open state.
  // Dependency: [pathname] — re-runs whenever navigation occurs.
  useEffect(() => {
    Promise.resolve().then(() => setIsMobileOpen(false));
  }, [pathname]);

  const navGroups = [
    {
      group: 'SaaS Business',
      items: [
        { name: 'Dashboard', href: SuperadminUrlConfig.PAGES.DASHBOARD, icon: LayoutDashboard },
        { name: 'Revenue Analytics', href: SuperadminUrlConfig.PAGES.ANALYTICS, icon: BarChart2 },
        { name: 'Subscription Plans', href: SuperadminUrlConfig.PAGES.PLANS, icon: CreditCard },
        // BarChart3 distinct from BarChart2 used by Revenue Analytics — Design §9b no icon duplication
        { name: 'Usage Meters', href: SuperadminUrlConfig.PAGES.USAGE_METERS, icon: BarChart3 },
        { name: 'Promotional Coupons', href: SuperadminUrlConfig.PAGES.COUPONS, icon: Tag },
        { name: 'Affiliate Partners', href: SuperadminUrlConfig.PAGES.AFFILIATES, icon: Users },
        { name: 'Tenants (Gyms)', href: SuperadminUrlConfig.PAGES.GYMS_LIST, icon: Building2 },
        { name: 'SaaS Invoices', href: SuperadminUrlConfig.PAGES.INVOICES, icon: Receipt },
        { name: 'Support Tickets', href: SuperadminUrlConfig.PAGES.TICKETS, icon: Ticket },
      ]
    },
    {
      group: 'Communication',
      items: [
        { name: 'Announcements', href: SuperadminUrlConfig.PAGES.BROADCASTS, icon: Megaphone },
        { name: 'Tenant Messaging', href: SuperadminUrlConfig.PAGES.MESSAGING, icon: MessageSquare },
      ]
    },
    {
      group: 'Tenants',
      items: [
        { name: 'Onboarding', href: SuperadminUrlConfig.PAGES.ONBOARDING, icon: UserPlus },
        { name: 'Portal Preview', href: SuperadminUrlConfig.PAGES.TENANT_PREVIEW, icon: Eye },
      ]
    },
    {
      group: 'Reports',
      items: [
        { name: 'Reports & Exports', href: SuperadminUrlConfig.PAGES.REPORTS, icon: FileBarChart },
      ]
    },
    {
      group: 'Product',
      items: [
        { name: 'Feature Flags', href: SuperadminUrlConfig.PAGES.FEATURES, icon: ToggleLeft },
      ]
    },
    {
      group: 'System & Infra',
      items: [
        { name: 'Infrastructure', href: SuperadminUrlConfig.PAGES.INFRASTRUCTURE, icon: HardDrive },
        { name: 'Schema Rollouts', href: SuperadminUrlConfig.PAGES.MIGRATIONS, icon: DatabaseZap },
        { name: 'Background Jobs', href: SuperadminUrlConfig.PAGES.JOBS, icon: Activity },
        { name: 'Database Backups', href: SuperadminUrlConfig.PAGES.BACKUPS, icon: DatabaseBackup },
        { name: 'System Health', href: SuperadminUrlConfig.PAGES.SYSTEM_HEALTH, icon: ServerCog },
        { name: 'Global Audit Logs', href: SuperadminUrlConfig.PAGES.GLOBAL_AUDIT, icon: History },
        { name: 'Global Settings', href: SuperadminUrlConfig.PAGES.SETTINGS, icon: Settings },
      ]
    }
  ];

  async function handleLogout() {
    await logout();
  }

  return (
    <>
      {/* Mobile Backdrop — closes sidebar when tapping outside */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden motion-safe:transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-border motion-safe:transition-all motion-safe:duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'
          } ${isMobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo / Branding Header */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-border shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Gauge size={18} className="text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground leading-tight block">GymSmart 360</span>
                <span className="text-xs text-secondary leading-none">SuperAdmin</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Gauge size={18} className="text-white" />
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <div className="hidden lg:flex items-center justify-end px-4 py-2 border-b border-border">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-3 custom-scrollbar" aria-label="Sidebar navigation">
          {navGroups.map((group) => (
            <div key={group.group}>
              {!isCollapsed && (
                <p className="text-xs font-semibold text-disabled mb-2 px-2 uppercase tracking-wider">
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isCollapsed ? item.name : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      className={`
                        relative flex items-center gap-3 rounded-lg px-3 py-2.5 motion-safe:transition-all motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                        ${isActive
                          // Design §3: Active = gold left border + primary-subtle bg + gold glow
                          ? 'bg-primary-subtle text-primary border-l-2 border-primary shadow-[0_0_15px_rgba(250,204,21,0.15)] pl-[10px]'
                          : 'text-secondary hover:bg-card hover:text-foreground border-l-2 border-transparent pl-[10px]'
                        }
                        ${isCollapsed ? 'justify-center pl-0' : ''}
                      `}
                    >
                      <Icon
                        size={18}
                        strokeWidth={2}
                        className={`shrink-0 ${isActive ? 'text-primary' : 'text-zinc-400 group-hover:text-white'}`}
                      />
                      {!isCollapsed && (
                        <span className="font-medium text-sm leading-none">{item.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer — Logout */}
        <div className="shrink-0 border-t border-border p-3">
          <button
            onClick={handleLogout}
            aria-label="Logout from SaaS Panel"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:text-danger hover:bg-danger-bg motion-safe:transition-all motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger ${isCollapsed ? 'justify-center' : ''
              }`}
          >
            <LogOut size={18} strokeWidth={2} className="shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
