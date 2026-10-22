// RESPONSIBILITY: Static hardcoded data and style constants for the Reports module.
// All mock data lives here so the client component stays pure UI. Replace with API calls tomorrow.

import type { RevenueRow, ChurnRecord, TenantHealthScore } from '@/app/superadmin/reports/reports_types/reports_types';

/** Premium gold gradient applied to all KPI stat cards. Design §5a. */
export const KPI_CARD_GRADIENT = 'linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))';

export const REVENUE_DATA: RevenueRow[] = [
  { month: 'Dec 23', mrr: 82000, newRevenue: 12000, churnedRevenue: 3000, netRevenue: 91000, tenantCount: 18 },
  { month: 'Jan 24', mrr: 91000, newRevenue: 15000, churnedRevenue: 6000, netRevenue: 100000, tenantCount: 21 },
  { month: 'Feb 24', mrr: 100000, newRevenue: 18000, churnedRevenue: 9000, netRevenue: 109000, tenantCount: 24 },
  { month: 'Mar 24', mrr: 109000, newRevenue: 22000, churnedRevenue: 13000, netRevenue: 118000, tenantCount: 27 },
  { month: 'Apr 24', mrr: 118000, newRevenue: 25000, churnedRevenue: 15000, netRevenue: 128000, tenantCount: 31 },
  { month: 'May 24', mrr: 128000, newRevenue: 30000, churnedRevenue: 20000, netRevenue: 138000, tenantCount: 34 },
];

export const CHURN_DATA: ChurnRecord[] = [
  { id: 'c-001', gymName: 'Peak Performance Studio', ownerName: 'James Rodrigues', plan: 'PRO', churnedAt: '2024-04-15', reason: 'Too expensive', mrr: 4500, daysActive: 180 },
  { id: 'c-002', gymName: 'Sunrise Fitness Hub', ownerName: 'Anita Sharma', plan: 'STARTER', churnedAt: '2024-04-22', reason: 'Switched to competitor', mrr: 1200, daysActive: 90 },
  { id: 'c-003', gymName: 'Urban Crossfit Box', ownerName: 'Derek Patel', plan: 'PRO', churnedAt: '2024-05-01', reason: 'Missing features', mrr: 3800, daysActive: 240 },
  { id: 'c-004', gymName: 'Lotus Wellness Center', ownerName: 'Kavya Nair', plan: 'STARTER', churnedAt: '2024-05-10', reason: 'Business closed', mrr: 900, daysActive: 60 },
  { id: 'c-005', gymName: 'Thunder Gym Whitefield', ownerName: 'Suresh Kumar', plan: 'ENTERPRISE', churnedAt: '2024-05-18', reason: 'Pricing negotiation failed', mrr: 12000, daysActive: 365 },
];

export const HEALTH_DATA: TenantHealthScore[] = [
  { id: 'gym-1234', gymName: 'Flex Fitness Central', plan: 'ENTERPRISE', score: 94, grade: 'A', memberCount: 1250, lastLogin: '2024-05-22', paymentHealth: 'GOOD', featureUsage: 92, supportTickets: 1 },
  { id: 'gym-5678', gymName: 'Iron Temple Barbell Club', plan: 'PRO', score: 78, grade: 'B', memberCount: 450, lastLogin: '2024-05-21', paymentHealth: 'GOOD', featureUsage: 74, supportTickets: 3 },
  { id: 'gym-7890', gymName: 'FitZone Indiranagar', plan: 'STARTER', score: 65, grade: 'C', memberCount: 120, lastLogin: '2024-05-19', paymentHealth: 'AT_RISK', featureUsage: 55, supportTickets: 5 },
  { id: 'gym-9012', gymName: 'Zenith Yoga & Pilates', plan: 'STARTER', score: 42, grade: 'D', memberCount: 85, lastLogin: '2024-05-10', paymentHealth: 'AT_RISK', featureUsage: 30, supportTickets: 8 },
  { id: 'gym-3456', gymName: 'PowerHouse Gym Koramangala', plan: 'PRO', score: 18, grade: 'F', memberCount: 200, lastLogin: '2024-04-28', paymentHealth: 'OVERDUE', featureUsage: 12, supportTickets: 14 },
];

export const GRADE_STYLES: Record<string, string> = {
  A: 'bg-success/10 text-success border border-success/30',
  B: 'bg-primary/10 text-primary border border-primary/30',
  C: 'bg-warning/10 text-warning border border-warning/30',
  D: 'bg-danger/10 text-danger border border-danger/30',
  F: 'bg-danger/20 text-danger border border-danger/50 font-bold',
};

export const PAYMENT_HEALTH_STYLES: Record<string, string> = {
  GOOD: 'text-success',
  AT_RISK: 'text-warning',
  OVERDUE: 'text-danger',
};

/** Threshold above which support ticket count is shown in danger color. */
export const TICKET_DANGER_THRESHOLD = 10;
/** Threshold above which support ticket count is shown in warning color. */
export const TICKET_WARNING_THRESHOLD = 5;
