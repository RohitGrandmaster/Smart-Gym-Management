// RESPONSIBILITY: Provides the implementation for ManagerSalesTabs.tsx functionality within its module.
'use client';

import { useSalesContext } from '@/app/manager/sales/sales_context/ManagerSalesContext';
import { SALES_TABS } from '@/app/manager/sales/sales_utils/ManagerSalesSharedConstants';

export default function ManagerSalesTabs() {
 const { tab, setTab } = useSalesContext();

 return (
 <div className="border-b border-border flex overflow-x-auto bg-card">
 {SALES_TABS.map(t => (
 <button 
 key={t} 
 onClick={() => setTab(t)}
 className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
 tab === t 
 ? 'text-primary bg-primary/5 border-primary' 
 : 'border-transparent text-secondary hover:text-foreground'
 }`}
 >
 {t}
 </button>
 ))}
 </div>
 );
}
