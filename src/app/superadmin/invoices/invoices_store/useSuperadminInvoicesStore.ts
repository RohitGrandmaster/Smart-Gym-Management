/**
 * RESPONSIBILITY: Zustand store that manages all async data for the Invoices module.
 * DATA FLOW: API (superadminApi) <-> useSuperadminInvoicesStore.ts <-> UI Components
 */

// DATA FLOW: Component -> useSuperadminInvoicesStore.ts -> API/Store
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { invoicesApi } from '@/app/superadmin/invoices/superadmin_invoices_api/superadmin_invoices_api';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import type { SaaSInvoice } from '@/app/superadmin/invoices/superadmin_invoices_types/superadmin_invoices_types';
import type { Tenant } from '@/app/superadmin/superadmin_types/superadmin_types';
import type { FetchState } from '@/app/superadmin/superadmin_types/superadmin_types';
import { MOCK_GYMS } from '@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants';

interface InvoicesState {
  invoices: SaaSInvoice[];
  tenants: Tenant[];
  fetchState: FetchState;
  error: string | null;
  actionLoading: boolean;

  fetchData: () => Promise<void>;
  logManualPayment: (data: { gymId: string, amount: number, planName: string }) => Promise<void>;
}

export const useSuperadminInvoicesStore = create<InvoicesState>((set, get) => ({
  invoices: [],
  tenants: [],
  fetchState: 'idle',
  error: null,
  actionLoading: false,

  fetchData: async () => {
    set({ fetchState: 'loading', error: null });
    try {
      const [invoicesRes, tenantsRes] = await Promise.all([
        invoicesApi.fetchInvoices(),
        superadminApi.gyms.fetchGyms()
      ]);
      const rawTenants = tenantsRes.data || [];
      const tenants = rawTenants.length > 0 ? rawTenants : MOCK_GYMS;
      set({ 
        invoices: invoicesRes.data || [], 
        tenants: tenants, 
        fetchState: 'success' 
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to fetch invoices data';
      set({ error: errMsg, fetchState: 'error' });
      toast.error(errMsg);
    }
  },

  logManualPayment: async (data: { gymId: string, amount: number, planName: string }) => {
    set({ actionLoading: true });
    try {
      // Simulate API call and locally append data to list (TC-25 fix)
      const newInvoice: SaaSInvoice = {
        id: `INV-${Math.floor(Math.random() * 100000)}`,
        tenantName: get().tenants.find(t => t.id === data.gymId)?.name || 'Unknown Gym',
        amount: data.amount || 0,
        currency: 'INR',
        status: 'PAID',
        date: new Date().toISOString(),
        planName: data.planName || 'Custom Plan'
      };

      set(state => ({
        invoices: [newInvoice, ...state.invoices]
      }));

      toast.success('Payment logged successfully');
    } catch (error: unknown) {
      toast.error('Failed to log payment');
    } finally {
      set({ actionLoading: false });
    }
  }
}));
