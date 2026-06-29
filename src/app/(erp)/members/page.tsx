'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Plus, Search, Filter, Download, Eye, Edit, RefreshCw, ArrowUpCircle, X, User } from 'lucide-react';

const members = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@gmail.com', group: 'Monthly', plan: 'Premium', status: 'Active', joined: '15 Jan 2026', expiry: '15 Jan 2027', address: 'Andheri, Mumbai', branch: 'Main Branch', gender: 'Male', paid: '₹2,500', pending: '₹0' },
  { id: 2, name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya@gmail.com', group: 'Monthly', plan: 'Basic', status: 'Active', joined: '10 Feb 2026', expiry: '10 Feb 2027', address: 'Borivali, Mumbai', branch: 'Branch 2', gender: 'Female', paid: '₹1,200', pending: '₹0' },
  { id: 3, name: 'Amit Kumar', phone: '+91 76543 21098', email: 'amit@gmail.com', group: 'Quarterly', plan: 'Gold', status: 'Pending', joined: '08 Mar 2026', expiry: '08 Mar 2027', address: 'Powai, Mumbai', branch: 'Main Branch', gender: 'Male', paid: '₹900', pending: '₹900' },
  { id: 4, name: 'Sneha Mehta', phone: '+91 65432 10987', email: 'sneha@gmail.com', group: 'Monthly', plan: 'Premium', status: 'Active', joined: '05 Apr 2026', expiry: '05 Apr 2027', address: 'Dadar, Mumbai', branch: 'Branch 3', gender: 'Female', paid: '₹2,500', pending: '₹0' },
  { id: 5, name: 'Vijay Singh', phone: '+91 54321 09876', email: 'vijay@gmail.com', group: 'Monthly', plan: 'Basic', status: 'Expired', joined: '01 May 2025', expiry: '01 May 2026', address: 'Thane, Mumbai', branch: 'Main Branch', gender: 'Male', paid: '₹1,200', pending: '₹0' },
  { id: 6, name: 'Anita Gupta', phone: '+91 43210 98765', email: 'anita@gmail.com', group: 'Annually', plan: 'Gold', status: 'Active', joined: '20 Jun 2026', expiry: '20 Jun 2027', address: 'Bandra, Mumbai', branch: 'Branch 2', gender: 'Female', paid: '₹1,800', pending: '₹0' },
  { id: 7, name: 'Rohit Yadav', phone: '+91 32109 87654', email: 'rohit@gmail.com', group: 'Annually', plan: 'Annual', status: 'Active', joined: '12 Jan 2026', expiry: '12 Jan 2027', address: 'Malad, Mumbai', branch: 'Main Branch', gender: 'Male', paid: '₹12,000', pending: '₹0' },
  { id: 8, name: 'Kavita Sharma', phone: '+91 21098 76543', email: 'kavita@gmail.com', group: 'Monthly', plan: 'Basic', status: 'Active', joined: '25 Mar 2026', expiry: '25 Mar 2027', address: 'Goregaon, Mumbai', branch: 'Branch 3', gender: 'Female', paid: '₹1,200', pending: '₹0' },
];

export default function Members() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);

  const filtered = members.filter(m => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search);
    const mf = statusFilter === 'All' || m.status === statusFilter;
    return ms && mf;
  });

  if (selectedMember) {
    return (
      <div className="min-h-full">
        <Header title="Member Profile" subtitle={`Viewing profile of ${selectedMember.name}`} />
        <div className="p-6 space-y-5">
          <button onClick={() => setSelectedMember(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5">← Back to Members</button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'hsl(24 95% 53%)' }}>{selectedMember.name.charAt(0)}</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedMember.name}</h2>
                <p className="text-gray-500">{selectedMember.email} · {selectedMember.phone}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedMember.status === 'Active' ? 'bg-green-100 text-green-700' : selectedMember.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{selectedMember.status}</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{selectedMember.plan}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Member ID', value: `GS${String(selectedMember.id).padStart(4, '0')}` },
                { label: 'Branch', value: selectedMember.branch },
                { label: 'Group', value: selectedMember.group },
                { label: 'Gender', value: selectedMember.gender },
                { label: 'Join Date', value: selectedMember.joined },
                { label: 'Expiry Date', value: selectedMember.expiry },
                { label: 'Address', value: selectedMember.address },
                { label: 'Amount Paid', value: selectedMember.paid },
              ].map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
              <div className="space-y-3">
                {[
                  { date: '15 Jan 2026', amount: selectedMember.paid, method: 'UPI', status: 'Paid' },
                  { date: '15 Dec 2025', amount: selectedMember.paid, method: 'Cash', status: 'Paid' },
                  { date: '15 Nov 2025', amount: selectedMember.paid, method: 'Card', status: 'Paid' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div><p className="text-sm font-medium text-gray-900">{p.date}</p><p className="text-xs text-gray-500">{p.method}</p></div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{p.amount}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Assigned Diet Plan</h3>
                <div className="p-3 border border-green-100 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">Muscle Gain Diet</p>
                  <p className="text-xs text-green-600 mt-0.5">3200 kcal · 6 meals/day · 12 weeks</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Assigned Workout Plan</h3>
                <div className="p-3 border border-blue-100 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Push Pull Legs</p>
                  <p className="text-xs text-blue-600 mt-0.5">6 days/week · 75 min · Hypertrophy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Header title="Member Management" subtitle="Manage all gym members, plans, and payments" />
      <div className="p-6 space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option>All</option><option>Active</option><option>Pending</option><option>Expired</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                <Filter size={15} /> Filter
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                <Download size={15} /> Export CSV
              </button>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-white rounded-lg font-medium transition-colors" style={{ background: 'hsl(24 95% 53%)' }}>
                <Plus size={15} /> Add Member
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Member', 'Contact', 'Group', 'Address', 'Branch', 'Gender', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm flex-shrink-0">{m.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-500">GS{String(m.id).padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><p className="text-sm text-gray-700">{m.phone}</p><p className="text-xs text-gray-500">{m.email}</p></td>
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{m.group}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[120px] truncate">{m.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.branch}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.gender}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${m.status === 'Active' ? 'bg-green-100 text-green-700' : m.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedMember(m)} title="View Profile" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={14} /></button>
                        <button title="Edit" className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit size={14} /></button>
                        <button title="Renew" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"><RefreshCw size={14} /></button>
                        <button title="Upgrade" className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><ArrowUpCircle size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {filtered.length} of {members.length} members</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Prev</button>
              <button className="px-3 py-1.5 text-white rounded-lg" style={{ background: 'hsl(24 95% 53%)' }}>1</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">Add New Member</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><X size={17} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <User size={22} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                  <button className="text-xs text-orange-500 mt-1 hover:underline">Upload Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', placeholder: 'Full name', required: true },
                  { label: 'Alternate Name', placeholder: 'Alternate / nickname' },
                  { label: 'Email', placeholder: 'email@example.com', type: 'email' },
                  { label: 'Mobile No.', placeholder: '+91 XXXXX XXXXX', type: 'tel', required: true },
                  { label: 'Alternate Mobile', placeholder: 'Alternate number', type: 'tel' },
                  { label: 'Occupation', placeholder: 'e.g. Software Engineer' },
                  { label: 'GST No.', placeholder: 'GST number (optional)' },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                    <input type={f.type || 'text'} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea rows={2} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Full address"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Plan</label>
                <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>Basic - ₹1,200/month</option><option>Gold - ₹1,800/month</option><option>Premium - ₹2,500/month</option><option>Annual - ₹12,000/year</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">Cancel</button>
              <button className="px-4 py-2.5 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
