// RESPONSIBILITY: Provides the implementation for AdminSalesTabs.tsx functionality within its module.
'use client';

import { useAdminSalesLogic } from '@/app/admin/sales/sales_context/useAdminSalesLogic';
import { SALES_TABS } from '@/app/admin/sales/sales_utils/AdminSalesSharedConstants';

export default function AdminSalesTabs() {
 const { tab, setTab } = useAdminSalesLogic();

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


