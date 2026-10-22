// RESPONSIBILITY: Renders the reusable confirmation/destructive action modal used across all SUPERADMIN modules. Receives config via SuperadminConfirmProvider. No API calls.
'use client';

import { AlertTriangle } from 'lucide-react';

interface SuperadminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function SuperadminConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: SuperadminConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm overflow-hidden motion-safe:animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              type === 'danger' ? 'bg-danger-bg text-danger' :
              type === 'warning' ? 'bg-warning-bg text-warning' :
              'bg-info-bg text-info'
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
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-input transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 ${
                type === 'danger' ? 'bg-danger' :
                type === 'warning' ? 'bg-warning' :
                'bg-info'
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
