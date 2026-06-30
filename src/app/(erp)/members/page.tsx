'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import MessageModal, { MessageType, MessageRecipient } from '@/components/MessageModal';
import Toast, { ToastType } from '@/components/Toast';
import {
  Plus, Search, Filter, Download, Eye, Edit, RefreshCw, ArrowUpCircle,
  X, User, MessageCircle, Mail, Trash2, CheckCircle, XCircle,
  Calendar, CreditCard, Clock, TrendingUp, Save, Printer
} from 'lucide-react';
import ThermalReceipt, { ReceiptData } from '@/components/ThermalReceipt';

// ─── Data ───────────────────────────────────────────────────────────────────

type MemberStatus = 'Active' | 'Pending' | 'Expired';
type BillingCycle = '1 Month' | '3 Months' | '6 Months' | '12 Months';
type PlanTier = 'Basic' | 'Gold' | 'Premium';

interface Member {
  id: number; name: string; phone: string; email: string;
  billingCycle: BillingCycle; plan: PlanTier; status: MemberStatus;
  joined: string; expiry: string; address: string; branch: string;
  gender: string; paidAmount: number; pendingAmount: number;
}

const initialMembers: Member[] = [
  { id: 1, name: 'Rahul Sharma',  phone: '+91 98765 43210', email: 'rahul@gmail.com',  billingCycle: '1 Month',   plan: 'Premium', status: 'Active',  joined: '15 Jan 2026', expiry: '15 Feb 2026', address: 'Andheri, Mumbai',  branch: 'Main Branch', gender: 'Male',   paidAmount: 2500,  pendingAmount: 0 },
  { id: 2, name: 'Priya Patel',   phone: '+91 87654 32109', email: 'priya@gmail.com',  billingCycle: '3 Months',  plan: 'Basic',   status: 'Active',  joined: '10 Feb 2026', expiry: '10 May 2026', address: 'Borivali, Mumbai', branch: 'Branch 2',   gender: 'Female', paidAmount: 3000,  pendingAmount: 0 },
  { id: 3, name: 'Amit Kumar',    phone: '+91 76543 21098', email: 'amit@gmail.com',   billingCycle: '1 Month',   plan: 'Gold',    status: 'Pending', joined: '08 Mar 2026', expiry: '08 Apr 2026', address: 'Powai, Mumbai',    branch: 'Main Branch', gender: 'Male',   paidAmount: 900,   pendingAmount: 900 },
  { id: 4, name: 'Sneha Mehta',   phone: '+91 65432 10987', email: 'sneha@gmail.com',  billingCycle: '6 Months',  plan: 'Premium', status: 'Active',  joined: '05 Jan 2026', expiry: '05 Jul 2026', address: 'Dadar, Mumbai',    branch: 'Branch 3',   gender: 'Female', paidAmount: 12000, pendingAmount: 0 },
  { id: 5, name: 'Vijay Singh',   phone: '+91 54321 09876', email: 'vijay@gmail.com',  billingCycle: '1 Month',   plan: 'Basic',   status: 'Expired', joined: '01 May 2025', expiry: '01 Jun 2025', address: 'Thane, Mumbai',    branch: 'Main Branch', gender: 'Male',   paidAmount: 1200,  pendingAmount: 1200 },
  { id: 6, name: 'Anita Gupta',   phone: '+91 43210 98765', email: 'anita@gmail.com',  billingCycle: '12 Months', plan: 'Gold',    status: 'Active',  joined: '20 Jun 2026', expiry: '20 Jun 2027', address: 'Bandra, Mumbai',   branch: 'Branch 2',   gender: 'Female', paidAmount: 15000, pendingAmount: 0 },
  { id: 7, name: 'Rohit Yadav',   phone: '+91 32109 87654', email: 'rohit@gmail.com',  billingCycle: '12 Months', plan: 'Premium', status: 'Active',  joined: '12 Jan 2026', expiry: '12 Jan 2027', address: 'Malad, Mumbai',    branch: 'Main Branch', gender: 'Male',   paidAmount: 22000, pendingAmount: 0 },
  { id: 8, name: 'Kavita Sharma', phone: '+91 21098 76543', email: 'kavita@gmail.com', billingCycle: '3 Months',  plan: 'Basic',   status: 'Active',  joined: '25 Mar 2026', expiry: '25 Jun 2026', address: 'Goregaon, Mumbai', branch: 'Branch 3',   gender: 'Female', paidAmount: 3000,  pendingAmount: 0 },
];

const PRICING_MATRIX = {
  Basic: { '1 Month': 1200, '3 Months': 3000, '6 Months': 5500, '12 Months': 10000 },
  Gold: { '1 Month': 1800, '3 Months': 4500, '6 Months': 8000, '12 Months': 15000 },
  Premium: { '1 Month': 2500, '3 Months': 6500, '6 Months': 12000, '12 Months': 22000 }
};

type PayStatus = 'Paid' | 'Due' | 'Upcoming';

interface PaymentSlot {
  label: string; amount: number; status: PayStatus; date?: string; method?: string;
}

function getPaymentHistory(member: Member): PaymentSlot[] {
  const baseAmt = PRICING_MATRIX[member.plan][member.billingCycle];
  const methods = ['UPI', 'Cash', 'Card', 'Net Banking'];
  
  if (member.billingCycle === '1 Month') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, i) => {
      // Dummy logic for demo: First few months paid, current is due/pending, rest upcoming
      if (i < 5) return { label: `${m} 2026`, amount: baseAmt, status: 'Paid', date: `05 ${m} 2026`, method: methods[i % 4] };
      if (i === 5) return { label: `${m} 2026`, amount: baseAmt, status: member.status === 'Active' ? 'Paid' : 'Due', date: member.status === 'Active' ? `05 ${m} 2026` : undefined, method: member.status === 'Active' ? 'UPI' : undefined };
      return { label: `${m} 2026`, amount: baseAmt, status: 'Upcoming' };
    });
  }
  
  if (member.billingCycle === '3 Months') {
    return [
      { label: 'Q1 (Jan-Mar)', amount: baseAmt, status: 'Paid', date: '05 Jan 2026', method: 'UPI' },
      { label: 'Q2 (Apr-Jun)', amount: baseAmt, status: member.status === 'Active' ? 'Paid' : 'Due', date: member.status === 'Active' ? '05 Apr 2026' : undefined, method: member.status === 'Active' ? 'Card' : undefined },
      { label: 'Q3 (Jul-Sep)', amount: baseAmt, status: 'Upcoming' },
      { label: 'Q4 (Oct-Dec)', amount: baseAmt, status: 'Upcoming' }
    ];
  }
  
  if (member.billingCycle === '6 Months') {
    return [
      { label: 'H1 (Jan-Jun)', amount: baseAmt, status: 'Paid', date: '05 Jan 2026', method: 'Net Banking' },
      { label: 'H2 (Jul-Dec)', amount: baseAmt, status: 'Upcoming' }
    ];
  }
  
  // 12 Months
  return [
    { label: 'Annual Dues 2026', amount: baseAmt, status: member.status === 'Pending' ? 'Due' : 'Paid', date: member.status === 'Pending' ? undefined : '05 Jan 2026', method: member.status === 'Pending' ? undefined : 'UPI' }
  ];
}

// Attendance (current month per member)
function genAttendance(memberId: number) {
  const days = 30;
  const seed = memberId * 7;
  return Array.from({ length: days }, (_, i) => {
    const d = i + 1;
    const rand = (seed + d * 13 + d * d) % 10;
    return { day: d, status: rand < 7 ? 'P' : rand < 9 ? 'A' : 'L' as 'P' | 'A' | 'L' };
  });
}

// ─── Message helpers ─────────────────────────────────────────────────────────
function getMsgTemplate(type: 'welcome' | 'renewal' | 'due' | 'general', member: Member) {
  const map: Record<string, string> = {
    welcome: `Hi ${member.name}! 🎉\n\nWelcome to GymSmart! We're thrilled to have you as a ${member.plan} member.\n\nStart Date: ${member.joined}\nExpiry Date: ${member.expiry}\n\nLet's crush those fitness goals! 💪\n\n— Team GymSmart`,
    renewal: `Hi ${member.name}! 🔔\n\nYour ${member.plan} membership expires on ${member.expiry}.\n\nRenew today to continue your fitness journey without interruption!\n\n— Team GymSmart`,
    due:     `Hi ${member.name} 🙏\n\nFriendly reminder: You have a pending amount of ₹${member.pendingAmount} on your GymSmart account.\n\nPlease clear your dues at the earliest.\n\n— Team GymSmart`,
    general: `Hi ${member.name}! 👋\n\nThis is a message from GymSmart. We hope you're enjoying your fitness journey!\n\n— Team GymSmart`,
  };
  return map[type];
}

const emptyForm = { name: '', email: '', phone: '', address: '', gender: 'Male', branch: 'Main Branch', billingCycle: '1 Month' as BillingCycle, plan: 'Basic' as PlanTier, status: 'Active' as MemberStatus };

// ─── Component ───────────────────────────────────────────────────────────────

export default function Members() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMemberId, setEditMemberId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'attendance' | 'payments'>('overview');

  // Attendance state
  const [attendanceMap, setAttendanceMap] = useState<Record<number, { day: number; status: string }[]>>({});
  const getAttendance = (id: number) => attendanceMap[id] || genAttendance(id);
  const toggleAtt = (memberId: number, day: number) => {
    const att = getAttendance(memberId).map(a =>
      a.day === day ? { ...a, status: a.status === 'P' ? 'A' : a.status === 'A' ? 'L' : 'P' } : a
    );
    setAttendanceMap(prev => ({ ...prev, [memberId]: att }));
  };

  // Messaging & Printing
  const [msgModal, setMsgModal] = useState<{ open: boolean; recipient: MessageRecipient; type: MessageType; message: string; subject?: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [printData, setPrintData] = useState<ReceiptData | null>(null);

  const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
  const closeMsg = useCallback(() => setMsgModal(null), []);

  const openMsg = (m: Member, type: MessageType) => {
    const tpl = m.status === 'Expired' ? 'renewal' : m.pendingAmount > 0 ? 'due' : 'general';
    setMsgModal({
      open: true, type,
      recipient: { name: m.name, phone: m.phone, email: m.email },
      message: getMsgTemplate(tpl, m),
      subject: `GymSmart - ${tpl === 'renewal' ? 'Renewal Reminder' : tpl === 'due' ? 'Payment Due' : 'Message'}`,
    });
  };

  const handlePrint = (p: PaymentSlot, m: Member) => {
    setPrintData({
      gymName: 'GymSmart Fitness',
      gymPhone: '+91 83479 77566',
      receiptNo: `REC-${Date.now().toString().slice(-6)}`,
      date: p.date || new Date().toLocaleDateString('en-IN'),
      customerName: m.name,
      items: [{ name: `Membership - ${m.plan} (${p.label})`, price: p.amount, amount: p.amount }],
      total: p.amount,
      paymentMethod: p.method || 'Cash'
    });
    setTimeout(() => window.print(), 100);
  };

  // CRUD
  const openAdd = () => { setEditMemberId(null); setForm(emptyForm); setShowAddModal(true); };
  const openEdit = (m: Member) => {
    setEditMemberId(m.id);
    setForm({ name: m.name, email: m.email, phone: m.phone, address: m.address, gender: m.gender, branch: m.branch, billingCycle: m.billingCycle, plan: m.plan, status: m.status });
    setShowAddModal(true);
  };

  const calculateExpiry = (joinedStr: string, cycle: BillingCycle) => {
    const d = new Date();
    // Simplified calculation for demo purposes: Add days based on cycle
    const days = cycle === '1 Month' ? 30 : cycle === '3 Months' ? 90 : cycle === '6 Months' ? 180 : 365;
    const expiry = new Date(d.getTime() + days * 86400000);
    return expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const saveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const expiry = calculateExpiry(joined, form.billingCycle);
    const amount = PRICING_MATRIX[form.plan][form.billingCycle];

    if (editMemberId) {
      const updated = members.map(m => m.id === editMemberId ? { ...m, ...form, paidAmount: m.status === 'Active' ? amount : m.paidAmount, pendingAmount: m.status === 'Active' ? 0 : m.pendingAmount } : m);
      setMembers(updated);
      if (selectedMember?.id === editMemberId) setSelectedMember(updated.find(x => x.id === editMemberId) || null);
    } else {
      const newM: Member = {
        id: Date.now(), ...form,
        joined, expiry,
        paidAmount: form.status === 'Active' ? amount : 0,
        pendingAmount: form.status === 'Pending' ? amount : 0,
      };
      setMembers([newM, ...members]);
    }
    setShowAddModal(false);
  };

  const deleteMember = (id: number) => {
    if (confirm('Delete this member?')) {
      setMembers(members.filter(m => m.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
    }
  };

  const filtered = members.filter(m => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search);
    const mf = statusFilter === 'All' || m.status === statusFilter;
    return ms && mf;
  });

  // ── Profile view ─────────────────────────────────────────────────────────
  if (selectedMember) {
    const att = getAttendance(selectedMember.id);
    const presentDays = att.filter(a => a.status === 'P').length;
    const absentDays = att.filter(a => a.status === 'A').length;
    const leaveDays = att.filter(a => a.status === 'L').length;
    const attPct = Math.round((presentDays / att.length) * 100);

    const payments = getPaymentHistory(selectedMember);
    const totalDue = payments.filter(p => p.status === 'Due').reduce((s, p) => s + p.amount, 0);
    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);

    return (
      <div className="min-h-full">
        <Header title="Member Profile" subtitle={`Viewing profile of ${selectedMember.name}`} />
        <div className="p-6 space-y-5">
          <button onClick={() => setSelectedMember(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5">← Back to Members</button>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'hsl(24 95% 53%)' }}>{selectedMember.name.charAt(0)}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMember.name}</h2>
                  <p className="text-gray-500 text-sm">{selectedMember.email} · {selectedMember.phone}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedMember.status === 'Active' ? 'bg-green-100 text-green-700' : selectedMember.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{selectedMember.status}</span>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{selectedMember.plan}</span>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{selectedMember.billingCycle}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => openEdit(selectedMember)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700"><Edit size={14} /> Edit</button>
                <button onClick={() => openMsg(selectedMember, 'whatsapp')} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: '#25D366' }}><MessageCircle size={14} /> WhatsApp</button>
                <button onClick={() => openMsg(selectedMember, 'email')} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: 'hsl(217 91% 60%)' }}><Mail size={14} /> Email</button>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Member ID', value: `GS${String(selectedMember.id).padStart(4, '0')}` },
                { label: 'Branch', value: selectedMember.branch },
                { label: 'Gender', value: selectedMember.gender },
                { label: 'Join Date', value: selectedMember.joined },
                { label: 'Expiry Date', value: selectedMember.expiry },
                { label: 'Address', value: selectedMember.address },
                { label: 'Cycle Price', value: `₹${PRICING_MATRIX[selectedMember.plan][selectedMember.billingCycle].toLocaleString()}` },
                { label: 'Total Paid', value: `₹${selectedMember.paidAmount.toLocaleString()}` },
              ].map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {([['overview', 'Overview'], ['attendance', 'Attendance'], ['payments', 'Payment History']] as [typeof profileTab, string][]).map(([t, label]) => (
                <button key={t} onClick={() => setProfileTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${profileTab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={profileTab === t ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}>
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* ── Overview ── */}
              {profileTab === 'overview' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Payments</h3>
                    <div className="space-y-3">
                      {payments.filter(p => p.status === 'Paid').slice(0, 3).map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                          <div><p className="text-sm font-medium text-gray-900">{p.date}</p><p className="text-xs text-gray-500">{p.method} • {p.label}</p></div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">₹{p.amount.toLocaleString()}</p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Paid</span>
                          </div>
                        </div>
                      ))}
                      {payments.filter(p => p.status === 'Paid').length === 0 && <div className="p-3 text-sm text-gray-500 text-center border border-gray-100 rounded-lg">No recent payments</div>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Assigned Diet Plan</h3>
                      {['Rahul Sharma', 'Rohit Yadav'].includes(selectedMember.name) ? (
                        <div className="p-3 border border-green-100 bg-green-50 rounded-lg">
                          <p className="font-medium text-green-800">{selectedMember.name === 'Rahul Sharma' ? 'Muscle Gain Diet' : 'Veg Protein Plan'}</p>
                          <p className="text-xs text-green-600 mt-0.5">{selectedMember.name === 'Rahul Sharma' ? '3200 kcal · High Protein' : '2800 kcal · Plant-Based'}</p>
                        </div>
                      ) : ['Priya Patel', 'Sneha Mehta'].includes(selectedMember.name) ? (
                        <div className="p-3 border border-green-100 bg-green-50 rounded-lg">
                          <p className="font-medium text-green-800">{selectedMember.name === 'Priya Patel' ? 'Fat Loss Plan' : 'Maintenance Diet'}</p>
                          <p className="text-xs text-green-600 mt-0.5">{selectedMember.name === 'Priya Patel' ? '1800 kcal · Low Carb' : '2200 kcal · Balanced'}</p>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-100 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-700">No Diet Plan Assigned</p>
                        </div>
                      )}
                      <button onClick={() => openMsg(selectedMember, 'whatsapp')} className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg text-white" style={{ background: '#25D366' }}>
                        <MessageCircle size={13} /> Send Diet Plan
                      </button>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Assigned Workout Plan</h3>
                      {['Rahul Sharma', 'Rohit Yadav'].includes(selectedMember.name) ? (
                        <div className="p-3 border border-blue-100 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-800">{selectedMember.name === 'Rahul Sharma' ? 'Push Pull Legs' : 'Arnold Split'}</p>
                          <p className="text-xs text-blue-600 mt-0.5">{selectedMember.name === 'Rahul Sharma' ? '6 days/week · Hypertrophy' : '6 days/week · Bodybuilding'}</p>
                        </div>
                      ) : ['Priya Patel'].includes(selectedMember.name) ? (
                        <div className="p-3 border border-blue-100 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-800">HIIT Fat Burn</p>
                          <p className="text-xs text-blue-600 mt-0.5">4 days/week · Cardio Focus</p>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-100 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-700">No Workout Assigned</p>
                        </div>
                      )}
                      <button onClick={() => openMsg(selectedMember, 'email')} className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg text-white" style={{ background: 'hsl(217 91% 60%)' }}>
                        <Mail size={13} /> Send Workout Plan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Attendance ── */}
              {profileTab === 'attendance' && (
                <div>
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Present', value: presentDays, color: 'text-green-600', bg: 'bg-green-50' },
                      { label: 'Absent', value: absentDays, color: 'text-red-600', bg: 'bg-red-50' },
                      { label: 'Leave', value: leaveDays, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                      { label: 'Attendance %', value: `${attPct}%`, color: attPct >= 75 ? 'text-green-600' : 'text-red-600', bg: 'bg-gray-50' },
                    ].map((s, i) => (
                      <div key={i} className={`${s.bg} rounded-xl p-4`}>
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Click a day to toggle: 🟢 Present → 🔴 Absent → 🟡 Leave</p>
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10">
                    {att.map(({ day, status }) => (
                      <button key={day} onClick={() => toggleAtt(selectedMember.id, day)}
                        title={`Day ${day}: ${status === 'P' ? 'Present' : status === 'A' ? 'Absent' : 'Leave'}`}
                        className={`h-10 w-full rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110 ${status === 'P' ? 'bg-green-100 text-green-700 hover:bg-green-200' : status === 'A' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-200 inline-block" />Present</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-200 inline-block" />Absent</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-200 inline-block" />Leave</span>
                  </div>
                </div>
              )}

              {/* ── Payment History ── */}
              {profileTab === 'payments' && (
                <div>
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500">Total Paid</p>
                      <p className="text-xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500">Total Due</p>
                      <p className="text-xl font-bold text-red-600">₹{totalDue.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500">Cycle Price ({selectedMember.billingCycle})</p>
                      <p className="text-xl font-bold text-orange-600">₹{PRICING_MATRIX[selectedMember.plan][selectedMember.billingCycle].toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Month-wise table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>{['Billing Slot', 'Amount', 'Status', 'Date', 'Method', 'Action'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {payments.map((p, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{p.label}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.amount > 0 ? `₹${p.amount.toLocaleString()}` : '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                p.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                p.status === 'Due' ? 'bg-red-100 text-red-700' :
                                p.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {p.status === 'Paid' && <CheckCircle size={10} />}
                                {p.status === 'Due' && <XCircle size={10} />}
                                {p.status === 'Upcoming' && <Clock size={10} />}
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{p.date || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{p.method || '—'}</td>
                            <td className="px-4 py-3">
                              {p.status === 'Due' && (
                                <button onClick={() => openMsg(selectedMember, 'whatsapp')}
                                  className="text-xs px-2.5 py-1 rounded-lg font-semibold text-white flex items-center gap-1"
                                  style={{ background: '#25D366' }}>
                                  <MessageCircle size={11} /> Remind
                                </button>
                              )}
                              {p.status === 'Paid' && (
                                <button onClick={() => handlePrint(p, selectedMember)}
                                  className="text-xs px-2.5 py-1 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center gap-1">
                                  <Printer size={11} /> Print
                                </button>
                              )}
                            </td>
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

        {msgModal && <MessageModal isOpen={msgModal.open} onClose={closeMsg} recipient={msgModal.recipient} type={msgModal.type} defaultMessage={msgModal.message} subject={msgModal.subject} onSuccess={() => showToast(`${msgModal.type === 'whatsapp' ? 'WhatsApp' : 'Email'} sent to ${msgModal.recipient.name}!`, msgModal.type)} />}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        {showAddModal && renderModal()}
        <ThermalReceipt data={printData} />
      </div>
    );
  }

  // ── Modal renderer ──────────────────────────────────────────────────────────
  function renderModal() {
    const calculatedPrice = PRICING_MATRIX[form.plan][form.billingCycle];

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="font-bold text-gray-900 text-lg">{editMemberId ? 'Edit Member' : 'Add New Member'}</h2>
            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><X size={17} /></button>
          </div>
          <form onSubmit={saveMember} className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <User size={22} className="text-gray-400" />
              </div>
              <div><p className="text-sm font-medium text-gray-700">Profile Photo</p><button type="button" className="text-xs text-orange-500 mt-1 hover:underline">Upload Photo</button></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name *', key: 'name', type: 'text', req: true },
                { label: 'Mobile No. *', key: 'phone', type: 'tel', req: true },
                { label: 'Email', key: 'email', type: 'email', req: false },
                { label: 'Address', key: 'address', type: 'text', req: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input required={f.req} type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {['Male', 'Female', 'Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {['Main Branch', 'Branch 2', 'Branch 3'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-orange-900">Membership Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">Plan Tier</label>
                  <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value as PlanTier })} className="w-full px-3 py-2.5 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {['Basic', 'Gold', 'Premium'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">Billing Cycle (Duration)</label>
                  <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value as BillingCycle })} className="w-full px-3 py-2.5 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {['1 Month', '3 Months', '6 Months', '12 Months'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as MemberStatus })} className="w-full px-3 py-2.5 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {['Active', 'Pending', 'Expired'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">Calculated Price</label>
                  <div className="w-full px-3 py-2.5 text-sm border border-orange-200 bg-white rounded-lg font-bold text-gray-900">
                    ₹{calculatedPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2.5 text-sm text-white rounded-lg font-medium flex items-center gap-2" style={{ background: 'hsl(24 95% 53%)' }}>
                <Save size={15} />{editMemberId ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Main List ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full">
      <Header title="Member Management" subtitle="Manage all gym members, plans, attendance, and payments" />
      <div className="p-6 space-y-5">
        {/* Filters */}
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
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><Download size={15} /> Export CSV</button>
              <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}>
                <Plus size={15} /> Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Member', 'Contact', 'Plan & Cycle', 'Status', 'Expiry', 'Dues', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}</tr>
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
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{m.plan}</p>
                      <p className="text-xs text-gray-500">{m.billingCycle}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${m.status === 'Active' ? 'bg-green-100 text-green-700' : m.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.expiry}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${m.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{m.pendingAmount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button onClick={() => { setSelectedMember(m); setProfileTab('overview'); }} title="View Profile" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={14} /></button>
                        <button onClick={() => openEdit(m)} title="Edit" className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit size={14} /></button>
                        <button onClick={() => { setSelectedMember(m); setProfileTab('attendance'); }} title="Attendance" className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Calendar size={14} /></button>
                        <button onClick={() => { setSelectedMember(m); setProfileTab('payments'); }} title="Payment History" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"><CreditCard size={14} /></button>
                        <button onClick={() => openMsg(m, 'whatsapp')} title="WhatsApp" className="p-1.5 rounded-lg hover:bg-green-50" style={{ color: '#25D366' }}><MessageCircle size={14} /></button>
                        <button onClick={() => openMsg(m, 'email')} title="Email" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Mail size={14} /></button>
                        <button onClick={() => deleteMember(m.id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-500">No members found.</td></tr>}
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

      {showAddModal && renderModal()}
      {msgModal && <MessageModal isOpen={msgModal.open} onClose={closeMsg} recipient={msgModal.recipient} type={msgModal.type} defaultMessage={msgModal.message} subject={msgModal.subject} onSuccess={() => showToast(`${msgModal.type === 'whatsapp' ? 'WhatsApp' : 'Email'} sent to ${msgModal.recipient.name}!`, msgModal.type)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
