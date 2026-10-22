# Landing Module — Theme Portability Contract

To ensure this module can be safely ported or re-themed without breaking, it strictly relies on the following CSS variables defined in the global design system (`globals.css` -> `tailwind.config.ts`), as well as localized variables in `landing.css`.

**DO NOT hardcode Tailwind colors (e.g., `bg-blue-500`, `text-[#1A1A2E]`) anywhere in this module.**

## Core Backgrounds
- `--bg-page`: Main background for sections.
- `--bg-card`: Background for feature, trainer, and pricing cards.
- `--bg-header`: Sticky navbar background.

## Borders
- `--border`: Standard card and section borders.

## Typography
- `--text-primary`: Primary headings, major text.
- `--text-secondary`: Body text, captions.

## Brand & UI Elements
- `--primary`: Primary brand color for CTAs, highlighted text, and buttons.
- `--primary-hover`: Hover state for primary buttons.
- `--primary-subtle`: Subtle backgrounds for badges or active items.

## Localized CSS Variables (`landing.css`)
- The landing module relies on complex gradient classes defined in `landing.css` (e.g., `.landing-service-icon--bodybuilding`). Do NOT attempt to build dynamic gradients using Tailwind inline strings; always refer to the static classes in the CSS file.
