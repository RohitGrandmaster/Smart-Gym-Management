// RESPONSIBILITY: Centralized URL config for the Permissions module.
export const PermissionsUrlConfig = {
  PAGES: { HOME: '/admin/permissions' },
  BACKEND_API: {
    ROLE_DEFAULTS: '/admin/permissions/roles',
    GYM_OVERRIDES: '/admin/permissions/gym-overrides',
    UPDATE_ROLE: (role: string) => `/admin/permissions/roles/${role}`,
    UPDATE_GYM: (gymId: string, role: string) => `/admin/permissions/gyms/${gymId}/${role}`,
  },
};
