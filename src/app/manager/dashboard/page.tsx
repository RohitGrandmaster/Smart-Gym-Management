// RESPONSIBILITY: Server Component that fetches initial SSR data for the dashboard layout.
import ManagerDashboardMain from '@/app/manager/dashboard/dashboard_components/ManagerDashboardMain/ManagerDashboardMain';
import { cookies } from 'next/headers';
import type { DashboardStats } from '@/app/manager/dashboard/dashboard_types/ManagerDashboardTypes';
import { ApiResponse } from '@/lib/api';

async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('gymsmart_token')?.value;
    
    if (!token) return null;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const res = await fetch(`${backendUrl}/manager/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!res.ok) return null;
    const json = await res.json() as ApiResponse<DashboardStats>;
    return json.data || null;
  } catch (e) {
    return null;
  }
}

export default async function DashboardPage() {
 const initialData = await getDashboardData();
 return <ManagerDashboardMain initialData={initialData} />;
}
