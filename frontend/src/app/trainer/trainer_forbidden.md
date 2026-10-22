# Forbidden Patterns for the Trainer Module

This file documents explicit anti-patterns that must **NEVER** be used in the `trainer` module.
Future AI sessions: read this file before touching any component in this module.

1. **Zero Cross-Module Imports**: Do NOT import anything from `/admin`, `/manager`, or `/superadmin`. The Trainer module must be 100% self-contained.
2. **No Generic Naming**: Every file and component MUST start with `Trainer...` (e.g., `TrainerWorkoutBuilder.tsx`, `useTrainerDashboard.ts`).
3. **No Inline Styling**: Do NOT use arbitrary Tailwind values (e.g., `w-[325px]`, `text-[15px]`) or inline hex codes. Strictly follow `trainer_theme_contract.md`.
4. **No Fat Components**: Do NOT mix heavy data fetching, formatting logic, and complex UI in one `.tsx` file. Extract logic to `use[ComponentName].ts`.
5. **No Barrel Files**: Do NOT use `index.ts` files for exporting. Use direct absolute imports (`@/app/trainer/...`).
6. **No Client-Side Pagination for Large Sets**: Do NOT fetch all exercises/members and paginate on the client. Always use server-side pagination.
7. **No Hardcoded URLs**: Do NOT hardcode `/api/trainer/...` directly in fetch calls. Add them to `trainer_utils/trainer_url_config.ts`.
