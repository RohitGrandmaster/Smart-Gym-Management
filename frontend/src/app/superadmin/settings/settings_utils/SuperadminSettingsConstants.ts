// RESPONSIBILITY: Centralized mock data constants for the Settings Module.
import type { PlatformSetting } from '@/app/superadmin/superadmin_types/superadmin_types';

export const MOCK_PLATFORM_SETTINGS: PlatformSetting[] = [
  { id: 'set_001', key: 'PLATFORM_MAINTENANCE_MODE', value: 'false', description: 'Enable global maintenance mode for all tenants', dataType: 'boolean', category: 'System' },
  { id: 'set_002', key: 'MAX_GLOBAL_TENANTS', value: '1000', description: 'Hard limit on total active tenants', dataType: 'number', category: 'Limits' },
  { id: 'set_003', key: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_***', description: 'Global Stripe webhook secret for billing events', dataType: 'string', category: 'Integrations' },
  { id: 'set_004', key: 'DEFAULT_TRIAL_DAYS', value: '14', description: 'Default trial period for new franchise signups', dataType: 'number', category: 'Business' },
  { id: 'set_005', key: 'ALLOW_PUBLIC_REGISTRATION', value: 'true', description: 'Allow new gyms to self-register via landing page', dataType: 'boolean', category: 'System' },
];
