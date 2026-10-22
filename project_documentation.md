# Smart Gym Management System - Master Documentation

This is the unified project documentation. It details the AI-Friendly Micro-Modular architecture across the entire frontend application. Every module is highly isolated into feature-based sub-folders to ensure that AI assistants can be fed specific modules without hallucinating across the broader codebase.

## Table of Contents

- [Login Module Architecture](#login-module-architecture)
- [Landing Page Features & Architecture](#landing-page-features-architecture)
- [Dashboard Module Features & Architecture](#dashboard-module-features-architecture)
- [Members Module Features & Architecture](#members-module-features-architecture)
- [Plans Module Features & Architecture](#plans-module-features-architecture)
- [Attendance Module Features & Architecture](#attendance-module-features-architecture)
- [Finance Module Features & Architecture](#finance-module-features-architecture)
- [Sales Module Features & Architecture](#sales-module-features-architecture)
- [HR Module Features & Architecture](#hr-module-features-architecture)
- [Inquiries Module Features & Architecture](#inquiries-module-features-architecture)
- [Library Module Features & Architecture](#library-module-features-architecture)
- [Workout Module Features & Architecture](#workout-module-features-architecture)
- [Store Module Features & Architecture](#store-module-features-architecture)
- [Settings Module Features & Architecture](#settings-module-features-architecture)

---

## 🏗️ Universal Architectural Rules & Patterns

Across all modules, the following strict patterns apply:
1. **Types Folder (`[module]_types/`)**: All TypeScript interfaces and types are strictly isolated in a centralized types file (e.g., `[module]_types.ts`).
2. **Logic Hook (`use[Module]Logic.ts`)**: Heavy logic (data fetching, calculations, local state) is extracted into a custom hook alongside the Context file, keeping UI components pure.
3. **URL Config (`[module]_url_config.ts`)**: Each module must have exactly one centralized URL configuration file to prevent hardcoded API routes or page routes.
4. **Main Orchestrator (`[Module]Main.tsx`)**: Every module typically includes an orchestrator component within its `_components/` folder that manages the high-level layout and conditional rendering of its micro-components.

---

# Login Module Architecture

## Directory Structure
- `login.css`: Contains CSS variables (e.g., `--login-primary`, `--login-bg-page`) derived from `global_design_system.md` for extreme theme isolation.
- `login_constants/LoginSharedConstants.ts`: Centralizes static texts, API paths, and asset paths used in the Login flow.
- `login_components/`: Contains isolated micro-components that only concern themselves with the UI layout.
  - `LoginVisual/LoginVisual.tsx`: Renders the desktop left-side visual banner.
  - `LoginHeader/LoginHeader.tsx`: Renders the mobile logo banner.
  - `LoginForm/LoginForm.tsx`: Renders the inputs and the submit button.
  - `LoginForm/useLoginForm.ts`: Manages React states (`email`, `password`, `loading`, `error`, `showPassword`) and encapsulates the `handleLogin` API flow logic.

## Future Modifications
- To change text or paths, edit `login_constants/LoginSharedConstants.ts`.
- To modify the login sequence logic, edit `login_components/LoginForm/useLoginForm.ts`.
- To edit colors, update the CSS variables in `login.css`.
- To update the form layout, edit `login_components/LoginForm/LoginForm.tsx`.


---

# Landing Page Features & Architecture

## Overview
The Landing module (`app/(landing)`) is the public-facing promotional website for GymSmart. It serves to convert visitors into members by showcasing facilities, pricing, trainers, transformations, and handling incoming leads (via contact and booking forms).

## AI-Context Architecture
This massive ~800-line monolith has been refactored into a strictly AI-Friendly, micro-modularized structure following the exact same guidelines applied to the internal `(erp)` system.

### 1. `landing_components/`
The monolithic page has been sliced into 15 individual, single-responsibility UI components:
- `LandingMain.tsx`
- `LandingNavbar.tsx`
- `LandingHero.tsx`
- `LandingAbout.tsx`
- `LandingBmiCalc.tsx`
- `LandingPlans.tsx`
- `LandingTrainers.tsx`
- `LandingServices.tsx`
- `LandingSchedule.tsx`
- `LandingGallery.tsx`
- `LandingBooking.tsx`
- `LandingTransformations.tsx`
- `LandingTestimonials.tsx`
- `LandingContact.tsx`
- `LandingFooter.tsx`

### 2. `landing_context/`
- `LandingContext.tsx`: Extracts and centralizes all the complex logic that was cluttering the UI:
  - Navbar scroll listeners and mobile menu toggles.
  - BMI Calculator mathematical logic and validation.
  - Asynchronous form submission logic for `Booking` and `Contact`.

### 3. `landing_utils/`
- `LandingSharedConstants.ts`: Extracts all 7 massive hardcoded mock data arrays (`STATS`, `SERVICES`, `TRAINERS`, `TRANSFORMATIONS`, `TESTIMONIALS`, `PLANS`, `SCHEDULE`) into a pure constants file to keep the UI components clean.

### 4. Root Files
- `page.tsx`: Acts simply as the structural stack, initializing the `LandingProvider` and sequentially rendering the 14 components.
- `landing.css`: Houses CSS variables specific to the landing page dark theme, ensuring compatibility with the global design system token structure.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features.


---

# Dashboard Module Features & Architecture

## Overview
The Dashboard module (`app/(erp)/dashboard`) provides the main landing page for authenticated administrators, summarizing gym KPIs, recent members, pending payments, and membership distribution. 

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `dashboard_components/`
Contains heavily isolated micro-components. Each file serves exactly one purpose and is highly descriptive:
- `DashboardKPIs/DashboardKPIs.tsx`: Renders the top statistical KPI cards.
- `MembershipDistribution/MembershipDistribution.tsx`: Displays the visual breakdown of plans.
- `PendingPayments/PendingPayments.tsx`: Lists payments nearing expiry.
- `PromoCard/PromoCard.tsx`: Static promotional banner.
- `RecentMembers/RecentMembers.tsx`: Table showing recently joined members.

### 2. `dashboard_context/`
- `DashboardContext.tsx`: The single source of truth for the module's state. It executes `dashboardApi.getStats()` on mount and exposes the `stats`, `loading`, and `error` state via the `useDashboardContext` hook. This eliminates prop drilling across the micro-components.

### 3. `dashboard_utils/`
- `DashboardSharedConstants.ts`: Centralizes backend-ready hardcoded arrays, table headers, and status-to-style mappings. If backend APIs change these lists, update this single file.

### 4. Root Files
- `page.tsx`: The module's entry point. It wraps `DashboardContent` within `DashboardProvider` to initialize the context and layout.
- `loading.tsx`: Native Next.js loading state.
- `error.tsx`: Native Next.js error boundary.
- `dashboard.css`: Contains CSS variables mapped to the global design system (e.g. `--dashboard-bg-card`), making the module entirely theme-independent without relying on inline Tailwind colors.


---

# Members Module Features & Architecture

## Overview
The Members module (`app/(erp)/members`) manages all gym members, memberships, and payments. It includes a comprehensive list view with statistics, and a detailed profile view for each member encompassing their overview, attendance, and payment history.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `members_components/`
- `MembersKPIs/MembersKPIs.tsx`: Renders the high-level metrics (Total, Active, Pending, Expired).
- `MembersToolbar/MembersToolbar.tsx`: Houses the search input, status filter select, and the button to add a new member.
- `MembersTable/MembersTable.tsx`: Displays the filtered list of members with actions to view profile, edit, delete, and send messages via WhatsApp or Email.
- `MemberModal/MemberModal.tsx`: A self-contained modal form for adding or editing a member.
- `MemberProfile/`: Contains the detailed view for a single member.
  - `MemberProfile.tsx`: The wrapper component handling the tabs and header.
  - `ProfileOverview.tsx`: Displays the member summary and quick actions.
  - `ProfileAttendance.tsx`: Displays attendance statistics and a toggleable calendar view.
  - `ProfilePayments.tsx`: Displays payment history and the ability to print thermal receipts.

### 2. `members_context/`
- `MembersContext.tsx`: The single source of truth for the Members state. Manages API calls via `membersApi`, `plansApi`, and `financeApi`. Handles local search/filter states, controls the visibility of the Add/Edit Modal, manages the global `MessageModal`, and handles the state for `selectedMember` profile viewing.

### 3. `members_utils/`
- `MembersSharedConstants.ts`: Centralizes arrays and mappings such as `MEMBERS_STATUS_COLORS`, `MEMBERS_CYCLE_LABELS`, `EMPTY_MEMBER_FORM`, and utility functions like `formatCurrency` and `getPriceForCycle`.

### 4. Root Files
- `page.tsx`: Initializes the `MembersProvider` and renders the components conditionally based on whether a member is selected.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features.
- `members.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--members-bg-card`) ensuring theme independence.


---

# Plans Module Features & Architecture

## Overview
The Plans module (`app/(erp)/plans`) allows gym administrators to manage their subscription offerings. They can create, edit, and delete tiers (e.g., Basic, Gold, Premium), set 1/3/6/12-month pricing, and list features for each plan.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `plans_components/`
- `PlansToolbar/PlansToolbar.tsx`: Houses the top action bar displaying the count of active plans and the 'Create Plan' button.
- `PlansGrid/PlansGrid.tsx`: Displays the grid of membership plans. Each plan renders its 4 pricing tiers and a checklist of features. It also conditionally renders a 'Most Popular' banner on the second item in the list.
- `PlanModal/PlanModal.tsx`: A self-contained modal form for creating or editing a gym membership plan.

### 2. `plans_context/`
- `PlansContext.tsx`: The single source of truth for the Plans state. Manages API calls via `plansApi`. Handles the form state and controls the visibility for the Plan Modal.

### 3. `plans_utils/`
- `PlansSharedConstants.ts`: Centralizes static data like the `TIERS` array, the empty state shape of the plan form, and a currency formatter function.

### 4. Root Files
- `page.tsx`: Initializes the `PlansProvider` and acts as the structural wrapper, rendering the Toolbar and Grid cleanly without messy inline logic.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features providing a smooth skeleton loading state and error boundary.
- `plans.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--plans-bg-card`) ensuring theme independence.


---

# Attendance Module Features & Architecture

## Overview
The Attendance module (`app/(erp)/attendance`) manages and tracks daily check-ins for both gym members and staff. It provides high-level daily statistics and a filterable history log.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `attendance_components/`
- `AttendanceKPIs/AttendanceKPIs.tsx`: Renders the high-level metrics for today's check-ins (Total, Members, Staff).
- `AttendanceToolbar/AttendanceToolbar.tsx`: Houses the filter tabs (All, Members, Staff) and action buttons (Refresh, Mark Attendance).
- `AttendanceTable/AttendanceTable.tsx`: Displays the filtered list of attendance records, differentiating between members and staff visually.
- `AttendanceModal/AttendanceModal.tsx`: A self-contained modal form for submitting a new attendance check-in for either a member or staff.

### 2. `attendance_context/`
- `AttendanceContext.tsx`: The single source of truth for the Attendance state. Manages API calls via `attendanceApi`, `membersApi`, and `hrApi`. Handles local filter states, and controls the visibility of the Add Modal. This entirely eliminates prop drilling.

### 3. `attendance_utils/`
- `AttendanceSharedConstants.ts`: Centralizes formatting utility functions (`formatDate`, `formatTime`), table headers, and the empty state shape of the attendance form.

### 4. Root Files
- `page.tsx`: Initializes the `AttendanceProvider` and acts as the structural wrapper for the micro-components.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features providing a smooth skeleton loading state and error boundary.
- `attendance.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--attendance-bg-card`) ensuring no hardcoded Tailwind colors break the theme.


---

# Finance Module Features & Architecture

## Overview
The Finance module (`app/(erp)/finance`) provides the main hub for tracking gym revenue, recording payments, and monitoring the financial health of the gym.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `finance_components/`
Contains heavily isolated micro-components. Each file serves exactly one purpose and is highly descriptive:
- `FinanceKPIs/FinanceKPIs.tsx`: Renders the top statistical financial cards.
- `RevenueByMethod/RevenueByMethod.tsx`: Renders the breakdown of revenue by payment methods (UPI, Cash, Card, etc.).
- `FinanceTabs/FinanceTabs.tsx`: Orchestrates the tab switching logic between the detailed Payments Table and the Revenue Summary chart.
- `PaymentsTable/PaymentsTable.tsx`: Displays the detailed list of past payments (loaded conditionally under the "Payments" tab).
- `RevenueSummary/RevenueSummary.tsx`: Displays a visual bar chart of monthly revenue (loaded conditionally under the "Summary" tab).
- `AddPaymentModal/AddPaymentModal.tsx`: A form modal to record a new payment. Contains its own local form state.

### 2. `finance_context/`
- `FinanceContext.tsx`: The single source of truth for the module's core data. It orchestrates the API calls (`financeApi.getPayments` and `financeApi.getSummary`) and provides the `payments`, `summary`, and UI states (`loading`, `showModal`, `toast`) via the `useFinanceContext` hook.

### 3. `finance_utils/`
- `FinanceSharedConstants.ts`: Centralizes backend-ready hardcoded arrays such as `FINANCE_PAYMENT_METHODS`, `PAYMENTS_TABLE_HEADERS`, and status-to-style mappings for consistency.

### 4. Root Files
- `page.tsx`: Wraps `FinanceContent` inside the `FinanceProvider`.
- `loading.tsx`: Native Next.js loading state.
- `error.tsx`: Native Next.js error boundary.
- `finance.css`: Defines module-level CSS variables mapped to the global design system, removing inline Tailwind colors and ensuring a completely theme-independent module.


---

# Sales Module Features & Architecture

## Overview
The Sales module (`app/(erp)/sales`) is the analytics dashboard of the gym. It provides insights into monthly revenue, new member trends, accounts receivable (pending payments), and a full list of all active/expired memberships.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `sales_components/`
- `SalesToolbar/SalesToolbar.tsx`: Houses the top action bar with Date Filters, "Filter by Name", and "Export" functionality.
- `SalesTabs/SalesTabs.tsx`: Renders the sub-navigation tabs (Overview, Membership Report, Pending Payments, All Memberships).
- `SalesOverview/SalesOverview.tsx`: Contains the `ReactApexCharts` visualizing monthly revenue (Bar chart) and new members (Area chart).
- `MembershipReport/MembershipReport.tsx`: Renders a table summarizing receivables, received amounts, and refunds, grouped by membership tier.
- `PendingPayments/PendingPayments.tsx`: Displays a list view of members whose payments are overdue.
- `AllMemberships/AllMemberships.tsx`: A comprehensive table tracking the status, dates, and days remaining for all users' subscriptions.

### 2. `sales_context/`
- `SalesContext.tsx`: The single source of truth for UI state. Manages the active tab and date filter selections, distributing them without prop drilling.

### 3. `sales_utils/`
- `SalesSharedConstants.ts`: Centralizes static types and mock data arrays (`monthlyData`, `membershipReport`, etc.) used across the dashboard.

### 4. Root Files
- `page.tsx`: Initializes the `SalesProvider` and acts as the structural wrapper. It handles the conditional rendering of the 4 tab contents based on the context state.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features providing a smooth skeleton loading state and error boundary.
- `sales.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--sales-bg-card`) ensuring theme independence.


---

# HR Module Features & Architecture

## Overview
The HR module (`app/(erp)/hr`) manages staff profiles, employee payrolls, branch assignments, and related HR analytics.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `hr_components/`
- `HrKPIs/HrKPIs.tsx`: Renders the high-level metrics for staff count and payroll amounts.
- `HrTabs/HrTabs.tsx`: Controls tab switching between the staff directory and payroll records.
- `StaffTable/StaffTable.tsx`: Displays a detailed table of staff members, including quick actions for editing or deleting profiles.
- `PayrollTable/PayrollTable.tsx`: Displays payroll data and provides the action to mark a month's payroll as Paid.
- `StaffModal/StaffModal.tsx`: A self-contained modal form for adding new staff or editing existing staff.

### 2. `hr_context/`
- `HrContext.tsx`: The single source of truth for the HR state. It manages all `hrApi` interactions (fetching staff/payroll, updating records) and exposes the data alongside UI triggers (toast, modal visibility) via `useHrContext`. This prevents massive prop drilling between the Tabs, Tables, and the Modal.

### 3. `hr_utils/`
- `HrSharedConstants.ts`: Houses the `EMPTY_STAFF` initialization object, select dropdown options (`GENDER_OPTIONS`, `BRANCH_OPTIONS`), and table headers to ensure one single point of modification.

### 4. Root Files
- `page.tsx`: Initializes the `HrProvider` and imports the micro-components to assemble the page.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features.
- `hr.css`: Removes dependency on inline hardcoded Tailwind colors by mapping to the global design system (e.g. `--hr-bg-card` => `var(--bg-card)`).


---

# Inquiries Module Features & Architecture

## Overview
The Inquiries module (`app/(erp)/inquiries`) tracks new leads, handles follow-ups, and manages lead statuses to convert potential clients into members. It includes email and WhatsApp messaging integrations.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `inquiries_components/`
- `InquiriesKPIs/InquiriesKPIs.tsx`: Renders the high-level metrics for new, follow-up, and converted leads.
- `InquiriesToolbar/InquiriesToolbar.tsx`: Houses the search input, status filter select, and the button to add a new inquiry.
- `InquiriesTable/InquiriesTable.tsx`: Displays the filtered list of inquiries with actions to edit, delete, update status, and send messages via WhatsApp or Email.
- `InquiryModal/InquiryModal.tsx`: A self-contained modal form for adding or editing an inquiry.

### 2. `inquiries_context/`
- `InquiriesContext.tsx`: The single source of truth for the Inquiries state. Manages API calls via `inquiriesApi`, handles local search/filter states, and controls the visibility of the Add/Edit Modal and the global `MessageModal`. This entirely eliminates prop drilling from the top level.

### 3. `inquiries_utils/`
- `InquiriesSharedConstants.ts`: Centralizes arrays such as `INQUIRY_SOURCES`, `INQUIRIES_TABLE_HEADERS`, `EMPTY_INQUIRY_FORM`, and maps styling colors to statuses (e.g. `NEW`, `FOLLOW_UP`). It also houses the `generateDefaultMessage` utility function.

### 4. Root Files
- `page.tsx`: Initializes the `InquiriesProvider` and renders the components.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features.
- `inquiries.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--inquiries-bg-card`) ensuring no hardcoded Tailwind colors break the theme.


---

# Library Module Features & Architecture

## Overview
The Library module (`app/(erp)/library`) manages the gym's catalog of Exercises and Diet Plans. It allows staff to create, edit, and delete both exercises and nutritional plans, which can later be assigned to members.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `library_components/`
- `LibraryTabs/LibraryTabs.tsx`: Houses the filter tabs ('Exercises' vs 'Diet Plans') and the action buttons for refreshing or adding new items.
- `ExerciseGrid/ExerciseGrid.tsx`: Displays the catalog of exercises as cards with their difficulty, muscle groups, and actions (edit/delete).
- `DietGrid/DietGrid.tsx`: Displays the catalog of diet plans as cards with their macros, goals, and meals list.
- `ExerciseModal/ExerciseModal.tsx`: A self-contained modal form for creating or editing an Exercise.
- `DietModal/DietModal.tsx`: A self-contained modal form for creating or editing a Diet Plan.

### 2. `library_context/`
- `LibraryContext.tsx`: The single source of truth for the Library state. Manages API calls via `workoutApi`. Handles local tab state, and controls the form states and visibility for *both* the Exercise Modal and the Diet Modal. This entirely eliminates prop drilling and keeps the components pure.

### 3. `library_utils/`
- `LibrarySharedConstants.ts`: Centralizes static data like `CATEGORIES`, `DIFFICULTIES`, `GOALS`, and the empty state shape of the forms.

### 4. Root Files
- `page.tsx`: Initializes the `LibraryProvider` and acts as the structural wrapper, rendering the Tabs and swapping between `ExerciseGrid` and `DietGrid` based on the context.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features providing a smooth skeleton loading state and error boundary.
- `library.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--library-bg-card`) ensuring theme independence.


---

# Workout Module Features & Architecture

## Overview
The Workout module (`app/(erp)/workout`) serves as a comprehensive database for the gym's exercise library and pre-defined workout programs. Staff can create and edit exercises (categorized by muscle and equipment) and group them into complete workout plans (e.g. "Push Pull Legs") with tags, levels, and durations.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `workout_components/`
- `WorkoutBanner/WorkoutBanner.tsx`: A static gradient hero banner displaying a dynamic count of the total programs and exercises.
- `WorkoutToolbar/WorkoutToolbar.tsx`: Houses the tab navigation ('Workout Plans' vs 'Exercise Library'), the real-time search input, and the dynamic 'Add' button.
- `WorkoutPlansGrid/WorkoutPlansGrid.tsx`: Displays the catalog of workout programs as cards showing their tags, duration, level, and actions.
- `ExerciseTable/ExerciseTable.tsx`: Displays a list of individual exercises, their targeted muscles, required equipment, and difficulty levels.
- `WorkoutModal/WorkoutModal.tsx`: A self-contained modal form for creating or editing a full workout plan.
- `ExerciseModal/ExerciseModal.tsx`: A self-contained modal form for creating or editing a single exercise.

### 2. `workout_context/`
- `WorkoutContext.tsx`: Centralizes all state including tabs, search filters, modal visibility, and handles the CRUD (Create, Read, Update, Delete) operations for both the `workouts` and `exercises` arrays. 

### 3. `workout_utils/`
- `WorkoutSharedConstants.ts`: Centralizes static Types (`Workout`, `Exercise`), the initial mock data arrays (`INITIAL_WORKOUTS`, `INITIAL_EXERCISES`), and the empty forms schemas.

### 4. Root Files
- `page.tsx`: Initializes the `WorkoutProvider` and acts as the structural wrapper, rendering the active tab content cleanly.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features providing a smooth skeleton loading state and error boundary.
- `workout.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--workout-bg-card`) ensuring theme independence.


---

# Store Module Features & Architecture

## Overview
The Store module (`app/(erp)/store`) is the gym's Point of Sale (POS) and inventory management system. It allows staff to manage products (supplements, equipment, merch), track inventory levels (with low-stock alerts), place orders via the POS modal, and generate thermal receipts.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `store_components/`
- `StoreKPIs/StoreKPIs.tsx`: Renders the top summary cards (Total Products, Orders, Revenue) and the dynamic low-stock alert banner.
- `StoreToolbar/StoreToolbar.tsx`: Houses the tab navigation ('Products' vs 'Orders') and the action buttons for refreshing, adding products, or opening the POS.
- `ProductGrid/ProductGrid.tsx`: Displays the catalog of products as cards with their price, stock level, and edit/delete actions.
- `OrderTable/OrderTable.tsx`: Renders the history of placed orders with the ability to re-print receipts.
- `ProductModal/ProductModal.tsx`: A self-contained modal form for creating or editing a product.
- `PosModal/PosModal.tsx`: The complex Point of Sale modal. It manages the active cart, allows adding/removing items, calculates totals, handles checkout, and triggers the receipt print flow.

### 2. `store_context/`
- `StoreContext.tsx`: The heavy-lifter of the module. It centralizes all state (products, orders, summary, modal visibility, active cart, and print data) and manages all API calls to `storeApi`. This eliminates prop drilling completely.

### 3. `store_utils/`
- `StoreSharedConstants.ts`: Centralizes static data like `CATEGORIES`, `PAYMENT_METHODS`, the currency formatter function, and the empty product form schema.

### 4. Root Files
- `page.tsx`: Initializes the `StoreProvider` and acts as the structural wrapper, cleanly rendering the modular components based on the active tab state.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features providing a smooth skeleton loading state and error boundary.
- `store.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--store-bg-card`) ensuring theme independence.


---

# Settings Module Features & Architecture

## Overview
The Settings module (`app/(erp)/settings`) allows gym administrators to configure global application settings, including Gym Profile, Notifications, Roles & Permissions, App Integrations, and General System Preferences.

## AI-Context Architecture
This module has been refactored into a strictly AI-Friendly, micro-modularized structure following the `frontend_development_instruction.md` guidelines.

### 1. `settings_components/`
- `SettingsNav/SettingsNav.tsx`: Displays a grid of cards that acts as the primary navigation between different settings categories.
- `SettingsContent/SettingsContent.tsx`: The main dynamic area. Currently, it renders the form for 'Gym Profile' and acts as a placeholder for other tabs.
- `SettingsBanner/SettingsBanner.tsx`: A static, promotional banner displayed at the bottom of the page for free demos.

### 2. `settings_context/`
- `SettingsContext.tsx`: The single source of truth for the settings UI state. Manages the active tab, the form values, and the `fetch` and `save` API calls to the `/settings` endpoint.

### 3. `settings_utils/`
- `SettingsSharedConstants.ts`: Centralizes static data like the configuration array for the settings navigation cards (icons, colors, titles) and the empty form schema.

### 4. Root Files
- `page.tsx`: Initializes the `SettingsProvider` and acts as the structural wrapper, cleanly rendering the Navigation, Content, and Banner components.
- `loading.tsx` & `error.tsx`: Built-in Next.js layout features providing a smooth skeleton loading state and error boundary.
- `settings.css`: Maps generic global tokens (`var(--bg-card)`) to module-level tokens (`--settings-bg-card`) ensuring theme independence.


