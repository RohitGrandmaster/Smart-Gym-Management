// RESPONSIBILITY: Renders the send-message modal (WhatsApp/Email) for communicating with a member. Shared across the Members and Finance modules.
'use client';

import { useState } from 'react';
import { X, Send, MessageCircle, Mail, CheckCircle, Phone, AtSign } from 'lucide-react';

export type MessageType = 'whatsapp' | 'email';

export interface AdminMessageRecipient {
 name: string;
 phone?: string;
 email?: string;
}

interface AdminMessageModalProps {
 isOpen?: boolean;
 open?: boolean;
 onClose: () => void;
 recipient: AdminMessageRecipient;
 type: MessageType;
 defaultMessage?: string;
 message?: string;
 subject?: string;
 onSuccess?: (msg: string) => void;
}

const WA_GREEN = '#25D366';
const EMAIL_BLUE = 'var(--info)';

export default function AdminMessageModal({
 isOpen,
 open,
 onClose,
 recipient,
 type,
 defaultMessage,
 message: propMessage,
 subject: defaultSubject = 'Message from GymSmart',
 onSuccess,
}: AdminMessageModalProps) {
 const [message, setMessage] = useState(defaultMessage || propMessage || '');
 const [subject, setSubject] = useState(defaultSubject);
 const [sending, setSending] = useState(false);
 const [sent, setSent] = useState(false);

 if (!(isOpen || open)) return null;

 const accentColor = type === 'whatsapp' ? WA_GREEN : EMAIL_BLUE;
 const Icon = type === 'whatsapp' ? MessageCircle : Mail;
 const label = type === 'whatsapp' ? 'WhatsApp' : 'Email';
 const contactInfo = type === 'whatsapp' ? recipient.phone : recipient.email;

 const handleSend = async () => {
 setSending(true);
 
 if (type === 'whatsapp') {
 const phone = contactInfo?.replace(/\D/g, '') || '';
 const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
 window.open(url, '_blank');
 } else {
 const url = `mailto:${contactInfo || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
 window.location.href = url;
 }

 setSending(false);
 setSent(true);
 setTimeout(() => {
 setSent(false);
 setMessage(defaultMessage || propMessage || '');
 onSuccess?.('Message sent successfully!');
 onClose();
 }, 1500);
 };

 const handleClose = () => {
 if (!sending) {
 setSent(false);
 setMessage(defaultMessage || propMessage || '');
 onClose();
 }
 };

 return (
 <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <div
 className="bg-card rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden border border-border"
 style={{ animation: 'fadeScaleIn 0.2s ease' }}
 >
 <div
 className="px-6 py-4 flex items-center justify-between"
 style={{ background: type === 'whatsapp' ? WA_GREEN : 'var(--info)' }}
 >
 <div className="flex flex-wrap items-center gap-3">
 <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
 <Icon size={18} color="white" />
 </div>
 <div>
 <p className="text-white font-bold text-base leading-tight">{label} Message</p>
 <p className="text-white/80 text-xs">Sending to {recipient.name}</p>
 </div>
 </div>
 <button
 onClick={handleClose}
 disabled={sending}
 className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
 >
 <X size={16} color="white" />
 </button>
 </div>

 <div className="px-6 pt-4 pb-2">
 <div className="flex items-center gap-3 p-3 bg-input rounded-xl border border-border">
 <div
 className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
 style={{ background: 'var(--primary)' }}
 >
 {recipient.name.charAt(0)}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-foreground truncate">{recipient.name}</p>
 <div className="flex items-center gap-1 mt-0.5">
 {type === 'whatsapp' ? (
 <Phone size={11} className="text-secondary flex-shrink-0" />
 ) : (
 <AtSign size={11} className="text-secondary flex-shrink-0" />
 )}
 <p className="text-xs text-secondary truncate">{contactInfo || 'N/A'}</p>
 </div>
 </div>
 </div>
 </div>

 {type === 'email' && (
 <div className="px-6 pt-2">
 <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
 Subject
 </label>
 <input
 type="text"
 value={subject}
 onChange={(e) => setSubject(e.target.value)}
 disabled={sending || sent}
 className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-foreground disabled:opacity-60"
 placeholder="Email subject..."
 />
 </div>
 )}

 <div className="px-6 pt-3 pb-2">
 <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
 Message
 </label>
 <textarea
 rows={5}
 value={message}
 onChange={(e) => setMessage(e.target.value)}
 disabled={sending || sent}
 className="w-full px-3 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:border-primary text-foreground resize-none disabled:opacity-60"
 placeholder="Type your message..."
 />
 <p className="text-right text-xs text-secondary mt-1">{message.length} chars</p>
 </div>

 <div className="px-6 pb-5 flex gap-3">
 <button
 onClick={handleClose}
 disabled={sending}
 className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl hover:bg-input text-foreground font-medium transition-colors disabled:opacity-50"
 >
 Cancel
 </button>
 <button
 onClick={handleSend}
 disabled={sending || sent || !message.trim()}
 className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
 style={{ background: sent ? 'var(--success)' : (type === 'whatsapp' ? WA_GREEN : 'var(--info)') }}
 >
 {sent ? (
 <>
 <CheckCircle size={16} />
 Sent!
 </>
 ) : sending ? (
 <>
 <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full motion-safe:animate-spin" />
 Sending...
 </>
 ) : (
 <>
 <Send size={15} />
 Send via {label}
 </>
 )}
 </button>
 </div>
 </div>

 <style>{`
 @keyframes fadeScaleIn {
 from { opacity: 0; transform: scale(0.93); }
 to { opacity: 1; transform: scale(1); }
 }
 `}</style>
 </div>
 );
}
