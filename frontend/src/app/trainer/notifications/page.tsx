// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the notifications page.
import { Metadata } from 'next';
import TrainerNotificationsMain from '@/app/trainer/notifications/notifications_components/TrainerNotificationsMain/TrainerNotificationsMain';

export const metadata: Metadata = {
  title: 'Notifications | Trainer — GymSmart',
  description: 'View and manage your gym notifications.',
};

export default function TrainerNotificationsPage() {
  return <TrainerNotificationsMain />;
}
