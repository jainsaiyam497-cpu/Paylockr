import { 
  User, 
  Transaction, 
  Expense, 
  Invoice, 
  VaultEntry, 
  BankAccount, 
  VaultDocument,
  TransactionType,
  TransactionStatus
} from '../types';

export interface ClassifiedIncome {
  id: string;
  userId: string;
  transactionId: string;
  amount: number;
  type: 'TAXABLE' | 'NON_TAXABLE';
  confidence: number;
  reason: string;
  userConfirmed: boolean;
}

export interface TaxCalendarEntry {
  id: string;
  userId: string;
  type: 'QUARTERLY' | 'ANNUAL' | 'GST' | 'TDS';
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  dueDate: Date;
  amount: number;
  status: 'UPCOMING' | 'DUE' | 'PAID' | 'OVERDUE';
  taxVaultId?: string;
  paidTransactionId?: string;
  description: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE' | 'TAX' | 'CASHFLOW' | 'GROWTH';
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  relatedIds: string[];
  actionable: boolean;
  createdAt: Date;
}

// ============ DEMO USERS ============
export const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'saiyam',
    username: 'saiyam',
    email: 'saiyam@paylockr.app',
    password: 'Demo@123',
    name: 'Saiyam Jain',
    phone: '+91-9876543210',
    panCard: 'ABCDE1234F'
  },
  {
    id: 'admin',
    username: 'admin',
    email: 'admin@paylockr.app',
    password: 'Admin@123',
    name: 'Admin User',
    phone: '+91-9876543211',
    panCard: 'XYZAB5678G'
  }
];

// ============ REALISTIC DATA CONSTANTS ============
const MERCHANTS = {
  FOOD: ['Swiggy', 'Zomato', 'FreshMenu', 'Starbucks', 'Third Wave Coffee', 'Blinkit', 'Zepto'],
  SHOPPING: ['Amazon India', 'Flipkart', 'Myntra', 'Uniqlo', 'IKEA', 'Apple Store'],
  TRAVEL: ['Uber', 'Ola', 'BluSmart', 'MakeMyTrip', 'Indigo Airlines', 'IRCTC'],
  ENTERTAINMENT: ['Netflix', 'Spotify Premium', 'BookMyShow', 'PlayStation Network', 'Steam'],
  UTILITIES: ['Jio Fiber', 'BESCOM', 'Airtel Postpaid', 'Tata Sky'],
  SUBSCRIPTIONS: ['Adobe Creative Cloud', 'Figma Professional', 'Midjourney', 'ChatGPT Plus', 'GitHub Copilot', 'Vercel Pro'],
  HEALTHCARE: ['Apollo Pharmacy', 'Practo', 'Cult.fit', '1mg'],
  INVESTMENT: ['Zerodha', 'Groww', 'SIP - HDFC Top 100', 'PPF Contribution']
};

export const CATEGORIES: any = {
  FOOD: { icon: '🍔', color: '#FF6B6B' },
  SHOPPING: { icon: '🛍️', color: '#4ECDC4' },
  TRAVEL: { icon: '✈️', color: '#45B7D1' },
  ENTERTAINMENT: { icon: '🎬', color: '#96CEB4' },
  UTILITIES: { icon: '💡', color: '#FFEAA7' },
  SUBSCRIPTIONS: { icon: '🔄', color: '#A855F7' },
  HEALTHCARE: { icon: '⚕️', color: '#DDA15E' },
  INVESTMENT: { icon: '📈', color: '#52B788' },
  SALARY: { icon: '💰', color: '#06C258' },
  FREELANCE: { icon: '💻', color: '#3B82F6' },
  TRANSFER: { icon: '↔️', color: '#6C63FF' }
};

const CLIENTS = [
  { name: 'TechFlow Systems', email: 'accounts@techflow.io', phone: '+91-80-4567-8901' },
  { name: 'Designify Studio', email: 'billing@designify.com', phone: '+91-22-6789-0123' },
  { name: 'Growth Hackers Inc', email: 'finance@growthhackers.com', phone: '+1-415-555-0199' },
  { name: 'Pixel Perfect', email: 'pay@pixelperfect.co', phone: '+91-11-2345-6789' },
  { name: 'Streamline Ops', email: 'invoices@streamline.com', phone: '+44-20-7946-0958' }
];

// ============ GENERATOR UTILS ============
const getRandomAmount = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ============ GENERATE CORRELATED DATA FOR USER ============
export function generateUserData(userId: string) {
  const transactions: Transaction[] = [];
  const expenses: Expense[] = [];
  const invoices: Invoice[] = [];
  const vaultEntries: VaultEntry[] = [];
  const classifiedIncomes: ClassifiedIncome[] = [];

  const today = new Date();
  
  // 1. Generate Historical Income (Last 6 Months)
  // Freelancers have irregular income. We simulate this.
  let totalIncomeAmount = 0;
  
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(today);
    monthDate.setMonth(today.getMonth() - i);
    monthDate.setDate(getRandomAmount(1, 28)); // Random day

    // 1-3 Major payments per month
    const numPayments = getRandomAmount(1, 3);
    
    for (let j = 0; j < numPayments; j++) {
      const isInternational = Math.random() > 0.7;
      const client = getRandomItem(CLIENTS);
      
      // Realistic Amounts: 25k to 1.2L per transaction
      const baseAmount = getRandomAmount(25000, 120000); 
      // Make amount look realistic (e.g. 45000 instead of 45123)
      const amount = Math.round(baseAmount / 500) * 500; 
      
      const txnId = `TXN-INC-${userId}-${i}-${j}`;
      const txnDate = new Date(monthDate);
      txnDate.setDate(txnDate.getDate() + j * 5); // Spread out

      // Tax Calculation (Simplified 10% TDS estimation)
      const estimatedTax = Math.round(amount * 0.10);

      const incomeTxn: Transaction = {
        id: txnId,
        userId,
        type: TransactionType.BUSINESS, 
        amount: amount,
        category: 'FREELANCE',
        description: `Payment from ${client.name} - ${isInternational ? 'USD Transfer' : 'Invoice Payment'}`,
        merchant: client.name,
        source: client.name,
        date: txnDate,
        time: `${getRandomAmount(9, 18)}:${getRandomAmount(10, 59)}`,
        fromAccount: client.name,
        toAccount: 'HDFC Bank - Savings',
        status: TransactionStatus.VAULTED,
        paymentMethod: isInternational ? 'Wire Transfer' : 'NEFT',
        referenceId: `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
        estimatedTax: estimatedTax,
        icon: '💻'
      };

      transactions.push(incomeTxn);
      totalIncomeAmount += amount;

      // Add to Classified Income
      classifiedIncomes.push({
        id: `CLASS-${txnId}`,
        userId,
        transactionId: txnId,
        amount: amount,
        type: 'TAXABLE',
        confidence: isInternational ? 98 : 95,
        reason: 'Client payment detected via reference pattern',
        userConfirmed: true
      });

      // Add to Vault
      const vaultId = `VAULT-${txnId}`;
      incomeTxn.vaultEntryId = vaultId;

      vaultEntries.push({
        id: vaultId,
        userId,
        transactionId: txnId,
        incomeAmount: amount,
        taxAmount: estimatedTax,
        lockedDate: txnDate,
        status: 'LOCKED'
      });

      // Generate Invoice for this income (Backward correlation)
      const invId = `INV-${userId}-${i}-${j}`;
      invoices.push({
        id: invId,
        userId,
        invoiceNumber: `INV-2024-${String(transactions.length).padStart(3, '0')}`,
        date: new Date(txnDate.getTime() - 15 * 24 * 60 * 60 * 1000), // Invoice sent 15 days before
        dueDate: txnDate,
        amount: amount,
        status: 'PAID',
        clientName: client.name,
        clientEmail: client.email,
        items: [{
          id: `ITEM-${invId}`,
          description: 'Professional Services - UI/UX Design & Development',
          quantity: 1,
          rate: amount,
          amount: amount,
          total: amount
        }],
        subtotal: amount,
        tax: 0, // Assuming export or composition for simplicity in prototype
        total: amount,
        currency: 'INR',
        paidTransactionId: txnId
      });
    }
  }

  // 2. Generate Expenses (Realistic Spending Patterns)
  let totalExpenseAmount = 0;
  const numExpenses = getRandomAmount(30, 50); // 30-50 expenses over history

  for (let k = 0; k < numExpenses; k++) {
    const categoryKey = getRandomItem(Object.keys(MERCHANTS));
    const merchant = getRandomItem(MERCHANTS[categoryKey as keyof typeof MERCHANTS]);
    const txnDate = new Date(today);
    txnDate.setDate(txnDate.getDate() - getRandomAmount(1, 90)); // Last 3 months mainly

    let amount = getRandomAmount(200, 5000);
    // Adjust amount based on category realism
    if (categoryKey === 'SUBSCRIPTIONS') amount = getRandomAmount(800, 4500);
    if (categoryKey === 'TRAVEL' && Math.random() > 0.8) amount = getRandomAmount(3000, 15000); // Flight
    if (categoryKey === 'UTILITIES') amount = getRandomAmount(800, 2500);

    const expenseId = `EXP-${userId}-${k}`;
    const txnId = `TXN-EXP-${userId}-${k}`;

    const expenseTxn: Transaction = {
      id: txnId,
      userId,
      type: TransactionType.PERSONAL, 
      amount: amount,
      category: categoryKey,
      description: `Payment to ${merchant}`,
      merchant: merchant,
      source: merchant,
      date: txnDate,
      time: `${getRandomAmount(8, 22)}:${getRandomAmount(10, 59)}`,
      fromAccount: 'HDFC Bank - Savings',
      toAccount: merchant,
      status: TransactionStatus.COMPLETED,
      paymentMethod: 'UPI',
      referenceId: `UPI/${Math.random().toString(36).substring(7)}`,
      expenseId: expenseId,
      estimatedTax: 0,
      icon: CATEGORIES[categoryKey]?.icon || '💸'
    };

    transactions.push(expenseTxn);
    totalExpenseAmount += amount;

    expenses.push({
      id: expenseId,
      userId,
      transactionId: txnId,
      category: categoryKey,
      amount: amount,
      date: txnDate,
      description: `Payment for ${categoryKey.toLowerCase()}`,
      merchant: merchant,
      paymentMethod: 'UPI',
      tags: [categoryKey.toLowerCase(), merchant.toLowerCase()],
      deductible: ['SUBSCRIPTIONS', 'UTILITIES'].includes(categoryKey) // Business deductible logic
    });
  }

  // 3. Create Draft/Sent Invoices (Future Receivables)
  for (let m = 0; m < 3; m++) {
    const client = getRandomItem(CLIENTS);
    const amount = getRandomAmount(30000, 80000);
    const date = new Date(today);
    date.setDate(date.getDate() - getRandomAmount(1, 10));
    
    invoices.push({
      id: `INV-PENDING-${m}`,
      userId,
      invoiceNumber: `INV-2024-${String(transactions.length + m + 50).padStart(3, '0')}`,
      date: date,
      dueDate: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
      amount: amount,
      status: m === 0 ? 'OVERDUE' : 'SENT', // 1 overdue, others sent
      clientName: client.name,
      clientEmail: client.email,
      items: [{
        id: '1', 
        description: 'Consulting Retainer',
        quantity: 1, 
        rate: amount, 
        amount: amount, 
        total: amount
      }],
      subtotal: amount,
      total: amount,
      currency: 'INR'
    });
  }

  // 4. Calculate Balances
  const vaultBalance = vaultEntries.reduce((sum, v) => sum + v.taxAmount, 0);
  const baseLiquidity = 45000; // Buffer
  const savingsBalance = baseLiquidity + totalIncomeAmount - totalExpenseAmount - vaultBalance;

  const bankAccounts: BankAccount[] = [
    {
      id: `BANK-${userId}-1`,
      userId,
      bankName: 'HDFC Bank',
      accountNumber: 'XXXX8901',
      accountHolder: 'Saiyam Jain',
      accountType: 'SAVINGS',
      balance: savingsBalance,
      ifscCode: 'HDFC0000240',
      lastUpdated: new Date(),
      isPrimary: true
    },
    {
      id: `BANK-${userId}-2`,
      userId,
      bankName: 'ICICI Bank',
      accountNumber: 'XXXX4321',
      accountHolder: 'Saiyam Jain',
      accountType: 'CURRENT',
      balance: vaultBalance, // Separate account for vault
      ifscCode: 'ICIC0001540',
      lastUpdated: new Date(),
      isPrimary: false,
      color: 'bg-blue-100'
    }
  ];

  // 5. Documents
  // 5. Tax Calendar (Linked to Vault)
  const taxCalendar: TaxCalendarEntry[] = [];
  const currentYear = today.getFullYear();
  const totalTaxLiability = vaultBalance;
  
  // Quarterly estimated tax payments
  const quarters = [
    { q: 'Q1', month: 5, day: 15, desc: 'Q1 (Apr-Jun)' },
    { q: 'Q2', month: 8, day: 15, desc: 'Q2 (Jul-Sep)' },
    { q: 'Q3', month: 11, day: 15, desc: 'Q3 (Oct-Dec)' },
    { q: 'Q4', month: 2, day: 15, desc: 'Q4 (Jan-Mar)', year: currentYear + 1 }
  ];

  quarters.forEach((q, idx) => {
    const dueDate = new Date(q.year || currentYear, q.month, q.day);
    const quarterAmount = Math.round(totalTaxLiability / 4);
    const isPast = dueDate < today;
    
    taxCalendar.push({
      id: `TAX-Q${idx + 1}-${userId}`,
      userId,
      type: 'QUARTERLY',
      quarter: q.q as any,
      dueDate,
      amount: quarterAmount,
      status: isPast ? 'PAID' : (dueDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000 ? 'DUE' : 'UPCOMING'),
      description: `Advance Tax Payment - ${q.desc}`,
      taxVaultId: vaultEntries[0]?.id
    });
  });

  // Annual ITR filing
  taxCalendar.push({
    id: `TAX-ANNUAL-${userId}`,
    userId,
    type: 'ANNUAL',
    dueDate: new Date(currentYear, 6, 31), // July 31
    amount: totalTaxLiability,
    status: new Date(currentYear, 6, 31) < today ? 'PAID' : 'UPCOMING',
    description: 'Income Tax Return Filing - FY 2023-24',
    taxVaultId: vaultEntries[0]?.id
  });

  // 6. AI Insights (Cross-module analysis)
  const aiInsights: AIInsight[] = [];

  // Income insight - Top client
  const clientRevenue: Record<string, { amount: number; ids: string[] }> = {};
  transactions
    .filter(t => t.type === TransactionType.BUSINESS)
    .forEach(t => {
      const client = t.merchant || t.source;
      if (!clientRevenue[client]) clientRevenue[client] = { amount: 0, ids: [] };
      clientRevenue[client].amount += t.amount;
      clientRevenue[client].ids.push(t.id);
    });

  const topClient = Object.entries(clientRevenue).sort((a, b) => b[1].amount - a[1].amount)[0];
  if (topClient) {
    const percentage = Math.round((topClient[1].amount / totalIncomeAmount) * 100);
    aiInsights.push({
      id: `INS-INCOME-${userId}`,
      userId,
      type: 'INCOME',
      title: 'Top Revenue Source Identified',
      message: `${topClient[0]} contributed ₹${topClient[1].amount.toLocaleString()} (${percentage}% of total income). Consider diversifying client base to reduce dependency.`,
      priority: percentage > 50 ? 'HIGH' : 'MEDIUM',
      relatedIds: topClient[1].ids,
      actionable: true,
      createdAt: today
    });
  }

  // Expense insight - Deductible opportunities
  const deductibleExpenses = expenses.filter(e => e.deductible);
  const totalDeductible = deductibleExpenses.reduce((sum, e) => sum + e.amount, 0);
  if (totalDeductible > 0) {
    aiInsights.push({
      id: `INS-EXPENSE-${userId}`,
      userId,
      type: 'EXPENSE',
      title: 'Tax Deduction Opportunity',
      message: `You have ₹${totalDeductible.toLocaleString()} in deductible business expenses. This could reduce your taxable income by ${Math.round((totalDeductible / totalIncomeAmount) * 100)}%.`,
      priority: 'MEDIUM',
      relatedIds: deductibleExpenses.map(e => e.id),
      actionable: true,
      createdAt: today
    });
  }

  // Tax insight - Liability projection
  const netTaxableIncome = totalIncomeAmount - totalDeductible;
  const projectedTax = Math.round(netTaxableIncome * 0.3);
  aiInsights.push({
    id: `INS-TAX-${userId}`,
    userId,
    type: 'TAX',
    title: 'Annual Tax Projection',
    message: `Based on current income (₹${totalIncomeAmount.toLocaleString()}) and deductions (₹${totalDeductible.toLocaleString()}), your estimated tax liability is ₹${projectedTax.toLocaleString()}. Current vault balance: ₹${vaultBalance.toLocaleString()}.`,
    priority: vaultBalance < projectedTax ? 'HIGH' : 'LOW',
    relatedIds: vaultEntries.map(v => v.id),
    actionable: true,
    createdAt: today
  });

  // Cashflow insight
  const avgMonthlyIncome = Math.round(totalIncomeAmount / 6);
  const avgMonthlyExpense = Math.round(totalExpenseAmount / 6);
  const netCashflow = avgMonthlyIncome - avgMonthlyExpense;
  aiInsights.push({
    id: `INS-CASHFLOW-${userId}`,
    userId,
    type: 'CASHFLOW',
    title: 'Monthly Cashflow Analysis',
    message: `Average monthly income: ₹${avgMonthlyIncome.toLocaleString()} | Expenses: ₹${avgMonthlyExpense.toLocaleString()} | Net: ₹${netCashflow.toLocaleString()}. ${netCashflow > 0 ? 'Healthy cashflow maintained.' : 'Warning: Expenses exceeding income.'}`,
    priority: netCashflow < 0 ? 'HIGH' : 'LOW',
    relatedIds: [],
    actionable: false,
    createdAt: today
  });

  // Growth insight
  const recentIncome = transactions
    .filter(t => t.type === TransactionType.BUSINESS && new Date(t.date).getMonth() === today.getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const lastMonthIncome = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === TransactionType.BUSINESS && tDate.getMonth() === today.getMonth() - 1;
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (lastMonthIncome > 0) {
    const growth = Math.round(((recentIncome - lastMonthIncome) / lastMonthIncome) * 100);
    aiInsights.push({
      id: `INS-GROWTH-${userId}`,
      userId,
      type: 'GROWTH',
      title: 'Revenue Growth Trend',
      message: `${growth > 0 ? '📈' : '📉'} Revenue ${growth > 0 ? 'increased' : 'decreased'} by ${Math.abs(growth)}% compared to last month. ${growth > 0 ? 'Great momentum!' : 'Consider new client acquisition strategies.'}`,
      priority: growth < -20 ? 'HIGH' : 'LOW',
      relatedIds: [],
      actionable: growth < 0,
      createdAt: today
    });
  }

  const vaultDocuments: VaultDocument[] = [
    {
      id: 'DOC-1',
      userId,
      title: 'PAN Card',
      category: 'GOVERNMENT',
      fileName: 'pan_card_scan.jpg',
      uploadedDate: new Date('2023-05-15'),
      size: 450000,
      type: 'IMAGE'
    },
    {
      id: 'DOC-2',
      userId,
      title: 'FY23-24 ITR Acknowledgement',
      category: 'GOVERNMENT',
      fileName: 'itr_v_2024.pdf',
      uploadedDate: new Date('2024-07-20'),
      size: 1200000,
      type: 'PDF'
    },
    {
      id: 'DOC-3',
      userId,
      title: 'Rental Agreement',
      category: 'PROPERTY',
      fileName: 'rent_agreement_2024.pdf',
      uploadedDate: new Date('2024-01-10'),
      size: 3500000,
      type: 'PDF'
    }
  ];

  return {
    transactions: transactions.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
      const dateB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
      return dateB - dateA;
    }),
    expenses: expenses.sort((a, b) => b.date.getTime() - a.date.getTime()),
    invoices: invoices.sort((a, b) => b.date.getTime() - a.date.getTime()),
    vaultEntries,
    classifiedIncomes,
    bankAccounts,
    vaultDocuments,
    taxCalendar: taxCalendar.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    aiInsights: aiInsights.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    stats: {
      totalIncome: totalIncomeAmount,
      totalExpense: totalExpenseAmount,
      vaultBalance: vaultBalance,
      availableBalance: savingsBalance,
      transactionCount: transactions.length,
      expenseCount: expenses.length,
      invoiceCount: invoices.length,
      paidInvoices: invoices.filter(i => i.status === 'PAID').length,
      netTaxableIncome: totalIncomeAmount - totalDeductible,
      projectedTaxLiability: projectedTax,
      deductibleExpenses: totalDeductible
    }
  };
}

// ============ GLOBAL DATA ACCESS ============
const ALL_USER_DATA: Record<string, any> = {};

// Initialize from localStorage or generate new
const initializeUserData = () => {
  const stored = localStorage.getItem('PAYLOCKR_USER_DATA');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Restore dates
      Object.keys(parsed).forEach(userId => {
        const data = parsed[userId];
        data.transactions = data.transactions.map((t: any) => ({ ...t, date: new Date(t.date) }));
        data.expenses = data.expenses.map((e: any) => ({ ...e, date: new Date(e.date) }));
        data.invoices = data.invoices.map((i: any) => ({ ...i, date: new Date(i.date), dueDate: new Date(i.dueDate) }));
        data.vaultEntries = data.vaultEntries.map((v: any) => ({ ...v, lockedDate: new Date(v.lockedDate) }));
        data.bankAccounts = data.bankAccounts.map((b: any) => ({ ...b, lastUpdated: new Date(b.lastUpdated) }));
        data.vaultDocuments = data.vaultDocuments.map((d: any) => ({ ...d, uploadedDate: new Date(d.uploadedDate) }));
        if (data.taxCalendar) {
          data.taxCalendar = data.taxCalendar.map((t: any) => ({ ...t, dueDate: new Date(t.dueDate) }));
        }
        if (data.aiInsights) {
          data.aiInsights = data.aiInsights.map((i: any) => ({ ...i, createdAt: new Date(i.createdAt) }));
        }
        ALL_USER_DATA[userId] = data;
      });
      return;
    } catch (e) {
      console.error('Failed to load stored data', e);
    }
  }
  
  // Generate fresh data
  DEMO_USERS.forEach(user => {
    ALL_USER_DATA[user.id] = generateUserData(user.id);
  });
  
  // Save to localStorage
  localStorage.setItem('PAYLOCKR_USER_DATA', JSON.stringify(ALL_USER_DATA));
};

initializeUserData();

export function authenticateUser(email: string, password: string) {
  // FIX: Only allow exact password match, not 'PayLockr@123' for all users
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  return user ? { ...user } : null;
}

export function getUserData(userId: string) {
  if (!ALL_USER_DATA[userId]) {
    ALL_USER_DATA[userId] = generateUserData(userId);
    localStorage.setItem('PAYLOCKR_USER_DATA', JSON.stringify(ALL_USER_DATA));
  }
  return ALL_USER_DATA[userId];
}

export function getDashboardStats(userId: string) {
  const data = getUserData(userId);
  
  return {
    ...data.stats,
    bankAccounts: data.bankAccounts,
    vaultEntries: data.vaultEntries,
    monthlyBreakdown: getMonthlyBreakdown(data.transactions)
  };
}

function getMonthlyBreakdown(transactions: Transaction[]) {
  const breakdown: Record<string, any> = {};
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = monthDate.toLocaleDateString('en-IN', { month: 'short' });
    
    // Initialize
    breakdown[monthKey] = { name: monthKey, income: 0, tax: 0 };

    const monthTransactions = transactions.filter(t => {
      const tDate = t.date instanceof Date ? t.date : new Date(t.date);
      return tDate.getMonth() === monthDate.getMonth() && tDate.getFullYear() === monthDate.getFullYear();
    });

    monthTransactions.forEach(t => {
      if (t.type === TransactionType.BUSINESS) {
        breakdown[monthKey].income += t.amount;
        breakdown[monthKey].tax += t.estimatedTax;
      }
    });
  }

  return Object.values(breakdown);
}