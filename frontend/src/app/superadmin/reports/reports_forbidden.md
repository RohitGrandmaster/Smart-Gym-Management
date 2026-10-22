# Reports Module — Forbidden Patterns

## What is EXPLICITLY NOT ALLOWED in this module

1. **No `key={index}`** — All table rows must use stable unique keys (`row.month`, `row.id`). Index keys break React reconciliation.

2. **No direct `.sort()` on imported arrays** — `HEALTH_DATA.sort()` mutates the module-level constant. Always spread first: `[...HEALTH_DATA].sort(...)`.

3. **No Recharts or Chart.js** — The canonical chart library is ApexCharts (`react-apexcharts`). Any other chart library is forbidden (Rule 62, Design §10).

4. **No hardcoded mock data inside the client component** — All static data (`REVENUE_DATA`, `CHURN_DATA`, `HEALTH_DATA`, `GRADE_STYLES`, `PAYMENT_HEALTH_STYLES`) must be imported from `reports_constants.ts`.

5. **No inline threshold magic numbers** — `TICKET_DANGER_THRESHOLD` and `TICKET_WARNING_THRESHOLD` are defined in `reports_constants.ts`. Never write `> 10` or `> 5` inline in JSX.

6. **No `any` type** — Strictly forbidden. Use typed interfaces from `reports_types.ts`.

7. **No relative imports** — All imports must use `@/` absolute paths (Rule 10).

8. **No `console.log`** — Forbidden in committed code (Rule 44).

9. **No hardcoded Tailwind colors** — Use design system tokens only. Never `bg-[#111]` or arbitrary hex values.

10. **No ApexCharts without `dynamic()` + `ssr: false`** — ApexCharts uses browser APIs and will crash on SSR. Always import via `next/dynamic` with `ssr: false`.

11. **No unchecked array access** — `REVENUE_DATA[REVENUE_DATA.length - 1]` must be typed safely. With `noUncheckedIndexedAccess`, this returns `RevenueRow | undefined`. Always assert or guard.
