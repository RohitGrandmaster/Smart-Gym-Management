// RESPONSIBILITY: Centralized constants and mock data for the Gym Health Alerts module.
import type { GymHealthAlert, GymHealthKPIData } from '@/app/admin/gym-health-alerts/gym_health_alerts_types/gym_health_alerts_types';

export const ALERT_SEVERITY_OPTIONS = [
  { value: 'all', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

export const ALERT_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'no_new_members', label: 'No New Members' },
  { value: 'revenue_drop', label: 'Revenue Drop' },
  { value: 'high_churn', label: 'High Churn' },
  { value: 'pending_payroll', label: 'Pending Payroll' },
  { value: 'low_attendance', label: 'Low Attendance' },
  { value: 'expiring_members', label: 'Expiring Members' },
];

export const GYM_OPTIONS = [
  { value: 'all', label: 'All Gyms' },
  { value: 'g1', label: 'Andheri East' },
  { value: 'g2', label: 'Bandra West' },
  { value: 'g3', label: 'Powai' },
  { value: 'g4', label: 'Thane' },
];

export const RESOLVED_OPTIONS = [
  { value: 'all', label: 'All Alerts' },
  { value: 'active', label: 'Active Only' },
  { value: 'resolved', label: 'Resolved Only' },
];

export const GYM_HEALTH_ITEMS_PER_PAGE = 10;

export const MOCK_GYM_HEALTH_ALERTS: GymHealthAlert[] = [
  { id: 'a1', gymId: 'g4', gymName: 'Thane', alertType: 'no_new_members', severity: 'critical', title: '0 New Members This Week', description: 'Thane branch has had zero new member registrations for 7 consecutive days.', metric: '0 new members', threshold: '< 3 per week', detectedAt: '2025-07-07T09:00:00', isResolved: false },
  { id: 'a2', gymId: 'g3', gymName: 'Powai', alertType: 'revenue_drop', severity: 'critical', title: 'Revenue Drop > 25%', description: 'Powai branch revenue dropped 28% compared to the same period last month.', metric: '-28% MoM', threshold: '> 20% drop', detectedAt: '2025-07-06T10:00:00', isResolved: false },
  { id: 'a3', gymId: 'g2', gymName: 'Bandra West', alertType: 'high_churn', severity: 'warning', title: 'High Member Churn Rate', description: 'Bandra West has a 18% churn rate this month, significantly above the 10% threshold.', metric: '18% churn', threshold: '> 10%', detectedAt: '2025-07-05T08:00:00', isResolved: false },
  { id: 'a4', gymId: 'g4', gymName: 'Thane', alertType: 'pending_payroll', severity: 'critical', title: 'Payroll Overdue by 5 Days', description: 'Staff payroll for Thane branch is 5 days overdue. 8 staff members are affected.', metric: '5 days overdue', threshold: '> 3 days', detectedAt: '2025-07-04T07:00:00', isResolved: false },
  { id: 'a5', gymId: 'g1', gymName: 'Andheri East', alertType: 'low_attendance', severity: 'warning', title: 'Attendance Below 40%', description: 'Average daily attendance at Andheri East has dropped to 38% of active members.', metric: '38% attendance', threshold: '< 40%', detectedAt: '2025-07-03T09:00:00', isResolved: false },
  { id: 'a6', gymId: 'g2', gymName: 'Bandra West', alertType: 'expiring_members', severity: 'info', title: '42 Memberships Expiring This Week', description: '42 active memberships at Bandra West are expiring within the next 7 days with no renewal initiated.', metric: '42 expiring', threshold: '> 30 expiring', detectedAt: '2025-07-07T06:00:00', isResolved: false },
  { id: 'a7', gymId: 'g3', gymName: 'Powai', alertType: 'no_new_members', severity: 'warning', title: 'Low New Member Acquisition', description: 'Powai had only 1 new member this week, below the expected minimum of 5.', metric: '1 new member', threshold: '< 5 per week', detectedAt: '2025-07-01T09:00:00', isResolved: true, resolvedAt: '2025-07-03T11:00:00' },
];

export const MOCK_GYM_HEALTH_KPI: GymHealthKPIData = {
  totalAlerts: 7,
  criticalAlerts: 3,
  warningAlerts: 2,
  gymsAtRisk: 3,
};
