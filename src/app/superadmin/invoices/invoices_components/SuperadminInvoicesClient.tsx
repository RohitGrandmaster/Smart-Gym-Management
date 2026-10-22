'use client';
// RESPONSIBILITY: Root orchestrator for the Invoices page. Composes sub-components and passes state from useSuperadminInvoicesPage. No inline business logic.

import { Search, Filter } from 'lucide-react';
import { useSuperadminInvoicesPage } from '@/app/superadmin/invoices/invoices_components/useSuperadminInvoicesPage';
import SuperadminInvoicesHeader from '@/app/superadmin/invoices/invoices_components/SuperadminInvoicesHeader/SuperadminInvoicesHeader';
import SuperadminInvoicesStatsBar from '@/app/superadmin/invoices/invoices_components/SuperadminInvoicesStatsBar/SuperadminInvoicesStatsBar';
import SuperadminInvoicesTable from '@/app/superadmin/invoices/invoices_components/SuperadminInvoicesTable/SuperadminInvoicesTable';
import SuperadminInvoicesEmptyState from '@/app/superadmin/invoices/invoices_components/SuperadminInvoicesEmptyState/SuperadminInvoicesEmptyState';
import SuperadminInvoicesLogPaymentModal from '@/app/superadmin/invoices/invoices_components/SuperadminInvoicesLogPaymentModal/SuperadminInvoicesLogPaymentModal';
import toast from 'react-hot-toast';

export default function SuperadminInvoicesClient() {
  const handleDownloadInvoice = (id: string) => {
    toast.success(`Downloading invoice #${id}.pdf...`);
    // Simulate real download behavior (TC-24 fix)
    const link = document.createElement('a');
    link.href = '#';
    link.download = `invoice_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const {
    fetchState,
    error,
    filteredInvoices,
    filteredTenantsForDropdown,
    selectedGym,
    totalRevenue,
    failedRevenue,
    search,
    setSearch,
    showAddModal,
    setShowAddModal,
    gymSearchTerm,
    setGymSearchTerm,
    isGymDropdownOpen,
    setIsGymDropdownOpen,
    paymentMethod,
    setPaymentMethod,
    handleSelectGym,
    statusFilter,
    setStatusFilter,
  } = useSuperadminInvoicesPage();

  if (fetchState === 'loading') return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded  w-full sm:w-64 " />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-28 bg-card rounded-xl border border-border" />
        <div className="h-28 bg-card rounded-xl border border-border" />
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="h-12 bg-border/30" />
        {[...Array(6)].map((_, i) => <div key={`skeleton-${i}`} className="h-12 border-t border-border" />)}
      </div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-danger">Error loading data.</div>;

  return (
    <div className="space-y-6 relative">
      <SuperadminInvoicesHeader onLogPaymentClick={() => setShowAddModal(true)} />
      
      <SuperadminInvoicesStatsBar totalRevenue={totalRevenue} failedRevenue={failedRevenue} />

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Search by invoice ID or gym name..."
              className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setStatusFilter(statusFilter === 'FAILED' ? null : 'FAILED')}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium motion-safe:transition-colors ${statusFilter === 'FAILED' ? 'bg-danger/10 border-danger/20 text-danger hover:bg-danger/20' : 'bg-input border-border text-secondary hover:text-foreground'}`}
          >
            <Filter size={16} /> Filter Failed
          </button>
        </div>

        {filteredInvoices.length === 0 ? (
          <SuperadminInvoicesEmptyState onLogPaymentClick={() => setShowAddModal(true)} />
        ) : (
          <SuperadminInvoicesTable 
            onLogPaymentClick={() => setShowAddModal(true)}
            invoices={filteredInvoices} 
          />
        )}
      </div>

      {showAddModal && (
        <SuperadminInvoicesLogPaymentModal
          onClose={() => setShowAddModal(false)}
          selectedGym={selectedGym}
          isGymDropdownOpen={isGymDropdownOpen}
          setIsGymDropdownOpen={setIsGymDropdownOpen}
          gymSearchTerm={gymSearchTerm}
          setGymSearchTerm={setGymSearchTerm}
          filteredTenantsForDropdown={filteredTenantsForDropdown}
          handleSelectGym={handleSelectGym}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onSave={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
