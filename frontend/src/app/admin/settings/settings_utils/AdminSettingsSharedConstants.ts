// RESPONSIBILITY: Centralized constants, schema, and shared utilities for the Settings module.
import { Building, Bell, Shield, Smartphone, Settings as SettingsIcon } from 'lucide-react';

export const SETTINGS_TABS = [
  { icon: Building, title: 'Gym Profile', desc: 'Update gym name, logo, address, and contact details', color: 'text-info', bg: 'bg-info-bg' },
  { icon: Bell, title: 'Notifications', desc: 'Configure SMS, email and WhatsApp alerts', color: 'text-warning', bg: 'bg-warning-bg' },
  { icon: Shield, title: 'Roles & Permissions', desc: 'Manage admin roles and access control', color: 'text-purple', bg: 'bg-purple-bg' },
  { icon: Smartphone, title: 'App Integration', desc: 'Member app settings and configurations', color: 'text-success', bg: 'bg-success-bg' },
  { icon: SettingsIcon, title: 'General Settings', desc: 'System preferences, timezone, language', color: 'text-secondary', bg: 'bg-card' },
];

export const EMPTY_SETTINGS_FORM = {
  gymName: 'GymSmart Fitness',
  ownerName: 'Rajesh Kumar',
  phone: '+91 83479 77566',
  email: 'admin@gymsmart.in',
  city: 'Mumbai',
  gstNumber: '27AABCU9603R1ZX',
};

export const MOCK_NOTIFICATION_SETTINGS = {
  smsOnJoin: true,
  smsOnExpiry: true,
  smsOnPayment: true,
  smsOnAbsence: false,
  emailOnJoin: true,
  emailOnExpiry: true,
  emailOnPayment: false,
  emailOnAbsence: false,
  whatsappOnJoin: true,
  whatsappOnExpiry: true,
  whatsappOnPayment: true,
  whatsappOnAbsence: true,
  expiryReminderDays: '7',
  absenceThresholdDays: '3',
};

export const MOCK_ROLES = [
  { id: 'r1', name: 'Super Admin', description: 'Full access to all modules and branches', permissions: ['all'], color: 'text-danger', bg: 'bg-danger-bg', memberCount: 1 },
  { id: 'r2', name: 'Branch Manager', description: 'Manage single branch operations, members, and staff', permissions: ['members', 'finance', 'hr', 'attendance'], color: 'text-warning', bg: 'bg-warning-bg', memberCount: 3 },
  { id: 'r3', name: 'Trainer', description: 'View assigned members, mark attendance, update workouts', permissions: ['attendance', 'members_view'], color: 'text-success', bg: 'bg-success-bg', memberCount: 8 },
  { id: 'r4', name: 'Receptionist', description: 'Handle walk-ins, collect fees, manage enquiries', permissions: ['members', 'finance_collect', 'enquiries'], color: 'text-info', bg: 'bg-info-bg', memberCount: 5 },
  { id: 'r5', name: 'Accountant', description: 'View and manage financial reports and expenses', permissions: ['finance', 'reports'], color: 'text-purple', bg: 'bg-purple-bg', memberCount: 2 },
];

export const MOCK_APP_INTEGRATION = {
  memberAppEnabled: true,
  qrCheckInEnabled: true,
  onlinePaymentsEnabled: false,
  dietPlanEnabled: true,
  workoutPlanEnabled: true,
  progressTrackingEnabled: true,
  pushNotificationsEnabled: true,
  appStoreLink: 'https://apps.apple.com/gymsmart',
  playStoreLink: 'https://play.google.com/store/gymsmart',
  apiKey: 'gsk_live_••••••••••••••••••••••••',
  webhookUrl: 'https://api.gymsmart.in/webhooks/member-app',
};

export const MOCK_GENERAL_SETTINGS = {
  timezone: 'Asia/Kolkata',
  language: 'en',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  fiscalYearStart: 'April',
  autoBackup: true,
  backupFrequency: 'daily',
  dataRetentionMonths: '24',
  maintenanceMode: false,
  twoFactorAuth: false,
  sessionTimeoutMinutes: '60',
};

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'IST — Asia/Kolkata (UTC+5:30)' },
  { value: 'Asia/Dubai', label: 'GST — Asia/Dubai (UTC+4:00)' },
  { value: 'UTC', label: 'UTC — Coordinated Universal Time' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'mr', label: 'Marathi' },
];

export const BACKUP_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];
