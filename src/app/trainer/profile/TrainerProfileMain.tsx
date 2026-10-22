'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Clock, Award, Save, CalendarDays, Banknote, X } from 'lucide-react';
import TrainerHeader from '@/app/trainer/trainer_components/TrainerLayout/TrainerHeader';
import { getUser } from '@/lib/api';

export default function TrainerProfileMain() {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'schedule' | 'attendance' | 'salary'>('personal');
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const user = mounted ? getUser() : null;
  const displayName = user?.name || 'Trainer';
  const displayEmail = user?.email || '';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    // TODO: Wire to real update profile API when backend is ready
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaveMsg('Profile updated successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  return (
    <div className="min-h-full pb-10">
      <TrainerHeader title="My Profile" subtitle="Manage your personal information and availability" />
      
      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            {[
              { id: 'personal', label: 'Personal Info', icon: User },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'schedule', label: 'Availability', icon: Clock },
              { id: 'attendance', label: 'Attendance & Leaves', icon: CalendarDays },
              { id: 'salary', label: 'Salary Details', icon: Banknote },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm motion-safe:transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-card text-secondary hover:bg-input hover:text-foreground border border-transparent hover:border-border'
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
              
              {activeTab === 'personal' && (
                <form onSubmit={handleSave} className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                  <div className="flex items-center gap-5 pb-6 border-b border-border">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold">
                      {mounted ? displayInitial : '?'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{mounted ? displayName : '...'}</h2>
                      <p className="text-sm text-secondary">{user?.role || 'TRAINER'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                      <input type="text" defaultValue={mounted ? displayName : ''} className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
                      <input type="email" defaultValue={mounted ? displayEmail : ''} className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
                      <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Specialization</label>
                      <input type="text" placeholder="e.g. Strength & Conditioning" className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2"><Award size={16} /> Certifications</label>
                    <textarea rows={3} placeholder="e.g. ACE Certified Personal Trainer" className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                  </div>
                  
                  {saveMsg && (
                    <p className="text-sm font-medium text-success bg-success-bg px-4 py-2 rounded-lg">{saveMsg}</p>
                  )}
                  
                  <div className="pt-2 flex justify-end">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 motion-safe:transition-opacity disabled:opacity-70">
                      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" /> : <Save size={18} />}
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                  <h3 className="text-lg font-bold text-foreground border-b border-border pb-4 mb-6">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 motion-safe:transition-opacity">
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                  <h3 className="text-lg font-bold text-foreground border-b border-border pb-4 mb-6">Working Hours</h3>
                  
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <div key={day} className="flex items-center justify-between p-4 bg-input rounded-xl border border-border">
                        <span className="font-medium text-foreground w-28">{day}</span>
                        <div className="flex items-center gap-3">
                          <input type="time" defaultValue="06:00" className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          <span className="text-secondary text-sm">to</span>
                          <input type="time" defaultValue="14:00" className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-4 bg-danger-bg/50 rounded-xl border border-danger/20">
                      <span className="font-medium text-danger w-28">Sunday</span>
                      <span className="text-danger text-sm font-semibold px-4">Off Day</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 motion-safe:transition-opacity">
                      <Save size={18} /> Save Schedule
                    </button>
                  </div>
                </div>
              )}

              { activeTab === 'attendance' && (
                <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                    <h3 className="text-lg font-bold text-foreground">Attendance & Leaves</h3>
                    <button onClick={() => setShowLeaveModal(true)} className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-xl hover:bg-primary/90 motion-safe:transition-colors">
                      Apply Leave
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-input rounded-xl border border-border">
                      <p className="text-sm text-secondary">Present Days</p>
                      <p className="text-2xl font-bold text-success mt-1">22</p>
                    </div>
                    <div className="p-4 bg-input rounded-xl border border-border">
                      <p className="text-sm text-secondary">Leaves Taken</p>
                      <p className="text-2xl font-bold text-warning mt-1">2</p>
                    </div>
                    <div className="p-4 bg-input rounded-xl border border-border">
                      <p className="text-sm text-secondary">Leave Balance</p>
                      <p className="text-2xl font-bold text-primary mt-1">10</p>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5 text-center text-secondary text-sm h-32 flex items-center justify-center">
                    Detailed attendance log for this month.
                  </div>
                </div>
              )}

              { activeTab === 'salary' && (
                <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                  <h3 className="text-lg font-bold text-foreground border-b border-border pb-4 mb-6">Salary Details</h3>
                  
                  <div className="bg-success-bg border border-success/20 rounded-xl p-6 mb-6">
                    <p className="text-sm font-semibold text-success mb-2">Next Payout: 1st of Next Month</p>
                    <p className="text-3xl font-bold text-success">₹ 45,000</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-input text-secondary">
                        <tr>
                          <th className="px-4 py-3 font-medium">Month</th>
                          <th className="px-4 py-3 font-medium">Amount</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Payslip</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { month: 'August 2026', amount: '₹ 45,000', status: 'Paid' },
                          { month: 'July 2026', amount: '₹ 45,000', status: 'Paid' },
                          { month: 'June 2026', amount: '₹ 45,000', status: 'Paid' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-primary/5">
                            <td className="px-4 py-3 text-foreground font-medium">{row.month}</td>
                            <td className="px-4 py-3 text-foreground">{row.amount}</td>
                            <td className="px-4 py-3 text-success font-medium">{row.status}</td>
                            <td className="px-4 py-3"><button className="text-primary hover:underline font-medium">Download</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden motion-safe:animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Apply for Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-secondary hover:text-foreground hover:bg-input p-1 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Leave Application Submitted'); setShowLeaveModal(false); }} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Start Date</label>
                  <input type="date" required className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">End Date</label>
                  <input type="date" required className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Reason</label>
                <textarea rows={3} required placeholder="e.g. Medical emergency" className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary custom-scrollbar"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border mt-4">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="px-4 py-2 text-sm font-semibold text-secondary hover:text-foreground hover:bg-input rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
