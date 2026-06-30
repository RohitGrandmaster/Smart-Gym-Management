'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import MessageModal, { MessageType, MessageRecipient } from '@/components/MessageModal';
import Toast, { ToastType } from '@/components/Toast';
import { MessageSquare, Phone, Plus, CheckCircle, Clock, MessageCircle, Mail, Edit2, Trash2, X } from 'lucide-react';

type LeadStatus = 'New' | 'Hot Lead' | 'Cold' | 'Follow Up' | 'Converted';

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  plan: string;
  status: LeadStatus;
  date: string;
}

const INIT_INQUIRIES: Inquiry[] = [
  { id: 1, name: 'Deepak Nair',     phone: '+91 90000 11111', email: 'deepak@gmail.com',  source: 'Facebook',  plan: 'Premium', status: 'Hot Lead',  date: '28 Jun 2026' },
  { id: 2, name: 'Meera Krishnan',  phone: '+91 91000 22222', email: 'meera@gmail.com',   source: 'WhatsApp',  plan: 'Gold',    status: 'Follow Up', date: '27 Jun 2026' },
  { id: 3, name: 'Sunil Patil',     phone: '+91 92000 33333', email: 'sunil@gmail.com',   source: 'Website',   plan: 'Basic',   status: 'New',       date: '26 Jun 2026' },
  { id: 4, name: 'Rekha Sharma',    phone: '+91 93000 44444', email: 'rekha@gmail.com',   source: 'IVR',       plan: 'Annual',  status: 'Converted', date: '25 Jun 2026' },
  { id: 5, name: 'Nikhil Joshi',    phone: '+91 94000 55555', email: 'nikhil@gmail.com',  source: 'Meta',      plan: 'Basic',   status: 'Cold',      date: '24 Jun 2026' },
  { id: 6, name: 'Sonal Mehta',     phone: '+91 95000 66666', email: 'sonal@gmail.com',   source: 'Email',     plan: 'Gold',    status: 'Hot Lead',  date: '23 Jun 2026' },
];

const campaigns = [
  { name: 'Summer Fitness Offer', platform: 'Facebook',  leads: 48, converted: 12, spend: '₹5,000', status: 'Active' },
  { name: 'New Year New You',     platform: 'Instagram', leads: 82, converted: 23, spend: '₹8,500', status: 'Ended' },
  { name: 'Ladies Gym Special',   platform: 'Meta',      leads: 36, converted: 9,  spend: '₹3,500', status: 'Active' },
];

const integrations = [
  { name: 'Meta (Facebook & Instagram)', status: 'Connected', icon: '📘', desc: 'Capture leads from Facebook forms and Instagram DMs automatically' },
  { name: 'WhatsApp Business',           status: 'Connected', icon: '💬', desc: 'Send automated follow-ups and engage leads via WhatsApp' },
  { name: 'Email Marketing',             status: 'Connected', icon: '📧', desc: 'Newsletter campaigns and drip email sequences' },
  { name: 'Website Widget',              status: 'Connected', icon: '🌐', desc: 'Embed inquiry form on your gym website' },
  { name: 'IVR System',                  status: 'Inactive',  icon: '📞', desc: 'Automated phone call system for lead qualification' },
];

function getInquiryTemplate(inq: Inquiry, type: 'followup' | 'welcome' | 'offer') {
  const templates = {
    followup: `Hi ${inq.name}! 👋\n\nThank you for your interest in GymSmart! We noticed you enquired about our ${inq.plan} plan.\n\nWe'd love to have you visit us for a FREE trial session — no strings attached!\n\nCall us or just reply to this message. We're here to help you start your fitness journey! 💪\n\n— Team GymSmart`,
    welcome:  `Hi ${inq.name}! 🎉\n\nThank you for reaching out to GymSmart!\n\nWe received your inquiry about our ${inq.plan} membership. Our team will get in touch with you shortly to answer all your questions.\n\nIn the meantime, feel free to check out our website for more information.\n\n— Team GymSmart`,
    offer:    `Hi ${inq.name}! 🔥\n\nExclusive offer just for you!\n\nJoin GymSmart this week and get:\n✅ 1 Month FREE on Annual Plans\n✅ Free Personal Training Session\n✅ Free Diet Consultation\n\nThis offer expires soon — don't miss out!\n\nReply YES to grab this deal! 💥\n\n— Team GymSmart`,
  };
  return templates[type];
}

// ─── Modal Components ────────────────────────────────────────────────────────

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400";
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INIT_INQUIRIES);
  const [tab, setTab] = useState('All Inquiries');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Inquiry>>({});

  const filtered = inquiries.filter(i => statusFilter === 'All' || i.status === statusFilter);

  // Messaging state
  const [msgModal, setMsgModal] = useState<{ open: boolean; recipient: MessageRecipient; type: MessageType; message: string; subject?: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const openMsg = useCallback((inq: Inquiry, type: MessageType) => {
    const templateType = inq.status === 'Cold' ? 'offer' : inq.status === 'New' ? 'welcome' : 'followup';
    setMsgModal({
      open: true,
      type,
      recipient: { name: inq.name, phone: inq.phone, email: inq.email },
      message: getInquiryTemplate(inq, templateType),
      subject: `GymSmart - ${templateType === 'offer' ? 'Exclusive Membership Offer' : templateType === 'welcome' ? 'Welcome to GymSmart!' : 'Follow-up on Your Inquiry'}`,
    });
  }, []);

  const closeMsg = useCallback(() => setMsgModal(null), []);

  // CRUD Handlers
  const handleOpenAdd = () => {
    setEditId(null);
    setForm({ name: '', phone: '', email: '', source: 'Walk-in', plan: 'Basic', status: 'New', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) });
    setShowAddModal(true);
  };

  const handleOpenEdit = (inq: Inquiry) => {
    setEditId(inq.id);
    setForm({ ...inq });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.plan) return showToast('Please fill all required fields.', 'error');
    if (editId) {
      setInquiries(inquiries.map(i => i.id === editId ? { ...i, ...form } as Inquiry : i));
      showToast('Lead updated successfully!', 'whatsapp');
    } else {
      setInquiries([{ id: Date.now(), ...form } as Inquiry, ...inquiries]);
      showToast('New lead added successfully!', 'whatsapp');
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      setInquiries(inquiries.filter(i => i.id !== id));
      showToast('Lead deleted.', 'whatsapp');
    }
  };

  // Convert Lead States
  const [convertLead, setConvertLead] = useState<Inquiry | null>(null);
  const [convertForm, setConvertForm] = useState({ billingCycle: '1 Month', payment: '' });

  const handleConvertInit = (inq: Inquiry) => {
    setConvertLead(inq);
    setConvertForm({ billingCycle: '1 Month', payment: '' });
  };

  const handleConvertConfirm = () => {
    if (!convertForm.payment) return showToast('Please enter the initial payment amount.', 'error');
    
    setInquiries(inquiries.map(i => i.id === convertLead?.id ? { ...i, status: 'Converted' } : i));
    showToast(`${convertLead?.name} converted to Member! Payment of ₹${convertForm.payment} recorded.`, 'whatsapp');
    setConvertLead(null);
  };

  return (
    <div className="min-h-full relative">
      <Header title="Inquiries & Lead Management" subtitle="Convert leads into loyal members — no lead left behind" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Inquiries', value: inquiries.length,                                          icon: MessageSquare, color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Hot Leads',       value: inquiries.filter(i => i.status === 'Hot Lead').length,    icon: Phone,         color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Converted',       value: inquiries.filter(i => i.status === 'Converted').length,  icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50' },
            { label: 'Follow Ups',      value: inquiries.filter(i => i.status === 'Follow Up').length,  icon: Clock,         color: 'text-yellow-600', bg: 'bg-yellow-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}><s.icon size={19} className={s.color} /></div>
              <div><p className="text-xs text-gray-500 font-medium">{s.label}</p><p className="text-xl font-bold text-gray-900">{s.value}</p></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex overflow-x-auto">
              {['All Inquiries', 'Social Campaign', 'Integrations'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${tab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={tab === t ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="px-4 flex-shrink-0">
              <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}>
                <Plus size={15} /> Add Lead
              </button>
            </div>
          </div>

          <div className="p-5">
            {tab === 'All Inquiries' && (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['All', 'Hot Lead', 'Follow Up', 'New', 'Converted', 'Cold'].map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className="px-3 py-1.5 text-xs rounded-full font-medium border transition-colors"
                      style={statusFilter === f ? { background: 'hsl(24 95% 53%)', color: 'white', border: 'none' } : { borderColor: '#e5e7eb', color: '#4b5563' }}>
                      {f}
                    </button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{['Lead', 'Source', 'Interest', 'Status', 'Date', 'Action'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map(inq => (
                        <tr key={inq.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm flex-shrink-0">
                                {inq.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{inq.name}</p>
                                <p className="text-xs text-gray-500">{inq.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">{inq.source}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-600">{inq.plan}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ${inq.status === 'Hot Lead' ? 'bg-red-100 text-red-700' : inq.status === 'Converted' ? 'bg-green-100 text-green-700' : inq.status === 'Follow Up' ? 'bg-yellow-100 text-yellow-700' : inq.status === 'Cold' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                              {inq.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{inq.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {/* Contact Icons */}
                              <button onClick={() => window.location.href = `tel:${inq.phone}`} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Call"><Phone size={14} /></button>
                              <button onClick={() => openMsg(inq, 'whatsapp')} className="p-1.5 transition-colors hover:bg-green-50" style={{ color: '#25D366' }} title="Send WhatsApp"><MessageCircle size={14} /></button>
                              <button onClick={() => openMsg(inq, 'email')} className="p-1.5 transition-colors hover:bg-blue-50 text-blue-500" title="Send Email"><Mail size={14} /></button>
                              
                              {/* Edit & Delete */}
                              <button onClick={() => handleOpenEdit(inq)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={14} /></button>
                              <button onClick={() => handleDelete(inq.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                              
                              {/* Convert Button */}
                              {inq.status !== 'Converted' && (
                                <button onClick={() => handleConvertInit(inq)} className="px-3 py-1.5 ml-1 text-xs font-medium rounded-lg text-white shadow-sm transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: 'hsl(24 95% 53%)' }}>
                                  Convert
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">No leads found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {tab === 'Social Campaign' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Active Campaigns</h3>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}><Plus size={15} /> New Campaign</button>
                </div>
                {campaigns.map((c, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div><h4 className="font-semibold text-gray-900">{c.name}</h4><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.platform}</span></div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[{ l: 'Total Leads', v: c.leads }, { l: 'Converted', v: c.converted }, { l: 'Conversion', v: `${Math.round((c.converted / c.leads) * 100)}%` }, { l: 'Ad Spend', v: c.spend }].map(s => (
                        <div key={s.l} className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-gray-900">{s.v}</p><p className="text-xs text-gray-500">{s.l}</p></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'Integrations' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">Connect your marketing channels to capture leads automatically</p>
                {integrations.map((intg, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{intg.icon}</div>
                      <div><p className="font-semibold text-gray-900">{intg.name}</p><p className="text-sm text-gray-500">{intg.desc}</p></div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${intg.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{intg.status}</span>
                      <button
                        className={`px-4 py-2 text-sm rounded-lg font-medium ${intg.status === 'Connected' ? 'border border-gray-200 text-gray-600 hover:bg-gray-50' : 'text-white'}`}
                        style={intg.status !== 'Connected' ? { background: 'hsl(24 95% 53%)' } : {}}>
                        {intg.status === 'Connected' ? 'Configure' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Lead Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editId ? 'Edit Lead' : 'Add New Lead'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <Field label="Full Name" required>
                <input className={inputCls} placeholder="Enter name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone" required>
                  <input className={inputCls} placeholder="+91 XXXXX" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input className={inputCls} placeholder="email@example.com" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Interest (Plan)" required>
                  <select className={inputCls} value={form.plan || 'Basic'} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                    <option>Basic</option>
                    <option>Gold</option>
                    <option>Premium</option>
                    <option>Annual</option>
                  </select>
                </Field>
                <Field label="Source">
                  <select className={inputCls} value={form.source || 'Walk-in'} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                    <option>Walk-in</option>
                    <option>Website</option>
                    <option>WhatsApp</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Referral</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Status">
                  <select className={inputCls} value={form.status || 'New'} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
                    <option>New</option>
                    <option>Hot Lead</option>
                    <option>Follow Up</option>
                    <option>Cold</option>
                    <option>Converted</option>
                  </select>
                </Field>
                <Field label="Date">
                  <input className={inputCls} value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-medium border rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90" style={{ background: 'hsl(24 95% 53%)' }}>
                {editId ? 'Save Changes' : 'Create Lead'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Convert Lead Modal ── */}
      {convertLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Convert to Member</h3>
              <button onClick={() => setConvertLead(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 bg-gray-50/50">
              <div className="text-sm">
                <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{convertLead.name}</span></p>
                <p><span className="text-gray-500">Plan:</span> <span className="font-semibold">{convertLead.plan}</span></p>
              </div>
              <Field label="Billing Cycle" required>
                <select className={inputCls} value={convertForm.billingCycle} onChange={(e) => setConvertForm({ ...convertForm, billingCycle: e.target.value })}>
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>12 Months</option>
                </select>
              </Field>
              <Field label="Initial Payment Amount (₹)" required>
                <input className={inputCls} type="number" placeholder="e.g. 2500" value={convertForm.payment} onChange={(e) => setConvertForm({ ...convertForm, payment: e.target.value })} />
              </Field>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setConvertLead(null)} className="px-4 py-2.5 text-sm font-medium border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleConvertConfirm} className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90" style={{ background: 'hsl(24 95% 53%)' }}>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal & Toast */}
      {msgModal && (
        <MessageModal
          isOpen={msgModal.open}
          onClose={closeMsg}
          recipient={msgModal.recipient}
          type={msgModal.type}
          defaultMessage={msgModal.message}
          subject={msgModal.subject}
          onSuccess={() => showToast(`${msgModal.type === 'whatsapp' ? 'WhatsApp' : 'Email'} sent to ${msgModal.recipient.name}!`, msgModal.type)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
