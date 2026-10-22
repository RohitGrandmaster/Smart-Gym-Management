# Onboarding Module — Forbidden Patterns

## What is EXPLICITLY NOT ALLOWED in this module

1. **No `key={index}`** — All list renders must use stable unique IDs (`tenant.id`, `item.key`). Index keys break React reconciliation when lists reorder or filter.

2. **No inline status style strings** — `ONBOARDING_STATUS_STYLES` and `TRIAL_STATUS_STYLES` must always be imported from `onboarding_constants.ts`. Never write `'bg-success/10 text-success'` inline in JSX.

3. **No instant execution of financial/destructive actions** — "Convert to Paid" and any future billing mutations MUST go through a confirmation modal (Rule 71). Single-click execution is forbidden.

4. **No naked `<input type="number">` without guards** — All numeric inputs must have `min`, `max`, and an `onKeyDown` handler blocking `-`, `e`, `+` (Rule 65).

5. **No hardcoded mock data inside the client component** — All static data lives in `onboarding_constants.ts`. The client component imports it.

6. **No `any` type** — Strictly forbidden. Use typed interfaces from `onboarding_types.ts`.

7. **No relative imports** — All imports must use `@/` absolute paths (Rule 10).

8. **No `console.log`** — Forbidden in committed code (Rule 44).

9. **No hardcoded Tailwind colors** — Use design system tokens only (`bg-card`, `text-foreground`, `text-danger`, etc.). Never `bg-[#111]` or `text-white` for semantic content.

10. **No cross-module business component imports** — This module may only import from `@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants` for shared tenant data. No imports from admin, manager, or other role modules.
