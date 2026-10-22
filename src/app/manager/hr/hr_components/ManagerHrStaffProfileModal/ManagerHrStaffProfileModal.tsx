// RESPONSIBILITY: Renders a read-only profile modal for a staff member.
'use client';

import { useHrContext } from '@/app/manager/hr/hr_context/ManagerHrContext';
import { X, Edit2, Phone, Mail, Calendar, MapPin, IndianRupee, Hash } from 'lucide-react';

export default function ManagerHrStaffProfileModal() {
  const { viewProfileData, setViewProfileData, openEdit } = useHrContext();

  if (!viewProfileData) return null;
  const s = viewProfileData;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="rounded-2xl shadow-xl w-full max-w-lg overflow-hidden bg-card border-2 border-primary/20">
        <div className="relative h-24 bg-gradient-to-r from-primary to-primary/60">
          <button 
            type="button" 
            onClick={() => setViewProfileData(null)} 
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-10 mb-6">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-4xl bg-card border-4 border-card text-primary shadow-lg shadow-black/20">
              {(s.name || '?').charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={() => { setViewProfileData(null); openEdit(s); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl transition-colors mb-2"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground">{s.name}</h3>
            <p className="text-sm font-medium text-primary mt-1 px-3 py-1 bg-primary/10 inline-block rounded-md">{s.role}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Phone</p>
                <p className="text-sm font-semibold text-foreground">{s.phone || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Email</p>
                <p className="text-sm font-semibold text-foreground truncate max-w-[150px]" title={s.email}>{s.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Join Date</p>
                <p className="text-sm font-semibold text-foreground">{s.joinDate ? new Date(s.joinDate).toLocaleDateString('en-IN') : 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IndianRupee className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Monthly Salary</p>
                <p className="text-sm font-bold text-success">{(s.salary || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IndianRupee className="w-5 h-5 text-[var(--danger)] mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Advance Balance</p>
                <p className="text-sm font-bold text-[var(--danger)]">{(s.advanceSalary || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IndianRupee className="w-5 h-5 text-[var(--warning)] mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Current Due</p>
                <p className="text-sm font-bold text-[var(--warning)]">{(s.currentDue || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Aadhaar No.</p>
                <p className="text-sm font-semibold text-foreground">{s.aadhaar || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 flex items-center justify-center font-bold text-xs text-secondary mt-0.5 border border-secondary rounded-sm">UPI</span>
              <div>
                <p className="text-xs text-secondary mb-0.5">UPI ID</p>
                <p className="text-sm font-semibold text-foreground">{s.upiId || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="text-xs text-secondary mb-0.5">Address</p>
                <p className="text-sm font-semibold text-foreground whitespace-pre-line">{s.address || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
             <div>
               <p className="text-xs text-secondary mb-1">Status</p>
               <div className="flex items-center gap-2">
                 <div className={`w-2.5 h-2.5 rounded-full ${s.isActive ? 'bg-success' : 'bg-danger'}`}></div>
                 <span className={`text-sm font-bold ${s.isActive ? 'text-success' : 'text-danger'}`}>{s.isActive ? 'Active Staff' : 'Suspended'}</span>
               </div>
             </div>
             <div>
               <p className="text-xs text-secondary mb-1">Gender</p>
               <p className="text-sm font-semibold text-foreground capitalize">{s.gender?.toLowerCase() || 'N/A'}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
