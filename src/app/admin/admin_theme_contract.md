# Admin Module — Theme Portability Contract

To ensure this module can be safely ported or re-themed without breaking, it strictly relies on the following CSS variables defined in the global design system (`globals.css` -> `tailwind.config.ts`).

**DO NOT hardcode Tailwind colors (e.g., `bg-blue-500`, `text-[#1A1A2E]`) anywhere in this module.**

## Core Backgrounds
- `--bg-page`: Main page background.
- `--bg-card`: Background for cards, panels, and tables.
- `--bg-sidebar`: Admin sidebar background.
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
