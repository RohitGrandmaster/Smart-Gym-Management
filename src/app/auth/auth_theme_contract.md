# Auth Module — Theme Portability Contract

To ensure this module can be safely ported or re-themed without breaking, it strictly relies on the following CSS variables defined in the global design system (`globals.css` -> `tailwind.config.ts`).

**DO NOT hardcode Tailwind colors (e.g., `bg-blue-500`, `text-[#1A1A2E]`) anywhere in this module.**

## Core Backgrounds
- `--bg-page`: Main background for the auth layout.
- `--bg-card`: Background for the login/auth form cards.
- `--bg-input`: Background for email/password input fields.

## Borders
- `--border`: Standard card and input borders.
- `--border-focus`: Active input focus ring for auth forms.

## Typography
- `--text-primary`: Primary headings, form labels.
- `--text-secondary`: Captions, placeholders, "Forgot Password" text.

## Status Colors (Background & Text)
- `--danger`: Error messages (e.g., "Invalid credentials").
- `--success`: Success messages (if applicable).

## Skeletons & Loaders
- `--primary`: Primary brand color for the "Sign In" button and loading spinner.
