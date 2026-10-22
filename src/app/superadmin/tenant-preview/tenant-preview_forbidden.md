# Tenant Preview Module — Forbidden Patterns

## What is EXPLICITLY NOT ALLOWED in this module

1. **No `key={index}`** — All list renders must use stable unique keys. Alerts use `alert.message`, members use `m.name`, KPI cards use `label`. Index keys break React reconciliation.

2. **No inline JSX in `const` objects** — `ALERT_ICONS` style patterns using `React.ReactNode` in plain constants are forbidden. Use the `AlertIcon` component instead.

3. **No hardcoded mock data inside the client component** — All static data (`TENANT_PREVIEW_DATA`, `ALERT_STYLES`, `PENDING_PAYMENTS_DANGER_THRESHOLD`) must be imported from `tenant_preview_constants.ts`.

4. **No mutations from the preview modal** — This is a read-only view. No buttons inside the simulated dashboard should trigger real state changes or API calls. All interactive elements inside the preview must use `cursor-default` and have no `onClick` handlers.

5. **No `any` type** — Strictly forbidden. Use typed interfaces from `tenant_preview_constants.ts`.

6. **No relative imports** — All imports must use `@/` absolute paths (Rule 10).

7. **No `console.log`** — Forbidden in committed code (Rule 44).

8. **No hardcoded Tailwind colors** — Use design system tokens only. Never `bg-[#111]` or arbitrary hex values. Exception: `text-black` on primary buttons (white text on gold fails WCAG contrast).

9. **No cross-module business component imports** — Only `@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants` is permitted for shared tenant data.

10. **No modal z-index above `z-40`** — Modals use `z-40` per the design system Z-index scale (Design §12). Toast notifications own `z-50`.

11. **No inline threshold magic numbers** — `PENDING_PAYMENTS_DANGER_THRESHOLD` is defined in `tenant_preview_constants.ts`. Never write `> 5` inline in JSX.
