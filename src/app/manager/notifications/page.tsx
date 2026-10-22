'use client';

import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';

export default function NotificationsPage() {
  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Notifications" subtitle="Send Reminder: Due/Expiry reminder send" />
      <div className="p-6">
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Send Reminder Notification</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Select Target Audience</label>
              <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                <option>Members with Pending Dues</option>
                <option>Memberships Expiring in 7 Days</option>
                <option>All Active Members</option>
                <option>Specific Member</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notification Type</label>
              <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                <option>SMS</option>
                <option>Email</option>
                <option>App Push Notification</option>
                <option>WhatsApp</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Message Template</label>
              <textarea 
                rows={4} 
                defaultValue="Dear Member, this is a reminder that your gym membership due is pending. Please pay at the earliest to avoid interruption." 
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            <button className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Send Notification
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Notifications Log</h3>
          <div className="overflow-x-auto bg-card border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-input/50">
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Date & Time</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Audience</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Type</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 text-sm text-foreground">Today, 09:00 AM</td>
                  <td className="py-3 px-4 text-sm text-secondary">Expiring in 7 Days (15 members)</td>
                  <td className="py-3 px-4 text-sm text-secondary">WhatsApp</td>
                  <td className="py-3 px-4 text-sm font-bold text-success">Sent</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-foreground">Yesterday, 06:30 PM</td>
                  <td className="py-3 px-4 text-sm text-secondary">Pending Dues (8 members)</td>
                  <td className="py-3 px-4 text-sm text-secondary">SMS</td>
                  <td className="py-3 px-4 text-sm font-bold text-success">Sent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
