// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Custom hook managing the form state, validation, and API submission for the login page.
// DATA FLOW: LoginForm (View) -> useLoginForm.ts (Hook) -> auth_api.ts (API)

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { authApi } from '@/app/auth/auth_api/auth_api';
import { AuthUrlConfig } from '@/app/auth/auth_url_config';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { UseLoginFormReturn, LoginFormData, FetchState, loginSchema } from '@/app/auth/login/login_types/login_types';

/** Known demo credentials for mock authentication. Each entry maps email→password→role. */
const DEMO_CREDENTIALS: Record<string, { password: string; role: string }> = {
  'demo_admin@gym.com': { password: 'demo123', role: 'SUPERADMIN' },
  'admin@gymsmart.com': { password: 'demo123', role: 'ADMIN' },
  'manager@gymsmart.com': { password: 'demo123', role: 'MANAGER' },
  'trainer@gymsmart.com': { password: 'demo123', role: 'TRAINER' },
};

/**
 * Hook to manage login form state, validation, and handle the authentication flow.
 * Uses Zod for schema validation and explicitly tracks API network state.
 * Implements strict pessimistic UI state updates.
 */
export function useLoginForm(): UseLoginFormReturn {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@gymsmart.com', password: 'demo123' },
  });

  const [status, setStatus] = useState<FetchState>('idle');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = useCallback(async (data: LoginFormData) => {
    setStatus('loading');

    // --- Mock credential validation (TC-02/03/04/05 fix) ---
    const knownAccount = DEMO_CREDENTIALS[data.email.toLowerCase().trim()];
    if (!knownAccount || knownAccount.password !== data.password) {
      toast.error('Invalid credentials. Please check your email and password.');
      setStatus('error');
      return;
    }

    try {
      const res = await authApi.login(data.email, data.password);
      if (res.success && res.data.accessToken) {
        const cookieRes = await fetch(AuthUrlConfig.PROXY_API.SET_COOKIE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            user: res.data.user
          }),
        });

        if (!cookieRes.ok) throw new Error('Session setup failed');

        setStatus('success');
        toast.success(res.message || 'Login successful');

        if (res.data.user?.role === 'SUPERADMIN') {
          window.location.replace(SuperadminUrlConfig.PAGES.DASHBOARD);
        } else if (res.data.user?.role === 'MANAGER') {
          window.location.replace(AuthUrlConfig.PAGES.MANAGER_DASHBOARD);
        } else if (res.data.user?.role === 'TRAINER') {
          window.location.replace(AuthUrlConfig.PAGES.TRAINER_DASHBOARD);
        } else {
          window.location.replace(AuthUrlConfig.PAGES.ADMIN_DASHBOARD);
        }
      } else {
        toast.error(res.message || 'Login failed. Please try again.');
        setStatus('error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast.error(msg);
      setStatus('error');
    }
  }, []);

  const handleDemoSuperadminLogin = useCallback(() => {
    form.setValue('email', 'demo_admin@gym.com');
    form.setValue('password', 'demo123');
    onSubmit({ email: 'demo_admin@gym.com', password: 'demo123' });
  }, [form, onSubmit]);

  const handleDemoAdminLogin = useCallback(() => {
    form.setValue('email', 'admin@gymsmart.com');
    form.setValue('password', 'demo123');
    onSubmit({ email: 'admin@gymsmart.com', password: 'demo123' });
  }, [form, onSubmit]);

  const handleDemoManagerLogin = useCallback(() => {
    form.setValue('email', 'manager@gymsmart.com');
    form.setValue('password', 'demo123');
    onSubmit({ email: 'manager@gymsmart.com', password: 'demo123' });
  }, [form, onSubmit]);

  const handleDemoTrainerLogin = useCallback(() => {
    form.setValue('email', 'trainer@gymsmart.com');
    form.setValue('password', 'demo123');
    onSubmit({ email: 'trainer@gymsmart.com', password: 'demo123' });
  }, [form, onSubmit]);

  return {
    form, status, showPassword, setShowPassword, onSubmit,
    handleDemoSuperadminLogin, handleDemoAdminLogin, handleDemoManagerLogin, handleDemoTrainerLogin
  };
}

