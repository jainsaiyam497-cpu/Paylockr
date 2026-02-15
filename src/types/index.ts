export type Theme = 'light' | 'dark';

export enum TransactionType {
  BUSINESS = 'Business Income',
  PERSONAL = 'Personal Transfer',
  REFUND = 'Refund',
  LOAN = 'Loan'
}

export enum TransactionStatus {
  PENDING = 'Pending',
  VAULTED = 'Vaulted',
  IGNORED = 'Ignored',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

export interface Transaction {
  id: string;
  userId?: string;
  date: Date | string;
  source: string;
  amount: number;
  type: TransactionType | string;
  status: TransactionStatus | string;
  estimatedTax: number;
  category?: string;
  notes?: string;
  description?: string;
  paymentMethod?: string;
  time?: string;
  referenceId?: string;
  upiId?: string;
  merchant?: string;
  invoiceId?: string;
  expenseId?: string;
  vaultEntryId?: string;
  fromAccount?: string;
  toAccount?: string;
  icon?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string;
  panCard?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  address?: string;
  username?: string;
}

export interface TaxSettings {
  regime: 'Old' | 'New';
  targetVaultAmount: number;
  deductions80C: boolean;
  deductions80D: boolean;
  annualDeductionAmount: number;
  mode: 'Conservative' | 'Balanced' | 'Liquidity';
}

export interface AppSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  autoImport: boolean;
  darkMode: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  read?: boolean;
}

export interface ChartDataPoint {
  name: string;
  income: number;
  tax: number;
}

export interface Expense {
  id: string;
  userId?: string;
  transactionId?: string;
  category: string;
  amount: number;
  date: Date;
  description: string;
  merchant: string;
  paymentMethod: string;
  tags: string[];
  deductible?: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice?: number;
  rate?: number;
  tax?: number;
  total?: number;
  amount?: number;
}

export interface Invoice {
  id: string;
  userId?: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  amount: number;
  currency: 'INR' | string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  items: InvoiceItem[];
  subtotal?: number;
  gst?: number;
  total?: number;
  tax?: number;
  paidTransactionId?: string;
}

export interface TaxDeadline {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  dueDate: string;
  percentageOfTotal: number;
  estimatedAmount: number;
  status: 'Upcoming' | 'Due' | 'Paid' | 'Overdue';
}

export interface BankAccount {
  id: string;
  userId?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'SALARY';
  balance: number;
  ifscCode: string;
  lastUpdated: Date;
  isPrimary?: boolean;
  color?: string;
}

export interface VaultDocument {
  id: string;
  userId?: string;
  title: string;
  category: 'BANK' | 'INSURANCE' | 'INVESTMENT' | 'PROPERTY' | 'PERSONAL' | 'GOVERNMENT';
  fileName: string;
  uploadedDate: Date;
  size: number;
  type: 'PDF' | 'IMAGE' | 'VIDEO';
}

export interface VaultEntry {
  id: string;
  userId: string;
  transactionId: string;
  incomeAmount: number;
  taxAmount: number;
  lockedDate: Date;
  status: 'LOCKED' | 'RELEASED';
}

export type ViewState = 
  | 'LOGIN' 
  | 'SIGNUP'
  | 'DASHBOARD' 
  | 'SMART_TAX_VAULT'
  | 'TRANSACTIONS' 
  | 'VAULT' 
  | 'SETTINGS' 
  | 'INSIGHTS' 
  | 'NOTIFICATIONS'
  | 'HELP'
  | 'INVOICES'
  | 'EXPENSES'
  | 'TAX_CALENDAR'
  | 'TAX_MANAGEMENT'
  | 'BANK_ACCOUNTS';