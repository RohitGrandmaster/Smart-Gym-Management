// RESPONSIBILITY: Constants, mock data, and filter options for the Audit Logs module.
import type { AuditLog, AuditKPIData } from '@/app/admin/audit_logs/audit_types/audit_types';

export const AUDIT_ITEMS_PER_PAGE = 10;

export const AUDIT_MODULE_OPTIONS = [
  { value: 'all', label: 'All Modules' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Members', label: 'Members' },
  { value: 'HR', label: 'HR' },
  { value: 'Plans', label: 'Plans' },
  { value: 'Auth', label: 'Auth' },
  { value: 'Settings', label: 'Settings' },
  { value: 'Branches', label: 'Branches' },
  { value: 'Store', label: 'Store' },
  { value: 'Attendance', label: 'Attendance' },
];

export const AUDIT_SEVERITY_OPTIONS = [
  { value: 'all', label: 'All Severity' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const AUDIT_GYM_OPTIONS = [
  { value: 'all', label: 'All Branches' },
  { value: 'b1', label: 'Andheri East' },
  { value: 'b2', label: 'Bandra West' },
  { value: 'b3', label: 'Powai' },
  { value: 'b4', label: 'Thane' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1',  timestamp: '2025-06-20T10:30:00Z', action: 'DELETED_PAYMENT',   user: 'Rahul Verma (Manager)',  branchId: 'b1', details: 'Deleted payment INV-1042 (Amount: ₹5,000, Member: John Doe)',           severity: 'high',   ip: '192.168.1.10', module: 'Finance',    userAgent: 'Chrome/Windows', affectedRecordId: 'INV-1042' },
  { id: '2',  timestamp: '2025-06-20T09:15:00Z', action: 'UPDATED_PLAN',      user: 'Super Admin',            branchId: 'all', details: 'Changed Annual Pro price from ₹12,000 to ₹15,000',                  severity: 'medium', ip: '10.0.0.1',    module: 'Plans',      userAgent: 'Chrome/Mac',     affectedRecordId: 'PLAN-007' },
  { id: '3',  timestamp: '2025-06-19T18:45:00Z', action: 'ADDED_STAFF',       user: 'Super Admin',            branchId: 'b2', details: 'Added new trainer: Vikas Singh (Role: General Trainer)',              severity: 'low',    ip: '10.0.0.1',    module: 'HR',         userAgent: 'Chrome/Mac',     affectedRecordId: 'STAFF-089' },
  { id: '4',  timestamp: '2025-06-19T14:20:00Z', action: 'REFUND_ISSUED',     user: 'Pooja Sharma (Manager)', branchId: 'b2', details: 'Refunded ₹2,000 to Member ID: MEM-009 (Ananya Reddy)',               severity: 'high',   ip: '192.168.1.22', module: 'Finance',    userAgent: 'Firefox/Windows', affectedRecordId: 'MEM-009' },
  { id: '5',  timestamp: '2025-06-18T11:00:00Z', action: 'LOGIN_FAILED',      user: 'Unknown IP',             branchId: 'b1', details: '5 failed login attempts for manager@andheri.com',                    severity: 'high',   ip: '203.0.113.5',  module: 'Auth',       userAgent: 'Unknown',        affectedRecordId: undefined },
  { id: '6',  timestamp: '2025-06-18T09:30:00Z', action: 'MEMBER_SUSPENDED',  user: 'Rahul Verma (Manager)',  branchId: 'b1', details: 'Suspended member Karan Mehta (MEM-005) due to non-payment',          severity: 'medium', ip: '192.168.1.10', module: 'Members',    userAgent: 'Chrome/Windows', affectedRecordId: 'MEM-005' },
  { id: '7',  timestamp: '2025-06-17T16:00:00Z', action: 'SETTINGS_CHANGED',  user: 'Super Admin',            branchId: 'all', details: 'Updated GST number from 27AABCU9603R1ZX to 27AABCU9603R1ZY',       severity: 'medium', ip: '10.0.0.1',    module: 'Settings',   userAgent: 'Chrome/Mac',     affectedRecordId: undefined },
  { id: '8',  timestamp: '2025-06-17T13:45:00Z', action: 'BULK_IMPORT',       user: 'Super Admin',            branchId: 'b3', details: 'Imported 45 new members from CSV file (members_jun2025.csv)',        severity: 'low',    ip: '10.0.0.1',    module: 'Members',    userAgent: 'Chrome/Mac',     affectedRecordId: undefined },
  { id: '9',  timestamp: '2025-06-16T11:20:00Z', action: 'STAFF_DELETED',     user: 'Super Admin',            branchId: 'b2', details: 'Deleted staff record: Mohan Das (Role: Receptionist)',               severity: 'high',   ip: '10.0.0.1',    module: 'HR',         userAgent: 'Chrome/Mac',     affectedRecordId: 'STAFF-041' },
  { id: '10', timestamp: '2025-06-16T09:00:00Z', action: 'PLAN_DELETED',      user: 'Super Admin',            branchId: 'all', details: 'Deleted plan: "Trial 7-Day" (was assigned to 0 members)',           severity: 'medium', ip: '10.0.0.1',    module: 'Plans',      userAgent: 'Chrome/Mac',     affectedRecordId: 'PLAN-002' },
  { id: '11', timestamp: '2025-06-15T17:30:00Z', action: 'ADMIN_LOGIN',       user: 'Super Admin',            branchId: 'all', details: 'Successful admin login from new device (Chrome/Windows)',            severity: 'low',    ip: '10.0.0.1',    module: 'Auth',       userAgent: 'Chrome/Windows', affectedRecordId: undefined },
  { id: '12', timestamp: '2025-06-15T14:10:00Z', action: 'EXPENSE_ADDED',     user: 'Pooja Sharma (Manager)', branchId: 'b2', details: 'Added expense: Rent ₹32,000 for June 2025',                          severity: 'low',    ip: '192.168.1.22', module: 'Finance',    userAgent: 'Firefox/Windows', affectedRecordId: 'EXP-112' },
  { id: '13', timestamp: '2025-06-14T12:00:00Z', action: 'MEMBER_DELETED',    user: 'Rahul Verma (Manager)',  branchId: 'b1', details: 'Permanently deleted member record: Suresh Kumar (MEM-011)',           severity: 'high',   ip: '192.168.1.10', module: 'Members',    userAgent: 'Chrome/Windows', affectedRecordId: 'MEM-011' },
  { id: '14', timestamp: '2025-06-14T10:30:00Z', action: 'PAYROLL_GENERATED', user: 'Super Admin',            branchId: 'all', details: 'Generated payroll for May 2025 (15 staff, Total: ₹2,45,000)',       severity: 'low',    ip: '10.0.0.1',    module: 'HR',         userAgent: 'Chrome/Mac',     affectedRecordId: undefined },
  { id: '15', timestamp: '2025-06-13T16:45:00Z', action: 'BRANCH_UPDATED',    user: 'Super Admin',            branchId: 'b3', details: 'Updated branch details: Powai — changed manager to Priya K',         severity: 'medium', ip: '10.0.0.1',    module: 'Branches',   userAgent: 'Chrome/Mac',     affectedRecordId: 'b3' },
  { id: '16', timestamp: '2025-06-13T11:00:00Z', action: 'PAYMENT_ADDED',     user: 'Rahul Verma (Manager)',  branchId: 'b1', details: 'Recorded payment INV-1089 ₹3,500 from Divya Singh (UPI)',             severity: 'low',    ip: '192.168.1.10', module: 'Finance',    userAgent: 'Chrome/Windows', affectedRecordId: 'INV-1089' },
  { id: '17', timestamp: '2025-06-12T15:20:00Z', action: 'LOGIN_FAILED',      user: 'Unknown IP',             branchId: 'b2', details: '3 failed login attempts for pooja@uptown.com',                       severity: 'high',   ip: '198.51.100.7', module: 'Auth',       userAgent: 'Unknown',        affectedRecordId: undefined },
  { id: '18', timestamp: '2025-06-12T09:45:00Z', action: 'MEMBER_FROZEN',     user: 'Pooja Sharma (Manager)', branchId: 'b2', details: 'Froze membership for Rohan Gupta (MEM-007) — medical leave',          severity: 'medium', ip: '192.168.1.22', module: 'Members',    userAgent: 'Firefox/Windows', affectedRecordId: 'MEM-007' },
  { id: '19', timestamp: '2025-06-11T14:00:00Z', action: 'ADDED_STAFF',       user: 'Super Admin',            branchId: 'b1', details: 'Added new receptionist: Kavya Nair (Role: Receptionist)',             severity: 'low',    ip: '10.0.0.1',    module: 'HR',         userAgent: 'Chrome/Mac',     affectedRecordId: 'STAFF-092' },
  { id: '20', timestamp: '2025-06-11T10:15:00Z', action: 'SETTINGS_CHANGED',  user: 'Super Admin',            branchId: 'all', details: 'Enabled Two-Factor Authentication for all admin accounts',           severity: 'medium', ip: '10.0.0.1',    module: 'Settings',   userAgent: 'Chrome/Mac',     affectedRecordId: undefined },
  { id: '21', timestamp: '2025-06-10T17:00:00Z', action: 'REFUND_ISSUED',     user: 'Rahul Verma (Manager)',  branchId: 'b1', details: 'Refunded ₹1,500 to Amit Verma (MEM-003) — plan downgrade',           severity: 'high',   ip: '192.168.1.10', module: 'Finance',    userAgent: 'Chrome/Windows', affectedRecordId: 'MEM-003' },
  { id: '22', timestamp: '2025-06-10T13:30:00Z', action: 'PLAN_CREATED',      user: 'Super Admin',            branchId: 'all', details: 'Created new plan: "Couple Fitness" ₹8,000/month',                   severity: 'low',    ip: '10.0.0.1',    module: 'Plans',      userAgent: 'Chrome/Mac',     affectedRecordId: 'PLAN-011' },
  { id: '23', timestamp: '2025-06-09T11:45:00Z', action: 'MEMBER_SUSPENDED',  user: 'Priya K (Manager)',      branchId: 'b3', details: 'Suspended Meera Pillai (MEM-012) — 3 months non-payment',            severity: 'medium', ip: '192.168.1.33', module: 'Members',    userAgent: 'Safari/iOS',     affectedRecordId: 'MEM-012' },
  { id: '24', timestamp: '2025-06-09T09:00:00Z', action: 'ADMIN_LOGIN',       user: 'Rahul Verma (Manager)',  branchId: 'b1', details: 'Manager login from mobile device (Safari/iOS)',                       severity: 'low',    ip: '192.168.1.10', module: 'Auth',       userAgent: 'Safari/iOS',     affectedRecordId: undefined },
  { id: '25', timestamp: '2025-06-08T16:20:00Z', action: 'DELETED_PAYMENT',   user: 'Super Admin',            branchId: 'b3', details: 'Voided payment INV-0987 (duplicate entry, Amount: ₹4,200)',           severity: 'high',   ip: '10.0.0.1',    module: 'Finance',    userAgent: 'Chrome/Mac',     affectedRecordId: 'INV-0987' },
  { id: '26', timestamp: '2025-06-08T12:00:00Z', action: 'BRANCH_CREATED',    user: 'Super Admin',            branchId: 'all', details: 'Created new branch: Thane Hub (Location: Thane West)',               severity: 'low',    ip: '10.0.0.1',    module: 'Branches',   userAgent: 'Chrome/Mac',     affectedRecordId: 'b4' },
  { id: '27', timestamp: '2025-06-07T15:00:00Z', action: 'PAYROLL_PAID',      user: 'Super Admin',            branchId: 'all', details: 'Marked payroll as paid for May 2025 (₹2,38,000)',                   severity: 'low',    ip: '10.0.0.1',    module: 'HR',         userAgent: 'Chrome/Mac',     affectedRecordId: undefined },
  { id: '28', timestamp: '2025-06-07T10:30:00Z', action: 'UPDATED_PLAN',      user: 'Super Admin',            branchId: 'all', details: 'Updated Gold Plan features — added "Personal Training 2x/week"',    severity: 'medium', ip: '10.0.0.1',    module: 'Plans',      userAgent: 'Chrome/Mac',     affectedRecordId: 'PLAN-005' },
  { id: '29', timestamp: '2025-06-06T14:45:00Z', action: 'STAFF_DELETED',     user: 'Super Admin',            branchId: 'b3', details: 'Removed staff: Arun Pillai (Role: Trainer) — resigned',              severity: 'high',   ip: '10.0.0.1',    module: 'HR',         userAgent: 'Chrome/Mac',     affectedRecordId: 'STAFF-055' },
  { id: '30', timestamp: '2025-06-06T09:15:00Z', action: 'EXPENSE_ADDED',     user: 'Priya K (Manager)',      branchId: 'b3', details: 'Added expense: Equipment Repair ₹8,500 (Treadmill belt replacement)', severity: 'low',    ip: '192.168.1.33', module: 'Finance',    userAgent: 'Safari/iOS',     affectedRecordId: 'EXP-098' },
  { id: '31', timestamp: '2025-06-05T11:00:00Z', action: 'PRODUCT_ADDED',     user: 'Rahul Verma (Manager)',  branchId: 'b1', details: 'Added new product: Whey Protein 1kg (SKU: WP-001, Price: ₹2,499)',    severity: 'low',    ip: '192.168.1.10', module: 'Store',      userAgent: 'Chrome/Windows', affectedRecordId: 'SKU-WP001' },
  { id: '32', timestamp: '2025-06-05T08:30:00Z', action: 'ATTENDANCE_MARKED', user: 'Pooja Sharma (Manager)', branchId: 'b2', details: 'Bulk attendance marked for 28 members — Morning batch (06:00–08:00)', severity: 'low',    ip: '192.168.1.22', module: 'Attendance', userAgent: 'Firefox/Windows', affectedRecordId: undefined },
];

export const MOCK_AUDIT_KPI: AuditKPIData = {
  totalEvents: 32,
  highSeverity: 10,
  mediumSeverity: 9,
  lowSeverity: 13,
  eventsToday: 3,
  uniqueUsers: 5,
};
