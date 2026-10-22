// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders a detailed view of a selected member's profile.
'use client';

import { MessageCircle, Mail } from 'lucide-react';
import TrainerHeader from '@/app/trainer/trainer_components/TrainerLayout/TrainerHeader';
import { useMembersContext } from '@/app/trainer/members/members_context/MembersContext';
import { MEMBERS_STATUS_COLORS, formatCurrency, PROFILE_TABS } from '@/app/trainer/members/members_utils/MembersSharedConstants';
import TrainerMembersProfileOverview from '@/app/trainer/members/members_components/TrainerMembersProfile/TrainerMembersProfileOverview';
import TrainerMembersProfileAttendance from '@/app/trainer/members/members_components/TrainerMembersProfile/TrainerMembersProfileAttendance';
import TrainerMembersProfileFitness from '@/app/trainer/members/members_components/TrainerMembersProfile/TrainerMembersProfileFitness';
import TrainerMembersProfileProgress from '@/app/trainer/members/members_components/TrainerMembersProfile/TrainerMembersProfileProgress';
import TrainerMembersProfileWorkout from '@/app/trainer/members/members_components/TrainerMembersProfile/TrainerMembersProfileWorkout';
import TrainerMembersProfileDiet from '@/app/trainer/members/members_components/TrainerMembersProfile/TrainerMembersProfileDiet';

export default function TrainerMembersProfile() {
  const { selectedMember, setSelectedMember, profileTab, setProfileTab, openEdit, openMsg } = useMembersContext();

  if (!selectedMember) return null;

  const statusStyle = MEMBERS_STATUS_COLORS[selectedMember.status] || { bg: 'bg-input', text: 'text-secondary' };

  return (
    <div className="min-h-full">
      <TrainerHeader title="Member Profile" subtitle={`Viewing profile of ${selectedMember.name}`} />
      <div className="p-6 space-y-5">
        <button
          onClick={() => setSelectedMember(null)}
          className="text-sm text-secondary hover:text-primary flex items-center gap-1.5 motion-safe:transition-all motion-safe:duration-200"
        >
          ← Back to Members
        </button>

        {/* Profile Card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-primary bg-primary-subtle">
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">{selectedMember.name}</h2>
                <p className="text-secondary text-sm">{selectedMember.email} · {selectedMember.phone}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                    {selectedMember.status}
                  </span>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info-bg text-info">
                    {selectedMember.plan?.name || ''}
                  </span>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-bg text-purple">
                    {selectedMember.billingCycle}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => openMsg(selectedMember, 'whatsapp')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-success text-white rounded-xl hover:opacity-90 motion-safe:transition-all motion-safe:duration-200 active:scale-95"
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button
                onClick={() => openMsg(selectedMember, 'email')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-info text-white rounded-xl hover:opacity-90 motion-safe:transition-all motion-safe:duration-200 active:scale-95"
              >
                <Mail size={14} /> Email
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Member ID', value: `GS${String(selectedMember.id).padStart(4, '0')}` },
              { label: 'Age', value: `${selectedMember.age || 25} yrs` },
              { label: 'Gender', value: selectedMember.gender },
              { label: 'Height', value: '175 cm' },
              { label: 'Weight', value: '70 kg' },
              { label: 'Join Date', value: new Date(selectedMember.joinDate).toLocaleDateString('en-IN') },
              { label: 'Expiry Date', value: new Date(selectedMember.expiryDate).toLocaleDateString('en-IN') },
              { label: 'Fitness Goal', value: selectedMember.fitnessGoal || 'Muscle Gain' },
              { label: 'Address', value: selectedMember.address || 'N/A' },
            ].map((f, i) => (
              <div key={i} className="bg-input rounded-lg p-3">
                <p className="text-xs text-secondary mb-0.5">{f.label}</p>
                <p className="text-sm font-semibold text-primary">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto custom-scrollbar">
            {PROFILE_TABS.map(({ id: t, label }) => (
              <button
                key={t}
                onClick={() => { setProfileTab(t as any); }}
                className={`whitespace-nowrap px-5 py-3.5 text-sm font-medium motion-safe:transition-all motion-safe:duration-200 border-b-2 ${
                  profileTab === t
                    ? 'text-primary bg-primary-subtle border-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-5 min-h-64">
            {profileTab === 'overview' && <TrainerMembersProfileOverview />}
            {profileTab === 'attendance' && <TrainerMembersProfileAttendance />}
            {profileTab === 'fitness' && <TrainerMembersProfileFitness />}
            {profileTab === 'progress' && <TrainerMembersProfileProgress />}
            {profileTab === 'workout' && <TrainerMembersProfileWorkout />}
            {profileTab === 'diet' && <TrainerMembersProfileDiet />}
          </div>
        </div>
      </div>
    </div>
  );
}

