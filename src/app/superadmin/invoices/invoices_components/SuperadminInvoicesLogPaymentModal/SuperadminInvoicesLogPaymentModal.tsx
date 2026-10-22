// RESPONSIBILITY: Renders the SuperadminInvoicesLogPaymentModal component.
import React from 'react';
import { X, Search, DollarSign } from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import type { Tenant } from '@/app/superadmin/superadmin_types/superadmin_types';

interface InvoicesLogPaymentModalProps {
  onClose: () => void;
  selectedGym: Tenant | undefined;
  isGymDropdownOpen: boolean;
  setIsGymDropdownOpen: (open: boolean) => void;
  gymSearchTerm: string;
  setGymSearchTerm: (term: string) => void;
  filteredTenantsForDropdown: Tenant[];
  handleSelectGym: (id: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onSave: () => void;
}

export default function SuperadminInvoicesLogPaymentModal({
  onClose,
  selectedGym,
  isGymDropdownOpen,
  setIsGymDropdownOpen,
  gymSearchTerm,
  setGymSearchTerm,
  filteredTenantsForDropdown,
  handleSelectGym,
  paymentMethod,
  setPaymentMethod,
  onSave
}: InvoicesLogPaymentModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-overlay border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Log Manual Payment</h2>
          <button onClick={onClose} className="text-secondary hover:text-foreground motion-safe:transition-colors" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Searchable Gym Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-secondary mb-1.5">Select Gym (Tenant)</label>
            <div
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground cursor-pointer flex justify-between items-center hover:border-primary motion-safe:transition-colors"
              onClick={() => setIsGymDropdownOpen(!isGymDropdownOpen)}
            >
              <span className={selectedGym ? 'text-foreground' : 'text-secondary'}>
                {selectedGym ? `${selectedGym.name} (${selectedGym.plan})` : '-- Choose Gym --'}
              </span>
              <span className="text-secondary text-xs">▼</span>
            </div>
            {isGymDropdownOpen && (
              <div className="absolute z-30 top-[calc(100%+4px)] left-0 right-0 bg-overlay border border-border rounded-lg shadow-2xl overflow-hidden max-h-64 flex flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-100">
                <div className="p-2 border-b border-border bg-header">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
                    <input
                      type="text"
                      placeholder="Search gym by name..."
                      className="w-full pl-8 pr-3 py-1.5 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:border-primary"
                      value={gymSearchTerm}
                      onChange={(e) => setGymSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="overflow-y-auto p-1">
                  {filteredTenantsForDropdown.map((t) => (
                    <div
                      key={t.id}
                      className="px-3 py-2.5 text-sm text-foreground hover:bg-input hover:text-primary cursor-pointer rounded-md motion-safe:transition-colors"
                      onClick={() => handleSelectGym(t.id)}
                    >
                      <span className="font-bold">{t.name}</span>
                      <span className="text-secondary text-xs ml-1">({t.plan})</span>
                    </div>
                  ))}
                  {filteredTenantsForDropdown.length === 0 && (
                    <div className="px-3 py-6 text-center text-sm text-disabled font-medium">No gyms found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Amount (₹)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }} placeholder="e.g. 4999" className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Payment Method</label>
              <SearchableDropdown
                value={paymentMethod}
                onChange={(val) => setPaymentMethod(String(val))}
                options={[
                  { label: 'UPI', value: 'UPI' },
                  { label: 'Cash', value: 'CASH' },
                  { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
                  { label: 'Other / Offline', value: 'OFFLINE' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Reference ID</label>
              <input type="text" placeholder="e.g. TXN123456" className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Date & Time Received</label>
            <input type="datetime-local" className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div className="p-5 border-t border-border bg-header flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-input border border-border text-foreground rounded-lg text-sm font-medium hover:bg-border motion-safe:transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:active:scale-95"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
}
