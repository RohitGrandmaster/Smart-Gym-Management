'use client';

import { useState } from 'react';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Daily Collection Report');

  const TABS = ['Daily Collection Report', 'Membership Report', 'Attendance Report', 'Due Report', 'Trainer Performance'];

  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Reports" subtitle="Daily Collection Report, Membership Report, Attendance Report, Due Report, Trainer Performance" />
      <div className="p-6 space-y-6">
        
        <div className="flex flex-wrap gap-2 bg-card border border-border p-1 rounded-xl w-fit">
          {TABS.map(t => (
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

        {activeTab === 'Daily Collection Report' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Today's Collections (₹12,500)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Receipt</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Member</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Type</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 text-sm text-secondary">#RCP-101</td>
                  <td className="py-3 px-4 text-sm text-foreground">Rahul Kumar</td>
                  <td className="py-3 px-4 text-sm text-secondary">Membership</td>
                  <td className="py-3 px-4 text-sm font-bold text-success">₹5,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-secondary">#RCP-102</td>
                  <td className="py-3 px-4 text-sm text-foreground">Neha Verma</td>
                  <td className="py-3 px-4 text-sm text-secondary">PT Package</td>
                  <td className="py-3 px-4 text-sm font-bold text-success">₹7,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Membership Report' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Membership Demographics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-input rounded-lg"><p className="text-sm text-secondary">Total Active</p><p className="text-2xl font-bold">450</p></div>
              <div className="p-4 bg-input rounded-lg"><p className="text-sm text-secondary">New This Month</p><p className="text-2xl font-bold text-success">25</p></div>
              <div className="p-4 bg-input rounded-lg"><p className="text-sm text-secondary">Expired</p><p className="text-2xl font-bold text-danger">15</p></div>
              <div className="p-4 bg-input rounded-lg"><p className="text-sm text-secondary">Renewals</p><p className="text-2xl font-bold text-info">30</p></div>
            </div>
          </div>
        )}

        {activeTab === 'Attendance Report' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Daily Attendance Overview</h3>
            <div className="flex gap-4 mb-4">
              <input type="date" className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
              <button className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90">Filter</button>
            </div>
            <p className="text-sm text-secondary">Chart will render here showing peak hours and total footfall.</p>
          </div>
        )}

        {activeTab === 'Due Report' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Total Pending Dues (₹35,000)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Member Name</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Phone</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Pending Amount</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 text-sm text-foreground">Amit Sharma</td>
                  <td className="py-3 px-4 text-sm text-secondary">9876543210</td>
                  <td className="py-3 px-4 text-sm font-bold text-danger">₹2,000</td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1.5 text-xs font-semibold bg-input text-foreground rounded-lg hover:opacity-90">Send Reminder</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Trainer Performance' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Trainer Performance Metrics</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Trainer</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Avg Rating</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Sessions Taken</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Member Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 text-sm text-foreground">Vikram (Head Trainer)</td>
                  <td className="py-3 px-4 text-sm text-warning font-bold">4.8 / 5</td>
                  <td className="py-3 px-4 text-sm text-secondary">120</td>
                  <td className="py-3 px-4 text-sm text-success font-bold">92%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
