// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Root shell layout for all TRAINER pages. Composes TrainerSidebar with the main content area. Manages sidebar collapsed state only.
'use client';

import { useState } from 'react';
import TrainerSidebar from '@/app/trainer/trainer_components/TrainerLayout/TrainerSidebar';

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

 return (
 <div className="flex h-screen overflow-hidden bg-background text-foreground">
 <TrainerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
 <main className={`flex-1 flex flex-col h-screen overflow-y-auto motion-safe:transition-all motion-safe:duration-300 ${isCollapsed ? 'lg:ml-23' : 'lg:ml-64'}`}>
 {children}
 </main>
 </div>
 );
}

