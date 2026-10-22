// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Encapsulates all API calls for the Landing module.
// Uses the centralized apiFetch wrapper. No component should call fetch() directly.
import { apiFetch, ApiResponse } from '@/lib/api';
import { LandingUrlConfig } from '@/app/landing/landing_url_config';

export const landingApi = {
  submitBooking: async (data: { name: string; email: string; phone: string; date: string; type: string }) => {
    const interestMap: Record<string, string> = { 'trial': 'Free Trial', 'membership': 'Membership', 'class': 'Class Slot' };
    return apiFetch<ApiResponse<unknown>>(LandingUrlConfig.BACKEND_API.BOOKING, {
      method: 'POST',
      body: JSON.stringify({ 
        ...data, 
        source: 'Website', 
        interest: interestMap[data.type] || 'General Inquiry' 
      }),
      auth: false,
    });
  },

  submitContact: async (data: { name: string; email: string; message: string }) => {
    return apiFetch<ApiResponse<unknown>>(LandingUrlConfig.BACKEND_API.CONTACT, {
      method: 'POST',
      body: JSON.stringify({ 
        ...data, 
        source: 'Website', 
        interest: 'General Inquiry' 
      }),
      auth: false,
    });
  },
};

