# Landing Feature Map

## Module Purpose
The Landing module provides the public-facing marketing and information pages for Smart Gym 360. It showcases features, pricing plans, trainer profiles, and acts as the entry point for both Superadmin and ERP users. It is entirely decoupled from authenticated operational modules.

## Directory Structure
- `landing_components/`: Contains all isolated micro-components for the landing page (Navbar, Hero, Features, Pricing, etc).
- `landing_types/`: TypeScript definitions for landing-specific data structures.
- `landing_utils/`: Shared constants and hardcoded data (e.g., feature lists, pricing tiers).
- `landing_context/`: Module-scoped React Context for managing scroll state and mobile menu toggles.

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Status |
|---|---|---|---|---|
| Home Page | `/` | Main marketing landing page | N/A (Static/Hardcoded) | ✅ Live |
| Navbar | `LandingNavbar` | Navigation and login CTA | N/A | ✅ Live |
| Hero | `LandingHero` | Main value proposition | N/A | ✅ Live |
| Features | `LandingFeatures` | Showcasing platform capabilities | N/A | ✅ Live |

## Data and State Architecture
- **Server-state query keys:** N/A (No API fetching required for current landing page)
- **Zustand stores:** N/A
- **Context providers:** `LandingProvider` (handles `scrolled` state for navbar, and `menuOpen` state)
- **Local-storage keys:** None
- **MSW handler file:** N/A

## API Contract
No API calls are currently made from the Landing module. All content is static or passed as hardcoded constants to ensure maximum performance and SEO.

## Permissions and Security
- Role: Public access (Unauthenticated).
- No sensitive data is exposed or fetched.

## Loading, Empty, Error States
- **Loading:** Uses `loading.tsx` skeleton matching global design.
- **Empty:** N/A for static content.
- **Error:** Uses `error.tsx` typed React Error Boundary to catch UI rendering crashes.

## Edge Cases / AI Warnings
- **No API calls** should be added to the landing page unless explicitly requested (e.g., a contact form). Performance and SEO are the top priorities here.
- **Z-index scale**: Follow global design rules (`LandingNavbar` is `z-20`).

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization — module-prefixed subfolders
- [x] Rule 2: Total Role Isolation — zero cross-role imports
- [x] Rule 3: Hyper-descriptive naming — `Landing` prefix on all files
- [x] Rule 4: Theme Independence — Tailwind tokens via `globals.css`
- [x] Rule 5: Smart State Management — Context used for UI state
- [x] Rule 7: Type Isolation — `*_types/` folders used
- [x] Rule 8: Server/Client Boundary — `page.tsx` = Server, `LandingNavbar.tsx` = Client
- [x] Rule 9: Loading/error/not-found — `loading.tsx` + `error.tsx` present
- [x] Rule 13: Feature Map — this document
- [x] Design §12: Z-index scale — navbar z-20
- [x] Design §29: motion-safe guards on all transitions and animations
