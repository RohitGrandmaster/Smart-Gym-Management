// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized constants shared across all TRAINER modules — nav items, placeholder notifications, gym identity (name/phone), sensitive data masking utility, and pagination page size.
import {
  LayoutDashboard, Users, Utensils, Dumbbell, CalendarCheck, Clock, Bell, User, Activity
} from 'lucide-react';

export const TRAINER_NAV_ITEMS = [
  { href: '/trainer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trainer/members', label: 'My Members', icon: Users },
  { href: '/trainer/workout', label: 'Workout & Exercises', icon: Dumbbell },
  { href: '/trainer/sessions', label: 'Sessions', icon: Clock },
  { href: '/trainer/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/trainer/library', label: 'Diet Library', icon: Utensils },
  { href: '/trainer/reports', label: 'Reports', icon: Activity },
  { href: '/trainer/notifications', label: 'Notifications', icon: Bell },
  { href: '/trainer/profile', label: 'My Profile', icon: User },
];

// TODO: Replace with real API call once Notifications backend module is built.
export const TRAINER_PLACEHOLDER_NOTIFICATIONS = [
 { id: 1, text: 'Your assigned member Amit logged a new weight', time: '5m ago', unread: true },
 { id: 2, text: 'Manager approved your leave request for tomorrow', time: '1h ago', unread: false },
 { id: 3, text: 'New member Pooja was assigned to you', time: '2h ago', unread: false },
];

export const GYM_DETAILS = {
  name: process.env.NEXT_PUBLIC_GYM_NAME || 'GymSmart Fitness',
  phone: process.env.NEXT_PUBLIC_GYM_PHONE || '+91 83479 77566'
};



export const TRAINER_ITEMS_PER_PAGE = 10;

