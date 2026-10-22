// RESPONSIBILITY: Renders the fixed bottom-right toast notification. Auto-dismisses after 4 seconds. Shared across all ADMIN modules.
'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, MessageCircle, Mail, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'whatsapp' | 'email' | 'error' | 'success' | 'info' | 'warning';

interface AdminToastProps {
 message: string;
 type: ToastType;
 onClose: () => void;
}

export default function AdminToast({ message, type, onClose }: AdminToastProps) {
 useEffect(() => {
 const timer = setTimeout(onClose, 4000);
 return () => clearTimeout(timer);
 }, [onClose]);

 const config: Record<ToastType, { icon: React.ReactNode, border: string, colorClass: string, shadow: string }> = {
 success: { icon: <CheckCircle size={20} />, border: 'var(--success)', colorClass: 'text-success', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]' },
 error: { icon: <XCircle size={20} />, border: 'var(--danger)', colorClass: 'text-danger', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
 whatsapp: { icon: <MessageCircle size={20} />, border: 'var(--success)', colorClass: 'text-success', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]' },
 email: { icon: <Mail size={20} />, border: 'var(--info)', colorClass: 'text-info', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
 info: { icon: <Info size={20} />, border: 'var(--info)', colorClass: 'text-info', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
 warning: { icon: <AlertTriangle size={20} />, border: 'var(--warning)', colorClass: 'text-warning', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
 };

 const { icon, border, colorClass, shadow } = config[type] || config.success;

 return (
 <div
 className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 w-80 p-4 rounded-xl border border-white/5 backdrop-blur-xl bg-card/90 text-foreground motion-safe:animate-in motion-safe:slide-in-from-right-8 motion-safe:fade-in duration-300 ${shadow}`}
 style={{ 
 borderLeft: `4px solid ${border}`
 }}
 >
 <div className={`${colorClass} flex-shrink-0`}>
 {icon}
 </div>
 <div className="flex-1 text-sm font-semibold">
 {message}
 </div>
 <button
 onClick={onClose}
 className="text-secondary hover:text-foreground flex-shrink-0 transition-colors p-1 rounded-md hover:bg-white/10"
 >
 <X size={16} />
 </button>
 </div>
 );
}
