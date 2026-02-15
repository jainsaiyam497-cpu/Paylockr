import { Transaction, TransactionType, TransactionStatus, Notification, ChartDataPoint, TaxDeadline, Expense, Invoice, BankAccount } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-1001',
    date: '2023-11-01',
    source: 'Fiverr Payout',
    amount: 12500,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.VAULTED,
    estimatedTax: 1250,
  },
  {
    id: 'TXN-1002',
    date: '2023-11-03',
    source: 'Personal Transfer (Mom)',
    amount: 3000,
    type: TransactionType.PERSONAL,
    status: TransactionStatus.IGNORED,
    estimatedTax: 0,
  },
  {
    id: 'TXN-1003',
    date: '2023-11-05',
    source: 'YouTube Earnings',
    amount: 8200,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.PENDING,
    estimatedTax: 820,
  },
  {
    id: 'TXN-1004',
    date: '2023-11-10',
    source: 'Client Payment (Design)',
    amount: 25000,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.PENDING,
    estimatedTax: 2500,
  },
  {
    id: 'TXN-1005',
    date: '2023-11-12',
    source: 'Tax Refund ITD',
    amount: 15000,
    type: TransactionType.REFUND,
    status: TransactionStatus.IGNORED,
    estimatedTax: 0,
  },
  {
    id: 'TXN-1006',
    date: '2023-11-15',
    source: 'Upwork Inc.',
    amount: 45000,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.VAULTED,
    estimatedTax: 4500,
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    date: '2026-02-05',
    source: 'Fiverr Payout - Logo Design',
    amount: 12500,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.VAULTED,
    estimatedTax: 1250,
    category: 'Freelance Income'
  },
  {
    id: 'txn-002',
    date: '2026-02-03',
    source: 'Client ABC - Website Development',
    amount: 45000,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.VAULTED,
    estimatedTax: 4500,
    category: 'Client Payment'
  },
  {
    id: 'txn-003',
    date: '2026-02-01',
    source: 'YouTube AdSense',
    amount: 8200,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.VAULTED,
    estimatedTax: 820,
    category: 'Content Creation'
  },
  {
    id: 'txn-004',
    date: '2026-01-28',
    source: 'Personal Transfer from Savings',
    amount: 15000,
    type: TransactionType.PERSONAL,
    status: TransactionStatus.IGNORED,
    estimatedTax: 0,
    category: 'Personal'
  },
  {
    id: 'txn-005',
    date: '2026-01-25',
    source: 'Upwork - Mobile App UI Design',
    amount: 32000,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.VAULTED,
    estimatedTax: 3200,
    category: 'Freelance Income'
  },
  {
    id: 'txn-006',
    date: '2026-01-20',
    source: 'Refund - Domain Registration',
    amount: 1200,
    type: TransactionType.REFUND,
    status: TransactionStatus.IGNORED,
    estimatedTax: 0,
    category: 'Refund'
  },
  {
    id: 'txn-007',
    date: '2026-01-18',
    source: 'Client XYZ - Consulting Fee',
    amount: 28000,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.PENDING,
    estimatedTax: 0,
    category: 'Consulting'
  },
  {
    id: 'txn-008',
    date: '2026-01-15',
    source: 'Instagram Collaboration',
    amount: 5500,
    type: TransactionType.BUSINESS,
    status: TransactionStatus.PENDING,
    estimatedTax: 0,
    category: 'Content Creation'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-1',
    title: 'New Income Detected',
    message: 'Received ₹8,200 from YouTube Earnings.',
    timestamp: '2 hours ago',
    type: 'info',
    read: false
  },
  {
    id: 'NOT-2',
    title: 'Vault Updated',
    message: '₹1,250 moved to TaxVault successfully.',
    timestamp: '1 day ago',
    type: 'success',
    read: false
  },
  {
    id: 'NOT-3',
    title: 'Tax Rule Update',
    message: 'New slab rates applicable from next fiscal quarter.',
    timestamp: '2 days ago',
    type: 'warning',
    read: false
  }
];

export const CHART_DATA: ChartDataPoint[] = [
  { name: 'Jun', income: 45000, tax: 4500 },
  { name: 'Jul', income: 52000, tax: 5200 },
  { name: 'Aug', income: 38000, tax: 3800 },
  { name: 'Sep', income: 65000, tax: 6500 },
  { name: 'Oct', income: 58000, tax: 5800 },
  { name: 'Nov', income: 108700, tax: 10870 },
];

export const MOCK_TAX_DEADLINES: TaxDeadline[] = [
  {
    id: 'q1-2026',
    quarter: 'Q1',
    dueDate: '2026-06-15',
    percentageOfTotal: 15,
    estimatedAmount: 18000,
    status: 'Upcoming'
  },
  {
    id: 'q2-2026',
    quarter: 'Q2',
    dueDate: '2026-09-15',
    percentageOfTotal: 45,
    estimatedAmount: 54000,
    status: 'Upcoming'
  },
  {
    id: 'q3-2026',
    quarter: 'Q3',
    dueDate: '2026-12-15',
    percentageOfTotal: 75,
    estimatedAmount: 90000,
    status: 'Upcoming'
  },
  {
    id: 'q4-2026',
    quarter: 'Q4',
    dueDate: '2027-03-15',
    percentageOfTotal: 100,
    estimatedAmount: 120000,
    status: 'Upcoming'
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-001',
    date: new Date('2026-02-04'),
    category: 'Software Subscriptions',
    description: 'Adobe Creative Cloud - Monthly',
    amount: 3299,
    deductible: true,
    merchant: 'Adobe',
    paymentMethod: 'Credit Card',
    tags: ['software', 'subscription']
  },
  {
    id: 'exp-002',
    date: new Date('2026-02-01'),
    category: 'Internet & Phone',
    description: 'Airtel Fiber - Business Use',
    amount: 1299,
    deductible: true,
    merchant: 'Airtel',
    paymentMethod: 'UPI',
    tags: ['utilities', 'internet']
  },
  {
    id: 'exp-003',
    date: new Date('2026-01-28'),
    category: 'Office Supplies',
    description: 'Laptop Stand + Mouse',
    amount: 2450,
    deductible: true,
    merchant: 'Amazon',
    paymentMethod: 'Debit Card',
    tags: ['equipment', 'office']
  },
  {
    id: 'exp-004',
    date: new Date('2026-01-25'),
    category: 'Professional Fees',
    description: 'CA Consultation',
    amount: 5000,
    deductible: true,
    merchant: 'CA Firm',
    paymentMethod: 'Bank Transfer',
    tags: ['professional', 'services']
  },
  {
    id: 'exp-005',
    date: new Date('2026-01-20'),
    category: 'Travel',
    description: 'Client Meeting - Mumbai',
    amount: 4500,
    deductible: true,
    merchant: 'Various',
    paymentMethod: 'Credit Card',
    tags: ['travel', 'client']
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Tech Startup Pvt Ltd',
    clientEmail: 'accounts@techstartup.com',
    date: new Date('2026-02-01'),
    dueDate: new Date('2026-02-15'),
    items: [
      {
        id: 'item-1',
        description: 'Website Design & Development',
        quantity: 1,
        rate: 45000,
        amount: 45000
      }
    ],
    subtotal: 45000,
    gst: 8100,
    total: 53100,
    amount: 53100,
    currency: 'INR',
    status: 'PAID',
    // paidDate: '2026-02-03' // Not in Invoice interface yet, removing for safety or should add
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-002',
    clientName: 'E-commerce Solutions Inc',
    clientEmail: 'billing@ecom.com',
    date: new Date('2026-01-28'),
    dueDate: new Date('2026-02-28'),
    items: [
      {
        id: 'item-1',
        description: 'Mobile App UI/UX Design',
        quantity: 1,
        rate: 32000,
        amount: 32000
      }
    ],
    subtotal: 32000,
    gst: 5760,
    total: 37760,
    amount: 37760,
    currency: 'INR',
    status: 'SENT'
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-003',
    clientName: 'Digital Marketing Agency',
    clientEmail: 'finance@digitalagency.com',
    date: new Date('2026-01-15'),
    dueDate: new Date('2026-01-30'),
    items: [
      {
        id: 'item-1',
        description: 'Brand Identity Design',
        quantity: 1,
        rate: 28000,
        amount: 28000
      }
    ],
    subtotal: 28000,
    gst: 5040,
    total: 33040,
    amount: 33040,
    currency: 'INR',
    status: 'OVERDUE'
  }
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-001',
    bankName: 'HDFC Bank',
    accountNumber: '****1234',
    accountType: 'CURRENT',
    balance: 145000,
    isPrimary: true,
    lastUpdated: new Date('2026-02-07T10:30:00'),
    ifscCode: 'HDFC0001234',
    accountHolder: 'John Doe'
  },
  {
    id: 'bank-002',
    bankName: 'ICICI Bank',
    accountNumber: '****5678',
    accountType: 'SAVINGS',
    balance: 82000,
    isPrimary: false,
    lastUpdated: new Date('2026-02-07T10:25:00'),
    ifscCode: 'ICIC0005678',
    accountHolder: 'John Doe'
  }
];

export const EXPENSE_CATEGORIES = [
  'Software Subscriptions',
  'Internet & Phone',
  'Office Rent',
  'Office Supplies',
  'Travel',
  'Professional Fees',
  'Equipment',
  'Marketing',
  'Utilities',
  'Other'
];