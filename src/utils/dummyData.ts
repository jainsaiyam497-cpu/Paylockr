import { Transaction, TransactionType, TransactionStatus, Invoice, Expense, VaultDocument, BankAccount } from '../types';

// ============ CONSTANTS ============

export const CATEGORIES = {
  FOOD: { icon: '🍔', color: '#FF6B6B', label: 'Food & Dining' },
  SHOPPING: { icon: '🛍️', color: '#4ECDC4', label: 'Shopping' },
  TRAVEL: { icon: '✈️', color: '#45B7D1', label: 'Travel' },
  ENTERTAINMENT: { icon: '🎬', color: '#96CEB4', label: 'Entertainment' },
  UTILITIES: { icon: '💡', color: '#FFEAA7', label: 'Utilities' },
  HEALTHCARE: { icon: '⚕️', color: '#DDA15E', label: 'Healthcare' },
  EDUCATION: { icon: '📚', color: '#BC6C25', label: 'Education' },
  INVESTMENT: { icon: '📈', color: '#52B788', label: 'Investment' },
  SALARY: { icon: '💰', color: '#06C258', label: 'Salary' },
  TRANSFER: { icon: '↔️', color: '#6C63FF', label: 'Transfer' }
};

const MERCHANTS = {
  FOOD: ['Swiggy', 'Zomato', 'Starbucks', 'Dominos', 'Local Restaurant', 'Blinkit'],
  SHOPPING: ['Amazon India', 'Flipkart', 'Myntra', 'Reliance Digital', 'D-Mart'],
  TRAVEL: ['Uber', 'Ola', 'MakeMyTrip', 'IRCTC', 'Indigo'],
  ENTERTAINMENT: ['Netflix', 'Spotify', 'BookMyShow', 'PVR Cinemas'],
  UTILITIES: ['BESCOM', 'Jio Fiber', 'Airtel', 'LIC India'],
  HEALTHCARE: ['Apollo Pharmacy', 'Practo', '1mg'],
  EDUCATION: ['Udemy', 'Coursera', 'Kindle'],
  INVESTMENT: ['Zerodha', 'Groww', 'PPF Account']
};

// ============ GENERATORS ============

export function generateDummyTransactions(count: number = 50): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();

  // Salary Income
  transactions.push({
    id: 'txn-salary-1',
    type: TransactionType.BUSINESS, 
    amount: 85000,
    source: 'Tech Solutions Pvt Ltd',
    date: new Date(today.getFullYear(), today.getMonth(), 1), // Date object
    time: '10:00 AM',
    status: TransactionStatus.VAULTED, 
    estimatedTax: 8500,
    category: 'SALARY',
    notes: 'Monthly Salary',
    paymentMethod: 'NEFT',
    referenceId: 'REF1234567890',
    description: 'Salary Credit'
  });

  for (let i = 0; i < count; i++) {
    const categoryKeys = Object.keys(MERCHANTS);
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const merchantList = MERCHANTS[category as keyof typeof MERCHANTS];
    const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
    
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Last 60 days

    const amount = Math.floor(Math.random() * 5000) + 100;
    const isExpense = i % 4 !== 0;
    
    transactions.push({
      id: `txn-${i}`,
      type: isExpense ? TransactionType.PERSONAL : TransactionType.BUSINESS, 
      amount: amount,
      source: isExpense ? merchant : `Client Payment ${i}`,
      merchant: isExpense ? merchant : undefined,
      date: date, // Date object
      time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`,
      status: isExpense ? TransactionStatus.IGNORED : TransactionStatus.PENDING,
      estimatedTax: isExpense ? 0 : amount * 0.1,
      category: category,
      notes: isExpense ? `Payment via UPI` : 'Freelance Work',
      paymentMethod: 'UPI',
      referenceId: `UPI${Math.floor(Math.random() * 10000000)}`,
      description: isExpense ? `Payment to ${merchant}` : `Received from Client`
    });
  }

  return transactions.sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());
}

export function generateDummyExpenses(count: number = 50): Expense[] {
  const expenses: Expense[] = [];
  const categoryKeys = Object.keys(CATEGORIES).filter(k => k !== 'SALARY');
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const merchantList = MERCHANTS[category as keyof typeof MERCHANTS] || ['Generic Merchant'];
    const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));

    expenses.push({
      id: `exp-${i}`,
      category: category,
      amount: Math.floor(Math.random() * 5000) + 100,
      date: date,
      description: `Expense for ${category.toLowerCase()}`,
      merchant: merchant,
      paymentMethod: 'UPI',
      tags: ['business', 'tax-deductible'],
      deductible: Math.random() > 0.5,
    });
  }
  return expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function generateDummyInvoices(count: number = 15): Invoice[] {
  const statuses: Invoice['status'][] = ['DRAFT', 'SENT', 'VIEWED', 'PAID', 'OVERDUE', 'CANCELLED'];
  const invoices: Invoice[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 15);

    invoices.push({
      id: `inv-${i}`,
      invoiceNumber: `INV-2024-${(100 + i).toString()}`,
      clientName: `Client ${String.fromCharCode(65 + (i % 5))} Corp`,
      clientEmail: `accounts@client${String.fromCharCode(65 + (i % 5))}.com`,
      date: date,
      dueDate: dueDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: [{ id: '1', description: 'Consulting Services', quantity: 1, rate: 5000, amount: 5000 }],
      subtotal: 5000,
      gst: 900,
      total: 5900,
      amount: Math.floor(Math.random() * 50000) + 5000,
      currency: 'INR'
    });
  }
  return invoices.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function generateDummyVaultDocuments(): VaultDocument[] {
  const today = new Date();
  const docs: VaultDocument[] = [
    {
      id: 'doc-1',
      title: 'HDFC Statement - Jan 2024',
      category: 'BANK',
      fileName: 'hdfc_jan_24.pdf',
      uploadedDate: new Date(today.getFullYear(), 0, 5),
      size: 2400000,
      type: 'PDF'
    },
    {
      id: 'doc-2',
      title: 'LIC Policy Bond',
      category: 'INSURANCE',
      fileName: 'lic_policy_8321.pdf',
      uploadedDate: new Date(today.getFullYear() - 1, 11, 15),
      size: 1800000,
      type: 'PDF'
    },
    {
      id: 'doc-3',
      title: 'PAN Card',
      category: 'PERSONAL',
      fileName: 'pan_card.jpg',
      uploadedDate: new Date(today.getFullYear() - 2, 0, 10),
      size: 500000,
      type: 'IMAGE'
    },
    {
      id: 'doc-4',
      title: 'FY 23-24 ITR-V',
      category: 'GOVERNMENT',
      fileName: 'itr_v_fy2324.pdf',
      uploadedDate: new Date(today.getFullYear(), 6, 31),
      size: 1200000,
      type: 'PDF'
    }
  ];
  return docs;
}

export function generateDummyBankAccounts(): BankAccount[] {
  return [
    {
      id: '1',
      bankName: 'HDFC Bank',
      accountNumber: '1234567890',
      accountHolder: 'John Doe',
      accountType: 'SAVINGS',
      balance: 124500.50,
      ifscCode: 'HDFC0001234',
      lastUpdated: new Date()
    },
    {
      id: '2',
      bankName: 'ICICI Bank',
      accountNumber: '0987654321',
      accountHolder: 'John Doe',
      accountType: 'CURRENT',
      balance: 45200.00,
      ifscCode: 'ICIC0000987',
      lastUpdated: new Date()
    }
  ];
}

export function generateDummyTaxData() {
  return {
    grossIncome: 1250000,
    totalDeductions: 150000,
    taxableIncome: 1100000,
    taxLiability: 142500,
    deductions: {
      section80C: 150000,
      section80D: 25000,
      section80E: 0
    }
  };
}

export function calculateExpenseSummary(transactions: Transaction[]) {
  const summary: Record<string, number> = {};
  
  transactions.forEach(t => {
    if (t.category) {
      summary[t.category] = (summary[t.category] || 0) + t.amount;
    }
  });

  return Object.entries(summary).map(([name, value]) => ({
    name,
    value,
    color: CATEGORIES[name as keyof typeof CATEGORIES]?.color || '#999'
  }));
}
