// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
import React from 'react';
import { Dumbbell } from 'lucide-react';

export default function TrainerWorkoutEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-input rounded-full flex items-center justify-center mb-4">
        <Dumbbell className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">No Workout Plans</h3>
      <p className="text-secondary text-sm text-center max-w-md">
        You haven't created any workout plans yet.
      </p>
    </div>
  );
}
