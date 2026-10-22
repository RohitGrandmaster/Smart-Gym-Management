import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';

export default function SupportPage() {
  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Help & Support" subtitle="Contact Super Admin for any issues or queries" />
      <div className="p-6">
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Send Message to Admin</h3>
          <div className="space-y-4 max-w-lg">
            
            <div>
              <label className="block text-sm font-medium mb-1">Issue Category</label>
              <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                <option>Billing / Invoice Issue</option>
                <option>Technical Problem</option>
                <option>Feature Request</option>
                <option>Other Enquiry</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input 
                type="text" 
                placeholder="Briefly describe the problem..." 
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Message Details</label>
              <textarea 
                rows={5} 
                placeholder="Explain your issue in detail so the admin can help you quickly..." 
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            <button className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Send to Admin
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Previous Tickets</h3>
          <div className="overflow-x-auto bg-card border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-input/50">
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Ticket ID</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Subject</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Date</th>
                  <th className="py-3 px-4 text-sm font-medium text-secondary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-secondary">#TKT-1042</td>
                  <td className="py-3 px-4 text-sm text-foreground">Printer not generating receipts</td>
                  <td className="py-3 px-4 text-sm text-secondary">06 Sept 2026</td>
                  <td className="py-3 px-4 text-sm font-bold text-success">Resolved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
