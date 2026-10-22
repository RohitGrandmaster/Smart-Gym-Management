// RESPONSIBILITY: Centralized chart color constants for all Superadmin ApexCharts configurations.
// Maps design system CSS variable values to hex codes for use in ApexCharts configs
// (CSS variables cannot be used directly inside ApexCharts options objects).
//
// Design §10: canonical chart library is ApexCharts. Colors must match design tokens.
// Design §1: PRIMARY = #FACC15 (Premium Gold), not indigo.

export const CHART_COLORS = {
  PRIMARY: '#FACC15',        // --primary (Premium Gold) — Design §1
  TEXT_SECONDARY: '#A1A1AA', // --text-secondary (dark mode) — Design §1
  BORDER: '#27272A',         // --border Zinc-800 (dark mode) — Design §1
  SUCCESS: '#22C55E',        // --success (Stronger Fitness Green) — Design §1
  DANGER: '#EF4444',         // --danger (Red) — Design §1
  WARNING: '#F59E0B',        // --warning (Amber) — Design §1
  INFO: '#3B82F6',           // --info (Blue) — Design §1
} as const;
