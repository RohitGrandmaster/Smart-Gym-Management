// RESPONSIBILITY: Root shell layout for all MANAGER pages. Composes ManagerSidebar with the main content area. Manages sidebar collapsed state only.
'use client';

import { useState } from 'react';
import ManagerSidebar from '@/app/manager/manager_components/ManagerLayout/ManagerSidebar';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

 return (
 <div className="flex h-screen overflow-hidden bg-background text-foreground">
 <ManagerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
 <main className={`flex-1 flex flex-col h-screen overflow-y-auto transition-all duration-300 ${isCollapsed ? 'lg:ml-23' : 'lg:ml-64'}`}>
 {children}
 </main>
 </div>
 );
}
