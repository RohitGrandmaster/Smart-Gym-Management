# Forbidden Patterns for the Manager Module

This file documents explicit anti-patterns that must **NEVER** be used in the `manager` module.
Future AI sessions: read this file before touching any component in this module.

1. **Zero Cross-Module Imports**: Do NOT import anything from `/admin`, `/trainer`, or `/superadmin`. The Manager module must be 100% self-contained.
2. **No Generic Naming**: Every file and component MUST start with `Manager...` (e.g., `ManagerMembersTable.tsx`, `useManagerDashboard.ts`).
3. **No Inline Styling**: Do NOT use arbitrary Tailwind values (e.g., `w-[325px]`, `text-[15px]`) or inline hex codes. Strictly follow `manager_theme_contract.md`.
4. **No Fat Components**: Do NOT mix heavy data fetching, formatting logic, and complex UI in one `.tsx` file. Extract logic to `use[ComponentName].ts`.
5. **No Barrel Files**: Do NOT use `index.ts` files for exporting. Use direct absolute imports (`@/app/manager/...`).
6. **No Client-Side Pagination for Large Sets**: Do NOT fetch all members/inquiries and paginate on the client. Always use server-side pagination.
7. **No Hardcoded URLs**: Do NOT hardcode `/api/manager/...` directly in fetch calls. Add them to `manager_utils/manager_url_config.ts`.
