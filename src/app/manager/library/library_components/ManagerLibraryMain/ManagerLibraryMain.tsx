// RESPONSIBILITY: Entry component for the Diet Library module. Wraps the UI in the context provider and handles page layout.
'use client';

import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import ManagerToast from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { LibraryProvider, useLibraryContext } from '@/app/manager/library/library_context/ManagerLibraryContext';
import ManagerLibraryTabs from '@/app/manager/library/library_components/ManagerLibraryTabs/ManagerLibraryTabs';

import ManagerLibraryDietGrid from '@/app/manager/library/library_components/ManagerLibraryDietGrid/ManagerLibraryDietGrid';
import ManagerLibraryDietModal from '@/app/manager/library/library_components/ManagerLibraryDietModal/ManagerLibraryDietModal';
import type { LibraryInitialData } from '@/app/manager/library/library_types/ManagerLibraryTypes';

function LibraryContent() {
 const { toast, hideToast } = useLibraryContext();

 return (
 <div className="min-h-full pb-10 bg-background text-foreground">
 <ManagerHeader title="Diet Management" subtitle="Manage exercises and diet plans for member assignments" />
 <div className="p-6 space-y-5">
 <ManagerLibraryTabs />
 
 <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden p-5">
   <ManagerLibraryDietGrid />
 </div>
 </div>


 <ManagerLibraryDietModal />

 {toast && (
 <ManagerToast message={toast.message} type={toast.type} onClose={hideToast} />
 )}
 </div>
 );
}

export default function ManagerLibraryMain({ initialData }: { initialData?: LibraryInitialData | null }) {
 return (
 <LibraryProvider initialData={initialData}>
 <LibraryContent />
 </LibraryProvider>
 );
}
