// RESPONSIBILITY: Global RBAC (Role-Based Access Control) hook (Frontend Rule 25).
// Reads the current user''s role from the gymsmart_user cookie via getUser().
// Components use can() to conditionally render action buttons, menus, and forms.
// NEVER gate routes here � route protection is in middleware.ts.
"use client";

import { useMemo } from "react";
import { getUser } from "@/lib/api";

type Role = "admin" | "manager" | "trainer" | "superadmin";

/**
 * A granular action key that maps to a permission rule.
 * Extend this union as new restricted features are added.
 */
type Action =
  // Finance
  | "finance:record_payment"
  | "finance:delete_payment"
  | "finance:export"
  // Members
  | "members:add"
  | "members:delete"
  | "members:bulk_import"
  | "members:view_sensitive_data"
  // HR
  | "hr:manage_staff"
  | "hr:process_payroll"
  | "hr:delete_staff"
  // Store
  | "store:add_product"
  | "store:delete_product"
  | "store:pos"
  // Audit
  | "audit:view"
  // Settings
  | "settings:edit_gym_profile"
  | "settings:manage_roles"
  | "settings:manage_integrations"
  // Superadmin
  | "superadmin:manage_gyms"
  | "superadmin:manage_plans"
  | "superadmin:view_invoices"
  | "superadmin:system_control";

/**
 * The permission matrix. Maps each action to the set of roles allowed to perform it.
 * When adding a new restricted action, add it here ONLY � not in components.
 */
const PERMISSIONS: Record<Action, Role[]> = {
  // Finance
  "finance:record_payment":       ["admin", "manager"],
  "finance:delete_payment":       ["admin"],
  "finance:export":               ["admin", "manager"],
  // Members
  "members:add":                  ["admin", "manager"],
  "members:delete":               ["admin"],
  "members:bulk_import":          ["admin", "manager"],
  "members:view_sensitive_data":  ["admin", "manager"],
  // HR
  "hr:manage_staff":              ["admin", "manager"],
  "hr:process_payroll":           ["admin"],
  "hr:delete_staff":              ["admin"],
  // Store
  "store:add_product":            ["admin", "manager"],
  "store:delete_product":         ["admin"],
  "store:pos":                    ["admin", "manager"],
  // Audit
  "audit:view":                   ["admin", "superadmin"],
  // Settings
  "settings:edit_gym_profile":    ["admin"],
  "settings:manage_roles":        ["admin"],
  "settings:manage_integrations": ["admin"],
  // Superadmin
  "superadmin:manage_gyms":       ["superadmin"],
  "superadmin:manage_plans":      ["superadmin"],
  "superadmin:view_invoices":     ["superadmin"],
  "superadmin:system_control":    ["superadmin"],
};

export interface UsePermissionsReturn {
  role: Role | null;
  /** Returns true if the current user is allowed to perform the given action. */
  can: (action: Action) => boolean;
  /** True only when role is "admin". */
  isAdmin: boolean;
  /** True only when role is "manager". */
  isManager: boolean;
  /** True only when role is "trainer". */
  isTrainer: boolean;
  /** True only when role is "superadmin". */
  isSuperadmin: boolean;
}

/**
 * usePermissions � Global RBAC hook.
 *
 * @example
 * const { can } = usePermissions();
 * {can("finance:delete_payment") && <DeleteButton />}
 */
export function usePermissions(): UsePermissionsReturn {
  const user = getUser();
  const role = (user?.role ?? null) as Role | null;

  const can = useMemo(
    () =>
      (action: Action): boolean => {
        if (!role) return false;
        return PERMISSIONS[action]?.includes(role) ?? false;
      },
    [role]
  );

  return {
    role,
    can,
    isAdmin:      role === "admin",
    isManager:    role === "manager",
    isTrainer:    role === "trainer",
    isSuperadmin: role === "superadmin",
  };
}
