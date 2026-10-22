# Superadmin Module — Theme Portability Contract

To ensure this module can be safely ported or re-themed without breaking, it strictly relies on the following CSS variables defined in the global design system (`globals.css` -> `tailwind.config.ts`), as well as localized variables in `superadmin.css`.

**DO NOT hardcode Tailwind colors (e.g., `bg-blue-500`, `text-[#1A1A2E]`) anywhere in this module.**

## Core Backgrounds
- `--bg-page`: Main page background.
- `--bg-card`: Background for cards, panels, and tables.
- `--bg-sidebar`: Superadmin sidebar background.
- `--bg-header`: Top navbar background.
- `--bg-input`: Form input background.

## Borders
- `--border`: Standard card, table, and input borders.
- `--border-focus`: Active input focus ring.

## Typography
- `--text-primary`: Primary headings, table values.
- `--text-secondary`: Labels, captions, placeholders.
- `--text-disabled`: Disabled state text.

## Status Colors (Background & Text)
- `--success`: Active, Working, Paid.
- `--warning`: Pending, Expiring.
- `--danger`: Overdue, Suspended.
- `--info`: New, Neutral.

## Skeletons
- `--skeleton-base`: Loading skeleton base.
- `--skeleton-highlight`: Loading skeleton shimmer.

## Surface Elevation (Design System §28 — Dark Mode Depth)
Used to convey visual depth in dark mode where shadows are invisible.
- `--bg-floating` (`bg-floating`): Inputs, code blocks — Layer 2.
- `--bg-overlay` (`bg-overlay`): Modals, dialogs, drawers — Layer 3.
- `--bg-popover` (`bg-popover`): Dropdowns, tooltips, command palette — Layer 4.

**Rule:** Modals use `bg-overlay`, dropdowns use `bg-popover`. In light mode, combine with `shadow-2xl`. In dark mode, elevation + `border border-border` provides depth.

## Accent — Purple (Plans & Enterprise Badges)
Used for Enterprise plan badges and end-user count metrics.
- `--purple`: Text color for purple accent elements (e.g., `text-purple`).
- `--purple-bg` / `bg-purple-bg`: Background for purple badge chips.
