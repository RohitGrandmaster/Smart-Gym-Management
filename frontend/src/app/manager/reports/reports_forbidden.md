# Forbidden Patterns for `manager/reports`

1. **No Mixed UI and Logic:** All heavy logic MUST reside in the adjacent custom hook or store.
2. **No Relative Imports:** Always use absolute paths starting with `@/app/manager/reports/...`.
3. **No Barrel Files:** Do not create `index.ts` files. Import files directly.
4. **No Direct `window.confirm`:** Use `ManagerConfirmProvider`.
5. **No Context for Async Data:** Do not use React Context for API data. Use Zustand store.
6. **No Arbitrary Tailwind Values:** Use design system tokens (`bg-card`, `p-4`).
7. **No Hardcoded Toasts from UI:** Let the store handle notifications.
8. **No Localized API Calls:** UI components must not call `apiFetch` directly.
9. **No Recharts or Chart.js:** Use `react-apexcharts` exclusively (canonical chart library).
