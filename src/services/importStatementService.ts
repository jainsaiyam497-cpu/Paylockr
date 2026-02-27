/**
 * importStatementService.ts
 *
 * Converts Gemini Vision ParsedTransaction[] into the app's Transaction[] format.
 * Gemini now supplies `source` and `upi_ref` directly so descriptions are
 * never truncated.
 *
 * Mathematical routing:
 *   credit  → TransactionType.BUSINESS  (income)   → adds to totalIncome + estimatedTax
 *   debit   → TransactionType.PERSONAL  (expense)  → adds to totalExpense
 */

import { Transaction, TransactionType, TransactionStatus } from '../types';
import { ParsedTransaction } from './geminiService';
import { calculateTax } from '../utils/taxCalculator';

// ─────────────────────────────────────────────────────────────────────────────
// Category auto-detection from description + source keywords
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: { keywords: string[]; category: string }[] = [
    { keywords: ['swiggy', 'zomato', 'food', 'restaurant', 'cafe', 'pizza', 'burger', 'blinkit', 'zepto', 'dunzo', 'dominos', 'kfc', 'mcdonalds', 'subway', 'starbucks', 'ccd'], category: 'FOOD' },
    { keywords: ['uber', 'ola', 'rapido', 'metro', 'bus', 'transport', 'flight', 'irctc', 'makemytrip', 'indigo', 'spicejet', 'goibibo', 'yatra', 'redbus', 'bluesmart'], category: 'TRAVEL' },
    { keywords: ['amazon', 'flipkart', 'myntra', 'meesho', 'shopping', 'nykaa', 'ajio', 'tatacliq', 'snapdeal', 'paytmmall', 'shopsy'], category: 'SHOPPING' },
    { keywords: ['netflix', 'spotify', 'hotstar', 'prime', 'jio', 'airtel', 'subscription', 'adobe', 'figma', 'github', 'vercel', 'openai', 'chatgpt', 'youtube', 'apple music', 'gaana'], category: 'SUBSCRIPTIONS' },
    { keywords: ['doctor', 'hospital', 'pharmacy', 'medical', 'health', 'apollo', 'practo', 'cult', '1mg', 'netmeds', 'pharmeasy', 'medlife'], category: 'HEALTHCARE' },
    { keywords: ['salary', 'payroll', 'client', 'upwork', 'freelance', 'invoice', 'techflow', 'designify', 'fiverr', 'toptal', 'payment received', 'consulting'], category: 'FREELANCE' },
    { keywords: ['zerodha', 'groww', 'stocks', 'mutual', 'investment', 'indstocks', 'nse', 'bse', 'ppf', 'sip', 'angelone', 'upstox', 'paytm money', 'kuvera'], category: 'INVESTMENT' },
    { keywords: ['electricity', 'water', 'gas', 'bill', 'utility', 'bsnl', 'bescom', 'msedcl', 'tata power', 'adani', 'broadband', 'wifi'], category: 'UTILITIES' },
    { keywords: ['emi', 'loan', 'mortgage', 'homecredit', 'bajaj', 'hdfc loan', 'icici loan', 'credit card'], category: 'LOAN' },
    { keywords: ['phonepe', 'gpay', 'paytm', 'ppewallet', 'ppw', 'wallet', 'cashback'], category: 'TRANSFER' },
    { keywords: ['upi', 'neft', 'imps', 'rtgs', 'transfer', 'fund transfer'], category: 'TRANSFER' },
];

function detectCategory(description: string, source: string): string {
    const text = ((description || '') + ' ' + (source || '')).toLowerCase();
    for (const { keywords, category } of CATEGORY_KEYWORDS) {
        if (keywords.some(kw => text.includes(kw))) return category;
    }
    return 'OTHER';
}

// ─────────────────────────────────────────────────────────────────────────────
// Source + reference extraction
// Uses Gemini-supplied fields first (no truncation), falls back to regex
// ─────────────────────────────────────────────────────────────────────────────

function resolveSourceAndRef(parsed: ParsedTransaction): { source: string; referenceId?: string } {
    // Primary: use Gemini-extracted fields (exact, no truncation)
    if (parsed.source) {
        return {
            source: parsed.source,
            referenceId: parsed.upi_ref ?? undefined,
        };
    }

    // Fallback: regex parse UPI/DR/REF/NAME/... or UPI/CR/REF/NAME/...
    const upiMatch = parsed.description.match(/^UPI\/(?:CR|DR)\/(\d{10,15})\/([^/]+)/i);
    if (upiMatch) {
        return {
            referenceId: upiMatch[1],
            source: upiMatch[2].trim(),
        };
    }

    // Last resort: use full description as source
    return { source: parsed.description };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main mapping — one ParsedTransaction → one Transaction
// ─────────────────────────────────────────────────────────────────────────────

export function mapParsedToTransaction(parsed: ParsedTransaction, monthlyIncome: number = 0): Transaction {
    const { source, referenceId } = resolveSourceAndRef(parsed);
    const isCredit = parsed.type === 'credit';

    // credit → Business Income  (counted in totalIncome, affects tax)
    // debit  → Personal Transfer (counted in totalExpense)
    const txnType = isCredit ? TransactionType.BUSINESS : TransactionType.PERSONAL;

    // Simplified tax calculation for speed (10% flat rate)
    const estimatedTax = isCredit && parsed.amount > 0 ? Math.round(parsed.amount * 0.1) : 0;

    // Validate and parse date
    let transactionDate = parsed.date || new Date().toISOString().split('T')[0];
    try {
        const dateObj = new Date(transactionDate);
        if (isNaN(dateObj.getTime())) {
            transactionDate = new Date().toISOString().split('T')[0];
        }
    } catch {
        transactionDate = new Date().toISOString().split('T')[0];
    }

    const txn: Transaction = {
        id: `TXN-IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        date: transactionDate,
        source: source || 'Unknown',
        amount: Math.abs(parsed.amount),
        type: txnType,
        status: TransactionStatus.COMPLETED,
        estimatedTax,
        description: parsed.description || 'Transaction',
        referenceId,
        category: detectCategory(parsed.description || '', source || ''),
        notes: parsed.balance !== null && parsed.balance !== undefined
            ? `Balance after: ₹${Number(parsed.balance).toLocaleString('en-IN')}`
            : undefined,
    };

    return txn;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulk import — converts parsed transactions and calls onAdd for each
// ─────────────────────────────────────────────────────────────────────────────

export function importTransactions(
    parsedList: ParsedTransaction[],
    onAdd: (t: Transaction) => void
): { imported: number; transactions: Transaction[] } {
    const result: Transaction[] = [];
    
    // Process transactions without sorting for speed
    for (const parsed of parsedList) {
        if (!parsed.amount || parsed.amount <= 0) continue;  // skip zero-amount rows
        
        const txn = mapParsedToTransaction(parsed, 0); // Skip complex monthly income calculation for speed
        onAdd(txn);
        result.push(txn);
    }

    return { imported: result.length, transactions: result };
}
