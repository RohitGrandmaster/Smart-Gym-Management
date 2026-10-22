// RESPONSIBILITY: Provides the implementation for ManagerSalesMain.tsx functionality within its module.
'use client';

import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import { SalesProvider, useSalesContext } from '@/app/manager/sales/sales_context/ManagerSalesContext';
import ManagerSalesToolbar from '@/app/manager/sales/sales_components/ManagerSalesToolbar/ManagerSalesToolbar';
import ManagerSalesTabs from '@/app/manager/sales/sales_components/ManagerSalesTabs/ManagerSalesTabs';
import ManagerSalesOverview from '@/app/manager/sales/sales_components/ManagerSalesOverview/ManagerSalesOverview';
import ManagerSalesMembershipReport from '@/app/manager/sales/sales_components/ManagerSalesMembershipReport/ManagerSalesMembershipReport';
import ManagerSalesPendingPayments from '@/app/manager/sales/sales_components/ManagerSalesPendingPayments/ManagerSalesPendingPayments';
import ManagerSalesAllMemberships from '@/app/manager/sales/sales_components/ManagerSalesAllMemberships/ManagerSalesAllMemberships';
import ManagerToast from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { SalesInitialData } from '@/app/manager/sales/sales_types/ManagerSalesTypes';

function SalesContent() {
 const { tab, toast, showToast } = useSalesContext();

 return (
 <div className="min-h-full pb-10 bg-background text-foreground">
 <ManagerHeader title="Payment & Billing" subtitle="Manage all payments, dues, and receipts" />
 <div className="p-6 space-y-5">
 <ManagerSalesToolbar />

 <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
 <ManagerSalesTabs />

 <div className="p-5">
 {tab === 'Daily Collection Report' && <ManagerSalesOverview />}
 {tab === 'Due Collection' && <ManagerSalesPendingPayments />}
 {tab === 'Payment History' && <ManagerSalesAllMemberships />}
  {tab === 'Collect Payment' && (
          <div className="bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Record New Payment</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Select Member</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Select a member...</option>
                  <option>Rahul Kumar (9876543210)</option>
                  <option>Priya Singh (8765432109)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment For</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Membership Plan</option>
                  <option>Personal Training</option>
                  <option>Add-ons</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount to Collect (₹)</label>
                <input type="number" placeholder="0.00" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>UPI / QR</option>
                  <option>Cash</option>
                  <option>Card</option>
                </select>
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2">
                Record Payment
              </button>
            </div>
          </div>
        )}

        {tab === 'Partial Payment' && (
          <div className="bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Accept Partial Payment</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Member with Pending Due</label>
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                  <option>Select a member...</option>
                  <option>Amit Sharma - Due: ₹1,500</option>
                  <option>Sneha - Due: ₹2,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paying Amount (₹)</label>
                <input type="number" placeholder="Enter partial amount" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <button className="w-full py-2 bg-info text-info-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2">
                Update Partial Payment
              </button>
            </div>
          </div>
        )}

        {(tab === 'Generate Receipt' || tab === 'Print Receipt') && (
          <div className="bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Transactions for Receipt</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Receipt No</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Member Name</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Amount</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary">Date</th>
                    <th className="py-3 px-4 text-sm font-medium text-secondary text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 px-4 text-sm font-mono text-secondary">#RCP-001</td>
                    <td className="py-3 px-4 text-sm text-foreground">Rahul Kumar</td>
                    <td className="py-3 px-4 text-sm font-bold text-success">₹5,000</td>
                    <td className="py-3 px-4 text-sm text-secondary">Today, 10:30 AM</td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Print Receipt</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-mono text-secondary">#RCP-002</td>
                    <td className="py-3 px-4 text-sm text-foreground">Priya Singh</td>
                    <td className="py-3 px-4 text-sm font-bold text-success">₹3,000</td>
                    <td className="py-3 px-4 text-sm text-secondary">Yesterday</td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Print Receipt</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
 </div>
 </div>
 </div>
 
 {toast && <ManagerToast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type)} />}
 </div>
 );
}

export default function ManagerSalesMain({ initialData }: { initialData?: SalesInitialData | null }) {
 return (
 <SalesProvider initialData={initialData}>
 <SalesContent />
 </SalesProvider>
 );
}
