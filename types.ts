
export type PlanType = 'FREE' | 'PRO' | 'ENTERPRISE';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | '';
export type EmployeeType = 'PRIVATE' | 'CENTRAL_GOVT' | 'STATE_GOVT' | 'STUDENT' | 'INTERN' | '';
export type EnterpriseRole = 'OWNER' | 'HR' | 'MANAGER' | 'STAFF';

export interface SalaryStructure {
  basic: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  pf: number;
  profTax: number;
  tds: number;
}

export interface Payslip {
  id: string;
  memberId: string;
  memberName: string;
  month: string; // e.g. "January"
  year: number;
  structure: SalaryStructure;
  workingDays: number;
  paidDays: number;
  lopDays: number;
  earnings: { label: string; amount: number }[];
  deductions: { label: string; amount: number }[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  timestamp: number;
  currency?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  designation: string;
  company: string;
  address?: string;
  phone?: string;
  about?: string;
  gender?: Gender;
  employeeType?: EmployeeType;
  state?: string;
  role: 'USER' | 'SUPER_ADMIN';
  enterpriseRole?: EnterpriseRole;
  plan: PlanType;
  joinedAt: number;
  status: 'ACTIVE' | 'SUSPENDED';
  enterpriseId?: string;
  defaultBankName?: string;
  defaultAccountNumber?: string;
  defaultIfscCode?: string;
  defaultUpiId?: string;
  defaultTerms?: string;
  defaultInvoicePrefix?: string;
  nextInvoiceSequence?: number;
  gstNumber?: string;
  defaultCurrency?: string;
  // Firebase Synced Properties
  signature?: string;
  balance?: LeaveBalance;
  resumeData?: ResumeData;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  targetType: 'GLOBAL' | 'ENTERPRISE';
  targetPlans?: PlanType[];
  enterpriseId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  timestamp: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'PUBLIC' | 'INSTITUTIONAL' | 'FESTIVAL';
  enterpriseId: string;
  description?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  defaultRate: number;
  defaultTaxRate: number;
  defaultDiscountValue: number;
  defaultDiscountType: 'PERCENT' | 'FIXED';
  defaultHsnCode?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  hsnCode?: string;
  quantity: number;
  rate: number;
  taxRate: number;
  discountValue: number;
  discountType: 'PERCENT' | 'FIXED';
  taxAmount: number;
  discountAmount: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientGstNumber?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  enterpriseId: string;
  timestamp: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolder?: string;
  upiId?: string;
  terms?: string;
  currency?: string;
}

export interface PaymentGatewayConfig {
  id: 'stripe' | 'razorpay' | 'paypal' | 'payu' | 'cashfree';
  name: string;
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  isSandbox: boolean;
}

export interface SubscriptionPlanConfig {
  id: PlanType;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}

export interface EmployerProfile {
  id: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  companyName: string;
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  duration: number;
  employerId: string;
  employerName: string;
  timestamp: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  applicantName?: string;
  applicantId?: string;
  enterpriseId?: string;
  documentType?: 'PROFESSIONAL' | 'ACADEMIC';
}

export interface LeaveBalance {
  cl: number;
  el: number;
  hpl: number;
  medical: number;
  rh: number;
  ccl: number;
  maternity: number;
  paternity: number;
  other: number;
}

export interface ExpenseClaim {
  id: string;
  userId: string;
  userName: string;
  category: 'Travel' | 'Food' | 'Internet' | 'Hardware' | 'Other';
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  description: string;
  receipt?: string;
  enterpriseId?: string;
}

export type PaymentMode = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'OTHER';

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string;
  category: string;
  paymentMode: PaymentMode;
  reference: string;
  description: string;
  timestamp: number;
  enterpriseId?: string;
  currency?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  memberId?: string;
  memberName?: string;
  checkIn: string;
  checkOut?: string;
  location?: { lat: number; lng: number };
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT';
  enterpriseId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  enterpriseRole: EnterpriseRole;
  type: 'MANAGED_FREE' | 'INVITED';
  status: 'ACTIVE' | 'PENDING' | 'ON_LEAVE';
  avatar: string;
  enterpriseId: string;
  salaryStructure?: SalaryStructure;
}

export interface ResumeData {
  templateId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    photo?: string;
  };
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    graduationDate: string;
  }[];
  skills: string[];
}

export enum AppScreen {
  LANDING = 'LANDING',
  PRIVACY = 'PRIVACY',
  REFUND = 'REFUND',
  TERMS = 'TERMS',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  EMPLOYER = 'EMPLOYER',
  LEAVE_FORM = 'LEAVE_FORM',
  PREVIEW = 'PREVIEW',
  PLANS = 'PLANS',
  HISTORY = 'HISTORY',
  SIGNATURE = 'SIGNATURE',
  PAYMATE = 'PAYMATE',
  RESUME_MAKER = 'RESUME_MAKER',
  TEAM = 'TEAM',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ATTENDANCE = 'ATTENDANCE',
  EXPENSE_TRACKER = 'EXPENSE_TRACKER',
  MY_CLAIMS = 'MY_CLAIMS',
  INVOICE_MAKER = 'INVOICE_MAKER',
  HOLIDAY_MANAGER = 'HOLIDAY_MANAGER',
  AI_ASSISTANT = 'AI_ASSISTANT',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS'
}
