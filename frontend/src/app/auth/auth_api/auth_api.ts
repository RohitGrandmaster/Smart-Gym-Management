// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized API client exclusively for the Auth module. Encapsulates network calls to backend authentication routes.
import { apiFetch, ApiResponse } from '@/lib/api';
import { AuthUrlConfig } from '@/app/auth/auth_url_config';

export const authApi = {
  login: async (email: string, password: string) => {
    return apiFetch<ApiResponse<import('@/app/auth/login/login_types/login_types').AuthResponse>>(AuthUrlConfig.BACKEND_API.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });
  },
};


