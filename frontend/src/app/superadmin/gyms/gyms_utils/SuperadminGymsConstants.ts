// RESPONSIBILITY: Centralized constants for the Superadmin Gyms module.
// No magic numbers or magic strings should exist in gyms_components — all live here.
// DATA FLOW: SuperadminGymsConstants → SuperadminGymsTable, SuperadminGymsToolbar, useSuperadminGymsTable

/** Number of gym rows displayed per page in the SuperadminGymsTable. */
export const GYMS_TABLE_PAGE_SIZE = 10;

/** Minimum search query length before triggering a filter. */
export const GYMS_SEARCH_MIN_LENGTH = 1;

/** Status label map for gym tenant status badges. */
export const GYMS_STATUS_LABELS = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  TRIAL: 'Trial',
  EXPIRED: 'Expired',
} as const;

/** Plan badge color map — used in SuperadminGymsTable plan badge rendering. */
export const GYMS_PLAN_COLORS = {
  ENTERPRISE: 'bg-purple-bg text-purple border border-purple',
  PRO: 'bg-primary-subtle text-primary border border-primary',
  STARTER: 'bg-success-bg text-success border border-success',
  BASIC: 'bg-success-bg text-success border border-success',
  DEFAULT: 'bg-input text-secondary border border-border',
} as const;

import type { Tenant } from '@/app/superadmin/gyms/superadmin_gyms_types/superadmin_gyms_types';

export const MOCK_GYMS: Tenant[] = [
  {
    id: 'gym-1234',
    name: 'Flex Fitness Central',
    ownerName: 'Sarah Connor',
    adminEmail: 'sarah@flexfitness.com',
    phone: '+1 555-0192',
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2023-01-15T00:00:00Z',
    memberCount: 1250,
    monthlyRevenue: 12500,
    databaseVersion: 'v1.4'
  },
  {
    id: 'gym-5678',
    name: 'Iron Temple Barbell Club',
    ownerName: 'Arnold Strong',
    adminEmail: 'arnold@irontemple.com',
    phone: '+1 555-9922',
    status: 'ACTIVE',
    plan: 'PRO',
    createdAt: '2023-06-20T00:00:00Z',
    memberCount: 450,
    monthlyRevenue: 4500,
    databaseVersion: 'v1.4'
  },
  {
    id: 'gym-9012',
    name: 'Zenith Yoga & Pilates',
    ownerName: 'Mia Wong',
    adminEmail: 'mia@zenithyoga.com',
    phone: '+1 555-3344',
    status: 'SUSPENDED',
    plan: 'STARTER',
    createdAt: '2023-11-05T00:00:00Z',
    memberCount: 85,
    monthlyRevenue: 850,
    databaseVersion: 'v1.2'
  }
];
