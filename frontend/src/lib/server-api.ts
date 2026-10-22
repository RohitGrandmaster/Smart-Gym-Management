// RESPONSIBILITY: Provides server-side fetch wrappers to securely fetch data from the backend during Server Component rendering (SSR), automatically handling token injection.
import { cookies } from 'next/headers';
import { StatusCodes } from 'http-status-codes';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function ssrApiFetch<T = unknown>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('gymsmart_token')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const userCookie = cookieStore.get('gymsmart_user')?.value;
  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      if (user.tenantId) {
        headers['x-tenant-id'] = user.tenantId;
      }
    } catch (_e) {
      // ignore parsing errors
    }
  }

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  let res: Response;

  try {
    if (isDemoMode) {
      throw new Error('DEMO_MODE_ACTIVE');
    }
    res = await fetch(`${BASE_URL}${path}`, { headers });
  } catch (error) {
    if (error instanceof TypeError || (error as Error).message === 'DEMO_MODE_ACTIVE') {
      const { routeMockRequest } = await import('./mock_router');
      return await routeMockRequest<T>(path, 'GET') as unknown as T;
    }
    throw error;
  }
  
  if (!res.ok) {
    if (res.status === StatusCodes.UNAUTHORIZED) {
      throw new Error('Unauthorized');
    }
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `API Error: ${res.status}`);
  }

  return res.json();
}
export { ssrApiFetch };
