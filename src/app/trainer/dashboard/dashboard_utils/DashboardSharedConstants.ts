// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized constants and status style maps for the Dashboard module.
export const DASHBOARD_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
 ACTIVE: { bg: 'bg-success-bg', text: 'text-success' },
 PENDING: { bg: 'bg-warning-bg', text: 'text-warning' },
 EXPIRED: { bg: 'bg-danger-bg', text: 'text-danger' },
};

export const DASHBOARD_PLAN_BG_COLORS: Record<string, string> = {
 BASIC: 'bg-info',
 GOLD: 'bg-warning',
 PREMIUM: 'bg-primary',
};

export const DASHBOARD_RECENT_MEMBERS_PAGE_SIZE = 5;
export const RECENT_MEMBERS_HEADERS = ['Member', 'Plan', 'Status', 'Joined', 'Amount'];

export const formatCurrency = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');


