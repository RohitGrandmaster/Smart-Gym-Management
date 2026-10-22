# Manager Module — Feature Map

## Module Purpose
The Manager module is the primary operational hub for gym branch managers. It provides a complete role-isolated ERP interface covering member management, attendance tracking, sales & revenue analytics, HR & payroll, expenses, gym store, diet library, workout library, and lead/inquiry management. Each sub-module is fully isolated from Admin and Trainer roles (zero cross-module imports).

## Directory Structure

| Folder | Responsibility |
|---|---|
| `manager_components/ManagerLayout/` | App shell: fixed sidebar, sticky header, collapsible navigation |
| `manager_components/ManagerFeedback/` | Shared feedback: toast, confirm modal, message modal, bulk messaging |
| `manager_components/ManagerShared/` | Generic primitives: pagination, stat card, receipt printer, searchable dropdown |
| `manager_utils/` | Shared constants: nav items, notifications, gym identity, items-per-page |
| `dashboard/` | Real-time KPI overview, recent members, pending payments, membership distribution |
| `members/` | Full member CRUD, profile viewer, renewal, payment recording, diet/workout assignment |
| `attendance/` | Daily check-in/check-out tracking, calendar view, KPIs |
| `sales/` | Revenue overview, membership report, pending payments, all memberships tabs |
| `hr/` | Staff management + payroll processing with KPIs and tab interface |
| `expenses/` | Operational expense tracking with CRUD and KPIs |
| `store/` | Gym store product and order management |
| `library/` | Diet plan library — create, view, assign to members |
| `workout/` | Workout plan library — create, view, assign to members |
| `plans/` | Membership plan viewing with pricing tiers and feature lists |
| `finance/` | Payments ledger with summary KPIs and search |
| `inquiries/` | CRM lead tracking, follow-up, and lead-to-member conversion |

## Feature Inventory

| Feature | Path | Purpose | Main API Calls | Status |
|---|---|---|---|---|
| Dashboard | `/manager/dashboard` | KPI overview, recent activity | `GET /manager/dashboard/stats` | ✅ Live |
| Members | `/manager/members` | Full member CRUD + profile | `GET/POST/PATCH/DELETE /manager/members` | ✅ Live |
| Attendance | `/manager/attendance` | Daily check-in tracking | `GET/POST /manager/attendance` | ✅ Live |
| Sales & Reports | `/manager/sales` | Revenue analytics | `GET /manager/sales/*` | ✅ Live |
| HR & Payroll | `/manager/hr` | Staff + payroll management | `GET/POST /manager/hr/*` | ✅ Live |
| Expenses | `/manager/expenses` | Expense CRUD | `GET/POST/PATCH/DELETE /manager/expenses` | ✅ Live |
| Store | `/manager/store` | Product + order management | `GET/POST /manager/store/*` | ✅ Live |
| Diet Library | `/manager/library` | Diet plan CRUD + assignment | `GET/POST /manager/library/*` | ✅ Live |
| Workout Library | `/manager/workout` | Workout plan CRUD + assignment | `GET/POST /manager/workout/*` | ✅ Live |
| Membership Plans | `/manager/plans` | View plans + request changes | `GET /manager/plans` | ✅ Live |
| Finance | `/manager/finance` | Payments ledger + revenue vs expense chart | `GET /manager/finance/*` | ✅ Live |
| Inquiries & Leads | `/manager/inquiries` | Lead CRM + conversion | `GET/POST /manager/inquiries` | ✅ Live |
| Reports | `/manager/reports` | Revenue, attendance, churn, expense analytics + CSV export | `GET /manager/reports/*` | ✅ Live (mock) |
| Notifications | `/manager/notifications` | System alerts, expiry warnings, payment reminders | `GET /manager/notifications/*` | ✅ Live (mock) |

## Data and State Architecture

- **Server-state query keys:** N/A — this module uses Context + Zustand (not TanStack Query)
- **Zustand stores:** `useManagerMembersStore`, `useManagerExpensesStore` — module-scoped, UI client state only
- **Context providers:** `DashboardProvider`, `MembersProvider`, `AttendanceProvider`, `SalesProvider`, `HrProvider`, `ExpensesProvider` (via `ManagerExpensesMain`), `InquiriesProvider`
- **Local-storage keys:** None — auth token stored in HTTP-only cookie
- **MSW handler file:** Not yet configured — all API calls go to real backend

## API Contract

All API calls go through the centralized `apiFetch` wrapper at `@/lib/api`. Each module has its own API file:

| Module | API File | URL Config |
|---|---|---|
| Members | `members_api/ManagerMembersApi.ts` | `ManagerMembersUrlConfig.ts` |
| Finance | `finance_api/ManagerFinanceApi.ts` | `ManagerFinanceUrlConfig.ts` |
| Plans | `plans_api/ManagerPlansApi.ts` | `ManagerPlansUrlConfig.ts` |
| Sales | `sales_api/ManagerSalesApi.ts` | `ManagerSalesUrlConfig.ts` |
| HR | `hr_api/ManagerHrApi.ts` | `ManagerHrUrlConfig.ts` |
| Expenses | `expenses_api/ManagerExpensesApi.ts` | `ManagerExpensesUrlConfig.ts` |
| Store | `store_api/ManagerStoreApi.ts` | `ManagerStoreUrlConfig.ts` |
| Library | `library_api/ManagerLibraryApi.ts` | `ManagerLibraryUrlConfig.ts` |
| Workout | `workout_api/ManagerWorkoutApi.ts` | `ManagerWorkoutUrlConfig.ts` |
| Inquiries | `inquiries_api/ManagerInquiriesApi.ts` | `ManagerInquiriesUrlConfig.ts` |
| Reports | `reports_api/ManagerReportsApi.ts` | `ManagerReportsUrlConfig.ts` |
| Notifications | `notifications_api/ManagerNotificationsApi.ts` | `ManagerNotificationsUrlConfig.ts` |

**Response envelope:** `{ success: boolean, message: string, data: T | null, meta?: PaginationMeta }`

## Permissions and Security

- Role: `MANAGER` — all routes under `/manager/*` require authenticated session with Manager role
- Auth: JWT stored in `gymsmart_token` HTTP-only cookie; injected by `apiFetch` wrapper
- Destructive actions (delete, bulk actions): Protected by `ManagerConfirmProvider` (confirm modal — `useConfirm` hook)
- Sensitive data: Phone numbers masked using `maskSensitiveData()` from `@/lib/formatters`
- Cross-role isolation: Zero imports from `/admin`, `/trainer`, `/superadmin` (enforced in `manager_forbidden.md`)

## Loading, Empty, Error States

| Module | Loading | Empty | Error |
|---|---|---|---|
| Dashboard | Structural skeleton via `loading.tsx` + `DashboardSkeleton` | N/A | `error.tsx` + inline error state |
| Members | `loading.tsx` + `Loader2` spinner in table | `ManagerMembersEmptyState.tsx` | `error.tsx` |
| Attendance | `loading.tsx` | Inline empty message | `error.tsx` |
| Sales | `loading.tsx` | `ManagerSalesEmptyState` | `error.tsx` |
| HR | `loading.tsx` | Inline table empty | `error.tsx` |
| Expenses | `loading.tsx` | Inline empty | `error.tsx` |
| Finance | Inline `Loader2` spinner | Inline empty with icon | Inline retry button |
| Plans | Skeleton grid cards | Inline empty with icon | Inline retry button |
| Inquiries | `loading.tsx` | Inline empty | `error.tsx` |

## Edge Cases / AI Warnings

- **Never use `window.confirm()`** for destructive actions — always use `useConfirm()` hook from `ManagerConfirmProvider`
- **No cross-module imports** — if you need a type from another module (e.g., `Plan` in `members_types`), that is an intentional duplication pattern per Rule 2
- **Server Components** (`page.tsx`) must never import or render Client-Component providers directly — providers live inside the `*Main` Client Component
- **Finance + Plans** modules use client-side fetching (no SSR initial data) — this is intentional as the data changes frequently
- **Expense page** specifically: `ExpensesProvider` lives inside `ManagerExpensesMain`, NOT in `page.tsx`
- **Sidebar active state** uses `bg-primary-subtle` + `border-l-2 border-primary` with glow shadow — NOT solid `bg-primary` (which is for buttons)
- **Z-index scale**: header = `z-20`, dropdowns = `z-30`, modals = `z-40`, toasts = `z-50`

## Rule Compliance Checklist

- [x] Rule 1: Micro-modularization — module-prefixed subfolders, 300-line ceiling
- [x] Rule 2: Total Role Isolation — zero cross-role imports
- [x] Rule 3: Hyper-descriptive naming — `Manager` prefix on all files
- [x] Rule 4: Theme Independence — Tailwind tokens via `globals.css` → `@theme inline`
- [x] Rule 5: Smart State Management — Zustand for UI state, Context for stable cross-tree
- [x] Rule 6: Logic/UI Separation — custom hooks (`useManagerMembersLogic.ts`, etc.)
- [x] Rule 7: Type Isolation — `*_types/` folders, no inline interfaces
- [x] Rule 8: Server/Client Boundary — `page.tsx` = Server, `*Main.tsx` = Client
- [x] Rule 9: Loading/error/not-found — `loading.tsx` + `error.tsx` in every module
- [x] Rule 10: Absolute imports — `@/app/manager/...` throughout
- [x] Rule 11: Centralized URL Config — `Manager*UrlConfig.ts` per module
- [x] Rule 13: Feature Map — this document
- [x] Rule 14: Backend-driven messages — toasts display backend `message` strings
- [x] Rule 19: Clickable table rows — all tables use `cursor-pointer` row clicks
- [x] Rule 26: Loading button states — Loader2 spinners on async actions
- [x] Rule 32: No barrel files — direct named imports
- [x] Rule 44: No console.log — removed from all production SSR files
- [x] Rule 71: Double verification — destructive actions use `useConfirm()` modal
- [x] Rule 73: import type — used for type-only imports throughout
- [x] Design §3: Sidebar active = subtle gold border + bg (NOT solid primary)
- [x] Design §12: Z-index scale — header z-20, dropdowns z-30, modals z-40, toasts z-50
- [x] Design §28: Surface elevation — `bg-popover` for dropdowns, `bg-overlay` for modals
- [x] Design §29: motion-safe guards on all transitions and animations
