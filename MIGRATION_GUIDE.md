# Migration Guide: Integrating Interconnected Data System

## Overview
This guide helps you integrate the new interconnected data system into your existing Paylockr components.

---

## Step 1: Update Imports

### Before
```typescript
import { dummyTransactions } from '../utils/dummyData';
```

### After
```typescript
import { getUserData } from '../utils/multiUserUnifiedData';
```

---

## Step 2: Component Updates

### Dashboard Component

**Before:**
```typescript
function Dashboard() {
  const [transactions] = useState(dummyTransactions);
  
  return (
    <div>
      <Stats totalIncome={150000} totalExpense={45000} />
    </div>
  );
}
```

**After:**
```typescript
function Dashboard() {
  const currentUserId = 'saiyam'; // Get from auth context
  const userData = getUserData(currentUserId);
  
  return (
    <div>
      <Stats 
        totalIncome={userData.stats.totalIncome}
        totalExpense={userData.stats.totalExpense}
        vaultBalance={userData.stats.vaultBalance}
        availableBalance={userData.stats.availableBalance}
      />
      
      {/* New: AI Insights Section */}
      <AIInsightsPanel insights={userData.aiInsights} />
      
      {/* New: Tax Calendar Preview */}
      <TaxDeadlineAlert 
        nextDeadline={userData.taxCalendar.find(t => t.status === 'UPCOMING')}
        vaultBalance={userData.stats.vaultBalance}
      />
      
      <RecentTransactions transactions={userData.transactions.slice(0, 10)} />
    </div>
  );
}
```

---

### Transactions Component

**Before:**
```typescript
function Transactions() {
  const [transactions] = useState(dummyTransactions);
  
  return (
    <TransactionList>
      {transactions.map(txn => (
        <TransactionRow key={txn.id} transaction={txn} />
      ))}
    </TransactionList>
  );
}
```

**After:**
```typescript
function Transactions() {
  const currentUserId = 'saiyam';
  const userData = getUserData(currentUserId);
  
  return (
    <div>
      {/* Filter Options */}
      <Filters 
        categories={['All', 'Business Income', 'Personal Transfer']}
        onFilter={(type) => {
          // Filter logic
        }}
      />
      
      <TransactionList>
        {userData.transactions.map(txn => {
          // Get related data
          const invoice = userData.invoices.find(i => i.paidTransactionId === txn.id);
          const expense = userData.expenses.find(e => e.transactionId === txn.id);
          const vaultEntry = userData.vaultEntries.find(v => v.transactionId === txn.id);
          
          return (
            <TransactionRow 
              key={txn.id} 
              transaction={txn}
              linkedInvoice={invoice}
              linkedExpense={expense}
              vaultEntry={vaultEntry}
              onViewDetails={() => {
                // Show modal with all related data
                showTransactionDetails(txn, invoice, expense, vaultEntry);
              }}
            />
          );
        })}
      </TransactionList>
    </div>
  );
}
```

---

### Invoices Component

**Before:**
```typescript
function Invoices() {
  const [invoices, setInvoices] = useState([]);
  
  return (
    <InvoiceList>
      {invoices.map(inv => (
        <InvoiceCard key={inv.id} invoice={inv} />
      ))}
    </InvoiceList>
  );
}
```

**After:**
```typescript
function Invoices() {
  const currentUserId = 'saiyam';
  const userData = getUserData(currentUserId);
  
  // Separate by status
  const paidInvoices = userData.invoices.filter(i => i.status === 'PAID');
  const pendingInvoices = userData.invoices.filter(i => i.status === 'SENT' || i.status === 'VIEWED');
  const overdueInvoices = userData.invoices.filter(i => i.status === 'OVERDUE');
  
  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Paid" count={paidInvoices.length} amount={paidInvoices.reduce((s, i) => s + i.amount, 0)} />
        <StatCard title="Pending" count={pendingInvoices.length} amount={pendingInvoices.reduce((s, i) => s + i.amount, 0)} />
        <StatCard title="Overdue" count={overdueInvoices.length} amount={overdueInvoices.reduce((s, i) => s + i.amount, 0)} />
      </div>
      
      {/* Invoice List */}
      <InvoiceList>
        {userData.invoices.map(invoice => {
          // Get payment transaction if paid
          const payment = invoice.paidTransactionId 
            ? userData.transactions.find(t => t.id === invoice.paidTransactionId)
            : null;
          
          return (
            <InvoiceCard 
              key={invoice.id} 
              invoice={invoice}
              paymentTransaction={payment}
              onMarkPaid={(txnId) => {
                // Link invoice to transaction
                invoice.paidTransactionId = txnId;
                invoice.status = 'PAID';
              }}
            />
          );
        })}
      </InvoiceList>
    </div>
  );
}
```

---

### Expenses Component

**Before:**
```typescript
function Expenses() {
  const [expenses, setExpenses] = useState([]);
  
  return (
    <ExpenseList>
      {expenses.map(exp => (
        <ExpenseCard key={exp.id} expense={exp} />
      ))}
    </ExpenseList>
  );
}
```

**After:**
```typescript
function Expenses() {
  const currentUserId = 'saiyam';
  const userData = getUserData(currentUserId);
  
  // Calculate deductible vs non-deductible
  const deductibleExpenses = userData.expenses.filter(e => e.deductible);
  const totalDeductible = deductibleExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  return (
    <div>
      {/* Deduction Summary */}
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h3 className="font-bold text-green-800">Tax Deductions</h3>
        <p className="text-2xl font-bold text-green-600">₹{totalDeductible.toLocaleString()}</p>
        <p className="text-sm text-green-700">
          {deductibleExpenses.length} deductible expenses • 
          Estimated tax saved: ₹{Math.round(totalDeductible * 0.3).toLocaleString()}
        </p>
      </div>
      
      {/* Category Breakdown */}
      <ExpenseCategoryChart expenses={userData.expenses} />
      
      {/* Expense List */}
      <ExpenseList>
        {userData.expenses.map(expense => {
          // Get linked transaction
          const transaction = userData.transactions.find(t => t.expenseId === expense.id);
          
          return (
            <ExpenseCard 
              key={expense.id} 
              expense={expense}
              transaction={transaction}
              showDeductibleBadge={expense.deductible}
            />
          );
        })}
      </ExpenseList>
    </div>
  );
}
```

---

### Smart Tax Vault Component

**Before:**
```typescript
function SmartTaxVault() {
  const [vaultBalance] = useState(45000);
  
  return (
    <div>
      <h2>Vault Balance: ₹{vaultBalance.toLocaleString()}</h2>
    </div>
  );
}
```

**After:**
```typescript
function SmartTaxVault() {
  const currentUserId = 'saiyam';
  const userData = getUserData(currentUserId);
  
  const lockedEntries = userData.vaultEntries.filter(v => v.status === 'LOCKED');
  const totalLocked = lockedEntries.reduce((sum, v) => sum + v.taxAmount, 0);
  
  return (
    <div>
      {/* Vault Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-xl text-white">
        <h2 className="text-3xl font-bold mb-2">₹{totalLocked.toLocaleString()}</h2>
        <p>Total Tax Reserved</p>
        <p className="text-sm opacity-80">{lockedEntries.length} entries locked</p>
      </div>
      
      {/* Tax Projection */}
      <div className="mt-6 p-6 bg-white rounded-xl shadow">
        <h3 className="font-bold mb-4">Tax Liability Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Gross Income</span>
            <span className="font-bold">₹{userData.stats.totalIncome.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Deductible Expenses</span>
            <span className="font-bold">-₹{userData.stats.deductibleExpenses?.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span>Net Taxable Income</span>
            <span className="font-bold">₹{userData.stats.netTaxableIncome?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-purple-600">
            <span>Projected Tax (30%)</span>
            <span className="font-bold">₹{userData.stats.projectedTaxLiability?.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Vault Entries */}
      <div className="mt-6">
        <h3 className="font-bold mb-4">Locked Entries</h3>
        {lockedEntries.map(entry => {
          const transaction = userData.transactions.find(t => t.id === entry.transactionId);
          return (
            <VaultEntryCard 
              key={entry.id}
              entry={entry}
              transaction={transaction}
            />
          );
        })}
      </div>
    </div>
  );
}
```

---

### Tax Calendar Component

**Before:**
```typescript
function TaxCalendar() {
  const deadlines = [
    { quarter: 'Q1', date: 'June 15', amount: 15000 }
  ];
  
  return (
    <Calendar>
      {deadlines.map(d => (
        <DeadlineCard key={d.quarter} deadline={d} />
      ))}
    </Calendar>
  );
}
```

**After:**
```typescript
function TaxCalendar() {
  const currentUserId = 'saiyam';
  const userData = getUserData(currentUserId);
  
  const upcomingDeadlines = userData.taxCalendar.filter(t => t.status === 'UPCOMING' || t.status === 'DUE');
  const paidDeadlines = userData.taxCalendar.filter(t => t.status === 'PAID');
  
  return (
    <div>
      {/* Calendar Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard 
          title="Upcoming Payments"
          value={upcomingDeadlines.reduce((sum, d) => sum + d.amount, 0)}
          count={upcomingDeadlines.length}
        />
        <StatCard 
          title="Paid This Year"
          value={paidDeadlines.reduce((sum, d) => sum + d.amount, 0)}
          count={paidDeadlines.length}
        />
      </div>
      
      {/* Deadline List */}
      <div className="space-y-4">
        {userData.taxCalendar.map(deadline => {
          const daysUntil = Math.floor((deadline.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const isUrgent = daysUntil <= 7 && daysUntil > 0;
          const vaultSufficient = userData.stats.vaultBalance >= deadline.amount;
          
          return (
            <DeadlineCard 
              key={deadline.id}
              deadline={deadline}
              daysUntil={daysUntil}
              isUrgent={isUrgent}
              vaultBalance={userData.stats.vaultBalance}
              sufficient={vaultSufficient}
              onMarkPaid={(txnId) => {
                deadline.status = 'PAID';
                deadline.paidTransactionId = txnId;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
```

---

### NEW: AI Insights Component

```typescript
function AIInsights() {
  const currentUserId = 'saiyam';
  const userData = getUserData(currentUserId);
  
  // Group by priority
  const highPriority = userData.aiInsights.filter(i => i.priority === 'HIGH');
  const mediumPriority = userData.aiInsights.filter(i => i.priority === 'MEDIUM');
  const lowPriority = userData.aiInsights.filter(i => i.priority === 'LOW');
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI-Powered Insights</h1>
      
      {/* High Priority Alerts */}
      {highPriority.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Requires Attention</h2>
          {highPriority.map(insight => (
            <InsightCard 
              key={insight.id}
              insight={insight}
              variant="danger"
              onViewDetails={() => {
                // Navigate to related data
                if (insight.type === 'INCOME') {
                  const relatedTxns = userData.transactions.filter(t => insight.relatedIds.includes(t.id));
                  showTransactionModal(relatedTxns);
                }
              }}
            />
          ))}
        </div>
      )}
      
      {/* Medium Priority */}
      {mediumPriority.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-yellow-600 mb-4">💡 Recommendations</h2>
          {mediumPriority.map(insight => (
            <InsightCard 
              key={insight.id}
              insight={insight}
              variant="warning"
            />
          ))}
        </div>
      )}
      
      {/* Low Priority */}
      {lowPriority.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4">📊 Insights</h2>
          {lowPriority.map(insight => (
            <InsightCard 
              key={insight.id}
              insight={insight}
              variant="info"
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Step 3: Create Reusable Components

### InsightCard Component
```typescript
interface InsightCardProps {
  insight: AIInsight;
  variant: 'danger' | 'warning' | 'info';
  onViewDetails?: () => void;
}

function InsightCard({ insight, variant, onViewDetails }: InsightCardProps) {
  const colors = {
    danger: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50'
  };
  
  const icons = {
    INCOME: '💰',
    EXPENSE: '💸',
    TAX: '📊',
    CASHFLOW: '💵',
    GROWTH: '📈'
  };
  
  return (
    <div className={`p-6 rounded-xl border-2 ${colors[variant]} mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icons[insight.type]}</span>
            <h3 className="font-bold text-lg">{insight.title}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-white">
              {insight.priority}
            </span>
          </div>
          <p className="text-gray-700">{insight.message}</p>
          {insight.relatedIds.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Related to {insight.relatedIds.length} transactions
            </p>
          )}
        </div>
        {insight.actionable && onViewDetails && (
          <button 
            onClick={onViewDetails}
            className="ml-4 px-4 py-2 bg-white rounded-lg hover:shadow"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Step 4: Testing

After migration, test each component:

```typescript
// In browser console
import { runDataIntegrityTests } from './utils/dataIntegrityTests';

// Run tests
runDataIntegrityTests('saiyam');

// View summary
printDataSummary('saiyam');

// See relationships
demonstrateRelationships('saiyam');
```

---

## Step 5: Common Patterns

### Pattern 1: Get Related Data
```typescript
const transaction = userData.transactions[0];
const invoice = userData.invoices.find(i => i.paidTransactionId === transaction.id);
const vault = userData.vaultEntries.find(v => v.transactionId === transaction.id);
```

### Pattern 2: Filter by Status
```typescript
const paidInvoices = userData.invoices.filter(i => i.status === 'PAID');
const lockedVault = userData.vaultEntries.filter(v => v.status === 'LOCKED');
const upcomingTax = userData.taxCalendar.filter(t => t.status === 'UPCOMING');
```

### Pattern 3: Calculate Totals
```typescript
const totalIncome = userData.transactions
  .filter(t => t.type === 'Business Income')
  .reduce((sum, t) => sum + t.amount, 0);
```

---

## Checklist

- [ ] Update all imports to use `getUserData`
- [ ] Replace hardcoded data with `userData.*`
- [ ] Add related data lookups (invoice ↔ transaction)
- [ ] Display AI insights on relevant pages
- [ ] Show tax calendar deadlines
- [ ] Add deductible expense indicators
- [ ] Test all data relationships
- [ ] Verify calculations are correct
- [ ] Check that all links work

---

**Migration complete! Your components now use the fully interconnected data system.** 🎉
