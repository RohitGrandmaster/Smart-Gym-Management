// RESPONSIBILITY: Entry component for the Store module. Wraps the UI in the context provider and handles page layout.
'use client';

import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import ManagerToast from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import ManagerThermalReceipt from '@/app/manager/manager_components/ManagerShared/ManagerThermalReceipt';

import { StoreProvider, useStoreContext } from '@/app/manager/store/store_context/ManagerStoreContext';
import ManagerStoreKPIs from '@/app/manager/store/store_components/ManagerStoreKPIs/ManagerStoreKPIs';
import ManagerStoreToolbar from '@/app/manager/store/store_components/ManagerStoreToolbar/ManagerStoreToolbar';
import ManagerStoreFilters from '@/app/manager/store/store_components/ManagerStoreFilters/ManagerStoreFilters';
import ManagerStoreProductGrid from '@/app/manager/store/store_components/ManagerStoreProductGrid/ManagerStoreProductGrid';
import ManagerStoreOrderTable from '@/app/manager/store/store_components/ManagerStoreOrderTable/ManagerStoreOrderTable';
import type { StoreInitialData } from '@/app/manager/store/store_types/ManagerStoreTypes';
import dynamic from 'next/dynamic';

const ManagerStoreProductModal = dynamic(() => import('@/app/manager/store/store_components/ManagerStoreProductModal/ManagerStoreProductModal'), { ssr: false });
const ManagerStorePosModal = dynamic(() => import('@/app/manager/store/store_components/ManagerStorePosModal/ManagerStorePosModal'), { ssr: false });


function StoreContent() {
  const { tab, toast, hideToast, printData } = useStoreContext();

  return (
    <div className="min-h-full pb-10 store-module bg-background text-foreground">
      <ManagerHeader title="Store" subtitle="Manage products, inventory and sales" />
      <div className="p-6 space-y-5">
        
        <ManagerStoreKPIs />

        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <ManagerStoreToolbar />
          {tab === 'Orders' && <ManagerStoreFilters />}

          <div className="p-5">
            {tab === 'Products' ? <ManagerStoreProductGrid /> : <ManagerStoreOrderTable />}
          </div>
        </div>
      </div>

      <ManagerStoreProductModal />
      <ManagerStorePosModal />

      {toast && (
        <ManagerToast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      
      {printData && (
        <ManagerThermalReceipt data={printData} />
      )}
    </div>
  );
}

export default function ManagerStoreMain({ initialData }: { initialData?: StoreInitialData }) {
  return (
    <StoreProvider initialData={initialData}>
      <StoreContent />
    </StoreProvider>
  );
}
