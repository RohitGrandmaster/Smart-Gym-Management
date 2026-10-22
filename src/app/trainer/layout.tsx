// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Root layout for the TRAINER module. Wraps all TRAINER pages with the sidebar layout and feedback providers.
import React from 'react';
import TrainerLayout from '@/app/trainer/trainer_components/TrainerLayout/TrainerLayout';
import { TrainerConfirmProvider } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerConfirmProvider';

export const metadata = {
  title: 'GymSmart TRAINER | Gym Management System',
  description: 'Complete gym management platform — members, attendance, finance, HR, and more.',
};

export default function TRAINERLayout({ children }: { children: React.ReactNode }) {
 return (
    <TrainerConfirmProvider>
      <TrainerLayout>{children}</TrainerLayout>
    </TrainerConfirmProvider>
  );
}

