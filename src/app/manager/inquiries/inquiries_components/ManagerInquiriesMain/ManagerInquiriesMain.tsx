// RESPONSIBILITY: Entry point for the Inquiries module. Sets up the Context provider and composes all sub-components.
'use client';

import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import ManagerToast from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import ManagerMessageModal from '@/app/manager/manager_components/ManagerFeedback/ManagerMessageModal';
import ManagerBulkMessageModal from '@/app/manager/manager_components/ManagerFeedback/ManagerBulkMessageModal';
import { InquiriesProvider, useInquiriesContext } from '@/app/manager/inquiries/inquiries_context/ManagerInquiriesContext';
import ManagerInquiriesKPIs from '@/app/manager/inquiries/inquiries_components/ManagerInquiriesKPIs/ManagerInquiriesKPIs';
import ManagerInquiriesToolbar from '@/app/manager/inquiries/inquiries_components/ManagerInquiriesToolbar/ManagerInquiriesToolbar';
import ManagerInquiriesTable from '@/app/manager/inquiries/inquiries_components/InquiriesTable/ManagerInquiriesTable';
import ManagerInquiriesModal from '@/app/manager/inquiries/inquiries_components/ManagerInquiriesModal/ManagerInquiriesModal';
import ManagerConvertLeadModal from '@/app/manager/inquiries/inquiries_components/ConvertLeadModal/ManagerConvertLeadModal';

function InquiriesContent() {
  const { toast, hideToast, msgModal, closeMsg, showToast, bulkMsgModal, closeBulkMsg, clearSelection } = useInquiriesContext();

  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Inquiries & Leads" subtitle="Track, follow up, and convert leads into members" />
      <div className="p-6 space-y-5">
        <ManagerInquiriesKPIs />
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <ManagerInquiriesToolbar />
          <ManagerInquiriesTable />
        </div>
      </div>

      <ManagerInquiriesModal />
      <ManagerConvertLeadModal />

      {msgModal?.open && (
        <ManagerMessageModal
          open={msgModal.open}
          type={msgModal.type}
          recipient={msgModal.recipient}
          message={msgModal.message}
          onClose={closeMsg}
          onSuccess={msg => { showToast(msg, 'success'); closeMsg(); }}
        />
      )}

      {bulkMsgModal?.open && (
        <ManagerBulkMessageModal
          open={bulkMsgModal.open}
          type={bulkMsgModal.type}
          recipients={bulkMsgModal.recipients}
          onClose={closeBulkMsg}
          onSuccess={msg => { showToast(msg, 'success'); closeBulkMsg(); clearSelection(); }}
        />
      )}

      {toast && <ManagerToast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}

export default function ManagerInquiriesMain() {
  return (
    <InquiriesProvider>
      <InquiriesContent />
    </InquiriesProvider>
  );
}
