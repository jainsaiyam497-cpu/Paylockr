# Paylockr System Architecture - Visual Guide

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAYLOCKR ECOSYSTEM                                   │
│                    (All Modules Interconnected)                              │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   USER       │
                              │  (Freelancer)│
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │   INVOICES   │ │ TRANSACTIONS │ │   EXPENSES   │
            │              │ │              │ │              │
            │ • Create     │ │ • Income     │ │ • Business   │
            │ • Send       │ │ • Spending   │ │ • Personal   │
            │ • Track      │ │ • Transfers  │ │ • Deductible │
            └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                   │                │                │
                   │    ┌───────────┴───────────┐    │
                   │    │                       │    │
                   ▼    ▼                       ▼    ▼
            ┌─────────────────────────────────────────────┐
            │         SMART TAX VAULT                     │
            │                                             │
            │  • Auto-calculate tax from income           │
            │  • Apply deductions from expenses           │
            │  • Lock funds for tax payments              │
            │  • Track tax liability                      │
            └─────────────┬───────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────────────────────────┐
            │         TAX CALENDAR                        │
            │                                             │
            │  • Q1, Q2, Q3, Q4 deadlines                 │
            │  • Annual ITR filing                        │
            │  • Amounts from Vault                       │
            │  • Payment tracking                         │
            └─────────────┬───────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────────────────────────┐
            │         BANK ACCOUNTS                       │
            │                                             │
            │  • Primary account (operations)             │
            │  • Tax vault account (locked funds)         │
            │  • Real-time balance                        │
            └─────────────┬───────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────────────────────────┐
            │         DASHBOARD                           │
            │                                             │
            │  • Aggregate all data                       │
            │  • Real-time metrics                        │
            │  • Visual analytics                         │
            └─────────────┬───────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────────────────────────┐
            │         AI INSIGHTS                         │
            │                                             │
            │  • Cross-module analysis                    │
            │  • Pattern detection                        │
            │  • Recommendations                          │
            └─────────────┬───────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────────────────────────┐
            │         NOTIFICATIONS                       │
            │                                             │
            │  • Event-driven alerts                      │
            │  • Deadline reminders                       │
            │  • Anomaly detection                        │
            └─────────────────────────────────────────────┘
```

---

## Data Relationship Map

```
INVOICE
  │
  ├─ id: "INV-001"
  ├─ clientName: "TechCorp"
  ├─ amount: ₹50,000
  ├─ status: "PAID"
  │
  └─ paidTransactionId: "TXN-001" ──────┐
                                        │
                                        ▼
                                   TRANSACTION
                                        │
                                        ├─ id: "TXN-001"
                                        ├─ type: "Business Income"
                                        ├─ amount: ₹50,000
                                        ├─ estimatedTax: ₹5,000
                                        │
                                        ├─ invoiceId: "INV-001" (back-link)
                                        │
                                        └─ vaultEntryId: "VAULT-001" ──────┐
                                                                           │
                                                                           ▼
                                                                      VAULT ENTRY
                                                                           │
                                                                           ├─ id: "VAULT-001"
                                                                           ├─ transactionId: "TXN-001"
                                                                           ├─ incomeAmount: ₹50,000
                                                                           ├─ taxAmount: ₹5,000
                                                                           ├─ status: "LOCKED"
                                                                           │
                                                                           └─ Links to ──────┐
                                                                                            │
                                                                                            ▼
                                                                                    TAX CALENDAR
                                                                                            │
                                                                                            ├─ id: "TAX-Q1"
                                                                                            ├─ type: "QUARTERLY"
                                                                                            ├─ amount: ₹5,000
                                                                                            ├─ dueDate: June 15
                                                                                            │
                                                                                            └─ taxVaultId: "VAULT-001"
```

---

## Expense Flow

```
USER LOGS EXPENSE
      │
      ├─ Category: "SUBSCRIPTIONS"
      ├─ Amount: ₹2,000
      ├─ Merchant: "Adobe"
      │
      ▼
EXPENSE CREATED
      │
      ├─ id: "EXP-001"
      ├─ deductible: true ✅
      │
      └─ Creates ──────────────────┐
                                   │
                                   ▼
                            TRANSACTION
                                   │
                                   ├─ id: "TXN-EXP-001"
                                   ├─ type: "Personal"
                                   ├─ amount: ₹2,000
                                   ├─ expenseId: "EXP-001"
                                   │
                                   └─ Updates ──────────────┐
                                                            │
                                                            ▼
                                                    BANK ACCOUNT
                                                            │
                                                            ├─ Balance: -₹2,000
                                                            │
                                                            └─ Updates ──────────┐
                                                                                 │
                                                                                 ▼
                                                                         SMART TAX VAULT
                                                                                 │
                                                                                 ├─ Deduction: +₹2,000
                                                                                 ├─ Tax Liability: -₹600
                                                                                 │
                                                                                 └─ Updates ──────┐
                                                                                                  │
                                                                                                  ▼
                                                                                          TAX CALENDAR
                                                                                                  │
                                                                                                  └─ Amounts reduced
```

---

## Module Interaction Matrix

```
┌─────────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│   Module    │ Invoice  │   Txn    │ Expense  │  Vault   │ Calendar │   Bank   │
├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Invoice     │    -     │  Links   │    -     │ Triggers │ Triggers │    -     │
│ Transaction │  Links   │    -     │  Links   │ Creates  │    -     │ Updates  │
│ Expense     │    -     │ Creates  │    -     │ Reduces  │    -     │ Updates  │
│ Vault       │    -     │  Links   │ Affected │    -     │  Feeds   │  Locks   │
│ Calendar    │    -     │    -     │    -     │  Reads   │    -     │    -     │
│ Bank        │    -     │ Affected │ Affected │  Holds   │    -     │    -     │
│ AI Insights │ Analyzes │ Analyzes │ Analyzes │ Analyzes │    -     │ Analyzes │
│ Dashboard   │ Displays │ Displays │ Displays │ Displays │ Displays │ Displays │
└─────────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## Real-World Scenario: Complete Flow

```
DAY 1: Create Invoice
  │
  ├─ Invoice #INV-2024-001
  ├─ Client: TechCorp
  ├─ Amount: ₹75,000
  ├─ Due: 30 days
  │
  └─ System Actions:
      ├─ Add to Tax Calendar (due date)
      ├─ Create notification: "Invoice sent"
      └─ Update Dashboard: "1 pending invoice"

DAY 15: Client Pays
  │
  ├─ Payment received: ₹75,000
  │
  └─ System Actions:
      ├─ Create Transaction (TXN-001)
      ├─ Link to Invoice (INV-2024-001)
      ├─ Update Invoice status: PAID
      ├─ Calculate tax: ₹7,500 (10%)
      ├─ Create Vault Entry (VAULT-001)
      ├─ Lock ₹7,500 in tax account
      ├─ Update Bank: +₹75,000 (primary), -₹7,500 (vault)
      ├─ Update Dashboard: Income +₹75,000
      ├─ AI Insight: "TechCorp is top client (40% of income)"
      └─ Notification: "Payment received from TechCorp"

DAY 20: Log Business Expense
  │
  ├─ Adobe Creative Cloud: ₹3,000
  │
  └─ System Actions:
      ├─ Create Expense (EXP-001)
      ├─ Mark as deductible ✅
      ├─ Create Transaction (TXN-EXP-001)
      ├─ Update Bank: -₹3,000
      ├─ Reduce tax liability: ₹7,500 → ₹6,600
      ├─ Update Tax Calendar amounts
      ├─ Update Dashboard: Expenses +₹3,000
      ├─ AI Insight: "₹3,000 deductible expense applied"
      └─ Notification: "Expense logged"

DAY 60: Tax Deadline Approaching
  │
  ├─ Q1 deadline in 7 days
  │
  └─ System Actions:
      ├─ Check Tax Calendar
      ├─ Get amount from Vault: ₹6,600
      ├─ Check Bank balance: ₹45,000 available
      ├─ AI Insight: "Sufficient funds for tax payment"
      └─ Notification: "₹6,600 due in 7 days"

DAY 67: Pay Tax
  │
  ├─ Payment to Income Tax: ₹6,600
  │
  └─ System Actions:
      ├─ Create Transaction (TXN-TAX-001)
      ├─ Link to Tax Calendar entry
      ├─ Update Calendar status: PAID
      ├─ Release Vault funds
      ├─ Update Bank: -₹6,600 (vault account)
      ├─ Update Dashboard: Tax paid
      └─ Notification: "Q1 tax payment completed"
```

---

## Key Principles

1. **Single Source of Truth**
   - Transaction is the central record
   - Everything links to or from transactions

2. **Bidirectional Links**
   - Invoice → Transaction (paidTransactionId)
   - Transaction → Invoice (invoiceId)

3. **Cascading Updates**
   - Change in one module affects all related modules
   - Example: Expense → Transaction → Vault → Calendar

4. **Real-Time Sync**
   - All modules stay in sync automatically
   - No manual reconciliation needed

5. **Audit Trail**
   - Every action is traceable
   - Full history of all financial activity

---

## Data Consistency Checks

```typescript
// Run these checks to verify data integrity

✅ Every business transaction has an invoice
✅ Every paid invoice has a transaction
✅ Every vaulted transaction has a vault entry
✅ Every vault entry has a transaction
✅ Every expense has a transaction
✅ Every transaction updates bank balance
✅ Tax calendar amounts match vault balance
✅ Dashboard stats match sum of all data
✅ AI insights reference valid data IDs
✅ No orphaned records
```

---

**This architecture ensures that Paylockr operates as a unified financial system where every data point is meaningful and connected.**
