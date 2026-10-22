'use client';
// RESPONSIBILITY: Root orchestrator for the Coupons page. Composes isolated sub-components and passes state from useSuperadminCoupons. No business logic here.

import { useSuperadminCoupons } from '@/app/superadmin/coupons/coupons_utils/useSuperadminCoupons';
import SuperadminCouponsHeader from '@/app/superadmin/coupons/coupons_components/SuperadminCouponsHeader/SuperadminCouponsHeader';
import SuperadminCouponsStatsBar from '@/app/superadmin/coupons/coupons_components/SuperadminCouponsStatsBar/SuperadminCouponsStatsBar';
import SuperadminCouponsTable from '@/app/superadmin/coupons/coupons_components/SuperadminCouponsTable/SuperadminCouponsTable';
import SuperadminCouponsEmptyState from '@/app/superadmin/coupons/coupons_components/SuperadminCouponsEmptyState/SuperadminCouponsEmptyState';
import { SuperadminCouponModal } from '@/app/superadmin/coupons/coupons_components/SuperadminCouponModal';
import { SuperadminCouponEditModal } from '@/app/superadmin/coupons/coupons_components/SuperadminCouponEditModal';

export default function SuperadminCouponsClient() {
  const {
    coupons,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    form,
    handleCreateCoupon,
    activeCoupons,
    totalRedeemed,
    fetchState,
    error,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedCoupon,
    setSelectedCoupon,
    handleUpdateCoupon,
    handleDeleteCoupon,
    handleToggleRestore,
    handleToggleStatus,
    activeKpi,
    setActiveKpi,
    totalCoupons,
  } = useSuperadminCoupons();

  if (fetchState === 'loading') return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(2)].map((_, i) => <div key={`skeleton-${i}`} className="h-24 bg-card rounded-xl border border-border" />)}
      </div>
      <div className="h-96 bg-card rounded-xl border border-border" />
    </div>
  );
  if (fetchState === 'error' || error) return <div className="p-8 text-center text-danger">Error loading data.</div>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <SuperadminCouponsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setIsModalOpen(true)}
      />

      <SuperadminCouponsStatsBar
        activeCoupons={activeCoupons}
        totalRedeemed={totalRedeemed}
        totalCoupons={totalCoupons}
        activeKpi={activeKpi}
        onKpiClick={setActiveKpi}
      />

      {coupons.length === 0 ? (
        <SuperadminCouponsEmptyState onCreateClick={() => setIsModalOpen(true)} />
      ) : (
        <SuperadminCouponsTable
          onCreateClick={() => setIsModalOpen(true)}
          coupons={coupons}
          onToggleStatus={handleToggleStatus}
          onEdit={(cpn) => { setSelectedCoupon(cpn); setIsEditModalOpen(true); }}
          onDelete={handleDeleteCoupon}
          onRestore={handleToggleRestore}
        />
      )}

      <SuperadminCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        onSubmit={handleCreateCoupon}
      />

      <SuperadminCouponEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateCoupon}
        coupon={selectedCoupon}
      />
    </div>
  );
}
