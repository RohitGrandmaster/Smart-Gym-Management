// RESPONSIBILITY: Centralized mock data constants for the Usage Meters Module.
import type { UsageMeter } from '@/app/superadmin/usage-meters/superadmin_usage-meters_types/superadmin_usage-meters_types';

export const MOCK_USAGE_METERS: UsageMeter[] = [
  {
    id: 'meter-1',
    tenantId: 'gym-1234',
    tenantName: 'Flex Fitness Central',
    smsSent: 9500,
    smsLimit: 10000,
    databaseGb: 8.0,
    mediaGb: 11.5,
    storageLimitGb: 20,
    activeMembers: 1950,
    totalMembers: 2100,
    memberLimit: 2000,
    staffCount: 15,
    staffLimit: 15,
    billingCycleEnd: 'Oct 15, 2026'
  },
  {
    id: 'meter-2',
    tenantId: 'gym-5678',
    tenantName: 'Iron Temple Barbell Club',
    smsSent: 5000,
    smsLimit: 5000,
    databaseGb: 2.0,
    mediaGb: 8.0,
    storageLimitGb: 10,
    activeMembers: 1000,
    totalMembers: 1200,
    memberLimit: 1000,
    staffCount: 8,
    staffLimit: 10,
    billingCycleEnd: 'Oct 20, 2026'
  },
  {
    id: 'meter-3',
    tenantId: 'gym-9012',
    tenantName: 'Zenith Yoga & Pilates',
    smsSent: 150,
    smsLimit: 1000,
    databaseGb: 0.1,
    mediaGb: 0.4,
    storageLimitGb: 2,
    activeMembers: 85,
    totalMembers: 95,
    memberLimit: 100,
    staffCount: 2,
    staffLimit: 5,
    billingCycleEnd: 'Nov 05, 2026'
  }
];
