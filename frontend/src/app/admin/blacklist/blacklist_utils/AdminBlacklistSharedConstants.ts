// RESPONSIBILITY: Constants, mock data, and Zod schema for the Blacklist module.
import { z } from 'zod';
import type { BlacklistedMember, BlacklistKPIData } from '@/app/admin/blacklist/blacklist_types/blacklist_types';

export const BLACKLIST_GYM_OPTIONS = [
  { value: 'all', label: 'All Gyms' },
  { value: 'g1', label: 'Andheri East' },
  { value: 'g2', label: 'Bandra West' },
  { value: 'g3', label: 'Powai' },
  { value: 'g4', label: 'Thane' },
];

export const BLACKLIST_SCOPE_OPTIONS = [
  { value: 'all', label: 'All Scopes' },
  { value: 'global', label: 'Global Ban' },
  { value: 'specific', label: 'Gym-Specific' },
];

export const BLACKLIST_ITEMS_PER_PAGE = 10;

export const BlacklistSchema = z.object({
  memberId: z.string().min(1, 'Member ID required'),
  memberName: z.string().min(2, 'Name required'),
  memberPhone: z.string().min(10, 'Valid phone required'),
  memberEmail: z.string().email('Valid email required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  scope: z.enum(['global', 'specific']),
  assignedGyms: z.array(z.string()).min(1, 'Select at least one gym'),
});

export const EMPTY_BLACKLIST_FORM = {
  memberId: '',
  memberName: '',
  memberPhone: '',
  memberEmail: '',
  reason: '',
  scope: 'global' as const,
  assignedGyms: ['all'],
};

export const MOCK_BLACKLIST: BlacklistedMember[] = [
  { id: 'bl1', memberId: 'M1042', memberName: 'Rajan Mehta', memberPhone: '+91 98765 43210', memberEmail: 'rajan.m@email.com', reason: 'Physical altercation with staff member at Andheri branch', blacklistedBy: 'Admin', blacklistedAt: '2025-05-12', scope: 'global', assignedGyms: ['all'], assignedGymNames: ['All Gyms'], isActive: true },
  { id: 'bl2', memberId: 'M2087', memberName: 'Priya Sharma', memberPhone: '+91 87654 32109', memberEmail: 'priya.s@email.com', reason: 'Repeated non-payment and fraudulent membership transfer', blacklistedBy: 'Admin', blacklistedAt: '2025-04-28', scope: 'global', assignedGyms: ['all'], assignedGymNames: ['All Gyms'], isActive: true },
  { id: 'bl3', memberId: 'M3156', memberName: 'Karan Joshi', memberPhone: '+91 76543 21098', memberEmail: 'karan.j@email.com', reason: 'Theft of equipment at Powai branch', blacklistedBy: 'Manager - Powai', blacklistedAt: '2025-06-01', scope: 'specific', assignedGyms: ['g3'], assignedGymNames: ['Powai'], isActive: true },
  { id: 'bl4', memberId: 'M4201', memberName: 'Sneha Patil', memberPhone: '+91 65432 10987', memberEmail: 'sneha.p@email.com', reason: 'Harassment of other members', blacklistedBy: 'Admin', blacklistedAt: '2025-03-15', scope: 'specific', assignedGyms: ['g1', 'g2'], assignedGymNames: ['Andheri East', 'Bandra West'], isActive: true },
  { id: 'bl5', memberId: 'M5312', memberName: 'Amit Verma', memberPhone: '+91 54321 09876', memberEmail: 'amit.v@email.com', reason: 'Chargebacks and payment disputes', blacklistedBy: 'Admin', blacklistedAt: '2025-02-20', scope: 'global', assignedGyms: ['all'], assignedGymNames: ['All Gyms'], isActive: false },
];

export const MOCK_BLACKLIST_KPI: BlacklistKPIData = {
  totalBlacklisted: 5,
  globalBans: 3,
  gymSpecificBans: 2,
  addedThisMonth: 1,
};
