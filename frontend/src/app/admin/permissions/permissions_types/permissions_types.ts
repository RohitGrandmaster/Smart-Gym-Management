// RESPONSIBILITY: Defines all TypeScript types for the Permissions module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type RoleType = 'manager' | 'trainer';

export interface PermissionFeature {
  key: string;
  label: string;
  group: string;
  description: string;
}

export interface RolePermissions {
  role: RoleType;
  permissions: Record<string, boolean>;
}

export interface GymPermissionOverride {
  gymId: string;
  gymName: string;
  role: RoleType;
  overrides: Record<string, boolean>;
}

export interface PermissionsData {
  roleDefaults: RolePermissions[];
  gymOverrides: GymPermissionOverride[];
}
