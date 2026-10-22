// RESPONSIBILITY: Contains logic, types, or component definition for this module.
'use client';

// RESPONSIBILITY: Contains logic, types, or component definition for this module.
'use client';

import React, { useState } from 'react';
import { MessageCircle, Mail, Snowflake, Stethoscope, Ban, UserCheck } from 'lucide-react';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { formatCurrency } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';

export default function ManagerProfileOverview() {
  const { selectedMember, openMsg, freezeMember, toggleSuspend, trainers, assignTrainer } = useMembersContext();
  const [isAssigningTrainer, setIsAssigningTrainer] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [isPT, setIsPT] = useState(false);

 if (!selectedMember) return null;

  const totalAmount = (selectedMember.paidAmount || 0) + (selectedMember.pendingAmount || 0);
  const dues = selectedMember.pendingAmount > 0 ? selectedMember.pendingAmount : 0;
  const advance = selectedMember.advanceAmount || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider opacity-80">Member Summary</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col p-4 bg-background rounded-xl border border-border shadow-sm">
              <span className="text-xs text-secondary font-medium mb-1">Total Plan Amount</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex flex-col p-4 bg-success-bg rounded-xl border border-success/20 shadow-sm">
              <span className="text-xs text-success font-medium mb-1">Total Paid</span>
              <span className="text-lg font-bold text-success">{formatCurrency(selectedMember.paidAmount || 0)}</span>
            </div>
            {dues > 0 && (
              <div className="flex flex-col p-4 bg-danger-bg rounded-xl border border-destructive/20 shadow-sm">
                <span className="text-xs text-danger font-medium mb-1">Pending Dues</span>
                <span className="text-lg font-bold text-danger">{formatCurrency(dues)}</span>
              </div>
            )}
            {advance > 0 && (
              <div className="flex flex-col p-4 bg-primary/10 rounded-xl border border-primary/20 shadow-sm">
                <span className="text-xs text-primary font-medium mb-1">Advance Payment</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(advance)}</span>
              </div>
            )}
            {selectedMember.assignedTrainerId && (
              <div className="flex flex-col p-4 bg-background rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-secondary font-medium">Assigned Trainer</span>
                  <UserCheck size={14} className="text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground truncate">{selectedMember.assignedTrainerName}</span>
                  {selectedMember.isPT && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20 shrink-0">
                      PT
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {selectedMember.medicalHistory && (
            <div className="flex flex-col gap-2 p-4 bg-warning-bg rounded-xl border border-warning/20 shadow-sm">
              <div className="flex items-center gap-2 text-warning">
                <Stethoscope size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Medical History / Notes</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {selectedMember.medicalHistory}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider opacity-80">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button 
              onClick={() => openMsg(selectedMember, 'whatsapp')} 
              className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md bg-success" 
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
            <button 
              onClick={() => openMsg(selectedMember, 'email')} 
              className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md bg-info" 
            >
              <Mail size={16} /> Email
            </button>
            {selectedMember.status !== 'FROZEN' ? (
              <button 
                onClick={() => freezeMember(true)} 
                className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-info bg-info-bg border border-info/30 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md" 
              >
                <Snowflake size={16} /> Freeze
              </button>
            ) : (
              <button 
                onClick={() => freezeMember(false)} 
                className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-success bg-success-bg border border-success/30 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md" 
              >
                Unfreeze
              </button>
            )}
            {selectedMember.status !== 'SUSPENDED' && selectedMember.pendingAmount > 0 ? (
              <button 
                onClick={() => toggleSuspend(true)} 
                className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-danger bg-danger-bg border border-danger/30 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md" 
              >
                <Ban size={16} /> Suspend
              </button>
            ) : selectedMember.status === 'SUSPENDED' ? (
              <button 
                onClick={() => toggleSuspend(false)} 
                className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-success bg-success-bg border border-success/30 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md" 
              >
                Unsuspend
              </button>
            ) : null}

            {trainers.length > 0 ? (
              !isAssigningTrainer ? (
                <button 
                  onClick={() => setIsAssigningTrainer(true)}
                  className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <UserCheck size={16} /> Assign Trainer
                </button>
              ) : (
                <div className="col-span-2 flex flex-col gap-3 p-4 bg-background border border-border rounded-xl shadow-sm">
                  <select 
                    value={selectedTrainerId} 
                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" checked={isPT} onChange={e => setIsPT(e.target.checked)} className="rounded border-border text-primary focus:ring-primary w-4 h-4" />
                    Personal Training (PT)
                  </label>
                  <div className="flex gap-3 mt-1">
                    <button 
                      onClick={() => {
                        if(selectedTrainerId) {
                          const t = trainers.find(x => x.id === selectedTrainerId);
                          if(t) assignTrainer(selectedMember.id, t.id, t.name, isPT);
                          setIsAssigningTrainer(false);
                        }
                      }}
                      className="flex-1 p-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsAssigningTrainer(false)}
                      className="flex-1 p-2.5 bg-secondary/10 text-secondary text-sm font-semibold rounded-xl hover:bg-secondary/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            ) : (
              <button disabled className="flex items-center justify-center gap-2 p-3 text-sm font-semibold text-secondary bg-secondary/5 border border-border rounded-xl">
                No trainers found
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
 );
}
