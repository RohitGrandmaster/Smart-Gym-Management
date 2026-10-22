import type { Metadata } from 'next';
import AdminSubscriptionsMain from '@/app/admin/subscriptions/subscriptions_components/AdminSubscriptionsMain/AdminSubscriptionsMain';

export const metadata: Metadata = {
  title: 'Subscription & Billing | Admin - GymSmart',
  description: 'Manage your GymSmart SaaS subscription, invoices, and payment methods.',
};

export default function AdminSubscriptionsPage() {
  return <AdminSubscriptionsMain />;
}
