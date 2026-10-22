# Tenant Preview Module — Feature Map

## Module Purpose
Allows superadmins to preview exactly what any tenant's admin dashboard looks like without impersonating their account. A read-only simulated view that helps support and onboarding teams understand a tenant's current state.

## Directory Structure
- `tenant-preview_components/` — Client UI orchestrator (`SuperadminTenantPreviewClient.tsx`)
- `tenant-preview_types/` — Types and static constants/mock data (`tenant_preview_constants.ts`)
- `page.tsx` — Server component entry point
- `loading.tsx` — Structural skeleton UI
- `error.tsx` — Module-level error boundary with `reset()` retry

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|
| Tenant selector | `SuperadminTenantPreviewClient.tsx` | Dropdown to select which tenant to preview | — | Superadmin |
| Tenant info card | `SuperadminTenantPreviewClient.tsx` | Shows selected tenant name, email, plan, status | — | Superadmin |
| Preview modal | `SuperadminTenantPreviewClient.tsx` | Full simulated admin dashboard (sidebar + KPIs + alerts + members) | `GET /superadmin/tenant-preview/:id` (future) | Superadmin |
| Read-only badge | `SuperadminTenantPreviewClient.tsx` | "Superadmin View" badge — makes clear no actions affect real data | — | Superadmin |

## Data and State Architecture
- Server-state query keys: `['superadmin', 'tenant-preview', tenantId]` (future)
- Zustand stores: none
- Context providers: none
- Local-storage keys: none
- MSW handler file: `src/mocks/handlers/superadmin-tenant-preview.handlers.ts` (future)

## API Contract
- `GET /superadmin/tenant-preview/:id` → `ApiResponse<TenantPreviewData>`

## Permissions and Security
- Restricted to `SUPERADMIN` role only
- Preview is strictly read-only — no mutations allowed from this view
- Future: audit log every preview access (`superadmin_id`, `tenant_id`, `timestamp`)

## Loading, Empty, Error States
- Loading: `loading.tsx` — structural skeleton (selector card + preview area)
- Empty: no tenant selected → selector shows placeholder, preview button disabled
- Error: `error.tsx` — module-specific fallback with `reset()` retry button

## Edge Cases / AI Warnings
- `key={index}` is forbidden — alerts use `alert.message` as key, members use `m.name` as key
- `ALERT_ICONS` must NOT be a `Record<string, React.ReactNode>` const — use the `AlertIcon` component instead
- `TENANT_PREVIEW_DATA` and `ALERT_STYLES` live in `tenant_preview_constants.ts` — never inline
- `PENDING_PAYMENTS_DANGER_THRESHOLD` is a named constant — never write `> 5` inline
- Simulated sidebar is hidden on mobile (`hidden md:flex`) — the preview is desktop-oriented
- Modal uses `z-40` per design system Z-index scale (Design §12)

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization — single client component, types + constants isolated
- [x] Rule 3: Module prefix naming — `SuperadminTenantPreviewClient`, `tenant-preview_types`, `tenant_preview_constants`
- [x] Rule 7: Type isolation — all types in `tenant_preview_constants.ts`
- [x] Rule 8: Server/client boundary — `page.tsx` is server component
- [x] Rule 9: Loading/error handling — `loading.tsx` skeleton + `error.tsx` with `reset()`
- [x] Rule 38: RESPONSIBILITY comment on client component
- [x] Rule 40: `forbidden.md` present
- [x] Rule 55: No `key={index}` — stable keys used (`alert.message`, `m.name`, `label`)
- [x] Rule 73: `import type` used for all type-only imports
- [x] Design §9: `size={18} strokeWidth={2}` on all icons
- [x] Design §12/29: `motion-safe:` prefix on all transitions
- [x] Rule 63: Zero cross-module imports — `PREVIEW_TENANTS` is self-contained in `tenant_preview_constants.ts`
- [x] Rule 3: `TENANT_STATUS_STYLES` and `KPI_CARD_GRADIENT` moved to constants files
- [x] Rule 9: `not-found.tsx` present with branded 404 + Back to Dashboard
- [x] Design §30: `bg-overlay` used for preview modal
