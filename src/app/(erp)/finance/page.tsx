'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import MessageModal, { MessageType, MessageRecipient } from '@/components/MessageModal';
import Toast, { ToastType } from '@/components/Toast';
import { FileText, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Edit2, X, MessageCircle, Mail, Printer } from 'lucide-react';
import ThermalReceipt, { ReceiptData } from '@/components/ThermalReceipt';

const initialInvoices = [
  { id: 'INV-001', member: 'Rahul Sharma', plan: 'Premium', amount: 2500, date: '2026-06-01', status: 'Paid' },
  { id: 'INV-002', member: 'Priya Patel', plan: 'Basic', amount: 1200, date: '2026-06-05', status: 'Paid' },
  { id: 'INV-003', member: 'Amit Kumar', plan: 'Gold', amount: 1800, date: '2026-06-08', status: 'Pending' },
  { id: 'INV-004', member: 'Sneha Mehta', plan: 'Premium', amount: 2500, date: '2026-06-10', status: 'Paid' },
];

const initialTransactions = [
  { id: 1, type: 'Credit', desc: 'Membership Fee - Rahul Sharma', amount: 2500, date: '2026-06-15', cat: 'Membership' },
  { id: 2, type: 'Credit', desc: 'Store Sale - Whey Protein', amount: 3200, date: '2026-06-14', cat: 'Store' },
  { id: 3, type: 'Debit', desc: 'Equipment Maintenance', amount: 8500, date: '2026-06-13', cat: 'Maintenance' },
  { id: 4, type: 'Debit', desc: 'Staff Salaries', amount: 122000, date: '2026-06-10', cat: 'Payroll' },
];

// Hardcoded phone/email map for demo (matches member names in invoices)
const memberContacts: Record<string, { phone: string; email: string }> = {
  'Rahul Sharma': { phone: '+91 98765 43210', email: 'rahul@gmail.com' },
  'Priya Patel':  { phone: '+91 87654 32109', email: 'priya@gmail.com' },
  'Amit Kumar':   { phone: '+91 76543 21098', email: 'amit@gmail.com'  },
  'Sneha Mehta':  { phone: '+91 65432 10987', email: 'sneha@gmail.com' },
};

export default function Finance() {
  const [tab, setTab] = useState('Invoices');
  const [invoices, setInvoices] = useState(initialInvoices);
  const [transactions, setTransactions] = useState(initialTransactions);

  // Modal states for Invoice
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState<string | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({ id: '', member: '', plan: 'Premium', amount: '', date: '', status: 'Pending' });

  // Modal states for Transaction
  const [showTxModal, setShowTxModal] = useState(false);
  const [editTxId, setEditTxId] = useState<number | null>(null);
  const [txForm, setTxForm] = useState({ type: 'Credit', desc: '', amount: '', date: '', cat: 'Misc' });

  // Messaging
  const [msgModal, setMsgModal] = useState<{ open: boolean; recipient: MessageRecipient; type: MessageType; message: string; subject?: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [printData, setPrintData] = useState<ReceiptData | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => setToast({ message, type }), []);

  const handlePrint = (inv: any) => {
    setPrintData({
      gymName: 'GymSmart Fitness',
      gymPhone: '+91 83479 77566',
      receiptNo: inv.id,
      date: inv.date,
      customerName: inv.member,
      items: [{ name: `Invoice - ${inv.plan}`, price: inv.amount, amount: inv.amount }],
      total: inv.amount,
      paymentMethod: 'Paid'
    });
    setTimeout(() => window.print(), 100);
  };
  const closeMsg = useCallback(() => setMsgModal(null), []);

  const openInvMsg = useCallback((inv: typeof initialInvoices[0], type: MessageType) => {
    const contact = memberContacts[inv.member] || { phone: '+91 00000 00000', email: 'member@gymsmart.in' };
    const isPending = inv.status === 'Pending' || inv.status === 'Overdue';
    const message = isPending
      ? `Dear ${inv.member},\n\nThis is a gentle reminder that your ${inv.plan} membership payment of ₹${inv.amount.toLocaleString()} (${inv.id}) is ${inv.status.toLowerCase()}.\n\nKindly clear your dues at the earliest to avoid any service interruption.\n\n— Team GymSmart`
      : `Dear ${inv.member},\n\nThank you for your payment! 🎉\n\nYour ${inv.plan} membership payment of ₹${inv.amount.toLocaleString()} has been received successfully.\nInvoice ID: ${inv.id}\nDate: ${inv.date}\n\nKeep up the great work at GymSmart! 💪\n\n— Team GymSmart`;
    setMsgModal({
      open: true, type,
      recipient: { name: inv.member, phone: contact.phone, email: contact.email },
      message,
      subject: isPending ? `GymSmart - Payment Reminder (${inv.id})` : `GymSmart - Payment Receipt (${inv.id})`,
    });
  }, []);

  // Invoice Handlers
  const openInvoiceModal = (inv?: any) => {
    if (inv) {
      setEditInvoiceId(inv.id);
      setInvoiceForm({ ...inv, amount: inv.amount.toString() });
    } else {
      setEditInvoiceId(null);
      setInvoiceForm({ id: `INV-${Date.now().toString().slice(-4)}`, member: '', plan: 'Premium', amount: '', date: new Date().toISOString().split('T')[0], status: 'Pending' });
    }
    setShowInvoiceModal(true);
  };

  const saveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editInvoiceId) {
      setInvoices(invoices.map(i => i.id === editInvoiceId ? { ...invoiceForm, amount: Number(invoiceForm.amount) } : i));
    } else {
      setInvoices([{ ...invoiceForm, amount: Number(invoiceForm.amount) }, ...invoices]);
    }
    setShowInvoiceModal(false);
  };

  const deleteInvoice = (id: string) => {
    if (confirm('Delete this invoice?')) {
      setInvoices(invoices.filter(i => i.id !== id));
    }
  };

  // Transaction Handlers
  const openTxModal = (tx?: any) => {
    if (tx) {
      setEditTxId(tx.id);
      setTxForm({ ...tx, amount: tx.amount.toString() });
    } else {
      setEditTxId(null);
      setTxForm({ type: 'Credit', desc: '', amount: '', date: new Date().toISOString().split('T')[0], cat: 'Misc' });
    }
    setShowTxModal(true);
  };

  const saveTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTxId) {
      setTransactions(transactions.map(t => t.id === editTxId ? { ...txForm, id: editTxId, amount: Number(txForm.amount) } : t));
    } else {
      setTransactions([{ ...txForm, id: Date.now(), amount: Number(txForm.amount) }, ...transactions]);
    }
    setShowTxModal(false);
  };

  const deleteTx = (id: number) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Metrics calculation
  const totalReceivable = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalReceived = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalCredits = transactions.filter(t => t.type === 'Credit').reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebits = transactions.filter(t => t.type === 'Debit').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-full pb-10">
      <Header title="Finance Management" subtitle="Track invoices, collections, expenses and transactions" />
      <div className="p-6 space-y-5">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0"><FileText size={19} className="text-blue-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">Total Pending</p><p className="text-lg font-bold text-gray-900">₹{totalReceivable.toLocaleString()}</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0"><TrendingUp size={19} className="text-green-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">Amount Received</p><p className="text-lg font-bold text-gray-900">₹{totalReceived.toLocaleString()}</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0"><DollarSign size={19} className="text-yellow-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">Total Credits</p><p className="text-lg font-bold text-gray-900">₹{totalCredits.toLocaleString()}</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0"><TrendingDown size={19} className="text-red-600" /></div>
            <div><p className="text-xs text-gray-500 font-medium">Total Debits</p><p className="text-lg font-bold text-gray-900">₹{totalDebits.toLocaleString()}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex justify-between items-center">
            <div className="flex overflow-x-auto">
              {['Invoices', 'Transactions'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${tab === t ? 'text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={tab === t ? { borderBottomColor: 'hsl(24 95% 53%)' } : {}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="px-4 flex gap-2 flex-shrink-0">
              <button 
                onClick={() => tab === 'Invoices' ? openInvoiceModal() : openTxModal()} 
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg hover:opacity-90" style={{ background: 'hsl(24 95% 53%)' }}
              >
                <Plus size={13} /> Add {tab === 'Invoices' ? 'Invoice' : 'Transaction'}
              </button>
            </div>
          </div>

          <div className="p-5">
            {tab === 'Invoices' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr>{['Invoice ID', 'Member', 'Plan', 'Amount', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-blue-600 font-medium">{inv.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{inv.member}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{inv.plan}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{inv.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{inv.date}</td>
                        <td className="px-4 py-3">
                          <select 
                            value={inv.status} 
                            onChange={(e) => setInvoices(invoices.map(i => i.id === inv.id ? {...i, status: e.target.value} : i))}
                            className={`text-xs font-medium rounded-full px-2.5 py-1 focus:outline-none ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openInvoiceModal(inv)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit2 size={15} /></button>
                            <button onClick={() => deleteInvoice(inv.id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={15} /></button>
                            {/* WhatsApp: Receipt (Paid) or Reminder (Pending/Overdue) */}
                            <button
                              onClick={() => openInvMsg(inv, 'whatsapp')}
                              title={inv.status === 'Paid' ? 'Send Receipt via WhatsApp' : 'Send Payment Reminder via WhatsApp'}
                              className="p-1 rounded-lg hover:bg-green-50 transition-colors"
                              style={{ color: '#25D366' }}
                            >
                              <MessageCircle size={15} />
                            </button>
                            {/* Email: Receipt (Paid) or Reminder (Pending/Overdue) */}
                            <button
                              onClick={() => openInvMsg(inv, 'email')}
                              title={inv.status === 'Paid' ? 'Send Receipt via Email' : 'Send Payment Reminder via Email'}
                              className="p-1 rounded-lg hover:bg-blue-50 transition-colors text-blue-500"
                            >
                              <Mail size={15} />
                            </button>
                            {inv.status === 'Paid' && (
                              <button onClick={() => handlePrint(inv)} className="p-1 rounded-lg hover:bg-gray-200 transition-colors text-gray-700" title="Print Receipt">
                                <Printer size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-500">No invoices found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
            
            {tab === 'Transactions' && (
              <div>
                <div className="space-y-2">
                  {transactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 group">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.type === 'Credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {t.type === 'Credit' ? <TrendingUp size={15} className="text-green-600" /> : <TrendingDown size={15} className="text-red-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t.desc}</p>
                          <p className="text-xs text-gray-500">{t.date} · {t.cat}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-sm font-bold ${t.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openTxModal(t)} className="text-blue-600 hover:text-blue-800"><Edit2 size={15} /></button>
                          <button onClick={() => deleteTx(t.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && <div className="text-center py-8 text-gray-500">No transactions found.</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INVOICE MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editInvoiceId ? 'Edit Invoice' : 'Add Invoice'}</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={saveInvoice} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Name</label>
                <input required type="text" value={invoiceForm.member} onChange={e => setInvoiceForm({...invoiceForm, member: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select value={invoiceForm.plan} onChange={e => setInvoiceForm({...invoiceForm, plan: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Basic</option>
                    <option>Gold</option>
                    <option>Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={invoiceForm.status} onChange={e => setInvoiceForm({...invoiceForm, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input required type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input required type="date" value={invoiceForm.date} onChange={e => setInvoiceForm({...invoiceForm, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium text-white" style={{ background: 'hsl(24 95% 53%)' }}>Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION MODAL */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editTxId ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button onClick={() => setShowTxModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={saveTx} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input required type="text" value={txForm.desc} onChange={e => setTxForm({...txForm, desc: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={txForm.type} onChange={e => setTxForm({...txForm, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Credit</option>
                    <option>Debit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={txForm.cat} onChange={e => setTxForm({...txForm, cat: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Membership</option>
                    <option>Store</option>
                    <option>Maintenance</option>
                    <option>Payroll</option>
                    <option>Utilities</option>
                    <option>Misc</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input required type="number" value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input required type="date" value={txForm.date} onChange={e => setTxForm({...txForm, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowTxModal(false)} className="px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium text-white" style={{ background: 'hsl(24 95% 53%)' }}>Save Transaction</button>
              </div>
            </form>
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
      <ThermalReceipt data={printData} />
    </div>
  );
}
