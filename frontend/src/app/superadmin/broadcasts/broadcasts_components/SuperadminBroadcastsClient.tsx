'use client';
// RESPONSIBILITY: Root orchestrator for the Broadcasts page. Composes isolated sub-components and passes state from useSuperadminBroadcastsPage. No business logic here.

import { useSuperadminBroadcastsPage } from '@/app/superadmin/broadcasts/broadcasts_utils/useSuperadminBroadcastsPage';
import SuperadminBroadcastsHeader from '@/app/superadmin/broadcasts/broadcasts_components/SuperadminBroadcastsHeader/SuperadminBroadcastsHeader';
import SuperadminBroadcastsTable from '@/app/superadmin/broadcasts/broadcasts_components/SuperadminBroadcastsTable/SuperadminBroadcastsTable';
import SuperadminBroadcastsEmptyState from '@/app/superadmin/broadcasts/broadcasts_components/SuperadminBroadcastsEmptyState/SuperadminBroadcastsEmptyState';
import { SuperadminBroadcastModal } from '@/app/superadmin/broadcasts/broadcasts_components/SuperadminBroadcastModal';
import SuperadminBroadcastQueueModal from '@/app/superadmin/broadcasts/broadcasts_components/SuperadminBroadcastQueueModal';

export default function SuperadminBroadcastsClient() {
  const {
    broadcasts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    setIsModalOpen,
    form,
    handleCreateBroadcast,
    handleDeleteBroadcast,
    handleSendBroadcast,
    openEditModal,
    openCreateModal,
    editingId,
    fetchState,
    error,
    queueModalOpen,
    queueRecipients,
    queueTitle,
    onQueueComplete
  } = useSuperadminBroadcastsPage();

  if (fetchState === 'loading') return (
    <div className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 bg-card rounded w-48" />
      <div className="h-96 bg-card rounded-xl border border-border" />
    </div>
  );
  if (fetchState === 'error' || error) return <div className="p-8 text-center text-danger">Error loading data.</div>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <SuperadminBroadcastsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onCreateClick={openCreateModal}
      />

      {broadcasts.length === 0 ? (
        <SuperadminBroadcastsEmptyState onCreateClick={openCreateModal} />
      ) : (
        <SuperadminBroadcastsTable
          onCreateClick={openCreateModal}
          broadcasts={broadcasts}
          onSend={handleSendBroadcast}
          onEdit={openEditModal}
          onDelete={handleDeleteBroadcast}
        />
      )}

      <SuperadminBroadcastModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        onSubmit={handleCreateBroadcast}
        isEditMode={!!editingId}
      />

      <SuperadminBroadcastQueueModal 
        isOpen={queueModalOpen}
        onClose={() => {}}
        recipients={queueRecipients}
        broadcastTitle={queueTitle}
        onComplete={onQueueComplete}
      />
    </div>
  );
}
