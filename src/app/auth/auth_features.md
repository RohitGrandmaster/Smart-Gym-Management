# Auth Feature Map

## Module Purpose
The Auth module provides authentication flows (Login, Logout, Token Refresh, Cookie Management) for all ERP roles (Manager, Trainer, Admin). It intercepts raw credentials, validates them against the backend, and securely sets HTTP-only cookies to establish sessions.

## Directory Structure
- `login/`: Contains the login page and its sub-components (Form, Hero, ErrorBoundary).
- `logout/`: Contains the logout API route handler.
- `refresh/`: Contains the token refresh API route handler.
- `set-cookie/`: Contains the internal Next.js API route used by the client to securely set HTTP-only cookies after a successful login.
- `token/`: Token utility or validation logic.
- `auth_api/`: Frontend API wrappers for interacting with the authentication backend.

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Status |
|---|---|---|---|---|
| Login Page | `/auth/login` | Unified login interface | `POST /auth/login` | ✅ Live |
| Set Cookie | `/auth/set-cookie` | Internal route to set HTTP-only cookie | N/A | ✅ Live |
| Logout | `/auth/logout` | Clears cookies and session | N/A | ✅ Live |

## Data and State Architecture
- **Server-state query keys:** N/A 
- **Zustand stores:** N/A (Forms use local state or React Hook Form)
- **Context providers:** N/A
- **Local-storage keys:** None — All tokens strictly reside in HTTP-only cookies.
- **MSW handler file:** N/A

## API Contract
- `POST /auth/login`: Accepts `{ email, password }`, returns JWT and User object.
- **Client-to-Next-Server**: The client form calls the external backend API. On success, it calls the internal Next.js route `/auth/set-cookie` to store the token securely in an HTTP-only cookie.

## Permissions and Security
- Role: Public access for Login.
- **Tokens are NEVER stored in localStorage.** They are always stored in the `gymsmart_token` HTTP-only, secure, sameSite=strict cookie.
- Server Components (`page.tsx`) read this cookie directly via `next/headers` `cookies()` to perform role-based redirects.

## Loading, Empty, Error States
- **Loading:** Uses inline button spinners during form submission.
- **Empty:** N/A.
- **Error:** Uses `LoginErrorBoundary` to catch UI rendering crashes. API errors are displayed via toast or inline form messages.

## Edge Cases / AI Warnings
- **Role-based Redirection:** `/auth/login` automatically redirects authenticated users to their respective dashboards based on the decoded role in the cookie.
- **Z-index scale**: Theme toggle is `z-30`.

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization — module-prefixed subfolders
- [x] Rule 2: Total Role Isolation — auth serves as the gateway
- [x] Rule 3: Hyper-descriptive naming — `Login` prefix on components
- [x] Rule 4: Theme Independence — Tailwind tokens via `globals.css`
- [x] Rule 7: Type Isolation — `*_types/` folders used
- [x] Rule 8: Server/Client Boundary — `page.tsx` = Server, `LoginForm.tsx` = Client
- [x] Rule 13: Feature Map — this document
- [x] Design §12: Z-index scale — floating toggles z-30
- [x] Design §29: motion-safe guards on all transitions and animations
