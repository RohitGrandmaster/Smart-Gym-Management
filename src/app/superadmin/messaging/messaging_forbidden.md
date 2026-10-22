# Messaging Module — Forbidden Patterns

## What is EXPLICITLY NOT ALLOWED in this module

1. **No `key={index}`** — All list renders must use stable unique IDs (`msg.id`, `notif.id`). Index keys break React reconciliation.

2. **No inline JSX in `const` objects** — `NOTIF_ICON` style patterns using `React.ReactNode` in plain constants are forbidden. Use a dedicated render function or small component (e.g., `NotifIcon`) instead.

3. **No hardcoded mock data inside the client component** — All static data (`INITIAL_MESSAGES`, `INITIAL_NOTIFICATIONS`, `CHANNEL_STYLES`, `MESSAGE_STATUS_STYLES`) must be imported from `messaging_constants.ts`.

4. **No native `<select>` for large tenant datasets** — When tenant count exceeds ~20, replace with a searchable custom dropdown (Rule 20). The current `<select>` is acceptable only while tenant count is small.

5. **No `any` type** — Strictly forbidden. Use typed interfaces from `messaging_types.ts`.

6. **No relative imports** — All imports must use `@/` absolute paths (Rule 10).

7. **No `console.log`** — Forbidden in committed code (Rule 44).

8. **No hardcoded Tailwind colors** — Use design system tokens only. Never `bg-[#111]` or arbitrary hex values.

9. **No cross-module business component imports** — Only `@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants` is permitted for shared tenant data.

10. **No modal z-index above `z-40`** — Modals use `z-40` per the design system Z-index scale (Design §12). Toast notifications own `z-50`.
