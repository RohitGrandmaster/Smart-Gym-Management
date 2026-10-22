// RESPONSIBILITY: Static hardcoded preview data and style constants for the Tenant Preview module.
// All mock data lives here so the client component stays pure UI. Replace with API calls tomorrow.

export type AlertType = 'warning' | 'info' | 'success';

/** Minimal tenant shape used by the tenant-preview module — self-contained, no cross-module import. */
export interface PreviewTenant {
  id: string;
  name: string;
  ownerName: string;
  adminEmail: string;
  plan: string;
  status: string;
}

export interface TenantPreviewAlert {
  type: AlertType;
  message: string;
}

export interface TenantPreviewRecentMember {
  name: string;
  plan: string;
  joinedAt: string;
}

export interface TenantPreviewData {
  memberCount: number;
  activeMembers: number;
  monthlyRevenue: number;
  pendingPayments: number;
  recentMembers: TenantPreviewRecentMember[];
  alerts: TenantPreviewAlert[];
}

export const ALERT_STYLES: Record<AlertType, string> = {
  warning: 'bg-warning/10 border-warning/20 text-warning',
  info: 'bg-info/10 border-info/20 text-info',
  success: 'bg-success/10 border-success/20 text-success',
};

export const TENANT_STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-success/10 text-success border-success/30',
  TRIAL: 'bg-primary/10 text-primary border-primary/30',
  SUSPENDED: 'bg-danger/10 text-danger border-danger/30',
  CANCELLED: 'bg-danger/10 text-danger border-danger/30',
};

/** Threshold above which pending payments count is shown in danger color. */
export const PENDING_PAYMENTS_DANGER_THRESHOLD = 5;

/**
 * Self-contained tenant list for the tenant-preview module.
 * Rule 63: Zero cross-module imports — never import from gyms module.
 * Replace with API call to GET /superadmin/tenants when backend is ready.
 */
export const PREVIEW_TENANTS: PreviewTenant[] = [
  { id: 'gym-1234', name: 'Flex Fitness Central', ownerName: 'Sarah Connor', adminEmail: 'sarah@flexfitness.com', plan: 'ENTERPRISE', status: 'ACTIVE' },
  { id: 'gym-5678', name: 'Iron Temple Barbell Club', ownerName: 'Arnold Strong', adminEmail: 'arnold@irontemple.com', plan: 'PRO', status: 'ACTIVE' },
  { id: 'gym-9012', name: 'Zenith Yoga & Pilates', ownerName: 'Mia Wong', adminEmail: 'mia@zenithyoga.com', plan: 'STARTER', status: 'SUSPENDED' },
];

export const TENANT_PREVIEW_DATA: Record<string, TenantPreviewData> = {
  'gym-1234': {
    memberCount: 1250, activeMembers: 1180, monthlyRevenue: 12500, pendingPayments: 3,
    recentMembers: [
      { name: 'Rahul Verma', plan: 'Monthly', joinedAt: '2024-05-22' },
      { name: 'Sneha Iyer', plan: 'Quarterly', joinedAt: '2024-05-21' },
      { name: 'Arjun Das', plan: 'Annual', joinedAt: '2024-05-20' },
    ],
    alerts: [
      { type: 'success', message: '3 new members joined this week.' },
      { type: 'info', message: 'Monthly report is ready to download.' },
    ],
  },
  'gym-5678': {
    memberCount: 450, activeMembers: 420, monthlyRevenue: 4500, pendingPayments: 8,
    recentMembers: [
      { name: 'Vikram Singh', plan: 'Monthly', joinedAt: '2024-05-21' },
      { name: 'Pooja Reddy', plan: 'Monthly', joinedAt: '2024-05-19' },
    ],
    alerts: [
      { type: 'warning', message: '8 payments are pending this month.' },
      { type: 'info', message: 'Trial ends in 6 days. Upgrade to keep access.' },
    ],
  },
  'gym-9012': {
    memberCount: 85, activeMembers: 70, monthlyRevenue: 850, pendingPayments: 2,
    recentMembers: [
      { name: 'Ananya Pillai', plan: 'Monthly', joinedAt: '2024-05-20' },
    ],
    alerts: [
      { type: 'warning', message: 'Email not verified. Please verify to unlock all features.' },
    ],
  },
};
