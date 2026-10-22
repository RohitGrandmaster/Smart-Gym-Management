// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Entry component for the Diet Library module. Wraps the UI in the context provider and handles page layout.
'use client';

import TrainerHeader from '@/app/trainer/trainer_components/TrainerLayout/TrainerHeader';
import TrainerToast from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import { LibraryProvider, useLibraryContext } from '@/app/trainer/library/library_context/LibraryContext';
import TrainerLibraryTabs from '@/app/trainer/library/library_components/TrainerLibraryTabs/TrainerLibraryTabs';
import TrainerLibraryDietModal from '@/app/trainer/library/library_components/TrainerLibraryDietModal/TrainerLibraryDietModal';
import TrainerLibraryDietGrid from '@/app/trainer/library/library_components/TrainerLibraryDietGrid/TrainerLibraryDietGrid';
import type { LibraryInitialData } from '@/app/trainer/library/library_types/library_types';

function LibraryContent() {
 const { toast, hideToast } = useLibraryContext();

 return (
 <div className="min-h-full pb-10 bg-background text-foreground">
 <TrainerHeader title="Library" subtitle="Manage diet plans for member assignments" />
 <div className="p-6 space-y-5">
 <TrainerLibraryTabs />
 
 <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden p-5">
   <TrainerLibraryDietGrid />
 </div>
 </div>

 <TrainerLibraryDietModal />

 {toast && (
 <TrainerToast message={toast.message} type={toast.type} onClose={hideToast} />
 )}
 </div>
 );
}

export default function TrainerLibraryMain({ initialData }: { initialData?: LibraryInitialData | null }) {
 return (
 <LibraryProvider initialData={initialData}>
 <LibraryContent />
 </LibraryProvider>
 );
}

