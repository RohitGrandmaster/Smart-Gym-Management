// RESPONSIBILITY: React Query hook for managing the server state of admin branches.
'use client';

import { useQuery } from '@tanstack/react-query';
import type { Branch } from '@/app/admin/admin_store/useAdminGlobalStore';

const STATIC_BRANCHES: Branch[] = [
  { id: 'b1', name: 'Downtown Core', location: '123 Main St', status: 'active', revenue: 125000, expenses: 45000, studentsCount: 450, staffCount: 12 },
  { id: 'b2', name: 'Uptown Plaza', location: '456 North Ave', status: 'active', revenue: 85000, expenses: 32000, studentsCount: 320, staffCount: 8 },
  { id: 'b3', name: 'Westside Mall', location: '789 West Blvd', status: 'active', revenue: 150000, expenses: 55000, studentsCount: 600, staffCount: 15 },
];

export const useAdminBranchesData = () => {
  return useQuery({
    queryKey: ['admin', 'branches'],
    queryFn: () => Promise.resolve(STATIC_BRANCHES),
    staleTime: Infinity,
  });
};
