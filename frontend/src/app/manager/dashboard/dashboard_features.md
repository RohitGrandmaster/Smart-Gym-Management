# Dashboard Feature Map

## Module Purpose
Handles dashboard operations, UI display, and logic isolation as part of the Smart Gym 360 platform.

## Directory Structure
- `dashboard_components/`: Contains all isolated micro-components for the module.
- `dashboard_types/` (if applicable): TypeScript definitions.
- `dashboard_utils/` (if applicable): Shared constants and hardcoded data.
- `dashboard_context/` (if applicable): Module-scoped React Context or Zustand store.

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|
| Core UI | `/dashboard` | Main module view | TBD | Frontend Team |

## Data and State Architecture
- Server-state query keys: `['dashboard']`
- Zustand stores: TBD
- Context providers: TBD
- Local-storage keys: TBD
- MSW handler file: TBD

## API Contract
List all endpoint builders and expected response types.
- `fetchDashboard(params)`
- `createDashboard(dto)`
- `updateDashboard(id, dto)`
- `deleteDashboard(id)`

## Permissions and Security
Document protected actions, roles, and CODEOWNERS paths.

## Loading, Empty, Error States
- **Loading:** Uses `loading.tsx` skeleton matching global design.
- **Empty:** Follows Rule 48 (dedicated empty state component).
- **Error:** Uses `error.tsx` typed React Error Boundary.

## Edge Cases / AI Warnings
- Do not bypass API interceptors.
- Do not mix complex React logic (`useEffect`) with JSX markup.

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization
- [x] Rule 7: Type isolation
- [x] Rule 8: Server/client boundary
- [x] Rule 9: Loading/error/not-found handling
- [x] Rule 14: Backend-driven messages
- [x] Rule 15A: Tests present
- [x] Rule 15B: Forms use React Hook Form + Zod
- [x] Rule 15C: State placed per Server/Client decision matrix
- [x] Rule 15D: Env vars validated centrally, none exposed unsafely
- [x] Rule 15E: Error monitoring wired for critical flows
- [x] Rule 74: Security scan gates passed (SCA + secrets)
- [x] Rule 76: CODEOWNERS covers security-critical paths
- [x] Rule 79: MSW handler present where needed
