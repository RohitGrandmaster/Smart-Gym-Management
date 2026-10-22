# Superadmin Module — Feature Documentation

## Overview
The Master Control Panel for the Multi-Tenant SaaS platform. Strictly isolated from the ERP module. Intended exclusively for platform owners (Superadmins).

## Architecture

### State Management Decision (Rule 58)
- **Zustand** (`gyms_store/useGymsStore.ts`): All async API data for the Gyms module (the most complex module with full CRUD + modals).
- **Zustand** (`plans_store/usePlansStore.ts`): Subscription Plans module — all async API data, modal state, and CRUD actions. `plans_context/` is intentionally empty per Rule 58.
- **Local `useState`**: All other pages (Tickets, Invoices, Coupons, Affiliates, Broadcasts, etc.) use local state via `useSuperadminData` hook or direct `superadminApi` calls.

### Data Fetching
- `superadmin_utils/useSuperadminData.ts` — Generic hook wrapping `apiFetch`. Returns `{ data, fetchState, error, mutate }`. Used by simpler pages.
- `superadmin_api/superadmin_api.ts` — Centralized typed API client for all 16 modules. Imports `apiFetch` from `src/lib/api.ts`.
- `superadmin_url_config.ts` — Single source of truth for all page routes and backend API paths.

### Async State Pattern
All pages use `FetchState = 'idle' | 'loading' | 'success' | 'error'` enum (never boolean `isLoading` flags).

## Directory Structure

```
superadmin/
├── layout.tsx                          # Server Component shell — wraps SuperadminLayout, imports superadmin.css
├── page.tsx                            # Redirects to /superadmin/dashboard
├── superadmin.css                      # Module-scoped CSS (custom scrollbar, keyframe animations, print rules)
├── superadmin_url_config.ts            # All page routes + backend API paths
├── superadmin_frontend_feature.md      # This file
├── superadmin_forbidden.md             # Module-level anti-pattern rules
├── superadmin_theme_contract.md        # CSS variables and theme dependencies
│
├── superadmin_types/
│   └── superadmin_types.ts             # All TypeScript types: Tenant, SubscriptionPlan, Coupon, Affiliate, Broadcast, GlobalAuditLog, etc.
│
├── superadmin_api/
│   └── superadmin_api.ts               # Typed API client for all 16 modules (gyms, plans, tickets, invoices, etc.)
│
├── superadmin_utils/
│   ├── useSuperadminData.ts            # Generic data-fetching hook (returns data, fetchState, error, mutate)
│   ├── useDebounce.ts                  # Debounce utility hook (300ms default) — Frontend Rule 15
│   ├── AuditLogsConstants.ts           # Fallback/mock data for Global Audit Logs page
│   ├── SuperadminChartConstants.ts     # ApexCharts color constants (hex) mapped from design system tokens
│   ├── SuperadminValidation.ts         # Pure-function validation helpers: isValidEmail, isValidSubdomain, isValidPhone, isFutureDate, etc.
│   ├── SuperadminZodSchemas.ts         # Zod schemas for ALL superadmin forms: addGymSchema, couponSchema, broadcastSchema, affiliateSchema, etc.
│   └── hooks/
│       ├── useAffiliatesPage.ts        # Logic hook for Affiliates page
│       ├── useBroadcastsPage.ts        # Logic hook for Broadcasts page
│       ├── useCouponsPage.ts           # Logic hook for Coupons page
│       └── useSuperadminMutation.ts    # Generic mutation helper with loading state
│
├── superadmin_components/
│   └── SuperadminLayout/
│       ├── SuperadminLayout.tsx        # Root layout: sidebar + header + content shell (Client Component)
│       ├── SuperadminSidebar.tsx       # Collapsible sidebar with nav groups + logout
│       ├── SuperadminHeader.tsx        # Top header with search, theme toggle, profile dropdown
│       └── SuperadminErrorBoundary.tsx # Typed React Error Boundary with Retry button (Rule 43)
│
├── dashboard/
│   ├── page.tsx                        # Server Component → renders SuperadminDashboardView
│   ├── loading.tsx                     # Skeleton loader
│   ├── error.tsx                       # Error boundary with Retry
│   └── dashboard_components/
│       └── SuperadminDashboardView/
│           └── SuperadminDashboardView.tsx       # SaaS KPI cards + ApexCharts MRR area chart + recent onboards
│
├── gyms/                               # Most complex module — full Zustand store
│   ├── page.tsx                        # Server Component entry point
│   ├── loading.tsx                     # Skeleton loader
│   ├── error.tsx                       # Error boundary
│   ├── gyms.css                        # Module-scoped CSS (row hover, ghost-login animation, status badges)
│   ├── GymsClient.tsx                  # Root orchestrator — imports gyms.css, renders Toolbar + Table
│   ├── gyms_forbidden.md               # Gyms-specific anti-patterns
│   ├── add/page.tsx                    # Onboard new gym form page
│   ├── gyms_store/
│   │   └── useGymsStore.ts             # Zustand store: gyms[], modals, CRUD actions, ghost login, suspend
│   ├── gyms_utils/
│   │   └── GymsValidationSchemas.ts    # Gyms-scoped Zod schemas (superseded by SuperadminZodSchemas for new code)
│   └── gyms_components/
│       ├── GymsTable/
│       │   ├── GymsTable.tsx           # Data table with sortable columns + row click
│       │   └── useGymsTable.ts         # Logic hook: filtering, pagination, modal triggers
│       ├── GymsToolbar/                # Search + filter + status filter bar
│       ├── GymEditModal/               # Edit gym details modal
│       ├── GymEmailModal/              # Email owner modal
│       ├── GymDeleteModal/             # Type-to-confirm delete modal (Rule 13.2)
│       ├── GymsEmptyState/             # Empty state component (Rule 50)
│       └── AddGymForm/
│           ├── AddGymForm.tsx          # Multi-step onboarding form
│           └── useAddGymForm.ts        # Logic hook for the Add Gym form
│
├── plans/                              # Zustand store (usePlansStore) — Rule 58
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── PlansClient.tsx                 # Root orchestrator for plans page
│   ├── plans_forbidden.md
│   ├── plans_store/
│   │   └── usePlansStore.ts            # Zustand: plans[], fetchState, modal state, CRUD actions
│   └── plans_components/
│       ├── PlansList.tsx               # Grid of plan cards
│       ├── PlanCreateModal.tsx         # RHF + Zod create form
│       └── PlanEditModal.tsx           # RHF + Zod edit form
│
├── tickets/                            # Local state via useSuperadminData
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── tickets_forbidden.md
│   └── TicketsClient.tsx
│
├── invoices/                           # Zustand store (useInvoicesStore) + useInvoicesPage hook
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── invoices_forbidden.md
│   ├── InvoicesClient.tsx
│   ├── invoices_store/
│   │   └── useInvoicesStore.ts
│   └── invoices_components/
│       ├── useInvoicesPage.ts          # Local UI state hook: search, modal state, derived stats
│       ├── InvoicesHeader/             # Page header + CTA button
│       ├── InvoicesTable/              # Data table
│       ├── InvoicesStatsBar/           # KPI stat cards (total, paid, failed revenue)
│       ├── InvoicesEmptyState/         # Empty state component
│       └── InvoicesLogPaymentModal/    # Log manual payment drawer
│
├── coupons/                            # useCouponsPage hook
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── coupons_forbidden.md
│   ├── CouponsClient.tsx
│   ├── coupons_types/
│   │   └── coupons_types.ts
│   └── coupons_components/
│       ├── CouponsHeader/
│       ├── CouponsTable/
│       ├── CouponsStatsBar/
│       ├── CouponsEmptyState/
│       ├── CouponsStatusBadge/
│       ├── SuperadminCouponModal.tsx   # Create coupon modal
│       └── SuperadminCouponEditModal.tsx
│
├── affiliates/                         # useAffiliatesPage hook
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── affiliates_forbidden.md
│   ├── AffiliatesClient.tsx
│   ├── affiliates_types/
│   │   └── affiliates_types.ts
│   └── affiliates_components/
│       ├── AffiliatesHeader/
│       ├── AffiliatesTable/
│       ├── AffiliatesStatsBar/
│       ├── AffiliatesEmptyState/
│       ├── AffiliateStatusBadge/
│       └── SuperadminAffiliateModal.tsx
│
├── broadcasts/                         # useBroadcastsPage hook
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── broadcasts_forbidden.md
│   ├── BroadcastsClient.tsx
│   ├── broadcasts_types/
│   │   └── broadcasts_types.ts
│   └── broadcasts_components/
│       ├── BroadcastsHeader/
│       ├── BroadcastsTable/
│       ├── BroadcastsEmptyState/
│       ├── BroadcastStatusBadge/
│       └── SuperadminBroadcastModal.tsx
│
├── features/                           # Feature flags + release notes tabs
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── features_forbidden.md
│   └── FeaturesClient.tsx
│
├── system/                             # System health dashboard
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── system_forbidden.md
│   └── SystemClient.tsx
│
├── infrastructure/                     # Server node CPU/RAM/Disk metrics
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── infrastructure_forbidden.md
│   └── InfrastructureClient.tsx
│
├── backups/                            # pg_dump backup records
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── backups_forbidden.md
│   └── BackupsClient.tsx
│
├── migrations/                         # TypeORM schema rollout management
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── migrations_forbidden.md
│   └── MigrationsClient.tsx
│
├── settings/                           # Platform-wide key-value settings
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── settings_forbidden.md
│   └── SettingsClient.tsx
│
├── jobs/                               # BullMQ background jobs table + metrics
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── jobs_forbidden.md
│   └── jobs_components/
│       └── JobsView.tsx
│
└── audit-logs/                         # Global audit log (URL-synced pagination + debounced search)
    ├── page.tsx                        # Server Component → renders AuditLogsClient
    ├── loading.tsx
    ├── error.tsx
    ├── audit-logs_forbidden.md
    └── audit-logs_components/
        └── AuditLogsClient/
            └── AuditLogsClient.tsx
```

## Forbidden Patterns (see also `*_forbidden.md` per module)
- Do NOT import from the ERP module (`/erp/`) except for shared primitives like `SearchableDropdown`.
- Do NOT add global auth logic here — handled by `middleware.ts`.
- Do NOT use `any` types — use `unknown` + Zod or explicit interfaces.
- Do NOT use boolean `isLoading` flags — use `FetchState` enum.
- Do NOT use Recharts — use ApexCharts exclusively.
- Do NOT hardcode inline hex colors (`bg-[#1E1E2E]`) — use design token classes (`bg-input`).
- Do NOT define Zod schemas inline in form components — import from `SuperadminZodSchemas.ts`.
- Do NOT write validation helpers inline in hooks — import from `SuperadminValidation.ts`.
