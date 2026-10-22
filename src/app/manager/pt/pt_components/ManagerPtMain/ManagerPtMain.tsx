'use client';

import { useState } from 'react';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import { Calendar, Users, ClipboardList } from 'lucide-react';

export default function ManagerPtMain() {
  const [activeTab, setActiveTab] = useState('View PT Packages');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');

  const PT_TABS = ['View PT Packages', 'Schedule PT Sessions', 'Assign Trainer', 'Track PT Sessions'];

  const openAssignModal = (pkgName: string) => {
    setSelectedPackage(pkgName);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Personal Training" subtitle="Manage PT packages, assign trainers, and view schedules" />

      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2 mb-4 bg-card border border-border p-1 rounded-xl w-fit">
          {PT_TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === t ? 'bg-primary text-primary-foreground shadow' : 'text-secondary hover:text-foreground hover:bg-accent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'View PT Packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Dummy Packages */}
            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">12 Sessions</span>
                <span className="text-foreground font-bold text-lg">₹5,000</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Monthly PT Package</h3>
              <p className="text-sm text-secondary mb-4">Assign a dedicated trainer for 12 sessions in a month.</p>
              <button 
                onClick={() => openAssignModal('Monthly PT Package')}
                className="w-full py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Assign to Member
              </button>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">24 Sessions</span>
                <span className="text-foreground font-bold text-lg">₹9,000</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Quarterly PT Package</h3>
              <p className="text-sm text-secondary mb-4">Assign a dedicated trainer for 24 sessions in 3 months.</p>
              <button 
                onClick={() => openAssignModal('Quarterly PT Package')}
                className="w-full py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Assign to Member
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Schedule PT Sessions' && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Calendar size={48} className="mx-auto text-secondary mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground mb-2">No PT Sessions Today</h3>
            <p className="text-sm text-secondary">There are no upcoming personal training sessions scheduled for today.</p>
          </div>
        )}

        {activeTab === 'Assign Trainer' && (
          <div className="bg-card p-6 border border-border rounded-xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Assign Personal Trainer</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Select Member</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Select a member...</option>
                  <option>Rahul Kumar</option>
                  <option>Priya Singh</option>
                  <option>Amit Sharma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select PT Package</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Monthly PT Package (12 Sessions)</option>
                  <option>Quarterly PT Package (24 Sessions)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Trainer</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Vikram (Head Trainer)</option>
                  <option>Neha (Cardio Expert)</option>
                  <option>Rahul (Strength Trainer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2">
                Confirm Assignment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Track PT Sessions' && (
          <div className="bg-card p-6 border border-border rounded-xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Active PT Members Progress</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Member Name</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Trainer</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Package</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Progress</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 px-4 text-sm text-foreground">Rahul Kumar</td>
                    <td className="py-3 px-4 text-sm text-secondary">Vikram</td>
                    <td className="py-3 px-4 text-sm text-secondary">12 Sessions</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-input rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-1/2"></div>
                        </div>
                        <span className="text-xs font-bold text-foreground">6/12</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-input text-foreground rounded-lg hover:opacity-90 transition-opacity">Mark Session</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-foreground">Priya Singh</td>
                    <td className="py-3 px-4 text-sm text-secondary">Neha</td>
                    <td className="py-3 px-4 text-sm text-secondary">24 Sessions</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-input rounded-full overflow-hidden">
                          <div className="h-full bg-success w-5/6"></div>
                        </div>
                        <span className="text-xs font-bold text-foreground">20/24</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-input text-foreground rounded-lg hover:opacity-90 transition-opacity">Mark Session</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Assign PT Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">Assign {selectedPackage}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Member</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2">
                  <option>Rahul Kumar</option>
                  <option>Priya Singh</option>
                  <option>Amit Sharma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Trainer</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2">
                  <option>Vikram (Head Trainer)</option>
                  <option>Neha (Cardio Expert)</option>
                  <option>Rahul (Strength Trainer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
