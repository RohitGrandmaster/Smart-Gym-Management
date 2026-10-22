import { redirect } from 'next/navigation';

// Progress tracking is member-specific and lives inside each member's profile tabs.
// Redirect to members directory where the trainer can select any member and view their progress.
export default function TrainerProgressTrackingPage() {
  redirect('/trainer/members');
}

