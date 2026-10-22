// RESPONSIBILITY: Entry component for the Workout Library module. Wraps the UI in the context provider and handles page layout.
'use client';

import React from 'react';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import { WorkoutProvider, useWorkoutContext } from '@/app/manager/workout/workout_context/ManagerWorkoutContext';
import ManagerWorkoutBanner from '@/app/manager/workout/workout_components/ManagerWorkoutBanner/ManagerWorkoutBanner';
import ManagerWorkoutToolbar from '@/app/manager/workout/workout_components/ManagerWorkoutToolbar/ManagerWorkoutToolbar';
import ManagerWorkoutPlansGrid from '@/app/manager/workout/workout_components/ManagerWorkoutPlansGrid/ManagerWorkoutPlansGrid';
import ManagerWorkoutExerciseTable from '@/app/manager/workout/workout_components/ManagerWorkoutExerciseTable/ManagerWorkoutExerciseTable';
import ManagerWorkoutModal from '@/app/manager/workout/workout_components/ManagerWorkoutModal/ManagerWorkoutModal';
import ManagerWorkoutExerciseModal from '@/app/manager/workout/workout_components/ManagerWorkoutExerciseModal/ManagerWorkoutExerciseModal';


function WorkoutContent() {
  const { tab } = useWorkoutContext();
  const [activeTab, setActiveTab] = React.useState('View Workout Plans');

  return (
  <div className="min-h-full pb-10 workout-module bg-background text-foreground">
  <ManagerHeader title="Workout Management" subtitle="Comprehensive exercise and workout plan database" />
  
  <div className="p-6 space-y-5">
  <ManagerWorkoutBanner />

   <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
     <div className="border-b border-border flex gap-4 p-4 overflow-x-auto">
       {['View Workout Plans', 'View Assigned Plans', 'Exercise Library'].map(t => (
         <button 
           key={t}
           onClick={() => setActiveTab(t)} 
           className={`px-4 py-2 whitespace-nowrap font-semibold border-b-2 transition-colors ${activeTab === t ? 'text-primary border-primary' : 'text-secondary border-transparent hover:text-foreground'}`}
         >
           {t}
         </button>
       ))}
     </div>

     {activeTab === 'View Workout Plans' && (
       <>
         <ManagerWorkoutToolbar />
         <div className="p-5">
           {tab === 'Workout Plans' ? <ManagerWorkoutPlansGrid /> : <ManagerWorkoutExerciseTable />}
         </div>
       </>
     )}

     {activeTab === 'View Assigned Plans' && (
       <div className="p-5">
         <h3 className="text-lg font-bold text-foreground mb-4">Assigned Workout Plans</h3>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border">
                 <th className="py-3 px-4 text-sm font-medium text-secondary">Member Name</th>
                 <th className="py-3 px-4 text-sm font-medium text-secondary">Assigned Plan</th>
                 <th className="py-3 px-4 text-sm font-medium text-secondary">Assigned By</th>
                 <th className="py-3 px-4 text-sm font-medium text-secondary">Start Date</th>
                 <th className="py-3 px-4 text-sm font-medium text-secondary text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               <tr>
                 <td className="py-3 px-4 text-sm text-foreground">Amit Sharma</td>
                 <td className="py-3 px-4 text-sm text-secondary">Beginner Weight Loss</td>
                 <td className="py-3 px-4 text-sm text-secondary">Vikram (Head Trainer)</td>
                 <td className="py-3 px-4 text-sm text-secondary">01 Sept 2026</td>
                 <td className="py-3 px-4 text-right">
                   <button className="px-3 py-1.5 text-xs font-semibold bg-input text-foreground rounded-lg hover:opacity-90 transition-opacity">View Progress</button>
                 </td>
               </tr>
               <tr>
                 <td className="py-3 px-4 text-sm text-foreground">Neha Verma</td>
                 <td className="py-3 px-4 text-sm text-secondary">Advanced Hypertrophy</td>
                 <td className="py-3 px-4 text-sm text-secondary">Rahul (Strength)</td>
                 <td className="py-3 px-4 text-sm text-secondary">05 Sept 2026</td>
                 <td className="py-3 px-4 text-right">
                   <button className="px-3 py-1.5 text-xs font-semibold bg-input text-foreground rounded-lg hover:opacity-90 transition-opacity">View Progress</button>
                 </td>
               </tr>
             </tbody>
           </table>
         </div>
       </div>
     )}

     {activeTab === 'Exercise Library' && (
       <>
         <ManagerWorkoutToolbar />
         <div className="p-5">
           <ManagerWorkoutExerciseTable />
         </div>
       </>
     )}
  </div>
  </div>

 <ManagerWorkoutModal />
 <ManagerWorkoutExerciseModal />
 </div>
 );
}

export default function ManagerWorkoutMain() {
 return (
 <WorkoutProvider>
 <WorkoutContent />
 </WorkoutProvider>
 );
}
