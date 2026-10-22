// RESPONSIBILITY: Centralized constants, mock data, and shared config for the Admin Members module.
import { z } from 'zod';

export const ADMIN_MEMBERS_ITEMS_PER_PAGE = 10;

export const MEMBER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'pending', label: 'Pending' },
  { value: 'frozen', label: 'Frozen' },
] as const;

export const EXPIRY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Members' },
  { value: 'this_week', label: 'Expiring This Week' },
  { value: 'this_month', label: 'Expiring This Month' },
] as const;

export const ADMIN_MOCK_MEMBERS = [
  { id: 'm1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', branchId: 'b1', branchName: 'Downtown Core', planName: 'Gold Plan', status: 'active' as const, joinDate: '2024-01-15', expiryDate: '2025-01-15', pendingAmount: 0, gender: 'Male' as const },
  { id: 'm2', name: 'Priya Patel', email: 'priya@example.com', phone: '9123456789', branchId: 'b2', branchName: 'Uptown Plaza', planName: 'Silver Plan', status: 'active' as const, joinDate: '2024-03-10', expiryDate: '2025-03-10', pendingAmount: 0, gender: 'Female' as const },
  { id: 'm3', name: 'Amit Verma', email: 'amit@example.com', phone: '9988776655', branchId: 'b1', branchName: 'Downtown Core', planName: 'Basic Plan', status: 'expired' as const, joinDate: '2023-06-01', expiryDate: '2024-06-01', pendingAmount: 2500, gender: 'Male' as const },
  { id: 'm4', name: 'Sneha Joshi', email: 'sneha@example.com', phone: '9871234560', branchId: 'b3', branchName: 'Westside Mall', planName: 'Gold Plan', status: 'active' as const, joinDate: '2024-05-20', expiryDate: '2025-05-20', pendingAmount: 0, gender: 'Female' as const },
  { id: 'm5', name: 'Karan Mehta', email: 'karan@example.com', phone: '9765432109', branchId: 'b2', branchName: 'Uptown Plaza', planName: 'Annual Pro', status: 'pending' as const, joinDate: '2024-11-01', expiryDate: '2025-11-01', pendingAmount: 5000, gender: 'Male' as const },
  { id: 'm6', name: 'Divya Singh', email: 'divya@example.com', phone: '9654321098', branchId: 'b3', branchName: 'Westside Mall', planName: 'Silver Plan', status: 'active' as const, joinDate: '2024-02-14', expiryDate: '2025-02-14', pendingAmount: 0, gender: 'Female' as const },
  { id: 'm7', name: 'Rohan Gupta', email: 'rohan@example.com', phone: '9543210987', branchId: 'b1', branchName: 'Downtown Core', planName: 'Gold Plan', status: 'frozen' as const, joinDate: '2024-04-01', expiryDate: '2025-04-01', pendingAmount: 1200, gender: 'Male' as const },
  { id: 'm8', name: 'Ananya Reddy', email: 'ananya@example.com', phone: '9432109876', branchId: 'b2', branchName: 'Uptown Plaza', planName: 'Basic Plan', status: 'expired' as const, joinDate: '2023-09-15', expiryDate: '2024-09-15', pendingAmount: 800, gender: 'Female' as const },
  { id: 'm9', name: 'Vikram Nair', email: 'vikram@example.com', phone: '9321098765', branchId: 'b3', branchName: 'Westside Mall', planName: 'Annual Pro', status: 'active' as const, joinDate: '2024-07-01', expiryDate: '2025-07-01', pendingAmount: 0, gender: 'Male' as const },
  { id: 'm10', name: 'Pooja Iyer', email: 'pooja@example.com', phone: '9210987654', branchId: 'b1', branchName: 'Downtown Core', planName: 'Silver Plan', status: 'active' as const, joinDate: '2024-08-20', expiryDate: '2025-01-20', pendingAmount: 0, gender: 'Female' as const },
  { id: 'm11', name: 'Suresh Kumar', email: 'suresh@example.com', phone: '9109876543', branchId: 'b2', branchName: 'Uptown Plaza', planName: 'Gold Plan', status: 'active' as const, joinDate: '2024-06-10', expiryDate: '2025-01-18', pendingAmount: 0, gender: 'Male' as const },
  { id: 'm12', name: 'Meera Pillai', email: 'meera@example.com', phone: '9098765432', branchId: 'b3', branchName: 'Westside Mall', planName: 'Basic Plan', status: 'pending' as const, joinDate: '2024-12-01', expiryDate: '2025-12-01', pendingAmount: 3000, gender: 'Female' as const },
];

export const ADMIN_MOCK_MEMBERS_SUMMARY = {
  totalMembers: 1370,
  activeMembers: 980,
  expiredMembers: 245,
  pendingMembers: 145,
  expiringThisWeek: 23,
  expiringThisMonth: 87,
  totalOutstanding: 284500,
  newThisMonth: 42,
};

export const MemberSearchSchema = z.object({
  search: z.string().optional(),
});
