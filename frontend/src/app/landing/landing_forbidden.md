# Forbidden Patterns for the Landing Module

This file documents explicit anti-patterns that must **NEVER** be used in the `landing` module.
Future AI sessions: read this file before touching any component in this module.

1. **Do NOT use dynamic Tailwind class strings for gradients** (e.g. `bg-gradient-to-br ${variable}`).
   Tailwind's purge scanner cannot detect dynamically constructed class names, resulting in missing styles in production.
   Always define gradient classes statically in `landing.css` (e.g. `.landing-service-icon--bodybuilding`) and apply them via a static constant field (e.g. `colorClass`).
   *(Rule 4, 36)*

2. **Do NOT place the `// RESPONSIBILITY:` comment before `"use client"`**.
   The comment must always appear directly AFTER `"use client"` — never before it.
   `"use client"` must be the absolute first line of any Client Component file.
   *(Frontend Rule 38)*

3. **Do NOT define inline data (arrays, objects) directly inside `.tsx` component files.**
   All hardcoded UI data (trainer list, service list, plan list, schedule, testimonials, etc.)
   belongs exclusively in `landing_utils/LandingSharedConstants.ts`.
   *(Rule 3)*

4. **Do NOT use raw CSS variable strings as className or style values for dynamic color states.**
   E.g., setting `color: 'var(--info)'` from a hook and passing it to a `className`.
   Instead, return a CSS class name string (e.g. `'bmi-result--underweight'`) from the hook and apply it as a className.
   The actual `color` property is then defined statically in `landing.css`.
   *(Rule 4)*

5. **Do NOT use arbitrary Tailwind values** (e.g. `to-[#1a1a1a]`, `w-[325px]`, `text-[15px]`).
   Every visual property must be expressed through a design system token (e.g. `bg-background`, `text-secondary`)
   or a CSS variable defined in `landing.css` or `globals.css`.
   *(Rule 36)*

6. **Do NOT define TypeScript types or interfaces inside `.tsx` component files.**
   All types belong in `landing_types/landing_types.ts`.
   *(Rule 7)*

7. **Do NOT use relative imports** (e.g. `../../`).
   Always use absolute `@/app/landing/...` imports.
   *(Rule 10)*

8. **Do NOT create barrel files** (`index.ts` / `index.js`).
   Always import directly from the exact file path.
   *(Rule 32)*

9. **Do NOT mix complex logic (state, effects, calculations) with JSX in the same function.**
   Extract all logic to `useLandingLogic.ts`. The `.tsx` files must be pure view layers.
   *(Rule 6)*

10. **Do NOT use `any` TypeScript type.**
    Use `unknown` + type narrowing or explicit interfaces.
    *(Rule 27)*
