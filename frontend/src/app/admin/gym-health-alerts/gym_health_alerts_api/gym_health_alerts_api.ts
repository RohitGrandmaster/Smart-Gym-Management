// RESPONSIBILITY: API client for the Gym Health Alerts module.
import type { GymHealthAlert, GymHealthKPIData } from '@/app/admin/gym-health-alerts/gym_health_alerts_types/gym_health_alerts_types';
import { MOCK_GYM_HEALTH_ALERTS, MOCK_GYM_HEALTH_KPI } from '@/app/admin/gym-health-alerts/gym_health_alerts_utils/AdminGymHealthAlertsSharedConstants';

let mockAlerts = [...MOCK_GYM_HEALTH_ALERTS];

export const gymHealthAlertsApi = {
  fetchAlerts: async (): Promise<GymHealthAlert[]> => mockAlerts,
  fetchKPIs: async (): Promise<GymHealthKPIData> => MOCK_GYM_HEALTH_KPI,
  resolveAlert: async (id: string): Promise<void> => {
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) { alert.isResolved = true; alert.resolvedAt = new Date().toISOString(); }
  },
  dismissAlert: async (id: string): Promise<void> => {
    mockAlerts = mockAlerts.filter(a => a.id !== id);
  },
};
