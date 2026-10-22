// RESPONSIBILITY: Renders the reusable confirmation/destructive action modal used across all ADMIN modules. Receives config via AdminConfirmProvider. No API calls.
'use client';

import { AlertTriangle } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 motion-safe:animate-in motion-safe:fade-in duration-200">
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 w-full max-w-sm overflow-hidden motion-safe:animate-in motion-safe:zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              type === 'danger' ? 'bg-danger/10 text-danger' :
              type === 'warning' ? 'bg-warning/10 text-warning' :
              'bg-info/10 text-info'
            }`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm text-secondary mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${
                type === 'danger' ? 'bg-danger shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                type === 'warning' ? 'bg-warning shadow-[0_0_20px_rgba(245,158,11,0.3)]' :
                'bg-info shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
