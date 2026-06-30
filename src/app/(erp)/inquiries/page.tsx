'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import MessageModal, { MessageType, MessageRecipient } from '@/components/MessageModal';
import Toast, { ToastType } from '@/components/Toast';
import { MessageSquare, Phone, Plus, CheckCircle, Clock, MessageCircle, Mail } from 'lucide-react';

const inquiries = [
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

function getInquiryTemplate(inq: typeof inquiries[0], type: 'followup' | 'welcome' | 'offer') {
  const templates = {
    followup: `Hi ${inq.name}! 👋\n\nThank you for your interest in GymSmart! We noticed you enquired about our ${inq.plan} plan.\n\nWe'd love to have you visit us for a FREE trial session — no strings attached!\n\nCall us or just reply to this message. We're here to help you start your fitness journey! 💪\n\n— Team GymSmart`,
    welcome:  `Hi ${inq.name}! 🎉\n\nThank you for reaching out to GymSmart!\n\nWe received your inquiry about our ${inq.plan} membership. Our team will get in touch with you shortly to answer all your questions.\n\nIn the meantime, feel free to check out our website for more information.\n\n— Team GymSmart`,
    offer:    `Hi ${inq.name}! 🔥\n\nExclusive offer just for you!\n\nJoin GymSmart this week and get:\n✅ 1 Month FREE on Annual Plans\n✅ Free Personal Training Session\n✅ Free Diet Consultation\n\nThis offer expires soon — don't miss out!\n\nReply YES to grab this deal! 💥\n\n— Team GymSmart`,
  };
  return templates[type];
}

export default function Inquiries() {
  const [tab, setTab] = useState('All Inquiries');
  const [statusFilter, setStatusFilter] = useState('All');
  const filtered = inquiries.filter(i => statusFilter === 'All' || i.status === statusFilter);

  // Messaging state
  const [msgModal, setMsgModal] = useState<{ open: boolean; recipient: MessageRecipient; type: MessageType; message: string; subject?: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const openMsg = useCallback((inq: typeof inquiries[0], type: MessageType) => {
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

  return (
    <div className="min-h-full">
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
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium" style={{ background: 'hsl(24 95% 53%)' }}><Plus size={15} /> Add Lead</button>
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
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">{inq.name.charAt(0)}</div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{inq.name}</p>
                                <p className="text-xs text-gray-500">{inq.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{inq.source}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-600">{inq.plan}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${inq.status === 'Hot Lead' ? 'bg-red-100 text-red-700' : inq.status === 'Converted' ? 'bg-green-100 text-green-700' : inq.status === 'Follow Up' ? 'bg-yellow-100 text-yellow-700' : inq.status === 'Cold' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                              {inq.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{inq.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Call"><Phone size={13} /></button>
                              {/* WhatsApp 1-Click */}
                              <button
                                onClick={() => openMsg(inq, 'whatsapp')}
                                className="p-1.5 rounded-lg transition-colors hover:bg-green-50"
                                style={{ color: '#25D366' }}
                                title="Send WhatsApp"
                              >
                                <MessageCircle size={13} />
                              </button>
                              {/* Email 1-Click */}
                              <button
                                onClick={() => openMsg(inq, 'email')}
                                className="p-1.5 rounded-lg transition-colors hover:bg-blue-50 text-blue-500"
                                title="Send Email"
                              >
                                <Mail size={13} />
                              </button>
                              <button className="px-2 py-1 text-xs font-medium rounded-lg text-white" style={{ background: 'hsl(24 95% 53%)' }}>Convert</button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
