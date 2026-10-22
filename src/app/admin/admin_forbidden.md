# Forbidden Patterns for the Admin Module

This file documents explicit anti-patterns that must **NEVER** be used in the `admin` module.
Future AI sessions: read this file before touching any component in this module.

1. **Zero Cross-Module Imports**: Do NOT import anything from `/manager`, `/trainer`, or `/superadmin`. The Admin module must be 100% self-contained.
2. **No Generic Naming**: Every file and component MUST start with `Admin...` (e.g., `AdminMembersTable.tsx`, `useAdminDashboard.ts`).
3. **No Inline Styling**: Do NOT use arbitrary Tailwind values (e.g., `w-[325px]`, `text-[15px]`) or inline hex codes. Strictly follow `admin_theme_contract.md`.
4. **No Fat Components**: Do NOT mix heavy data fetching, formatting logic, and complex UI in one `.tsx` file. Extract logic to `use[ComponentName].ts`.
5. **No Barrel Files**: Do NOT use `index.ts` files for exporting. Use direct absolute imports (`@/app/admin/...`).
6. **No Client-Side Pagination for Large Sets**: Do NOT fetch all members/inquiries and paginate on the client. Always use server-side pagination.
7. **No UI-Side HTTP Status Codes**: Do NOT hardcode `401` or `500` inside UI files. Intercept them centrally in the API wrapper.
8. **No Hardcoded URLs**: Do NOT hardcode `/api/admin/members` directly in fetch calls. Add them to `admin_utils/admin_url_config.ts`.
