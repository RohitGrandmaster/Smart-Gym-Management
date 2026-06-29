'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Plus, Users, Clock, Calendar, Shield, Trash2, Edit2, X } from 'lucide-react';

const initialStaff = [
  { id: 1, name: 'Mukesh Verma', role: 'Personal Trainer', shift: 'Morning', status: 'Present', salary: '25000', phone: '+91 98765 11111' },
  { id: 2, name: 'Sunita Rajput', role: 'Receptionist', shift: 'Evening', status: 'Present', salary: '18000', phone: '+91 87654 22222' },
  { id: 3, name: 'Rajesh Kumar', role: 'Housekeeping', shift: 'Morning', status: 'Absent', salary: '12000', phone: '+91 76543 33333' },
];

const initialPayroll = [
  { id: 1, staffId: 1, basic: 25000, bonus: 2000, deduction: 500, net: 26500, status: 'Paid' },
  { id: 2, staffId: 2, basic: 18000, bonus: 0, deduction: 250, net: 17750, status: 'Paid' },
  { id: 3, staffId: 3, basic: 12000, bonus: 0, deduction: 800, net: 11200, status: 'Pending' },
];

const tabs = ['Attendance', 'Staff', 'Payroll'];

export default function HR() {
  const [activeTab, setActiveTab] = useState('Staff');
  const [staffList, setStaffList] = useState(initialStaff);
  const [payrollList, setPayrollList] = useState(initialPayroll);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', shift: 'Morning', status: 'Present', salary: '', phone: '' });

  const handleOpenModal = (staff?: any) => {
    if (staff) {
      setEditId(staff.id);
      setFormData(staff);
    } else {
      setEditId(null);
      setFormData({ name: '', role: '', shift: 'Morning', status: 'Present', salary: '', phone: '' });
    }
    setShowModal(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setStaffList(staffList.map(s => s.id === editId ? { ...formData, id: editId } : s));
    } else {
      const newStaff = { ...formData, id: Date.now() };
      setStaffList([...staffList, newStaff]);
      // create default payroll
      setPayrollList([...payrollList, { id: Date.now(), staffId: newStaff.id, basic: Number(newStaff.salary), bonus: 0, deduction: 0, net: Number(newStaff.salary), status: 'Pending' }]);
    }
    setShowModal(false);
  };

  const handleDeleteStaff = (id: number) => {
    if(confirm('Are you sure you want to delete this staff member?')) {
      setStaffList(staffList.filter(s => s.id !== id));
      setPayrollList(payrollList.filter(p => p.staffId !== id));
    }
  };

  const presentCount = staffList.filter(s => s.status === 'Present').length;

  return (
    <div className="min-h-full pb-10">
      <Header title="HR Management" subtitle="Manage staff attendance, shifts, leave policies and payroll" />
      <div className="p-6 space-y-5">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Users size={19} className="text-blue-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">Total Staff</p><p className="text-xl font-bold text-gray-900">{staffList.length}</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><Shield size={19} className="text-green-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">Present Today</p><p className="text-xl font-bold text-gray-900">{presentCount}</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center"><Calendar size={19} className="text-yellow-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">On Leave</p><p className="text-xl font-bold text-gray-900">{staffList.length - presentCount}</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><Clock size={19} className="text-red-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">Pending Requests</p><p className="text-xl font-bold text-gray-900">2</p></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                style={activeTab === tab ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}>
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* STAFF TAB */}
            {activeTab === 'Staff' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">{staffList.length} staff members found</p>
                  <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium hover:opacity-90 transition-opacity" style={{ background: 'hsl(24 95% 53%)' }}>
                    <Plus size={15} /> Add Staff
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{['Staff Member', 'Role', 'Shift', 'Status', 'Salary', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">{s.name.charAt(0)}</div>
                              <div><p className="text-sm font-medium text-gray-900">{s.name}</p><p className="text-xs text-gray-500">{s.phone}</p></div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{s.role}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{s.shift}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{Number(s.salary).toLocaleString()}</td>
                          <td className="px-4 py-3 flex items-center gap-3">
                            <button onClick={() => handleOpenModal(s)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteStaff(s.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                      {staffList.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-500">No staff found. Click Add Staff to create one.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'Attendance' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">Today&apos;s Attendance</p>
                  <button onClick={() => {
                    setStaffList(staffList.map(s => ({...s, status: s.status === 'Present' ? 'Absent' : 'Present'})));
                  }} className="text-sm text-orange-600 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-lg">Toggle All Status (Demo)</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50"><tr>{['Staff', 'Role', 'Status', 'Check In / Out'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((a, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">{a.name.charAt(0)}</div><p className="text-sm font-medium text-gray-900">{a.name}</p></div></td>
                          <td className="px-4 py-3 text-sm text-gray-600">{a.role}</td>
                          <td className="px-4 py-3">
                            <select 
                              value={a.status} 
                              onChange={(e) => setStaffList(staffList.map(s => s.id === a.id ? {...s, status: e.target.value} : s))}
                              className={`text-xs font-medium rounded-full px-2.5 py-1 focus:outline-none ${a.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{a.status === 'Present' ? '08:00 AM - 05:00 PM' : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PAYROLL TAB */}
            {activeTab === 'Payroll' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50"><tr>{['Staff', 'Basic Salary', 'Bonus', 'Deduction', 'Net Salary', 'Status'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {payrollList.map(p => {
                        const staff = staffList.find(s => s.id === p.staffId);
                        if (!staff) return null;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{staff.name}</p><p className="text-xs text-gray-500">{staff.role}</p></td>
                            <td className="px-4 py-3 text-sm text-gray-900">₹{p.basic.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-green-600 font-medium">
                              <input type="number" value={p.bonus} onChange={(e) => {
                                const bonus = Number(e.target.value);
                                setPayrollList(payrollList.map(item => item.id === p.id ? {...item, bonus, net: item.basic + bonus - item.deduction} : item));
                              }} className="w-20 border rounded px-1" />
                            </td>
                            <td className="px-4 py-3 text-sm text-red-500">
                              <input type="number" value={p.deduction} onChange={(e) => {
                                const deduction = Number(e.target.value);
                                setPayrollList(payrollList.map(item => item.id === p.id ? {...item, deduction, net: item.basic + item.bonus - deduction} : item));
                              }} className="w-20 border rounded px-1" />
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{p.net.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => {
                                setPayrollList(payrollList.map(item => item.id === p.id ? {...item, status: item.status === 'Paid' ? 'Pending' : 'Paid'} : item));
                              }} className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${p.status === 'Paid' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                                {p.status}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editId ? 'Edit Staff' : 'Add New Staff'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveStaff} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Full Day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
                  <input required type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium text-white" style={{ background: 'hsl(24 95% 53%)' }}>Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
