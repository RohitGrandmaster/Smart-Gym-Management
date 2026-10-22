// RESPONSIBILITY: Centralized constants, schema, and shared utilities for the HR module.
import { z } from 'zod';

export const StaffSchema = z.object({
  name: z.string().min(2, "Name is required").regex(/^[A-Za-z\s]+$/, "Only alphabets allowed"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  role: z.string().min(2, "Role is required"),
  salary: z.number().min(0, "Salary must be positive"),
  branch: z.string().min(1, "Branch is required"),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional(),
  joinDate: z.string(),
  temporaryPassword: z.string().optional().refine(val => !val || val.length >= 8, {
    message: "Password must be at least 8 characters",
  }),
  isActive: z.boolean().default(true),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits").optional().or(z.literal('')),
  upiId: z.string().regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID format").optional().or(z.literal('')),
  advanceSalary: z.number().min(0, "Advance cannot be negative").optional().default(0),
  assignedBranches: z.array(z.string()).optional(),
  primaryBranchId: z.string().optional()
});

export type StaffFormValues = z.infer<typeof StaffSchema>;

export const HR_TABS = ['Staff', 'Payroll', 'Advance', 'Dues', 'Ledger'];

export const EMPTY_STAFF = { 
 name: '', 
 email: '', 
 phone: '', 
 role: '', 
 salary: 0, 
 branch: '',
 gender: 'MALE', 
 address: '', 
 joinDate: new Date().toISOString().split('T')[0],
 temporaryPassword: '',
 isActive: true,
 aadhaar: '',
 upiId: '',
 advanceSalary: 0
};

export const PayrollSchema = z.object({
  staffId: z.string().min(1, "Please select staff"),
  month: z.string().min(1, "Month is required"),
  amount: z.number().min(0, "Amount must be positive"),
  paidAmount: z.number().min(0, "Paid amount cannot be negative"),
  notes: z.string().optional()
}).refine(data => data.paidAmount <= data.amount, {
  message: "Paid amount cannot exceed total amount",
  path: ['paidAmount']
});

export type PayrollFormValues = z.infer<typeof PayrollSchema>;

export const EMPTY_PAYROLL_FORM = {
  staffId: '',
  month: new Date().toISOString().slice(0, 7),
  amount: 0,
  paidAmount: 0,
  notes: ''
} as unknown as PayrollFormValues;

export const STAFF_TABLE_HEADERS = ['Name', 'Branch', 'Role', 'Status', 'Phone', 'Salary', 'Advance', 'Joined'];

export const PAYROLL_TABLE_HEADERS = ['Staff', 'Month', 'Base Salary', 'Net Payable', 'Paid Amount', 'Pending', 'Status', 'Paid On'];

export const GENDER_OPTIONS = [
 { label: 'Male', value: 'MALE' },
 { label: 'Female', value: 'FEMALE' },
 { label: 'Other', value: 'OTHER' }
];

export const BRANCH_OPTIONS = ['b1', 'b2', 'b3', 'b4', 'b5'];

export const STAFF_ROLE_OPTIONS = [
  { label: 'Manager', value: 'Manager' },
  { label: 'General Trainer', value: 'General Trainer' },
  { label: 'Personal Trainer (PT)', value: 'Personal Trainer' },
  { label: 'Gym Admin', value: 'Gym Admin' },
  { label: 'Receptionist', value: 'Receptionist' },
  { label: 'Sales Executive', value: 'Sales Executive' },
  { label: 'Dietitian / Nutritionist', value: 'Nutritionist' },
  { label: 'Group Class Instructor', value: 'Group Class Instructor' },
  { label: 'Housekeeping / Helper', value: 'Housekeeping' },
  { label: 'Maintenance Technician', value: 'Maintenance Technician' },
  { label: 'Cafeteria Staff', value: 'Cafeteria Staff' },
  { label: 'Other', value: 'Other' },
];

export const STAFF_MODAL_FIELDS = [
 { label: 'Full Name', key: 'name', type: 'text', placeholder: '' },
 { label: 'Email', key: 'email', type: 'email', placeholder: '' },
 { label: 'Phone', key: 'phone', type: 'tel', placeholder: '' },
 { label: 'Aadhaar No.', key: 'aadhaar', type: 'tel', placeholder: '123456789012' },
 { label: 'UPI ID', key: 'upiId', type: 'text', placeholder: 'rahul@okhdfcbank' },
 { label: 'Monthly Salary (₹)', key: 'salary', type: 'number', placeholder: '' },
 { label: 'Advance Paid (₹)', key: 'advanceSalary', type: 'number', placeholder: '0' },
];
