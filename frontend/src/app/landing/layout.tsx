// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Thin layout wrapper for the /landing route segment.
// Intentionally minimal — the landing module manages its own background, fonts,
// and wrapper div via LandingMain.tsx and landing.css.
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

