// RESPONSIBILITY: Renders the slide-in profile drawer for a selected member showing full details.
'use client';

import { X, Phone, Mail, Building2, Calendar, IndianRupee, User } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { AdminMember } from '@/app/admin/members/members_types/AdminMembersTypes';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-success-bg text-success',
  expired: 'bg-danger-bg text-danger',
  pending: 'bg-warning-bg text-warning',
  frozen: 'bg-info-bg text-info',
};

interface AdminMembersProfileDrawerProps {
  member: AdminMember;
  onClose: () => void;
}

export default function AdminMembersProfileDrawer({ member, onClose }: AdminMembersProfileDrawerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-overlay border-l border-border z-40 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-foreground text-lg">Member Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-input hover:bg-border flex items-center justify-center motion-safe:transition-colors"
            aria-label="Close profile"
          >
            <X size={16} className="text-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border border-primary/30">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_STYLES[member.status] ?? 'bg-input text-secondary'}`}>
                {member.status}
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-input/40 rounded-xl border border-border p-4 space-y-3">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Contact Info</p>
            <div className="flex items-center gap-3">
              <Phone size={15} className="text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">{member.phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground truncate">{member.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <User size={15} className="text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">{member.gender}</span>
            </div>
          </div>

          {/* Membership */}
          <div className="bg-input/40 rounded-xl border border-border p-4 space-y-3">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Membership</p>
            <div className="flex items-center gap-3">
              <Building2 size={15} className="text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">{member.branchName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={15} className="text-secondary flex-shrink-0" />
              <div>
                <span className="text-sm text-foreground">{member.planName}</span>
                <p className="text-xs text-secondary mt-0.5">
                  {new Date(member.joinDate).toLocaleDateString('en-IN')} → {new Date(member.expiryDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
            {member.pendingAmount > 0 && (
              <div className="flex items-center gap-3">
                <IndianRupee size={15} className="text-danger flex-shrink-0" />
                <span className="text-sm font-bold text-danger">Outstanding: {formatCurrency(member.pendingAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
