// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Defines strict Zod schemas, TypeScript interfaces, and API response shapes specifically for the Login module to enforce type safety.
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface UseLoginFormReturn {
  form: UseFormReturn<LoginFormData>;
  status: FetchState;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  onSubmit: (data: LoginFormData) => Promise<void>;
  handleDemoSuperadminLogin: () => void;
  handleDemoAdminLogin: () => void;
  handleDemoManagerLogin: () => void;
  handleDemoTrainerLogin: () => void;
}

