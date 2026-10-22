// RESPONSIBILITY: page.tsx handles the logic and UI for its corresponding feature.
import { redirect } from 'next/navigation';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';

export default function SaaSRootPage() {
  redirect(SuperadminUrlConfig.PAGES.DASHBOARD);
}




