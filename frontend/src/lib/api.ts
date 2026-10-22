// RESPONSIBILITY: Centralized API client and auth utilities for the GymSmart ERP frontend.
// Provides: apiFetch() (with auto token injection, tenant header, and 401 refresh logic),
// getUser() (reads user from non-HttpOnly cookie), and logout() (clears session and redirects).
// Every API call in every module MUST go through apiFetch — never call fetch() directly.
/**
 * GymSmart API Client
 * Centralised fetch wrapper for all backend API calls.
 * Base URL: http://localhost:5000/api/v1
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}


import { AuthUrlConfig } from '@/app/auth/auth_url_config';
import { StatusCodes } from 'http-status-codes';
import toast from 'react-hot-toast';
import { routeMockRequest } from './mock_router';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ─── User Helper (reads from non-HttpOnly cookie set by server) ───────────────

export function getUser(): { id?: string; name: string; email: string; role: string; tenantId?: string } | null {
  if (typeof window === 'undefined') return null;
  const c = document.cookie.split(';').find(x => x.trim().startsWith('gymsmart_user='));
  if (!c) return null;
  try { return JSON.parse(decodeURIComponent(c.split('=').slice(1).join('='))); } catch { return null; }
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }
  await fetch(AuthUrlConfig.PROXY_API.LOGOUT, { method: 'POST' });
  window.location.replace(AuthUrlConfig.PAGES.LOGIN);
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { auth = true, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string>),
  };

  // Inject Tenant ID for Multi-Tenancy
  if (typeof window !== 'undefined') {
    const user = getUser();
    if (user && user.tenantId) {
      headers['x-tenant-id'] = user.tenantId;
    } else {
      // Fallback to checking a specific cookie if tenantId is stored separately
      const tenantCookie = document.cookie.split(';').find(x => x.trim().startsWith('x-tenant-id='));
      if (tenantCookie) {
        headers['x-tenant-id'] = tenantCookie.split('=')[1].trim();
      }
    }
  }

  // Token is in HttpOnly cookie — read via Next.js proxy to avoid CORS/exposure
  if (auth) {
    const tokenRes = await fetch(AuthUrlConfig.PROXY_API.TOKEN).catch(() => null);
    if (tokenRes?.ok) {
      const { token } = await tokenRes.json();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  }
  let res: Response;
  let finalRes: Response;
  const method = rest.method || 'GET';
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  try {
    if (isDemoMode) {
      throw new Error('DEMO_MODE_ACTIVE');
    }
    res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });
    finalRes = res;
  } catch (error) {
    // Intercept network failures or explicit demo mode
    if (error instanceof TypeError || (error as Error).message === 'DEMO_MODE_ACTIVE') {
      return await routeMockRequest<T>(path, method, rest.body) as unknown as T;
    }
    throw error;
  }
  
  if (res.status === StatusCodes.UNAUTHORIZED && auth) {
    // Attempt to refresh the token
    const refreshRes = await fetch(AuthUrlConfig.PROXY_API.REFRESH, { method: 'POST' });
    
    if (refreshRes.ok) {
      // Refresh succeeded, grab new token from response
      const { accessToken } = await refreshRes.json();
      if (accessToken) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${accessToken}`;
        finalRes = await fetch(`${BASE_URL}${path}`, { ...rest, headers });
      }
    } else {
      // Refresh failed, session genuinely expired
      await fetch(AuthUrlConfig.PROXY_API.LOGOUT, { method: 'POST' });
      window.location.replace(AuthUrlConfig.PAGES.LOGIN);
      throw new Error('Session expired. Please login again.');
    }
  }

  const json = await finalRes.json();

  if (!finalRes.ok) {
    const errorMsg = json.message || `API Error: ${finalRes.status}`;
    if (typeof window !== 'undefined') {
      toast.error(errorMsg);
    }
    throw new Error(errorMsg);
  }

  return json;
}




