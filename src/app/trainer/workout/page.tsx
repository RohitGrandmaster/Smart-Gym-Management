// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Server Component — fetches initial SSR data and renders the Workout Library module entry point.
import TrainerWorkoutMain from '@/app/trainer/workout/workout_components/TrainerWorkoutMain/TrainerWorkoutMain';

export default function WorkoutPage() {
 return <TrainerWorkoutMain />;
}

