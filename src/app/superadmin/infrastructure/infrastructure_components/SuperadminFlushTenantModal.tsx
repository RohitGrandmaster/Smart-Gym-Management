'use client';
// RESPONSIBILITY: Renders the SuperadminFlushTenantModal component using TanStack Query.
import React, { useState, useEffect } from 'react';
import { X, Loader2, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import type { Tenant } from '@/app/superadmin/superadmin_types/superadmin_types';
import { MOCK_GYMS } from '@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants';

interface FlushTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlush: (tenantIds: string[]) => Promise<void>;
}

export default function SuperadminFlushTenantModal({ isOpen, onClose, onFlush }: FlushTenantModalProps) {
  const [search, setSearch] = useState('');
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [isFlushing, setIsFlushing] = useState(false);

  const { data: fetchRes, isLoading: fetchStateLoading } = useQuery({
    queryKey: ['superadmin', 'gyms'],
    queryFn: () => superadminApi.gyms.fetchGyms(),
    enabled: isOpen,
  });

  const rawGyms = (fetchRes?.data as Tenant[]) ?? [];
  const gyms = rawGyms.length > 0 ? rawGyms : MOCK_GYMS;

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTenantIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredGyms = gyms?.filter((g: Tenant) => g.name?.toLowerCase().includes(search.toLowerCase()) || g.id?.includes(search)) || [];

  const handleFlush = async () => {
    if (selectedTenantIds.length === 0) return;
    setIsFlushing(true);
    try {
      await onFlush(selectedTenantIds);
      onClose();
    } finally {
      setIsFlushing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in">
      <div className="bg-overlay border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col motion-safe:animate-in motion-safe:zoom-in-95">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Flush Specific Tenant</h2>
            <p className="text-sm text-secondary">Select a tenant to clear its Redis cache.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-secondary hover:text-foreground hover:bg-input rounded-full motion-safe:transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input 
              type="text"
              placeholder="Search by gym name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
            />
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-semibold text-secondary">Found {filteredGyms.length} tenants</span>
            <div className="space-x-3">
              <button 
                onClick={() => setSelectedTenantIds(filteredGyms.map((g: Tenant) => g.id))}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Select All
              </button>
              <button 
                onClick={() => setSelectedTenantIds([])}
                className="text-xs font-semibold text-secondary hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden flex flex-col h-64 bg-background">
            {fetchStateLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 motion-safe:animate-spin text-primary" />
              </div>
            ) : filteredGyms.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-secondary">
                No tenants found.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {filteredGyms.map((gym: Tenant) => {
                  const isSelected = selectedTenantIds?.includes(gym.id);
                  return (
                    <button
                      key={gym.id}
                      onClick={() => {
                        setSelectedTenantIds(prev => 
                          prev?.includes(gym.id) ? prev.filter(id => id !== gym.id) : [...prev, gym.id]
                        )
                      }}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm motion-safe:transition-colors flex items-center justify-between ${isSelected ? 'bg-primary/10 border-primary text-primary font-semibold' : 'hover:bg-input text-foreground border-transparent'} border`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-border bg-input'}`}>
                          {isSelected && <X className="w-3 h-3" />}
                        </div>
                        <span>{gym.name}</span>
                      </div>
                      <span className={`text-xs ${isSelected ? 'text-primary' : 'text-secondary'}`}>ID: {gym.id}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-border flex justify-end gap-3 bg-sidebar/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-transparent border border-border hover:bg-input text-foreground font-medium rounded-lg motion-safe:transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleFlush}
            disabled={selectedTenantIds.length === 0 || isFlushing}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-medium rounded-lg motion-safe:transition-colors text-sm disabled:cursor-not-allowed"
          >
            {isFlushing && <Loader2 className="w-4 h-4 motion-safe:animate-spin" />}
            Flush {selectedTenantIds.length > 0 ? selectedTenantIds.length : ''} {selectedTenantIds.length === 1 ? 'Tenant' : 'Tenants'}
          </button>
        </div>
      </div>
    </div>
  );
}
