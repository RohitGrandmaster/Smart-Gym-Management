// RESPONSIBILITY: Filter controls for the Gym Health Alerts table (severity, type, gym, resolved status).
'use client';

import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';
import { useAdminGymHealthAlertsLogic } from '@/app/admin/gym-health-alerts/gym_health_alerts_context/useAdminGymHealthAlertsLogic';
import {
  ALERT_SEVERITY_OPTIONS,
  ALERT_TYPE_OPTIONS,
  GYM_OPTIONS,
  RESOLVED_OPTIONS,
} from '@/app/admin/gym-health-alerts/gym_health_alerts_utils/AdminGymHealthAlertsSharedConstants';

export default function AdminGymHealthAlertsFilters() {
  const {
    severityFilter, setSeverityFilter,
    typeFilter, setTypeFilter,
    gymFilter, setGymFilter,
    resolvedFilter, setResolvedFilter,
  } = useAdminGymHealthAlertsLogic();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-40">
        <AdminSearchableDropdown options={ALERT_SEVERITY_OPTIONS} value={severityFilter} onChange={(v) => setSeverityFilter(v as string)} placeholder="All Severities" />
      </div>
      <div className="w-48">
        <AdminSearchableDropdown options={ALERT_TYPE_OPTIONS} value={typeFilter} onChange={(v) => setTypeFilter(v as string)} placeholder="All Types" />
      </div>
      <div className="w-40">
        <AdminSearchableDropdown options={GYM_OPTIONS} value={gymFilter} onChange={(v) => setGymFilter(v as string)} placeholder="All Gyms" />
      </div>
      <div className="w-40">
        <AdminSearchableDropdown options={RESOLVED_OPTIONS} value={resolvedFilter} onChange={(v) => setResolvedFilter(v as string)} placeholder="Active Only" />
      </div>
    </div>
  );
}
