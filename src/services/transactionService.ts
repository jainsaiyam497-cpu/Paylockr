import { Transaction, TransactionType } from '../types';
import { INITIAL_TRANSACTIONS } from '../constants';

/**
 * Transaction Service
 * Manages fetching, creating, and updating transactions.
 */

export const transactionService = {
  /**
   * Get all transactions for a user
   */
  getTransactions: async (): Promise<Transaction[]> => {
    // In a real app, fetch from Supabase
    return Promise.resolve(INITIAL_TRANSACTIONS);
  },

  /**
   * Create a new transaction
   */
  createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const newTxn: Transaction = {
      id: `TXN-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      source: data.source || 'Unknown',
      amount: data.amount || 0,
      type: data.type || TransactionType.BUSINESS,
      status: data.status || 'Pending',
      estimatedTax: data.estimatedTax || 0,
      ...data
    } as Transaction;
    
    return Promise.resolve(newTxn);
  },

  /**
   * Update a transaction
   */
  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    // Mock update
    return Promise.resolve({ ...INITIAL_TRANSACTIONS[0], ...data, id });
  },

  /**
   * Delete a transaction
   */
  deleteTransaction: async (id: string): Promise<boolean> => {
    return Promise.resolve(true);
  },

  /**
   * Classify a transaction based on metadata (Mock AI logic)
   */
  classifyTransaction: async (metadata: any): Promise<TransactionType> => {
    const description = (metadata.description || '').toLowerCase();
    
    if (description.includes('salary') || description.includes('client') || description.includes('upwork')) {
      return TransactionType.BUSINESS;
    } else if (description.includes('transfer') || description.includes('refund')) {
      return TransactionType.REFUND;
    } else if (description.includes('loan')) {
      return TransactionType.LOAN;
    }
    
    return TransactionType.PERSONAL;
  }
};