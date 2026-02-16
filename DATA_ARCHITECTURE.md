# Paylockr Data Architecture 🏗️

## Overview
This document describes the **interconnected data model** for Paylockr - a comprehensive tax calculation and financial management system for freelancers. Every data point is meaningfully connected, creating a living financial ecosystem.

---

## Core Principle: Data Integrity Through Relationships

**Every transaction, invoice, expense, and tax entry is linked.** No data exists in isolation.

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  INVOICES   │─────▶│ TRANSACTIONS │─────▶│ BANK ACCOUNT│
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │                      │
       │                     ▼                      │
       │              ┌──────────────┐              │
       └─────────────▶│ SMART TAX    │◀─────────────┘
                      │   VAULT      │
                      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ TAX CALENDAR │
                      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ AI INSIGHTS  │
                      └──────────────┘
```

---

## Data Models

### 1. Transaction
**The central hub of all financial activity**

```typescript
interface Transaction {
  id: string;
  userId: string;
  date: Date;
  amount: number;
  type: 'Business Income' | 'Personal Transfer' | 'Refund' | 'Loan';
  status: 'Pending' | 'Vaulted' | 'Completed' | 'Failed';
  
  // Relationships
  invoiceId?: string;        // Links to Invoice (if business income)
  expenseId?: string;        // Links to Expense (if spending)
  vaultEntryId?: string;     // Links to Smart Tax Vault
  
  // Details
  source: string;
  merchant?: string;
  category: string;
  estimatedTax: number;
  paymentMethod: string;
  referenceId: string;
}
```

**Connections:**
- ✅ Every business income transaction links to an Invoice
- ✅ Every expense transaction links to an Expense record
- ✅ Taxable transactions auto-create Vault entries
- ✅ All transactions update Bank Account balance
- ✅ Triggers notifications on creation

---

### 2. Invoice
**Client billing and revenue tracking**

```typescript
interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  
  // Client Details
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  
  // Line Items
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  
  // Relationships
  paidTransactionId?: string;  // Links to Transaction when paid
}
```

**Connections:**
- ✅ When invoice is paid → creates Transaction
- ✅ Transaction links back to Invoice
- ✅ Due date added to Tax Calendar
- ✅ Payment triggers notification
- ✅ Updates Dashboard revenue metrics

---

### 3. Expense
**Business and personal spending**

```typescript
interface Expense {
  id: string;
  userId: string;
  transactionId: string;     // Always linked to Transaction
  category: string;
  amount: number;
  date: Date;
  description: string;
  merchant: string;
  paymentMethod: string;
  tags: string[];
  deductible: boolean;       // Tax deduction eligibility
}
```

**Categories:**
- Software & Tools (deductible)
- Equipment (deductible)
- Office Supplies (deductible)
- Travel (deductible)
- Internet & Phone (deductible)
- Professional Services (deductible)
- Marketing (deductible)
- Education (deductible)
- Food & Entertainment (partially deductible)
- Personal (non-deductible)

**Connections:**
- ✅ Every expense creates a Transaction
- ✅ Deductible expenses reduce tax liability in Smart Tax Vault
- ✅ Updates Dashboard expense breakdown
- ✅ Analyzed by AI Insights for spending patterns

---

### 4. Smart Tax Vault
**Intelligent tax calculation and management**

```typescript
interface VaultEntry {
  id: string;
  userId: string;
  transactionId: string;     // Links to income transaction
  incomeAmount: number;
  taxAmount: number;
  lockedDate: Date;
  status: 'LOCKED' | 'RELEASED';
}
```

**Logic:**
1. Business income transaction created
2. System calculates estimated tax (10-30% based on amount)
3. Auto-creates VaultEntry
4. Links VaultEntry to Transaction
5. Updates transaction status to 'VAULTED'
6. Deductible expenses reduce total tax liability

**Connections:**
- ✅ Linked to every business Transaction
- ✅ Considers all deductible Expenses
- ✅ Feeds data to Tax Calendar
- ✅ Displayed on Dashboard
- ✅ Analyzed by AI Insights

---

### 5. Tax Calendar
**Deadline tracking with calculated amounts**

```typescript
interface TaxCalendarEntry {
  id: string;
  userId: string;
  type: 'QUARTERLY' | 'ANNUAL' | 'GST' | 'TDS';
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  dueDate: Date;
  amount: number;              // Calculated from Smart Tax Vault
  status: 'UPCOMING' | 'DUE' | 'PAID' | 'OVERDUE';
  taxVaultId?: string;         // Links to Vault
  paidTransactionId?: string;  // Links to payment Transaction
  description: string;
}
```

**Deadlines:**
- Q1 (Apr-Jun): June 15
- Q2 (Jul-Sep): September 15
- Q3 (Oct-Dec): December 15
- Q4 (Jan-Mar): March 15
- Annual ITR: July 31

**Connections:**
- ✅ Amount calculated from Smart Tax Vault balance
- ✅ Payment creates Transaction
- ✅ Triggers notifications 7 days before due
- ✅ Updates when vault balance changes

---

### 6. Bank Account
**Real-time balance tracking**

```typescript
interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountType: 'SAVINGS' | 'CURRENT';
  balance: number;
  lastUpdated: Date;
  isPrimary: boolean;
}
```

**Balance Calculation:**
```
Balance = Starting Balance 
        + All Income Transactions
        - All Expense Transactions
        - Tax Vault Locked Amount
```

**Connections:**
- ✅ Updated by every Transaction
- ✅ Separate account for Tax Vault
- ✅ Displayed on Dashboard
- ✅ Low balance triggers notification

---

### 7. AI Insights
**Cross-module intelligent analysis**

```typescript
interface AIInsight {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE' | 'TAX' | 'CASHFLOW' | 'GROWTH';
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  relatedIds: string[];      // Links to related data
  actionable: boolean;
  createdAt: Date;
}
```

**Insight Types:**

1. **Income Insights**
   - Top client identification
   - Revenue concentration risk
   - Seasonal income patterns

2. **Expense Insights**
   - Overspending alerts
   - Deduction opportunities
   - Cost optimization suggestions

3. **Tax Insights**
   - Annual liability projection
   - Tax bracket analysis
   - Deduction maximization

4. **Cashflow Insights**
   - Monthly income vs expenses
   - Liquidity analysis
   - Payment timing patterns

5. **Growth Insights**
   - Month-over-month revenue
   - Client acquisition trends
   - Profitability analysis

**Connections:**
- ✅ Analyzes all Transactions
- ✅ Considers all Expenses
- ✅ Links to specific Invoices
- ✅ References Tax Vault data
- ✅ Displayed on Dashboard & Insights page

---

### 8. Notifications
**Event-driven alerts**

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}
```

**Triggers:**
- ✅ Transaction created
- ✅ Invoice paid
- ✅ Expense logged
- ✅ Tax deadline approaching (7 days)
- ✅ Low bank balance
- ✅ Unusual spending detected
- ✅ Invoice overdue

---

## Data Flow Examples

### Example 1: Freelancer Receives Payment

```
1. Client pays invoice
   ↓
2. Create Transaction (type: Business Income)
   ↓
3. Link Transaction to Invoice
   ↓
4. Update Invoice status to 'PAID'
   ↓
5. Calculate tax (10% of amount)
   ↓
6. Create VaultEntry with tax amount
   ↓
7. Link VaultEntry to Transaction
   ↓
8. Update Bank Account balance
   ↓
9. Update Dashboard metrics
   ↓
10. AI Insights analyzes client profitability
   ↓
11. Create Notification: "Payment received"
```

### Example 2: Freelancer Logs Expense

```
1. User logs expense (e.g., Adobe subscription)
   ↓
2. System checks if deductible (YES for subscriptions)
   ↓
3. Create Expense record
   ↓
4. Create linked Transaction (type: Personal)
   ↓
5. Update Bank Account balance
   ↓
6. Recalculate Smart Tax Vault (reduce liability)
   ↓
7. Update Tax Calendar amounts
   ↓
8. Update Dashboard expense breakdown
   ↓
9. AI Insights: "Tax deduction applied"
   ↓
10. Create Notification: "Expense logged"
```

### Example 3: Tax Deadline Approaching

```
1. Tax Calendar checks dates daily
   ↓
2. Finds deadline in 7 days
   ↓
3. Gets amount from Smart Tax Vault
   ↓
4. Creates Notification: "₹X due in 7 days"
   ↓
5. AI Insights: "Ensure sufficient balance"
   ↓
6. Dashboard shows alert banner
```

---

## Data Integrity Rules

✅ **Every transaction must link to an invoice OR expense**
✅ **Every invoice must link to a transaction when paid**
✅ **Every expense must be categorized**
✅ **Every business income must create a vault entry**
✅ **Every tax deadline must have a calculated amount**
✅ **All financial data must flow to Dashboard**
✅ **AI Insights must analyze cross-module patterns**
✅ **Notifications must trigger on key events**
✅ **No data is isolated—everything is connected**

---

## Implementation Files

- `src/types/index.ts` - TypeScript interfaces
- `src/utils/multiUserUnifiedData.ts` - Data generation & storage
- `src/services/dataService.ts` - Data operations & relationships
- `src/services/transactionService.ts` - Transaction management
- `src/services/taxService.ts` - Tax calculations

---

## Usage

```typescript
import { getUserData } from '../utils/multiUserUnifiedData';

// Get all interconnected data for user
const data = getUserData('saiyam');

// Access linked data
const transaction = data.transactions[0];
const linkedInvoice = data.invoices.find(i => i.id === transaction.invoiceId);
const vaultEntry = data.vaultEntries.find(v => v.transactionId === transaction.id);
const taxDeadline = data.taxCalendar.find(t => t.taxVaultId === vaultEntry.id);

// Everything is connected!
```

---

## Future Enhancements

- [ ] Real-time bank sync via Plaid/Finicity
- [ ] OCR for receipt scanning
- [ ] Automated invoice generation from contracts
- [ ] ML-based expense categorization
- [ ] Predictive tax planning
- [ ] Multi-currency support
- [ ] GST compliance automation

---

**Built with ❤️ for financial freedom**
