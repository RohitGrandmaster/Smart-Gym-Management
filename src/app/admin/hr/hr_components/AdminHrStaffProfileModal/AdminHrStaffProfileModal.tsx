// RESPONSIBILITY: Read-only profile view for Staff/Managers, showing details and assigned branches.
'use client';

import React from 'react';
import { useHrContext } from '@/app/admin/hr/hr_context/AdminHrContext';
import { X, Building2, User, Phone, Mail, MapPin, Calendar, Activity, CheckCircle2, Ban, Edit2, IndianRupee, Hash } from 'lucide-react';

export default function AdminHrStaffProfileModal() {
  const { showProfileModal, setShowProfileModal, editData, openEdit } = useHrContext();

  if (!showProfileModal || !editData) return null;

  const isManager = editData.role === 'Manager';

  // Mock global branch data resolution (Ideally this comes from global store)
  const resolveBranchInfo = (branchId: string) => {
    const mockBranches: Record<string, { name: string, location: string }> = {
      'b1': { name: 'Downtown Core', location: '123 Main St' },
      'b2': { name: 'Westside Gym', location: '456 West Ave' },
      'b3': { name: 'Eastside Fitness', location: '789 East Blvd' },
      'b4': { name: 'North Park', location: '321 North Rd' },
      'b5': { name: 'South End', location: '654 South St' },
    };
    return mockBranches[branchId] || { name: `Branch ${branchId}`, location: 'Unknown Location' };
  };

  const branchesToRender = isManager && editData.assignedBranches?.length 
    ? editData.assignedBranches 
    : [editData.branch || ''];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full max-w-3xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-input/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <User size={20} />
            </div>
            <h2 className="text-lg font-bold text-foreground">Staff Profile</h2>
          </div>
          <button 
            onClick={() => setShowProfileModal(false)}
            className="p-2 rounded-full hover:bg-input transition-colors text-secondary hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Top Profile Section */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex flex-col items-center justify-center flex-shrink-0 text-primary">
              <span className="text-3xl font-bold uppercase">{(editData.name || '?').charAt(0)}</span>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground leading-tight">{editData.name}</h1>
                  <p className="text-sm font-medium text-primary mt-1">{editData.role} • ID: {editData.id?.toUpperCase()}</p>
                </div>
                {isManager && (
                  <button
                    onClick={() => openEdit(editData as any)}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={14} />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-border/50">
                  <Phone size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground">{editData.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-border/50">
                  <Mail size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground truncate">{editData.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-border/50">
                  <Calendar size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Joined: {editData.joinDate ? new Date(editData.joinDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-border/50">
                  <Activity size={16} className="text-secondary" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-secondary">Status:</span>
                    {editData.isActive !== false ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        <Ban size={12} /> Suspended
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-border/50">
                  <IndianRupee size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Salary: {(editData.salary || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-[var(--danger)]/50">
                  <IndianRupee size={16} className="text-[var(--danger)]" />
                  <span className="text-sm font-medium text-[var(--danger)]">
                    Advance: {(editData.advanceSalary || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-[var(--warning)]/50">
                  <IndianRupee size={16} className="text-[var(--warning)]" />
                  <span className="text-sm font-medium text-[var(--warning)]">
                    Due: {(editData.currentDue || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-border/50">
                  <Hash size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Aadhaar: {editData.aadhaar || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-input/50 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] font-bold border border-secondary text-secondary rounded px-1">UPI</span>
                  <span className="text-sm font-medium text-foreground truncate max-w-[150px]" title={editData.upiId}>
                    {editData.upiId || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Branches Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">Assigned {isManager ? 'Branches' : 'Branch'}</h3>
            </div>
            
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-input/50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Branch</th>
                    <th className="px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Location</th>
                    {isManager && <th className="px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Badge</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {branchesToRender.map((bId) => {
                    if (!bId) return null;
                    const info = resolveBranchInfo(bId);
                    const isPrimary = editData.primaryBranchId === bId || (!editData.primaryBranchId && bId === editData.branch);
                    
                    return (
                      <tr key={bId} className="bg-card hover:bg-input/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {info.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} />
                            {info.location}
                          </div>
                        </td>
                        {isManager && (
                          <td className="px-4 py-3 text-right">
                            {isPrimary ? (
                              <span className="inline-block text-[10px] font-bold text-warning bg-warning/10 border border-warning/20 px-2 py-1 rounded-md uppercase">
                                Primary Branch
                              </span>
                            ) : (
                              <span className="inline-block text-[10px] font-bold text-secondary bg-input px-2 py-1 rounded-md uppercase">
                                Assigned
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {!branchesToRender.length && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-secondary text-sm">
                        No branches assigned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isManager && (
              <p className="text-xs text-secondary/70 italic flex items-center gap-1 mt-2">
                Note: This manager has access to data strictly limited to the above listed branches.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
