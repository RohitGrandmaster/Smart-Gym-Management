# Forbidden Architectural Patterns in Superadmin Module

This file strictly dictates what is **NOT ALLOWED** anywhere within src/app/superadmin. AI Agents and developers must abort operations if they are about to perform any of the following:

## 1. No Component-Level Fetching
**FORBIDDEN:** Direct API calls (piFetch, etch) inside .tsx components (except for Server Components).
**ALLOWED:** All fetching MUST happen via useQuery or useMutation in custom hooks (e.g., useGymsTable.ts), which then import from [module]_api.ts.

## 2. No Tailwind Arbitrary Values
**FORBIDDEN:** Arbitrary tailwind pixel values like h-[400px], w-[32px], g-[#1A1A1A].
**ALLOWED:** Strictly use standard tokens (h-96, w-8, g-card, 	ext-primary).

## 3. No Pure Server State in Global Stores
**FORBIDDEN:** Caching API responses in Zustand.
**ALLOWED:** Zustand is strictly for complex UI state (modals, wizards). Server state MUST live in TanStack Query.

## 4. No Default Type Imports
**FORBIDDEN:** import { Tenant } from './types'
**ALLOWED:** You must use explicit type imports: import type { Tenant } from './types'

## 5. No Unsafe Destructive Operations
**FORBIDDEN:** Standard single-click confirmation modals for highly destructive operations (Delete Gym).
**ALLOWED:** Destructive operations MUST implement the "Type-to-Confirm" UI requiring the exact word "DELETE".

## 6. No Generic Loading Spinners
**FORBIDDEN:** Displaying full-page generic spinners (<Loader2 />) while a page loads.
**ALLOWED:** loading.tsx MUST use structural skeletons mimicking the layout via g-skeleton-base.
