import { Transaction, TransactionType, VaultEntry } from '../types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const getVaultStatus = (balance: number, required: number) => {
  if (required === 0 && balance > 0) return 'Fully Protected';
  if (required === 0) return 'Safe (No Tax Liability)';
  if (balance >= required * 0.9) return 'Fully Protected';
  if (balance >= required * 0.5) return 'Partially Protected';
  return 'At Risk';
};

export const getComplianceMessage = (score: number) => {
  if (score >= 80) return 'Excellent! You are tax compliant.';
  if (score >= 50) return 'Good, but attention needed soon.';
  return 'Critical! Immediate action required.';
};

export const classifyIncome = (transaction: Transaction) => {
  // Logic: Business income is taxable
  // In a real app, this would use ML or more complex rules based on merchant/description
  const isTaxable = transaction.type === TransactionType.BUSINESS;
  
  return {
    type: isTaxable ? 'TAXABLE' : 'NON_TAXABLE',
    confidence: isTaxable ? 90 : 80,
    reason: isTaxable ? 'Business/Freelance Income Source' : 'Personal/Refund Transaction',
    userConfirmed: false
  };
};

export const calculateProvisionalTax = (amount: number, annualIncome: number) => {
  // Simplified tax calculation for demo purposes (New Regime FY 24-25)
  // Slabs: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)
  
  let rate = 0;
  if (annualIncome > 1500000) rate = 0.30;
  else if (annualIncome > 1200000) rate = 0.20;
  else if (annualIncome > 1000000) rate = 0.15;
  else if (annualIncome > 700000) rate = 0.10;
  else if (annualIncome > 300000) rate = 0.05;
  
  // Rebate u/s 87A for income up to 7L (New Regime)
  if (annualIncome <= 700000) rate = 0;

  return amount * rate;
};

export const getVaultBalance = (entries: VaultEntry[]) => {
  return entries
    .filter(e => e.status === 'LOCKED')
    .reduce((sum, e) => sum + e.taxAmount, 0);
};

export const getSmartTaxVaultDashboard = (
  userId: string,
  transactions: any[] = [],
  classifiedIncomes: any[] = [],
  vaultEntries: any[] = []
) => {
  // If we have real vault entries, use them to calculate balance
  let vaultBalance = 0;
  if (vaultEntries.length > 0) {
    vaultBalance = vaultEntries
      .filter((e: any) => e.status === 'LOCKED')
      .reduce((sum: any, e: any) => sum + e.taxAmount, 0);
  } else {
    // Mock balance matching dummy data if no entries
    vaultBalance = 142500;
  }

  // Calculate annual income from transactions or mock
  const totalIncome = transactions.length > 0 
    ? transactions
        .filter(t => t.type === 'INCOME' || t.type === TransactionType.BUSINESS)
        .reduce((sum, t) => sum + t.amount, 0)
    : 1250000;

  // Estimate total tax roughly
  const estimatedTax = Math.round(totalIncome * 0.15); // Avg effective rate
  
  // Mock expenses calculation if not provided
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE' || t.type === TransactionType.PERSONAL)
    .reduce((sum, t) => sum + t.amount, 0);

  const availableForSpending = totalIncome - vaultBalance - totalExpenses;

  // Monthly report generation (mock or computed)
  const monthlyReport = {
    totalIncome: totalIncome / 6, // Approx monthly
    taxableIncome: totalIncome / 6,
    nonTaxableIncome: 0,
    estimatedTax: estimatedTax / 6,
    vaultAddition: vaultBalance / 6,
    expenses: totalExpenses / 6,
    netSpendable: (totalIncome - vaultBalance - totalExpenses) / 6
  };
  
  return {
    vaultBalance,
    availableForSpending,
    totalIncome,
    percentageInVault: totalIncome > 0 ? (vaultBalance / totalIncome) * 100 : 0,
    monthlyReport: {
      totalIncome: Math.round(monthlyReport.totalIncome),
      taxableIncome: Math.round(monthlyReport.taxableIncome),
      nonTaxableIncome: 0,
      estimatedTax: Math.round(monthlyReport.estimatedTax),
      vaultAddition: Math.round(monthlyReport.vaultAddition),
      expenses: Math.round(monthlyReport.expenses),
      netSpendable: Math.round(monthlyReport.netSpendable)
    },
    confidenceScore: vaultEntries.length > 0 ? 98 : 85, // Higher confidence with real data
    classifiedCount: classifiedIncomes.length || 12,
    unconfirmedCount: classifiedIncomes.filter((c: any) => !c.userConfirmed).length || 2,
    emergencyUnlockRequests: 0
  };
};