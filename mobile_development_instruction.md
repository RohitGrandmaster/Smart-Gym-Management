# Mobile Development Instructions — Framework-Agnostic (Enterprise / Industry Scale)

> Applies regardless of chosen stack (React Native bare-metal, Flutter, or native
> Swift/Kotlin). This document defines architectural discipline, not a specific
> library mandate — where a decision genuinely differs by framework, both paths
> are given explicitly. No managed/hosted vendor toolchain (e.g. Expo) is assumed.

## Rule 0 — Framework Decision (Made Once, Documented, Not Re-Litigated Per Feature)

Choose ONE framework for the whole app and record the decision + reasoning in
`/docs/decisions/framework-choice.md`. Use this criteria table to decide:

| Criteria | React Native (bare-metal) | Flutter | Native (Swift/Kotlin, separate codebases) |
|---|---|---|---|
| Team's existing skill (JS/TS vs Dart vs Swift/Kotlin) | Best if team is React/web-heavy | Best if team wants one language, no JS bridge overhead | Best if platform-specific perfection is the top priority |
| Code sharing across iOS/Android | High | Highest (one rendering engine, no platform widgets) | None — two full codebases |
| Native module / SDK availability | Good, growing | Good, growing, occasionally behind RN for very new SDKs | Best — always first-class |
| Long-term hiring pool | Large (JS ecosystem) | Growing, smaller than JS | Two separate specialist pools needed |
| Performance ceiling | Very good with New Architecture (Fabric/TurboModules) | Very good with Impeller rendering engine | Highest, but rarely the bottleneck in practice |

Whichever is chosen, mandate the framework's **current-generation architecture**
(e.g. RN's New Architecture — Fabric + TurboModules; Flutter's Impeller renderer)
— never start a new enterprise project on a legacy/deprecated engine.

## Rule 1 — Micro-Modularization (One Feature = One Self-Contained Folder)

This is the most important structural rule. **One feature = one self-contained folder.**
If there is a bug in `members`, you drag ONLY the `features/members/` folder to the AI.
Everything the AI needs — components, hooks/controllers, schemas, types, API, state,
tests, and the context file — lives inside that single folder. Zero need to open any other folder.

- One component/widget = one file. One file = one responsibility — never mix
  data-fetching, business logic, and presentation in the same file.
- Every feature lives ENTIRELY inside its own feature folder. Nothing feature-specific
  exists outside it.
- Screens/route entry points are THIN — they compose feature components only.
  No business logic, no direct API calls, no non-trivial state inside a screen file.

### File Size Ceilings (AI Context Limits)

| File type | Maximum lines |
|---|---|
| Screen / Page entry point | **80 lines** |
| Component / Widget | **200 lines** |
| Custom Hook / Controller / Notifier | **150 lines** |
| Validation Schema / Validator class | **150 lines** |
| API service file | **150 lines** |
| State store / Provider / Bloc | **180 lines** |
| Type / Model file | **150 lines** |
| Utility / Formatter file | **120 lines** |

If a file exceeds its ceiling: split by **feature responsibility**, not randomly by line count.
Never create dumping folders named `helpers/`, `common/`, or `misc/`.
Keep all split files inside the **same feature folder**.

### Canonical Feature Folder Structure

Adapt file extensions to the framework (`*.ts`/`*.tsx` for React Native; `*.dart` for Flutter):

```
features/
└── members/                              ← entire feature lives here
    ├── components/                       (or widgets/ in Flutter)
    │   ├── MembersMemberCard.tsx         ← module-prefixed component
    │   ├── MembersMemberCard.test.tsx    ← co-located test
    │   ├── MembersMemberListItem.tsx
    │   └── MembersEmptyState.tsx
    ├── hooks/                            (or controllers/ / notifiers/ in Flutter)
    │   ├── useMembers.ts                 ← server-state data-fetching hook
    │   ├── useMembers.test.ts
    │   ├── useMembersFilters.ts          ← client-state UI filter hook
    │   └── useMembersFilters.test.ts
    ├── schemas/                          (or validators/ in Flutter)
    │   └── members.schema.ts             ← Zod schema / validator class
    ├── types/                            (or models/ in Flutter)
    │   └── members.types.ts              ← all interfaces, enums, type unions
    ├── api/
    │   └── members.api.ts                ← ALL network calls for this feature ONLY
    ├── state/                            ← only if UI state shared across 2+ components
    │   └── members.store.ts              ← Zustand (RN) / Riverpod provider (Flutter)
    ├── tests/                            ← integration-level tests (unit = co-located)
    │   └── members.integration.test.ts
    ├── members_features.md               ← MANDATORY — see Rule 24
    └── members_forbidden.md             ← MANDATORY — see Rule 29
```

### Hyper-Descriptive, Module-Prefixed Naming (AI Context Guarantee)

Every file name **MUST begin with the feature name as a prefix**. When you tag a file
in an AI prompt (e.g. `@MembersMemberCard.tsx`), the AI instantly knows which module
it belongs to — zero ambiguity, zero cross-module hallucination risk.

```
❌ BAD:  Card.tsx, hook.ts, api.ts, store.ts, types.ts
✅ GOOD: MembersMemberCard.tsx, useMembersFilters.ts, members.api.ts
```

- **No abbreviations:** Never `Btn`, `Nav`, `Util`. Use `Button`, `Navigation`, `Utility`.
- **Suffix by type:** `...Card`, `...List`, `...Form`, `...Modal`, `...Sheet`, `...EmptyState`.
- **Exported name = filename:** `MembersMemberCard.tsx` must export `MembersMemberCard`.
  No default exports with a different name — this prevents AI hallucination.
- **Props interfaces prefixed:** `export interface MembersMemberCardProps` — never generic `Props`.

### Role Isolation (Mirror of Web Architecture)

Just as the web has isolated `/admin`, `/manager`, `/trainer` root folders, the mobile
app MUST follow the same pattern. A `MemberCard` in `admin/members/` is **never** imported
into `manager/members/`. Duplicate it — AI writes the code, so duplication cost is near
zero but isolation value is massive.

```
features/
├── admin/
│   └── members/      ← AdminMembers — completely isolated
├── manager/
│   └── members/      ← ManagerMembers — isolated, even if visually similar
└── trainer/
    └── members/      ← TrainerMembers — isolated
```




## Rule 2 — Navigation

- Navigation MUST be declarative and centrally configured — a single navigation
  graph/router definition, not ad-hoc imperative pushes scattered across files.
- Every route takes typed parameters — no passing full objects through navigation;
  pass IDs and re-fetch inside the destination screen (see Rule 4).
- Deep linking must resolve through the SAME central route definition used for
  in-app navigation — never a second, separately maintained linking map.
- Framework examples: React Navigation (React Native bare-metal) or go_router /
  Navigator 2.0 (Flutter) — either is acceptable as long as the rules above hold.
- Modals, bottom sheets, and nested tab/stack navigators must be defined once at
  the top of the navigation tree, not re-implemented per screen.

## Rule 3 — Styling & Design Tokens (No Magic Values, Anywhere)

- Every color, spacing value, font size, radius, and shadow used in the app MUST
  come from the single design-token source defined in `mobile_global_design.md`.
  No raw hex codes, no arbitrary pixel/dp values typed directly into a component.
- Implementation mechanism differs by framework but the discipline is identical:
  - React Native: a central theming module (e.g. NativeWind config, or a plain
    TypeScript theme object) that every component imports from.
  - Flutter: a central `ThemeData`/`ColorScheme` + custom `ThemeExtension`
    consumed via `Theme.of(context)` — never inline `Color(0xFF...)` literals.
- There is no hover state on touch devices — design and implement only
  press/active and disabled states, never hover-dependent interactions.
- Dark mode must use the SAME token names in light and dark variants so no
  component ever branches manually on "is dark mode" — the token resolves itself.

## Rule 4 — State Management (Server State vs Client State — Explicit Matrix)

Exactly two categories of state exist. Do not invent a third ad-hoc pattern.

| State Type | Category | Rule |
|---|---|---|
| Anything from an API (lists, details, counts, status) | **Server state** | Managed by a caching/data-fetching layer with built-in loading/error/stale-tracking (e.g. TanStack Query for React Native bare-metal; Riverpod's `AsyncNotifier` or a repository+cache pattern for Flutter). Never duplicated into a separate "client" state container. |
| UI-only state shared across 2+ components in one feature | **Client state (shared)** | A lightweight, feature-scoped state container (e.g. Zustand for RN; a `Provider`/`Bloc`/`Riverpod` scoped to the feature for Flutter). One container per feature — never one giant global store. |
| UI-only state used by exactly one component | **Client state (local)** | Local component state (`useState`/`useReducer` equivalent, or `StatefulWidget` local fields). |
| Data that must survive app restart offline | **Persisted server state** | Only when explicitly required — server-state cache persisted to local storage. Must be documented in the feature's `_features.md` (Rule 24), including conflict-resolution strategy. |

**Hard rule:** never copy API response data into the shared client-state
container "just in case." Components read server state directly through the
data-fetching layer, which handles request de-duplication and caching itself.

## Rule 5 — Forms & Validation

- All non-trivial forms use a form-management library + a schema-validation
  library, kept separate from each other (e.g. React Hook Form + Zod for RN;
  a form controller pattern + a validator class for Flutter).
- Validation schema/rules live in the feature's `schemas/` (or `validators/`)
  folder — never written inline inside the widget/component.
- Client-side validation messages are for immediate UX feedback only. The
  backend's validation response (see Rule 7) is the final source of truth for
  what's actually accepted — never assume client validation alone is sufficient.

## Rule 6 — Secure Storage & Credential Handling

There is no browser `localStorage`/cookies on mobile. Classify every piece of
stored data and route it accordingly:

| Data type | Storage requirement |
|---|---|
| Auth tokens (JWT, refresh token), biometric keys, any credential | Hardware-backed secure storage ONLY — iOS Keychain / Android Keystore, accessed via a secure-storage library (e.g. a Keychain-wrapper package for RN; `flutter_secure_storage` for Flutter). Never anywhere else. |
| App preferences, non-sensitive cached data | Fast key-value or embedded database storage (e.g. an MMKV-style store for RN; `shared_preferences`/`Hive`/`Isar` for Flutter). |
| Temporary session-only data | In-memory state only — cleared on app kill, never persisted. |

- Create exactly ONE central storage-access module per app. No other file may
  call the underlying secure-storage or key-value APIs directly — always go
  through this one module.
- Never log tokens, PII, or full request/response bodies containing sensitive
  fields — sanitize before any log line or crash-report breadcrumb.

## Rule 7 — API Layer & Error Handling

- ONE central network-client module for the whole app — one HTTP client
  instance, one place where auth headers, tenant headers (`x-tenant-id`), and
  correlation IDs are attached. No feature creates its own separate HTTP client.
- Every response is normalized into ONE shared `ApiResponse<T>` shape:
  `{ success, message, data: T | null, meta?, error?, statusCode? }`
  This matches the backend's canonical envelope exactly (Backend Rule 28).
  Every feature's API layer returns this shape — never raw, un-normalized responses.
- User-facing error messages come from the backend's `message` field —
  never hardcoded strings duplicated across screens.
- Authentication expiry (401) is handled by ONE centralized
  logout/token-refresh interceptor — never ad-hoc inside individual screens.

**Typed API Verb Contract:** Every function in a feature's `*.api.ts` MUST follow
the same verb naming as Backend Rule 86 and Frontend Rule 72 — 1:1 symmetry:
- `fetchMembers(params)` — paginated list
- `fetchMemberById(id)` — single entity
- `createMember(dto)` — POST creation
- `updateMember(id, dto)` — PATCH/PUT update
- `deleteMember(id)` — DELETE
- `exportMembersReport(params)` — report/export

AI agents must never invent arbitrary function names like `loadData()` or `getData()`.

## Rule 8 — Lists & Rendering Performance

- Any list rendering more than ~20 items MUST use a virtualization-aware list
  component (e.g. a high-performance list library for RN; `ListView.builder`
  for Flutter — never a naively-mapped, fully-rendered list of widgets).
- List item components must be render-stable (memoized in RN; using `const`
  constructors and stable keys in Flutter) to avoid unnecessary re-renders.

## Rule 9 — Images & Media Assets

- Use the framework's optimized image-loading mechanism exclusively — one that
  supports caching, placeholders, and format negotiation (a dedicated image
  library for RN rather than the bare core `Image`; Flutter's `Image` with a
  caching package like `cached_network_image`).
- Always specify explicit dimensions or aspect ratio for network images to
  prevent layout shift while loading.
- Bundled assets are referenced statically — never construct a dynamically
  computed asset path at runtime; bundlers cannot resolve those reliably.

## Rule 10 — Iconography

- Use ONE icon library/family for the entire app — never mix icon sets.
- Icon sizes and stroke/weight values must reference tokens from
  `mobile_global_design.md` — never arbitrary numeric values per usage.

## Rule 11 — Animations & Gestures

- Use the framework's high-performance animation system (a UI-thread-driven
  animation library for RN rather than the legacy JS-thread animation API;
  Flutter's native `AnimationController`/implicit animations).
- Use the framework's dedicated gesture-handling system for swipe/pan/pinch —
  never reconstruct gesture recognition manually from raw touch events.
- Respect the OS-level reduced-motion accessibility setting — skip or shorten
  non-essential animations when the user has that setting enabled.
- Centralize reusable animation presets (durations, easing curves, spring
  configs) in one shared module — never redefine the same values per screen.

## Rule 12 — Charts & Data Visualization

- Use a native-rendering charting library appropriate to the framework (Skia-
  or Canvas-based for RN; a Flutter-native charting package) — never a
  DOM/SVG/Canvas-web-only charting library, none of which render on mobile.
- Chart color palettes must pull from the design system's chart tokens — never
  hardcoded hex values per chart instance.

## Rule 13 — Platform-Specific Code

- Isolate genuinely divergent iOS/Android implementations into separate
  platform files (platform-suffix files in RN; conditional platform channels
  or separate implementation classes in Flutter) — not scattered inline
  platform checks throughout shared files.
- A trivial one-line platform difference (e.g. a shadow property) may remain
  inline; once a component accumulates three or more such checks, split it.
- Every platform-specific behavior (permission dialog wording, native UI
  quirks) must be noted in that feature's `_features.md` (Rule 24).

## Rule 14 — Permissions & Native Modules

- All permission requests (camera, location, notifications, media, contacts,
  biometrics) go through ONE central permissions module — no component or
  screen calls a native permission API directly.
- Before adding any new native dependency, verify it fully supports the
  framework's current-generation architecture (New Architecture for RN;
  current Flutter engine for Flutter plugins) — do not add a package flagged
  legacy-only without a documented, reviewed exception.
- Maintain an approved-dependency list per category (networking, forms,
  validation, state, storage, lists, images, icons, animation, charts,
  notifications, crash reporting) in `/docs/decisions/approved-dependencies.md`
  — extend only with written justification.

## Rule 15 — Push Notifications

- Token registration, permission flow, and notification-tap handling are each
  centralized in ONE module — never duplicated per screen.
- Notification-tap deep links resolve through the SAME central navigation
  definition used elsewhere in the app (Rule 2) — no separate ad-hoc routing
  logic for notifications.

## Rule 16 — Offline-First & Sync

- Default assumption: the app requires network connectivity. Offline support
  is opt-in per feature, explicitly justified — not a blanket architecture
  decision.
- Any feature requiring offline reads persists its server-state cache (Rule 4)
  to local storage, documented in that feature's `_features.md`, including
  cache invalidation triggers.
- Any offline write (queued mutation) requires an explicit, written
  conflict-resolution strategy — never silently assume "last write wins."

## Rule 17 — Testing (Full Pyramid)

- **Unit tests:** pure logic, validators, utility functions — fast, no
  framework rendering involved.
- **Component/widget tests:** every non-trivial component/widget in a feature
  folder has a matching test in that folder's `tests/` directory (Jest +
  Testing Library for RN; Flutter's built-in widget-test framework).
- **Integration tests:** critical user flows tested end-to-end within the app
  process (RN's integration-test tooling; Flutter's `integration_test`
  package).
- **E2E tests (real device/simulator):** pick ONE tool project-wide for
  black-box, full-app-flow testing (e.g. Maestro or a comparable YAML/script-
  driven E2E runner works across both RN and Flutter) and document the choice
  once — do not mix multiple E2E tools in the same repo.
- Native modules (camera, biometrics, secure storage, notifications) are
  mocked at the test boundary — unit and component tests never touch a real
  native API.
- No feature is considered complete without its core logic/component tests
  passing — tracked in that feature's `_features.md` checklist.

## Rule 18 — Native Build & Code Signing

- Android: signing keystore is generated once, backed up securely (encrypted,
  outside the repository), and never committed to version control. Use the
  platform's managed app-signing service where available to reduce upload-key
  exposure risk.
- iOS: distribution certificates and provisioning profiles are managed through
  a single, auditable process (e.g. a shared signing-management tool like
  fastlane match) — never distributed as ad-hoc files over chat/email.
- All signing secrets live ONLY in the CI/CD platform's protected secret store
  — never in the repository, build scripts, or plain-text config files.
- Build configuration (app ID, version code/name, bundle identifiers per
  environment) is generated from one central config source per environment —
  never manually edited per release.

## Rule 19 — CI/CD Pipeline

> Note: as of 2025, hosted all-in-one mobile DevOps platforms bundled with
> some frameworks' managed toolchains have been retired industry-wide for
> non-managed projects. The current enterprise-standard approach separates
> concerns explicitly:

- **CI (every pull request):** format check, static analysis/lint, run the
  full test pyramid (Rule 17), produce an unsigned development build. Must
  NOT have access to production signing secrets.
- **CD (on release tag / manual approval):** restore signing credentials from
  protected secrets, produce a signed release artifact (Android App
  Bundle / iOS IPA), upload to the store's internal/beta testing track.
- Use a general-purpose CI orchestrator (GitHub Actions, Azure Pipelines,
  Bitrise, or Codemagic) paired with a dedicated mobile release-automation
  tool (fastlane is the current industry standard for both Android and iOS
  signing + store upload) — do not rely on a single vendor's bundled
  build+test+distribute+analytics stack; treat each capability (build, test,
  distribute, monitor) as independently replaceable.
- Production deployment jobs sit behind a protected environment requiring
  manual approval and branch restrictions — no direct, unreviewed path from a
  feature branch to a store release.
- Pin the framework/SDK version and commit the dependency lockfile for
  reproducible builds — never build against a floating "latest" SDK version.

## Rule 20 — Environment & Configuration Management

- All secrets, base URLs, and feature flags are defined per build
  environment (dev/staging/production) through the framework's native build
  variant/flavor/scheme mechanism — never through a single shared config file
  edited manually before each release.
- No component or screen reads a raw environment variable or config file
  directly — always go through one central config-access module that
  validates presence/shape of required values at app startup, failing fast
  with a clear error rather than silently proceeding with `undefined`/`null`.
- Only genuinely public, non-sensitive values may ever end up in the shipped
  binary. Anything sensitive is fetched from a secured backend endpoint at
  runtime, never bundled into the client.

## Rule 21 — Over-The-Air (OTA) Updates & Hotfix Strategy

- OTA/JS-only patch delivery is OPTIONAL and must be a deliberate, documented
  decision — not a default assumption. For regulated or high-compliance
  industries, evaluate whether OTA patching is even permitted by internal
  policy before adopting it.
- If adopted: OTA covers script/asset changes ONLY. Any change touching
  native code, permissions, or native dependencies requires a full,
  store-reviewed release — never attempt to OTA around a native change.
- Choose ONE OTA mechanism appropriate to the framework and host it under
  your own infrastructure or a vetted managed provider — document the exact
  provider/self-hosted setup in `/docs/decisions/ota-strategy.md`, including
  rollback procedure and phased-rollout percentages.
- Every OTA push follows the same staged-rollout discipline as a full release
  (see Rule 24) — never push an OTA update to 100% of users immediately.

## Rule 22 — Security Scanning & Dependency Guardrails

- CI runs, on every push: (a) a software-composition-analysis (SCA)
  dependency vulnerability scan, (b) a secret-scanning check. Both must pass
  before merge.
- Code ownership (`CODEOWNERS`) requires mandatory human review on: the central
  network client, the central storage module, the central permissions module,
  the central config module, any auth flow, and any native build/signing config.
- No new dependency is added without:
  1. Checking the `/docs/decisions/approved-dependencies.md` list first.
  2. Confirming current-generation architecture compatibility (Rule 0 / Rule 14).
  3. Passing a vulnerability scan.
  4. Adding a written justification for why no existing approved library suffices.

**AI Dependency-Addition Guardrail:** An AI agent CANNOT add a new dependency
(`npm install` / `pub add`) without first checking the approved-dependency list.
Before proposing a new library, the AI must explicitly explain why an existing
approved library (e.g. `react-native-keychain`, `zustand`, `react-hook-form`,
`zod`, `@tanstack/react-query`, `react-native-fast-image`, `date-fns`,
`react-native-reanimated`) does not suffice for the task.

## Rule 23 — Observability & Crash Reporting

- Crash reporting and JS/Dart exception tracking wired at app root, before
  any other initialization — use a framework-supported crash-reporting SDK
  (e.g. Sentry or Firebase Crashlytics both support RN and Flutter).
- Every centralized module (network client, storage, permissions) reports
  errors with enough context (feature name, action attempted) to trace an
  issue without needing physical device logs.
- Track crash-free-rate and release health per version — mobile crashes are
  unrecoverable by "just refresh" the way a web page is, making this a
  release-blocking concern, not optional polish.

## Rule 24 — AI-Context Documentation (THE MODULARIZATION CONTRACT)

**This is the most important rule for AI-driven development.**

Every feature folder MUST contain a file named `[featureName]_features.md`.
This file is the single source of truth for that feature — an AI given ONLY
this file plus the feature folder must be able to fully understand, modify,
or debug it without reading any other part of the codebase.

**Before modifying a feature, read its `_features.md` in full first.**
If it is missing or stale, updating it is part of the same change — a feature
is never "done" while its context file is out of date.

### Mandatory `_features.md` Template

Every `_features.md` MUST use this minimum structure:

```markdown
# [FeatureName] Feature Map

## Purpose
Brief business explanation of what this feature does and which user roles use it.

## Screens & Entry Points
| Screen name | Route / stack name | Role access |
|---|---|---|

## Folder Structure
Brief description of each subfolder and its single responsibility.

## Data & State Architecture
- TanStack Query / repository cache keys:
- Feature-scoped Zustand stores / Riverpod providers:
- Local state decisions (per component):
- Persisted state (offline requirement): Yes / No — if yes, document strategy
- Storage keys used (namespaced constants):

## API Contract
| Function | Method | Endpoint | Request type | Response type |
|---|---|---|---|---|

## Permissions Used
| Permission | Central module function | Rationale |
|---|---|---|

## Platform-Specific Notes
List any iOS / Android divergence and why.

## Offline Behavior
Explicit "Yes, with [strategy]" or "No offline requirement."

## Loading / Empty / Error States
| State | Component file |
|---|---|
| Loading | FeatureListSkeleton.tsx |
| Empty | FeatureEmptyState.tsx |
| Error | FeatureErrorFallback.tsx |

## Edge Cases / AI Warnings
Known product constraints, regression risks, common AI hallucination traps.

## Rule Compliance Checklist
- [ ] Rule 1: Micro-modularization & module-prefixed naming
- [ ] Rule 3: All styles use design tokens — no magic hex/dp values
- [ ] Rule 4: State placed per Server/Client decision matrix
- [ ] Rule 5: Forms use form library + schema validator
- [ ] Rule 7: All API calls through central network client, typed verb contract
- [ ] Rule 8: Lists use virtualized component for >20 items
- [ ] Rule 7: User-facing messages come from backend's message field
- [ ] Rule 6: Auth tokens in hardware-backed secure storage only
- [ ] Rule 17: Co-located unit tests present; E2E for critical flows
- [ ] Rule 23: Observability wired for critical error paths
- [ ] Rule 22: No unapproved dependencies added
- [ ] Rule 25: All interactive elements have accessible labels + 44/48dp targets
- [ ] Rule 28: Zero cross-feature imports (self-containment verified)
- [ ] Rule 29: `_forbidden.md` exists and is current

## Known Issues / Tech Debt
| Issue | Reason deferred | Tracking reference |
|---|---|---|
```

## Rule 25 — Accessibility

- Every interactive element exposes an accessible role/label — no exceptions
  for "obviously self-explanatory" icons or buttons.
- Minimum touch target: 44×44pt (iOS) / 48×48dp (Android) — enforced via the
  shared minimum-touch-target token in `mobile_global_design.md`, not
  per-component guesses.
- Respect system font-scaling accessibility settings — never disable dynamic
  text scaling unless a specific pixel-perfect element requires it, and
  document why when it does.

## Rule 26 — App Store & Regulatory Compliance

- iOS Privacy Manifest and Android Play Console Data Safety disclosures are
  kept in sync with actual data collection/usage — reviewed before every
  release, owned by whoever last touched the permissions or analytics code.
- Any use of advertising/tracking identifiers is documented in the relevant
  feature's `_features.md` and reflected in the store compliance forms.
- App icons, splash screens, and store metadata are managed through one
  central, version-controlled config — never manually edited inside
  platform-native project files directly (breaks on next native rebuild).

## Rule 27 — Release Management & Staged Rollout

- Every release increments a version identifier and has a changelog entry —
  no silent version bumps.
- Any release containing a New Architecture / rendering-engine change, or a
  major native dependency upgrade, ships via staged rollout (e.g. 5% → 20% →
  50% → 100% over roughly two weeks), monitoring crash-free rate at each
  stage before advancing — never a 100% release for high-risk native changes.

---

## Rule 28 — Zero Cross-Feature Imports (The Portable Folder Rule)

Feature A (`members`) is **explicitly FORBIDDEN** from importing anything from
Feature B (`attendance`) — no components, no hooks, no types, no constants.

Every feature folder must be a **completely self-contained unit**. It may depend ONLY on:
- (a) npm / pub packages
- (b) Generic zero-business-logic primitives from `src/core/ui/` (shared UI atoms)
- (c) Its own internal files

This guarantees the entire feature folder can be deleted, copied, and pasted
into a different project with **zero broken imports** — the drag-and-drop-to-AI
workflow depends entirely on this guarantee.

Enforce mechanically via `eslint-plugin-boundaries` (React Native) or equivalent
static analysis / import linter (Flutter) so violations are caught in CI, not in code review.

---

## Rule 29 — Forbidden Patterns Per Feature (`_forbidden.md`)

Every feature folder MUST have a `[featureName]_forbidden.md` file listing
what is explicitly NOT allowed in that specific feature. This is the first file
an AI agent reads before making any change to a feature.

Example `members_forbidden.md`:
```markdown
# members — Forbidden Patterns

- NEVER import from any other feature folder (admin/members/, trainer/members/, etc.)
- NEVER call the HTTP client directly — always use members.api.ts
- NEVER store API response data in members.store.ts — use the data-fetching layer cache only
- NEVER implement ad-hoc confirmation dialogs — use the centralized confirmation module
- NEVER add a new dependency without approval (Rule 22 — dependency guardrail)
- NEVER hardcode hex colors, dp values, or font sizes — use design tokens only (Rule 3)
- NEVER log auth tokens, PII, or payment data — sanitize before any log call
```

---

## Workflow Checklist — What to Verify After AI Writes Code

1. Read the feature's `_features.md` and `_forbidden.md` before giving the AI any files.
2. Identify the exact layer (UI? Hook? API? Schema? State?) and pass only those files.
3. After the AI writes code, verify:
   - All styles use design tokens — no raw hex/dp values? (Rule 3)
   - State placed per Server/Client matrix? (Rule 4)
   - Forms using library + schema validator? (Rule 5)
   - API calls through central client, typed verb names? (Rule 7)
   - Lists virtualized for >20 items? (Rule 8)
   - User messages from `response.message`, never hardcoded? (Rule 7)
   - Auth tokens in hardware-backed secure storage only? (Rule 6)
   - Co-located tests exist for new hooks and components? (Rule 17)
   - Crash reporting wired for new critical paths? (Rule 23)
   - Is any new dependency on the approved list? (Rule 22)
   - `_features.md` updated? (Rule 24)
   - All interactive elements have accessible labels + 44/48dp targets? (Rule 25)
   - Any cross-feature imports? (Rule 28)
   - `_forbidden.md` current? (Rule 29)
4. Run CI gates: lint, type check, test pyramid, SCA scan, secrets scan.
5. For auth, payment, storage, or tenant-routing changes: ensure CODEOWNERS human review.
