// Core Data Service - Manages all interconnected data relationships
import { 
  Transaction, Expense, Invoice, VaultEntry, BankAccount, 
  Notification, TransactionType, TransactionStatus 
} from '../types';

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
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE' | 'TAX' | 'CASHFLOW' | 'GROWTH';
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  relatedIds: string[];
  createdAt: Date;
}

class DataService {
  private static instance: DataService;

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // ============ TRANSACTION OPERATIONS ============
  createTransaction(userId: string, data: Partial<Transaction>): Transaction {
    const txn: Transaction = {
      id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      date: new Date(),
      amount: data.amount || 0,
      type: data.type || TransactionType.PERSONAL,
      status: data.status || TransactionStatus.COMPLETED,
      source: data.source || '',
      estimatedTax: data.estimatedTax || 0,
      ...data
    };

    // Auto-link to invoice if business income
    if (txn.type === TransactionType.BUSINESS && !txn.invoiceId) {
      this.autoLinkInvoice(userId, txn);
    }

    // Auto-create vault entry if taxable
    if (txn.type === TransactionType.BUSINESS && txn.estimatedTax > 0) {
      this.createVaultEntry(userId, txn);
    }

    // Update bank balance
    this.updateBankBalance(userId, txn);

    // Trigger notification
    this.createNotification(userId, {
      type: 'success',
      title: 'Transaction Recorded',
      message: `${txn.type} of ₹${txn.amount.toLocaleString()} recorded`
    });

    return txn;
  }

  // ============ INVOICE OPERATIONS ============
  createInvoice(userId: string, data: Partial<Invoice>): Invoice {
    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      userId,
      invoiceNumber: `INV-2024-${String(Date.now()).slice(-4)}`,
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amount: data.amount || 0,
      status: 'DRAFT',
      clientName: data.clientName || '',
      clientEmail: data.clientEmail || '',
      items: data.items || [],
      currency: 'INR',
      ...data
    };

    // Add to tax calendar
    this.addTaxCalendarEntry(userId, {
      type: 'ANNUAL',
      dueDate: invoice.dueDate,
      amount: invoice.amount * 0.1,
      status: 'UPCOMING'
    });

    return invoice;
  }

  markInvoicePaid(userId: string, invoiceId: string, transactionId: string): void {
    // Link invoice to transaction
    // Update smart tax vault
    // Trigger notification
    this.createNotification(userId, {
      type: 'success',
      title: 'Invoice Paid',
      message: `Payment received for invoice ${invoiceId}`
    });
  }

  // ============ EXPENSE OPERATIONS ============
  createExpense(userId: string, data: Partial<Expense>): Expense {
    const expense: Expense = {
      id: `EXP-${Date.now()}`,
      userId,
      category: data.category || 'OTHER',
      amount: data.amount || 0,
      date: new Date(),
      description: data.description || '',
      merchant: data.merchant || '',
      paymentMethod: data.paymentMethod || 'UPI',
      tags: data.tags || [],
      deductible: this.isDeductible(data.category || ''),
      ...data
    };

    // Create linked transaction
    const txn = this.createTransaction(userId, {
      type: TransactionType.PERSONAL,
      amount: expense.amount,
      category: expense.category,
      merchant: expense.merchant,
      description: expense.description,
      expenseId: expense.id
    });

    expense.transactionId = txn.id;

    // If deductible, update tax vault
    if (expense.deductible) {
      this.updateTaxDeductions(userId, expense);
    }

    return expense;
  }

  private isDeductible(category: string): boolean {
    const deductibleCategories = ['SUBSCRIPTIONS', 'UTILITIES', 'TRAVEL', 'HEALTHCARE'];
    return deductibleCategories.includes(category);
  }

  // ============ SMART TAX VAULT ============
  private createVaultEntry(userId: string, transaction: Transaction): VaultEntry {
    const entry: VaultEntry = {
      id: `VAULT-${transaction.id}`,
      userId,
      transactionId: transaction.id,
      incomeAmount: transaction.amount,
      taxAmount: transaction.estimatedTax,
      lockedDate: new Date(),
      status: 'LOCKED'
    };

    transaction.vaultEntryId = entry.id;
    transaction.status = TransactionStatus.VAULTED;

    return entry;
  }

  private updateTaxDeductions(userId: string, expense: Expense): void {
    // Recalculate tax liability with deductions
    this.createNotification(userId, {
      type: 'info',
      title: 'Tax Deduction Applied',
      message: `₹${expense.amount} marked as deductible expense`
    });
  }

  // ============ TAX CALENDAR ============
  private addTaxCalendarEntry(userId: string, data: Partial<TaxCalendarEntry>): TaxCalendarEntry {
    const entry: TaxCalendarEntry = {
      id: `TAX-${Date.now()}`,
      userId,
      type: data.type || 'QUARTERLY',
      dueDate: data.dueDate || new Date(),
      amount: data.amount || 0,
      status: data.status || 'UPCOMING',
      ...data
    };

    // Check if due soon
    const daysUntilDue = Math.floor((entry.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 7 && daysUntilDue > 0) {
      this.createNotification(userId, {
        type: 'warning',
        title: 'Tax Deadline Approaching',
        message: `₹${entry.amount.toLocaleString()} due in ${daysUntilDue} days`
      });
    }

    return entry;
  }

  // ============ BANK ACCOUNT ============
  private updateBankBalance(userId: string, transaction: Transaction): void {
    // Update primary bank account balance
    // Trigger low balance alert if needed
  }

  // ============ AI INSIGHTS ============
  generateInsights(userId: string, data: any): AIInsight[] {
    const insights: AIInsight[] = [];

    // Income insights
    if (data.transactions) {
      const topClient = this.getTopClient(data.transactions);
      if (topClient) {
        insights.push({
          id: `INS-${Date.now()}-1`,
          userId,
          type: 'INCOME',
          title: 'Top Revenue Source',
          message: `${topClient.name} contributed ${topClient.percentage}% of your income`,
          priority: 'MEDIUM',
          relatedIds: topClient.transactionIds,
          createdAt: new Date()
        });
      }
    }

    // Expense insights
    if (data.expenses) {
      const overspending = this.detectOverspending(data.expenses);
      if (overspending) {
        insights.push({
          id: `INS-${Date.now()}-2`,
          userId,
          type: 'EXPENSE',
          title: 'Overspending Alert',
          message: `${overspending.category} expenses up ${overspending.increase}% this month`,
          priority: 'HIGH',
          relatedIds: overspending.expenseIds,
          createdAt: new Date()
        });
      }
    }

    // Tax insights
    const taxProjection = this.calculateTaxProjection(data);
    insights.push({
      id: `INS-${Date.now()}-3`,
      userId,
      type: 'TAX',
      title: 'Annual Tax Projection',
      message: `Estimated tax liability: ₹${taxProjection.toLocaleString()}`,
      priority: 'MEDIUM',
      relatedIds: [],
      createdAt: new Date()
    });

    return insights;
  }

  private getTopClient(transactions: Transaction[]): any {
    const clientMap: Record<string, { amount: number; ids: string[] }> = {};
    let total = 0;

    transactions
      .filter(t => t.type === TransactionType.BUSINESS)
      .forEach(t => {
        const client = t.merchant || t.source;
        if (!clientMap[client]) {
          clientMap[client] = { amount: 0, ids: [] };
        }
        clientMap[client].amount += t.amount;
        clientMap[client].ids.push(t.id);
        total += t.amount;
      });

    const topClient = Object.entries(clientMap).sort((a, b) => b[1].amount - a[1].amount)[0];
    if (!topClient) return null;

    return {
      name: topClient[0],
      amount: topClient[1].amount,
      percentage: Math.round((topClient[1].amount / total) * 100),
      transactionIds: topClient[1].ids
    };
  }

  private detectOverspending(expenses: Expense[]): any {
    // Simplified overspending detection
    return null;
  }

  private calculateTaxProjection(data: any): number {
    const totalIncome = data.stats?.totalIncome || 0;
    const totalDeductions = data.expenses?.filter((e: Expense) => e.deductible)
      .reduce((sum: number, e: Expense) => sum + e.amount, 0) || 0;
    
    const taxableIncome = totalIncome - totalDeductions;
    return Math.round(taxableIncome * 0.3); // Simplified 30% tax
  }

  // ============ NOTIFICATIONS ============
  private createNotification(userId: string, data: Partial<Notification>): Notification {
    const notification: Notification = {
      id: `NOTIF-${Date.now()}`,
      title: data.title || '',
      message: data.message || '',
      timestamp: new Date().toISOString(),
      type: data.type || 'info',
      read: false
    };

    return notification;
  }

  // ============ AUTO-LINKING ============
  private autoLinkInvoice(userId: string, transaction: Transaction): void {
    // Find matching unpaid invoice by amount and client
    // Link them together
  }
}

export default DataService.getInstance();
