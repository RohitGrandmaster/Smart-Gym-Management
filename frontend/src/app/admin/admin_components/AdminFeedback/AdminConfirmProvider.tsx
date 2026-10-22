// RESPONSIBILITY: Provides a programmatic confirm() API to all ADMIN components via React Context. Renders a single shared AdminConfirmModal at the root level. No async data — sync UI state only.
'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import AdminConfirmModal from '@/app/admin/admin_components/AdminFeedback/AdminConfirmModal';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function AdminConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    setOptions(options);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver({ resolve });
    });
  }, []);

  const handleConfirm = () => {
    resolver?.resolve(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver?.resolve(false);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <AdminConfirmModal
          isOpen={isOpen}
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          type={options.type}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export const useAdminConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useAdminConfirm must be used within AdminConfirmProvider");
  return context;
};
