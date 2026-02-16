# Quick Start: Using Paylockr's Interconnected Data System

## Getting User Data

```typescript
import { getUserData, getDashboardStats } from '../utils/multiUserUnifiedData';

// Get complete user data (all modules interconnected)
const userData = getUserData('saiyam');

console.log(userData);
// {
//   transactions: Transaction[],
//   expenses: Expense[],
//   invoices: Invoice[],
//   vaultEntries: VaultEntry[],
//   bankAccounts: BankAccount[],
//   taxCalendar: TaxCalendarEntry[],
//   aiInsights: AIInsight[],
//   stats: { ... }
// }
```

## Following Data Relationships

### 1. From Transaction to Invoice

```typescript
// Get a business income transaction
const transaction = userData.transactions.find(
  t => t.type === 'Business Income'
);

// Find the linked invoice
const invoice = userData.invoices.find(
  i => i.paidTransactionId === transaction.id
);

console.log(`Transaction ${transaction.id} paid invoice ${invoice.invoiceNumber}`);
```

### 2. From Transaction to Vault Entry

```typescript
// Get a vaulted transaction
const vaultedTxn = userData.transactions.find(
  t => t.status === 'Vaulted'
);

// Find the vault entry
const vaultEntry = userData.vaultEntries.find(
  v => v.transactionId === vaultedTxn.id
);

console.log(`₹${vaultEntry.taxAmount} locked for tax from ₹${vaultEntry.incomeAmount} income`);
```

### 3. From Expense to Transaction

```typescript
// Get an expense
const expense = userData.expenses[0];

// Find the linked transaction
const expenseTxn = userData.transactions.find(
  t => t.expenseId === expense.id
);

console.log(`Expense ${expense.description} paid via ${expenseTxn.paymentMethod}`);
```

### 4. From Tax Calendar to Vault

```typescript
// Get upcoming tax deadline
const deadline = userData.taxCalendar.find(
  t => t.status === 'UPCOMING'
);

// Find linked vault entries
const vaultTotal = userData.vaultEntries
  .filter(v => v.status === 'LOCKED')
  .reduce((sum, v) => sum + v.taxAmount, 0);

console.log(`₹${deadline.amount} due on ${deadline.dueDate}`);
console.log(`Current vault balance: ₹${vaultTotal}`);
```

### 5. AI Insights with Related Data

```typescript
// Get high priority insights
const criticalInsights = userData.aiInsights.filter(
  i => i.priority === 'HIGH'
);

criticalInsights.forEach(insight => {
  console.log(`⚠️ ${insight.title}`);
  console.log(insight.message);
  
  // Get related transactions
  const relatedTxns = userData.transactions.filter(
    t => insight.relatedIds.includes(t.id)
  );
  
  console.log(`Related to ${relatedTxns.length} transactions`);
});
```

## Dashboard Integration

```typescript
import { getDashboardStats } from '../utils/multiUserUnifiedData';

const stats = getDashboardStats('saiyam');

// Display key metrics
console.log(`Total Income: ₹${stats.totalIncome.toLocaleString()}`);
console.log(`Total Expenses: ₹${stats.totalExpense.toLocaleString()}`);
console.log(`Vault Balance: ₹${stats.vaultBalance.toLocaleString()}`);
console.log(`Available Balance: ₹${stats.availableBalance.toLocaleString()}`);
console.log(`Net Taxable Income: ₹${stats.netTaxableIncome.toLocaleString()}`);
console.log(`Projected Tax: ₹${stats.projectedTaxLiability.toLocaleString()}`);
```

## Creating New Data (with Auto-Linking)

### Create Invoice → Auto-links to Tax Calendar

```typescript
import dataService from '../services/dataService';

const newInvoice = dataService.createInvoice('saiyam', {
  clientName: 'TechCorp',
  clientEmail: 'billing@techcorp.com',
  amount: 50000,
  items: [{
    id: '1',
    description: 'Web Development Services',
    quantity: 1,
    rate: 50000,
    amount: 50000
  }]
});

// System automatically:
// ✅ Creates invoice
// ✅ Adds due date to Tax Calendar
// ✅ Creates notification
```

### Record Payment → Auto-links Everything

```typescript
const payment = dataService.createTransaction('saiyam', {
  type: 'Business Income',
  amount: 50000,
  source: 'TechCorp',
  invoiceId: newInvoice.id
});

// System automatically:
// ✅ Creates transaction
// ✅ Links to invoice
// ✅ Updates invoice status to 'PAID'
// ✅ Calculates tax (₹5,000)
// ✅ Creates vault entry
// ✅ Updates bank balance
// ✅ Updates dashboard
// ✅ Triggers AI analysis
// ✅ Creates notification
```

### Log Expense → Auto-deducts from Tax

```typescript
const expense = dataService.createExpense('saiyam', {
  category: 'SUBSCRIPTIONS',
  amount: 2000,
  merchant: 'Adobe Creative Cloud',
  description: 'Monthly subscription'
});

// System automatically:
// ✅ Creates expense
// ✅ Creates linked transaction
// ✅ Marks as deductible (subscriptions are business expenses)
// ✅ Reduces tax liability in vault
// ✅ Updates tax calendar amounts
// ✅ Updates bank balance
// ✅ Updates dashboard
// ✅ Creates notification
```

## Component Usage Examples

### In Dashboard Component

```typescript
import { getUserData } from '../utils/multiUserUnifiedData';

function Dashboard() {
  const userData = getUserData(currentUserId);
  
  return (
    <div>
      {/* Income Overview */}
      <StatCard 
        title="Total Income"
        value={userData.stats.totalIncome}
        transactions={userData.transactions.filter(t => t.type === 'Business Income')}
      />
      
      {/* Vault Status */}
      <VaultCard
        balance={userData.stats.vaultBalance}
        entries={userData.vaultEntries}
        nextDeadline={userData.taxCalendar.find(t => t.status === 'UPCOMING')}
      />
      
      {/* AI Insights */}
      <InsightsPanel insights={userData.aiInsights} />
    </div>
  );
}
```

### In Transactions Page

```typescript
function Transactions() {
  const userData = getUserData(currentUserId);
  
  return (
    <TransactionList>
      {userData.transactions.map(txn => {
        // Get related data
        const invoice = userData.invoices.find(i => i.paidTransactionId === txn.id);
        const expense = userData.expenses.find(e => e.transactionId === txn.id);
        const vaultEntry = userData.vaultEntries.find(v => v.transactionId === txn.id);
        
        return (
          <TransactionRow
            transaction={txn}
            linkedInvoice={invoice}
            linkedExpense={expense}
            vaultEntry={vaultEntry}
          />
        );
      })}
    </TransactionList>
  );
}
```

### In Tax Calendar Page

```typescript
function TaxCalendar() {
  const userData = getUserData(currentUserId);
  
  return (
    <Calendar>
      {userData.taxCalendar.map(deadline => {
        // Get vault balance for this deadline
        const vaultBalance = userData.vaultEntries
          .filter(v => v.status === 'LOCKED')
          .reduce((sum, v) => sum + v.taxAmount, 0);
        
        const isSufficient = vaultBalance >= deadline.amount;
        
        return (
          <DeadlineCard
            deadline={deadline}
            vaultBalance={vaultBalance}
            sufficient={isSufficient}
            daysUntilDue={Math.floor((deadline.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
          />
        );
      })}
    </Calendar>
  );
}
```

### In AI Insights Page

```typescript
function Insights() {
  const userData = getUserData(currentUserId);
  
  return (
    <div>
      {userData.aiInsights.map(insight => {
        // Get related data based on insight type
        let relatedData = [];
        
        if (insight.type === 'INCOME') {
          relatedData = userData.transactions.filter(
            t => insight.relatedIds.includes(t.id)
          );
        } else if (insight.type === 'EXPENSE') {
          relatedData = userData.expenses.filter(
            e => insight.relatedIds.includes(e.id)
          );
        }
        
        return (
          <InsightCard
            insight={insight}
            relatedData={relatedData}
            onViewDetails={() => navigateToRelatedData(insight)}
          />
        );
      })}
    </div>
  );
}
```

## Data Persistence

All data is automatically saved to localStorage:

```typescript
// Data is saved automatically when generated
const userData = getUserData('saiyam');

// To force refresh (regenerate data)
localStorage.removeItem('PAYLOCKR_USER_DATA');
window.location.reload();
```

## Testing Data Relationships

```typescript
// Verify all relationships are intact
function verifyDataIntegrity(userId: string) {
  const data = getUserData(userId);
  
  // Check transaction-invoice links
  const businessTxns = data.transactions.filter(t => t.type === 'Business Income');
  businessTxns.forEach(txn => {
    const invoice = data.invoices.find(i => i.paidTransactionId === txn.id);
    console.assert(invoice, `Transaction ${txn.id} missing invoice link`);
  });
  
  // Check transaction-vault links
  const vaultedTxns = data.transactions.filter(t => t.status === 'Vaulted');
  vaultedTxns.forEach(txn => {
    const vault = data.vaultEntries.find(v => v.transactionId === txn.id);
    console.assert(vault, `Transaction ${txn.id} missing vault entry`);
  });
  
  // Check expense-transaction links
  data.expenses.forEach(expense => {
    const txn = data.transactions.find(t => t.expenseId === expense.id);
    console.assert(txn, `Expense ${expense.id} missing transaction link`);
  });
  
  console.log('✅ All data relationships verified!');
}
```

---

## Key Takeaways

1. **Everything is connected** - No isolated data
2. **Auto-linking** - System maintains relationships automatically
3. **Bidirectional** - Can navigate from any data point to related data
4. **Real-time** - Changes propagate across all modules
5. **Traceable** - Full audit trail of all financial activity

**The system is designed to work like a real financial organism where every action has cascading effects across all modules.**
