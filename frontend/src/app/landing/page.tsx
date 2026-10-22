// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Server Component entry point for /landing. Renders LandingMain which
// bootstraps the LandingProvider context tree and all 15 section components.
// No API calls or data fetching — the landing page uses static/mocked data from LandingSharedConstants.
import LandingMain from '@/app/landing/landing_components/LandingMain/LandingMain';

export default function LandingPage() {
  return <LandingMain />;
}

