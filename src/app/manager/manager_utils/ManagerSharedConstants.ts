// RESPONSIBILITY: Centralized constants shared across all MANAGER modules — nav items, placeholder notifications, gym identity (name/phone), sensitive data masking utility, and pagination page size.
import {
  LayoutDashboard, Users, FileBarChart,
  UserCog, ShoppingBag, Utensils, Dumbbell,
  MessageSquare, CalendarCheck, Receipt, Tags, Bell, BarChart3
} from 'lucide-react';

export const MANAGER_NAV_ITEMS = [
 { href: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
 { href: '/manager/inquiries', label: 'Inquiries (Leads)', icon: Users },
 { href: '/manager/members', label: 'Member Management', icon: Users },
 { href: '/manager/plans', label: 'Membership / Plans', icon: Tags },
 { href: '/manager/sales', label: 'Payment & Billing', icon: FileBarChart },
 { href: '/manager/hr', label: 'Trainer Management', icon: UserCog },
 { href: '/manager/attendance', label: 'Attendance', icon: CalendarCheck },
 { href: '/manager/workout', label: 'Workout Management', icon: Dumbbell },
 { href: '/manager/library', label: 'Diet Management', icon: Utensils },
 { href: '/manager/pt', label: 'Personal Training', icon: Users },
 { href: '/manager/expenses', label: 'Expenses', icon: Receipt },
 { href: '/manager/reports', label: 'Reports', icon: FileBarChart },
 { href: '/manager/notifications', label: 'Notifications', icon: MessageSquare },
 { href: '/manager/support', label: 'Help & Support', icon: MessageSquare }
];

// TODO: Replace with real API call once Notifications backend module is built.
export const MANAGER_PLACEHOLDER_NOTIFICATIONS = [
 { id: 1, text: 'New member Amit registered', time: '5m ago', unread: true },
 { id: 2, text: 'Payment received from Rahul', time: '1h ago', unread: false },
 { id: 3, text: 'Pooja requested a trial session', time: '2h ago', unread: false },
];

export const GYM_DETAILS = {
  name: process.env.NEXT_PUBLIC_GYM_NAME || 'GymSmart Fitness',
  phone: process.env.NEXT_PUBLIC_GYM_PHONE || '+91 83479 77566'
};



export const MANAGER_ITEMS_PER_PAGE = 10;
