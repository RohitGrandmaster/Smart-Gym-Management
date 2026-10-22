# Superadmin Module Feature Map

## Module Purpose
The Superadmin module is the Master Control Panel (SaaS layer) for GymSmart 360. It manages global platforms, tenants (branches/franchises), global plans, coupons, SaaS invoices, system health, and infrastructure settings. It is fully isolated from Manager, Trainer, and Admin (gym-level) roles.

## Directory Structure
- `superadmin_components/`: Global components (Layout, Header, Sidebar, ConfirmProvider, QueryProvider).
- `superadmin_api/`: Dedicated API client for global administrative routes.
- `superadmin_types/`: Shared TypeScript definitions.
- `dashboard/`: SaaS-level KPI overview.
- `analytics/`: Revenue analytics and MRR tracking.
- `plans/`: SaaS subscription tiers and pricing definitions.
- `coupons/`: Promotional codes for SaaS subscriptions.
- `affiliates/`: Affiliate partners and referral tracking.
- `gyms/` (Tenants): Master list of all gym instances (branches/franchises).
- `invoices/`: Billing history and payments collected from tenants.
- `tickets/`: Global support ticketing system.
- `usage-meters/`: Resource usage tracking per tenant.
- `broadcasts/`: System-wide announcements to all tenants.
- `features/`: Feature flags and rollout controls.
- `infrastructure/`: Server load, queue status, caching configuration.
- `migrations/`: Database schema rollouts and tracking.
- `jobs/`: Background job monitoring (queues, crons, workers).
- `backups/`: Database backup scheduling and restoration.
- `system/`: General system health (RAM, CPU, Uptime).
- `global-audit/`: Master audit logs across all tenants.
- `settings/`: Global platform settings and configuration.

## Data and State Architecture
- **Server-state query keys:** Uses `['superadmin', ...]` with React Query (`useQuery`, `useMutation`).
- **Zustand stores:** Used for module-scoped modal/drawer states (e.g., `useSuperadminPlansStore`).
- **Context providers:** `SuperadminConfirmProvider`, `SuperadminQueryProvider`.
- **Local-storage keys:** None — auth token is HTTP-only.

## Permissions and Security
- Role: `SUPERADMIN` only.
- Strict isolation from all ERP roles (`/admin`, `/manager`, `/trainer`).

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization — module-prefixed subfolders
- [x] Rule 2: Total Role Isolation — zero cross-role imports
- [x] Rule 3: Hyper-descriptive naming — `Superadmin` prefix on all components
- [x] Rule 4: Theme Independence — Tailwind tokens via `globals.css`
- [x] Rule 7: Type Isolation — `*_types/` folders used
- [x] Rule 8: Server/Client Boundary — clear separation
- [x] Rule 9: Loading/error/not-found — handled via standard Next.js conventions
- [x] Rule 13: Feature Map — this document
- [x] Rule 71: Double verification — destructive actions use `useSuperadminConfirm()` modal
- [x] Design §3: Sidebar active = subtle gold border + bg + glow
- [x] Design §12: Z-index scale — header z-20, dropdowns z-30, modals z-40, toasts z-50
- [x] Design §28: Surface elevation — `bg-popover` for dropdowns, `bg-overlay` for modals
- [x] Design §29: motion-safe guards on all transitions and animations
