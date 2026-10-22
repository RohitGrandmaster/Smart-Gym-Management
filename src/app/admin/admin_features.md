# Admin Module — Feature Map

## Module Purpose
The Admin module is the overarching control center for gym operations. It provides full access to manage branches, global settings, staff (HR), global plans, and overall finance/sales metrics. It enforces role isolation from Manager and Trainer modules.

## Directory Structure

| Folder | Responsibility |
|---|---|
| `admin_components/AdminLayout/` | App shell: fixed sidebar, sticky header, collapsible navigation |
| `admin_components/AdminFeedback/` | Shared feedback: toast, confirm modal, message modal, bulk messaging |
| `admin_components/AdminShared/` | Generic primitives: pagination, stat card, searchable dropdown |
| `admin_utils/` | Shared constants: nav items, items-per-page, placeholders |
| `admin_store/` | Global state (Zustand) for branches and selected branch filter |
| `dashboard/` | High-level analytics, revenue trends, global alerts |
| `branches/` | CRUD operations for physical gym locations |
| `finance/` | Global payment tracking, revenue reporting |
| `sales/` | Membership sales reports, aggregate performance |
| `hr/` | Staff management (Managers, Trainers, Admins) |
| `plans/` | Global membership plans and pricing definitions |
| `settings/` | System-wide configuration |
| `notifications/` | Admin-level alerts and global communication |

## Feature Inventory

| Feature | Path | Purpose | Main API Calls | Status |
|---|---|---|---|---|
| Dashboard | `/admin/dashboard` | KPI overview, global charts | `GET /admin/dashboard/*` | ✅ Live |
| Branches | `/admin/branches` | Manage gym locations | `GET/POST /admin/branches` | ✅ Live |
| Finance | `/admin/finance` | System-wide payments | `GET /admin/finance/*` | ✅ Live |
| Sales | `/admin/sales` | Aggregate membership sales | `GET /admin/sales/*` | ✅ Live |
| HR | `/admin/hr` | Staff directory & roles | `GET/POST /admin/hr` | ✅ Live |
| Plans | `/admin/plans` | Manage membership pricing | `GET/POST /admin/plans` | ✅ Live |
| Settings | `/admin/settings` | Global configuration | `GET/PATCH /admin/settings` | ✅ Live |
| Notifications | `/admin/notifications` | Alerts and messages | `GET/POST /admin/notifications` | ✅ Live |

## Data and State Architecture

- **Server-state query keys:** N/A — this module uses Context + Zustand
- **Zustand stores:** `useAdminGlobalStore` for selected branch, plus module-scoped stores (e.g., `useAdminPlansStore`)
- **Context providers:** Contexts for complex module data flow (e.g., `AdminHrContext`, `AdminPlansContext`, `AdminConfirmProvider`)
- **Local-storage keys:** None — auth token stored in HTTP-only cookie
- **MSW handler file:** Not yet configured — all API calls go to real backend

## API Contract

All API calls go through the centralized `apiFetch` wrapper at `@/lib/api`.

**Response envelope:** `{ success: boolean, message: string, data: T | null, meta?: PaginationMeta }`

## Permissions and Security

- Role: `SUPERADMIN` — all routes under `/admin/*` require authenticated session with Super Admin role
- Auth: JWT stored in `gymsmart_token` HTTP-only cookie; injected by `apiFetch` wrapper
- Destructive actions: Protected by `AdminConfirmProvider` (confirm modal — `useConfirm` hook)
- Cross-role isolation: Zero imports from `/manager` or `/trainer` (enforced in `admin_forbidden.md`)

## Loading, Empty, Error States

- Uses Next.js `loading.tsx` and `error.tsx` patterns in every sub-module.
- Uses skeleton loading states for tables and grid cards.
- Fallback empty states provided when no data exists.

## Edge Cases / AI Warnings

- **Never use `window.confirm()`** for destructive actions — always use `useConfirm()` hook from `AdminConfirmProvider`
- **No cross-module imports** — if you need a type from another module, duplicate it (intentional pattern per Rule 2)
- **Server Components** (`page.tsx`) must never import or render Client-Component providers directly
- **Sidebar active state** uses `bg-primary-subtle` + `border-l-2 border-primary` with glow shadow — NOT solid `bg-primary`
- **Z-index scale**: header = `z-20`, dropdowns = `z-30`, modals = `z-40`, toasts = `z-50`

## Rule Compliance Checklist

- [x] Rule 1: Micro-modularization — module-prefixed subfolders
- [x] Rule 2: Total Role Isolation — zero cross-role imports
- [x] Rule 3: Hyper-descriptive naming — `Admin` prefix on all files
- [x] Rule 4: Theme Independence — Tailwind tokens via `globals.css`
- [x] Rule 5: Smart State Management — Context/Zustand combination
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
