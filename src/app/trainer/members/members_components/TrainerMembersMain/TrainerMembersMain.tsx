// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Entry point component for the members module that sets up context providers and layout.
'use client';

import TrainerHeader from '@/app/trainer/trainer_components/TrainerLayout/TrainerHeader';
import TrainerToast from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import TrainerMessageModal from '@/app/trainer/trainer_components/TrainerFeedback/TrainerMessageModal';

import { MembersProvider, useMembersContext } from '@/app/trainer/members/members_context/MembersContext';
import TrainerMembersKPIs from '@/app/trainer/members/members_components/TrainerMembersKPIs/TrainerMembersKPIs';
import TrainerMembersToolbar from '@/app/trainer/members/members_components/TrainerMembersToolbar/TrainerMembersToolbar';
import TrainerMembersTable from '@/app/trainer/members/members_components/TrainerMembersTable/TrainerMembersTable';
import TrainerMembersProfile from '@/app/trainer/members/members_components/TrainerMembersProfile/TrainerMembersProfile';
import type { MembersInitialData } from '@/app/trainer/members/members_types/members_types';

function MembersContent() {
  const { toast, hideToast, msgModal, closeMsg, showToast, selectedMember } = useMembersContext();

  return (
    <div className="min-h-full pb-10">
      <div className="print-hide">
        {!selectedMember ? (
          <>
            <TrainerHeader title="Members Directory" subtitle="Manage gym members, profiles, and subscriptions" />
            <div className="p-6 space-y-5">
              <TrainerMembersKPIs />
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <TrainerMembersToolbar />
                <TrainerMembersTable />
              </div>
            </div>
          </>
        ) : (
          <TrainerMembersProfile />
        )}

        {/* Add Member modal removed — trainers are view-only, cannot create members */}

        {msgModal?.open && (
          <TrainerMessageModal 
            open={msgModal.open}
            type={msgModal.type}
            recipient={msgModal.recipient}
            message={msgModal.message}
            onClose={closeMsg} 
            onSuccess={msg => { showToast(msg, 'success'); closeMsg(); }} 
          />
        )}

        {toast && <TrainerToast message={toast.message} type={toast.type} onClose={hideToast} />}
      </div>
    </div>
  );
}

export default function TrainerMembersMain({ initialData }: { initialData?: MembersInitialData | null }) {
  return (
    <MembersProvider initialData={initialData}>
      <MembersContent />
    </MembersProvider>
  );
}

