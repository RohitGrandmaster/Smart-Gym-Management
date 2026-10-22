// RESPONSIBILITY: Manages form state, validation, and API submission for onboarding a new gym.
// DATA FLOW: SuperadminAddGymForm -> useSuperadminAddGymForm -> superadminApi.gyms.create

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { OnboardGymSchema, OnboardGymFormValues } from '@/app/superadmin/gyms/gyms_utils/SuperadminGymsValidationSchemas';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { useSuperadminData } from '@/app/superadmin/superadmin_utils/useSuperadminData';
import type { Tenant } from '@/app/superadmin/gyms/superadmin_gyms_types/superadmin_gyms_types';
import type { SubscriptionPlan } from '@/app/superadmin/superadmin_types/superadmin_types';
import { WhatsAppFormatter } from '@/lib/whatsapp_formatter';
/** Simulated provisioning step delays (ms) — replace with real SSE/WebSocket events when backend supports it */
const PROVISIONING_DELAYS = {
  VALIDATE: 800,
  CREATE_DB: 1500,
  RUN_MIGRATIONS: 2000,
  CREATE_USER: 1000,
  SEND_WHATSAPP: 800,
  REDIRECT: 500,
} as const;

/** Default values for a newly provisioned tenant */
const NEW_TENANT_DEFAULTS = {
  STATUS: 'TRIAL',
  DB_VERSION: 'v1.0.0',
  MEMBER_COUNT: 0,
  MONTHLY_REVENUE: 0,
} as const;

/**
 * Custom hook to encapsulate the logic for the SuperadminAddGymForm component.
 * Handles form validation, UI state (provisioning logs), and API submission.
 */
export function useSuperadminAddGymForm() {
  const router = useRouter();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningLogs, setProvisioningLogs] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const { data: plans, fetchState: fetchStatePlans } = useSuperadminData<SubscriptionPlan[]>(
    SuperadminUrlConfig.BACKEND_API.PLANS_BASE
  );
  
  const loadingPlans = fetchStatePlans === 'loading';

  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm<OnboardGymFormValues>({
    resolver: zodResolver(OnboardGymSchema),
    defaultValues: { plan: '' },
  });

  const addLog = (msg: string) => setProvisioningLogs(prev => [...prev, msg]);

  const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

  const onSubmit = async (data: OnboardGymFormValues) => {
    const cleanPhone = data.phone.replace(/\D/g, '');
    let waWindow: Window | null = null;
    if (cleanPhone) {
      waWindow = window.open('about:blank', '_blank');
    }

    setIsProvisioning(true);
    setProvisioningLogs([]);

    addLog('Validating payload...');
    await delay(PROVISIONING_DELAYS.VALIDATE);

    addLog(`Executing: CREATE DATABASE gym_${data.gymName.toLowerCase().replace(/\s/g, '_')}...`);
    await delay(PROVISIONING_DELAYS.CREATE_DB);

    addLog('Running TypeORM migrations on new database...');
    await delay(PROVISIONING_DELAYS.RUN_MIGRATIONS);

    addLog('Creating Admin User account...');
    await delay(PROVISIONING_DELAYS.CREATE_USER);

    addLog('Sending WhatsApp message with temporary password...');
    await delay(PROVISIONING_DELAYS.SEND_WHATSAPP);

    try {
      const dateStr = new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).format(new Date());

      const waText = WhatsAppFormatter.formatReceipt({
        title: 'Smart Gym 360',
        subtitle: 'Tenant Provisioning',
        date: dateStr,
        customerInfo: {
          Owner: data.ownerName,
          Gym: data.gymName
        },
        sections: [
          {
            title: 'Account Details',
            items: {
              Email: data.adminEmail,
              Pass: data.temporaryPassword
            }
          },
          {
            items: {
              Plan: String(data.plan).toUpperCase()
            }
          }
        ],
        footer: 'Please login to continue'
      });

      if (cleanPhone && waWindow) {
        waWindow.location.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
      } else if (cleanPhone && !waWindow) {
        // Fallback if blocked
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`, '_blank');
      }

      addLog('Sending payload to backend...');
      // Mocking the backend API success as per "fix with all hardcoded data"
      const newGym = {
        id: `mock-${Date.now()}`,
        name: data.gymName,
        ownerName: data.ownerName,
        adminEmail: data.adminEmail,
        phone: data.phone,
        plan: data.plan,
        status: NEW_TENANT_DEFAULTS.STATUS,
        memberCount: NEW_TENANT_DEFAULTS.MEMBER_COUNT,
        monthlyRevenue: NEW_TENANT_DEFAULTS.MONTHLY_REVENUE,
        databaseVersion: NEW_TENANT_DEFAULTS.DB_VERSION,
        temporaryPassword: data.temporaryPassword,
        createdAt: new Date().toISOString(),
      } as unknown as Tenant;

      // Invalidate queries to fetch new data on navigation
      import('@tanstack/react-query').then(({ QueryClient }) => {
         const queryClient = new QueryClient();
         queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] });
      });

      addLog('Provisioning complete! Redirecting...');
      await delay(PROVISIONING_DELAYS.REDIRECT);

      toast.success('Gym provisioned successfully');
      router.push(SuperadminUrlConfig.PAGES.GYMS_LIST);
    } catch (e: unknown) {
      if (waWindow) waWindow.close();
      const errMsg = e instanceof Error ? e.message : 'An error occurred';
      addLog(`Error: ${errMsg}`);
    } finally {
      setIsProvisioning(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    control,
    errors,
    isDirty,
    isProvisioning,
    provisioningLogs,
    showPassword,
    setShowPassword,
    plans,
    loadingPlans,
  };
}
