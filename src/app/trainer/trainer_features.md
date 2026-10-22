# Trainer Module — Feature Map

## Module Purpose
The Trainer module is the primary operational interface for gym trainers. It provides role-isolated access to member management (assigned members only), attendance tracking, workout plans, diet library, and notifications. 
**Strict Role Isolation:** Each sub-module is fully isolated from Admin and Manager roles. Trainers are strictly forbidden from accessing financial data, global member lists, gym revenue, membership plan pricing, and HR data (other staff's payroll/attendance).

## Directory Structure

| Folder | Responsibility |
|---|---|
| `trainer_components/TrainerLayout/` | App shell: fixed sidebar, sticky header, collapsible navigation |
| `trainer_components/TrainerFeedback/` | Shared feedback: toast, confirm modal, message modal, bulk messaging |
| `trainer_components/TrainerShared/` | Generic primitives: pagination, stat card, searchable dropdown |
| `trainer_utils/` | Shared constants: nav items, notifications, items-per-page |
| `dashboard/` | Real-time KPI overview, recent assigned members, upcoming sessions |
| `members/` | Assigned members directory, profile viewing, progress tracking |
| `attendance/` | Staff check-in/check-out tracking, schedule viewing |
| `library/` | Diet plan library — create, view, assign to members |
| `workout/` | Workout plan library — create, view, assign to members |
| `notifications/` | Real-time alerts for member activity and manager messages |

## Feature Inventory

| Feature | Path | Purpose | Main API Calls | Status |
|---|---|---|---|---|
| Dashboard | `/trainer/dashboard` | KPI overview (own clients), upcoming sessions | `GET /trainer/dashboard/stats` | ✅ Live |
| Members | `/trainer/members` | Assigned members ONLY (profile, BMI/measurements, attendance, NO finance) | `GET/PATCH /trainer/members` | ✅ Live |
| Attendance | `/trainer/attendance` | Own daily check-in and attendance history | `GET/POST /trainer/attendance` | ✅ Live |
| Diet Library | `/trainer/library` | View diet plans + assign to own clients (No creating/editing global plans) | `GET/POST /trainer/library/*` | ✅ Live |
| Workout Library | `/trainer/workout` | View workout plans + assign to own clients (No creating/editing global plans) | `GET/POST /trainer/workout/*` | ✅ Live |
| Notifications | `/trainer/notifications` | Alerts relevant to trainer (e.g., manager msgs) | `GET/POST /trainer/notifications` | ✅ Live |

## Forbidden Features (STRICTLY ENFORCED)
- **Finance/Sales**: No dashboards, widgets, or APIs exposing gym revenue.
- **Member Payments**: No viewing membership fees, pending payments, or transaction history.
- **Global Member List**: Trainers can only view members explicitly assigned to them.
- **HR & Payroll**: Trainers cannot see other staff members' profiles, attendance, or salaries. (They may only view their own attendance/salary if enabled).
- **Store & Expenses**: Complete restriction from operational inventory or expense tracking.
- **Membership Plans**: Complete restriction from managing pricing tiers.

## Data and State Architecture

- **Server-state query keys:** N/A — this module uses Context + Zustand
- **Zustand stores:** Module-scoped stores for UI client state
- **Context providers:** `DashboardProvider`, `MembersProvider`, `AttendanceProvider`, `LibraryProvider`, `WorkoutProvider`, `TrainerConfirmProvider`
- **Local-storage keys:** None — auth token stored in HTTP-only cookie
- **MSW handler file:** Not yet configured — all API calls go to real backend

## API Contract

All API calls go through the centralized `apiFetch` wrapper at `@/lib/api`.

| Module | API File | URL Config |
|---|---|---|
| Members | `members_api/members_api.ts` | `members_api/members_server_api.ts` |
| Attendance| `attendance_api/` | |
| Library | `library_api/` | |
| Workout | `workout_api/` | |
| Notifications| `notifications_utils/` | |

**Response envelope:** `{ success: boolean, message: string, data: T | null, meta?: PaginationMeta }`

## Permissions and Security

- Role: `TRAINER` — all routes under `/trainer/*` require authenticated session with Trainer role
- Auth: JWT stored in `gymsmart_token` HTTP-only cookie; injected by `apiFetch` wrapper
- Destructive actions: Protected by `TrainerConfirmProvider` (confirm modal — `useConfirm` hook)
- Sensitive data: Phone numbers masked using `maskSensitiveData()` from `@/lib/formatters`
- Cross-role isolation: Zero imports from `/admin`, `/manager`, `/superadmin` (enforced in `trainer_forbidden.md`)

## Loading, Empty, Error States

| Module | Loading | Empty | Error |
|---|---|---|---|
| Dashboard | Structural skeleton via `loading.tsx` | N/A | `error.tsx` |
| Members | `loading.tsx` + `Loader2` spinner | Empty state component | `error.tsx` |
| Attendance | `loading.tsx` | Inline empty message | `error.tsx` |
| Library | Skeleton grid cards | Inline empty with icon | Inline retry button |
| Workout | Skeleton grid cards | Inline empty with icon | Inline retry button |
| Notifications| Inline `Loader2` | `TrainerNotificationsEmptyState` | `error.tsx` |

## Edge Cases / AI Warnings

- **Never use `window.confirm()`** for destructive actions — always use `useConfirm()` hook from `TrainerConfirmProvider`
- **No cross-module imports** — if you need a type from another module, duplicate it (intentional pattern per Rule 2)
- **Server Components** (`page.tsx`) must never import or render Client-Component providers directly
- **Sidebar active state** uses `bg-primary-subtle` + `border-l-2 border-primary` with glow shadow — NOT solid `bg-primary`
- **Z-index scale**: header = `z-20`, dropdowns = `z-30`, modals = `z-40`, toasts = `z-50`

## Rule Compliance Checklist

- [x] Rule 1: Micro-modularization — module-prefixed subfolders
- [x] Rule 2: Total Role Isolation — zero cross-role imports
- [x] Rule 3: Hyper-descriptive naming — `Trainer` prefix on all files
- [x] Rule 4: Theme Independence — Tailwind tokens via `globals.css`
- [x] Rule 5: Smart State Management — Context for stable cross-tree
- [x] Rule 7: Type Isolation — `*_types/` folders, no inline interfaces
- [x] Rule 8: Server/Client Boundary — `page.tsx` = Server, `*Main.tsx` = Client
- [x] Rule 9: Loading/error/not-found — `loading.tsx` + `error.tsx` in every module
- [x] Rule 13: Feature Map — this document
- [x] Rule 19: Clickable table rows — all tables use `cursor-pointer` row clicks
- [x] Rule 44: No console.log — removed from all production SSR files
- [x] Rule 71: Double verification — destructive actions use `useConfirm()` modal
- [x] Rule 73: import type — used for type-only imports throughout
- [x] Design §3: Sidebar active = subtle gold border + bg (NOT solid primary)
- [x] Design §12: Z-index scale — header z-20, dropdowns z-30, modals z-40, toasts z-50
- [x] Design §28: Surface elevation — `bg-popover` for dropdowns, `bg-overlay` for modals
- [x] Design §29: motion-safe guards on all transitions and animations
