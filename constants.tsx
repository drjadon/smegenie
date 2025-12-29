
import { PlanType, LeaveBalance } from './types';

export const LEAVE_TYPES = [
  'Casual Leave (CL)',
  'Earned Leave (EL)',
  'Half Pay Leave (HPL)',
  'Commuted Leave (Medical)',
  'Restricted Holiday (RH)',
  'Child Care Leave (CCL)',
  'Maternity Leave',
  'Paternity Leave',
  'Extraordinary Leave (EOL)',
  'Exam Leave (Academic)',
  'Duty Leave (Academic)',
  'Internship Project Work',
  'Medical / Sick Leave'
];

// Types that carry forward and accumulate year-over-year
export const CARRY_FORWARD_TYPES = ['el', 'hpl', 'medical', 'ccl'];

export const AI_TONES = [
  { id: 'Standard', label: 'Standard' },
  { id: 'Urgent', label: 'Urgent' },
  { id: 'Detailed', label: 'Detailed' },
  { id: 'Apologetic', label: 'Apologetic' }
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Lakshadweep", "Puducherry"
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export const getCurrencySymbol = (code?: string) => {
  return CURRENCIES.find(c => c.code === code)?.symbol || '₹';
};

export const TYPE_MAPPING: Record<string, keyof LeaveBalance> = {
  'Casual Leave (CL)': 'cl',
  'Earned Leave (EL)': 'el',
  'Half Pay Leave (HPL)': 'hpl',
  'Commuted Leave (Medical)': 'medical',
  'Restricted Holiday (RH)': 'rh',
  'Child Care Leave (CCL)': 'ccl',
  'Maternity Leave': 'maternity',
  'Paternity Leave': 'paternity',
  'Extraordinary Leave (EOL)': 'other',
  'Exam Leave (Academic)': 'other',
  'Duty Leave (Academic)': 'other',
  'Internship Project Work': 'other',
  'Medical / Sick Leave': 'medical'
};

export const REASON_TEMPLATES = [
  { label: "Medical / Sick Leave", text: "I am writing to inform you that I am suffering from a high fever and have been advised complete bed rest by my physician for the specified period." },
  { label: "Exam Preparation", text: "I am writing to request leave to prepare for my upcoming end-semester examinations which are crucial for my academic progress." },
  { label: "Family Emergency", text: "I have an unforeseen urgent family emergency that requires my immediate presence and attention at home." },
  { label: "Duty Leave (Student)", text: "I have been selected to represent our institution at a national-level symposium/competition and require duty leave for the same." },
  { label: "Project Field Work", text: "As part of my internship/course requirements, I need to conduct field research and data collection during this period." },
  { label: "Doctor Appointment", text: "I have a scheduled medical consultation and diagnostic tests that require me to be away from work/college for the day." },
  { label: "Bereavement", text: "I am writing to request leave due to a death in my family and need time to attend the funeral services." }
];

export const STORAGE_KEYS = {
  USER_PROFILE: 'leavegenie_user_profile',
  EMPLOYERS: 'leavegenie_employers',
  HISTORY: 'leavegenie_history',
  PLAN: 'leavegenie_plan',
  BALANCE: 'leavegenie_balance',
  SIGNATURE: 'leavegenie_signature',
  SALARY_CONFIG: 'paymate_salary_config',
  CLAIMS: 'paymate_claims',
  ATTENDANCE: 'paymate_attendance',
  RESUME: 'leavegenie_resume',
  TEAM: 'leavegenie_team_members',
  INVOICES: 'leavegenie_invoices'
};

export const DEFAULT_BALANCE: LeaveBalance = {
  cl: 13,
  el: 30,
  hpl: 20,
  medical: 10,
  rh: 3,
  ccl: 730,
  maternity: 180,
  paternity: 15,
  other: 0
};

export const MAX_ENTITLEMENTS: LeaveBalance = {
  cl: 13,
  el: 300, // Maximum accumulation allowed in Govt. rules
  hpl: 20, // Annual addition (but accumulates)
  medical: 10,
  rh: 3,
  ccl: 730,
  maternity: 180,
  paternity: 15,
  other: 0
};

export const DEFAULT_SALARY: any = {
  basic: 2500,
  hra: 1000,
  specialAllowance: 500,
  overtimeRate: 20,
  pf: 200,
  profTax: 50
};

export interface PlanFeature {
  name: string;
  free: boolean;
  pro: boolean;
  enterprise: boolean;
}

export const PLAN_FEATURES: PlanFeature[] = [
  { name: 'Professional PDF Export', free: true, pro: true, enterprise: true },
  { name: 'Govt. & Academic Templates', free: true, pro: true, enterprise: true },
  { name: 'Advanced Balance Tracking', free: false, pro: true, enterprise: true },
  { name: 'Resume Maker (3 Templates)', free: true, pro: true, enterprise: true },
  { name: 'Extended Templates (10+)', free: false, pro: true, enterprise: true },
  { name: 'Multiple Employers/Institutes', free: false, pro: true, enterprise: true },
  { name: 'Digital Signature', free: false, pro: true, enterprise: true },
  { name: 'AI Reason Polishing', free: false, pro: true, enterprise: true },
  { name: 'PayMate Payroll Module', free: false, pro: false, enterprise: true },
  { name: 'Attendance Manager', free: false, pro: false, enterprise: true },
  { name: 'Expense Claims Hub', free: false, pro: false, enterprise: true },
  { name: 'Pro Invoice Maker', free: false, pro: false, enterprise: true },
];

export const createGoogleCalendarUrl = (title: string, startDate: string, endDate: string, details: string) => {
  const start = startDate.replace(/-/g, '');
  const end = endDate.replace(/-/g, '');
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
};
