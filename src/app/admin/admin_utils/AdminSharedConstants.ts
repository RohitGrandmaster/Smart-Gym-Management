// RESPONSIBILITY: Centralized constants shared across all ADMIN modules — nav items, placeholder notifications, gym identity (name/phone), sensitive data masking utility, and pagination page size.
import {
  LayoutDashboard, ClipboardList, FileBarChart,
  IndianRupee, Settings, Building2, Users, ShieldAlert, Gauge, Bell,
  BarChart3, GitCompare, Tag, ShieldCheck, Wallet, Ban, Megaphone, Download, Activity,
  CreditCard, BellRing
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { href: '/admin/dashboard',           label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/admin/branches',            label: 'Branches',         icon: Building2 },
  { href: '/admin/members',             label: 'Members',          icon: Users },
  { href: '/admin/hr',                  label: 'HR & Managers',    icon: Users },
  { href: '/admin/plans',               label: 'Plans',            icon: ClipboardList },
  { href: '/admin/sales',               label: 'Sales & Reports',  icon: FileBarChart },
  { href: '/admin/finance',             label: 'Finance',          icon: IndianRupee },
  { href: '/admin/reports',             label: 'Reports',          icon: BarChart3 },
  { href: '/admin/gym-comparison',      label: 'Gym Comparison',   icon: GitCompare },
  { href: '/admin/payouts',             label: 'Payouts',          icon: Wallet },
  { href: '/admin/coupons',             label: 'Coupons',          icon: Tag },
  { href: '/admin/permissions',         label: 'Permissions',      icon: ShieldCheck },
  { href: '/admin/blacklist',           label: 'Blacklist',        icon: Ban },
  { href: '/admin/bulk-communications', label: 'Bulk Comms',       icon: Megaphone },
  { href: '/admin/announcements',       label: 'Announcements',    icon: BellRing },
  { href: '/admin/data-export',         label: 'Data Export',      icon: Download },
  { href: '/admin/gym-health-alerts',   label: 'Health Alerts',    icon: Activity },
  { href: '/admin/audit_logs',          label: 'Audit Logs',       icon: ShieldAlert },
  { href: '/admin/subscriptions',       label: 'Subscription',     icon: CreditCard },
  { href: '/admin/usage',               label: 'Usage & Plan',     icon: Gauge },
  { href: '/admin/notifications',       label: 'Notifications',    icon: Bell },
  { href: '/admin/settings',            label: 'Settings',         icon: Settings },
];

// TODO: Replace with real API call once Notifications backend module is built.
export const ADMIN_PLACEHOLDER_NOTIFICATIONS = [
 { id: 1, text: 'New member Amit registered', time: '5m ago', unread: true },
 { id: 2, text: 'Payment received from Rahul', time: '1h ago', unread: false },
 { id: 3, text: 'Pooja requested a trial session', time: '2h ago', unread: false },
];

export const GYM_DETAILS = {
  name: process.env.NEXT_PUBLIC_GYM_NAME || 'GymSmart Fitness',
  phone: process.env.NEXT_PUBLIC_GYM_PHONE || '+91 83479 77566'
};



export const ADMIN_ITEMS_PER_PAGE = 10;
