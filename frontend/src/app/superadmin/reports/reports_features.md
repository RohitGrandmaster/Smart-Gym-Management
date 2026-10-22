# Reports Module — Feature Map

## Module Purpose
Provides superadmins with global financial intelligence: MRR/ARR revenue reports with CSV/PDF export, churn analysis with reason breakdown, and per-tenant health scoring. The single source of truth for SaaS business health metrics.

## Directory Structure
- `reports_components/` — Client UI orchestrator (`SuperadminReportsClient.tsx`)
- `reports_types/` — TypeScript types (`reports_types.ts`) and static constants/mock data (`reports_constants.ts`)
- `page.tsx` — Server component entry point
- `loading.tsx` — Structural skeleton UI
- `error.tsx` — Module-level error boundary with `reset()` retry

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|
| Revenue Report tab | `SuperadminReportsClient.tsx` | MRR area chart + monthly revenue table | `GET /superadmin/reports/revenue` (future) | Superadmin |
| CSV Export | `SuperadminReportsClient.tsx` | Exports filtered revenue data as CSV | `GET /superadmin/reports/revenue/export?format=csv` (future) | Superadmin |
| PDF Export | `SuperadminReportsClient.tsx` | Generates PDF revenue report | `GET /superadmin/reports/revenue/export?format=pdf` (future) | Superadmin |
| Date range filter | `SuperadminReportsClient.tsx` | Filters all report data by date range | — (passed as query params future) | Superadmin |
| Churn Analysis tab | `SuperadminReportsClient.tsx` | Donut chart of churn reasons + churn table | `GET /superadmin/reports/churn` (future) | Superadmin |
| Tenant Health tab | `SuperadminReportsClient.tsx` | Health score table sorted by score desc | `GET /superadmin/reports/health` (future) | Superadmin |

## Data and State Architecture
- Server-state query keys: `['superadmin', 'reports', 'revenue']`, `['superadmin', 'reports', 'churn']`, `['superadmin', 'reports', 'health']` (future)
- Zustand stores: none
- Context providers: none
- Local-storage keys: none
- MSW handler file: `src/mocks/handlers/superadmin-reports.handlers.ts` (future)

## API Contract
- `GET /superadmin/reports/revenue?from=&to=` → `ApiResponse<RevenueRow[]>`
- `GET /superadmin/reports/churn?from=&to=` → `ApiResponse<ChurnRecord[]>`
- `GET /superadmin/reports/health` → `ApiResponse<TenantHealthScore[]>`
- `GET /superadmin/reports/revenue/export?format=csv|pdf&from=&to=` → file download

## Permissions and Security
- All actions restricted to `SUPERADMIN` role only
- Export endpoints must validate date range server-side to prevent abuse

## Loading, Empty, Error States
- Loading: `loading.tsx` — structural skeleton (3 KPI cards + chart area + table)
- Empty: no explicit empty state needed (data is always present for reports)
- Error: `error.tsx` — module-specific fallback with `reset()` retry button

## Edge Cases / AI Warnings
- `HEALTH_DATA.sort()` mutates the original array — always use `[...HEALTH_DATA].sort()` (spread first)
- `REVENUE_DATA[REVENUE_DATA.length - 1]` can be `undefined` with `noUncheckedIndexedAccess` — always assert with `as RevenueRow` or add a guard
- `GRADE_STYLES`, `PAYMENT_HEALTH_STYLES`, `TICKET_DANGER_THRESHOLD`, `TICKET_WARNING_THRESHOLD` all live in `reports_constants.ts` — never inline
- Chart library is ApexCharts (`react-apexcharts`) — Recharts and Chart.js are forbidden (Rule 62)
- Chart component uses `dynamic()` with `ssr: false` — required for ApexCharts (Design §10)

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization — single client component, types + constants isolated
- [x] Rule 3: Module prefix naming — `SuperadminReportsClient`, `reports_types`, `reports_constants`
- [x] Rule 7: Type isolation — all types in `reports_types.ts`
- [x] Rule 8: Server/client boundary — `page.tsx` is server component
- [x] Rule 9: Loading/error handling — `loading.tsx` skeleton + `error.tsx` with `reset()`
- [x] Rule 38: RESPONSIBILITY comment on client component
- [x] Rule 40: `forbidden.md` present
- [x] Rule 55: No `key={index}` — stable IDs used (`row.month`, `row.id`)
- [x] Rule 73: `import type` used for all type-only imports
- [x] Design §5a: Gold gradient on all 3 KPI cards with hover elevation
- [x] Design §9: `size={18} strokeWidth={2}` on all icons
- [x] Rule 3: `KPI_CARD_GRADIENT` moved to `reports_constants.ts`
- [x] Rule 7: `ReportsTab` type exported from `reports_types.ts`
- [x] Rule 9: `not-found.tsx` present with branded 404 + Back to Dashboard
- [x] Design §11: `focus-visible:ring-2 focus-visible:ring-primary` on all date inputs
- [x] Design §12/29: `motion-safe:` prefix on all transitions
