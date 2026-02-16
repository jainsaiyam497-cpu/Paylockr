// Data Integrity Test Suite
// Run this in browser console to verify all relationships

import { getUserData } from './utils/multiUserUnifiedData';

export function runDataIntegrityTests(userId: string = 'saiyam') {
  console.log('🧪 Running Paylockr Data Integrity Tests...\n');
  
  const data = getUserData(userId);
  let passed = 0;
  let failed = 0;

  // Test 1: Transaction-Invoice Links
  console.log('📋 Test 1: Transaction-Invoice Relationships');
  const businessTxns = data.transactions.filter(t => t.type === 'Business Income');
  businessTxns.forEach(txn => {
    const invoice = data.invoices.find(i => i.paidTransactionId === txn.id);
    if (invoice && invoice.id === txn.invoiceId) {
      passed++;
    } else {
      console.error(`❌ Transaction ${txn.id} missing bidirectional invoice link`);
      failed++;
    }
  });
  console.log(`✅ ${businessTxns.length} business transactions verified\n`);

  // Test 2: Transaction-Vault Links
  console.log('🔒 Test 2: Transaction-Vault Relationships');
  const vaultedTxns = data.transactions.filter(t => t.status === 'Vaulted');
  vaultedTxns.forEach(txn => {
    const vault = data.vaultEntries.find(v => v.transactionId === txn.id);
    if (vault && vault.id === txn.vaultEntryId) {
      passed++;
    } else {
      console.error(`❌ Transaction ${txn.id} missing vault entry`);
      failed++;
    }
  });
  console.log(`✅ ${vaultedTxns.length} vaulted transactions verified\n`);

  // Test 3: Expense-Transaction Links
  console.log('💸 Test 3: Expense-Transaction Relationships');
  data.expenses.forEach(expense => {
    const txn = data.transactions.find(t => t.expenseId === expense.id);
    if (txn && txn.id === expense.transactionId) {
      passed++;
    } else {
      console.error(`❌ Expense ${expense.id} missing transaction link`);
      failed++;
    }
  });
  console.log(`✅ ${data.expenses.length} expenses verified\n`);

  // Test 4: Tax Calendar-Vault Links
  console.log('📅 Test 4: Tax Calendar-Vault Relationships');
  const taxEntries = data.taxCalendar.filter(t => t.taxVaultId);
  taxEntries.forEach(entry => {
    const vault = data.vaultEntries.find(v => v.id === entry.taxVaultId);
    if (vault) {
      passed++;
    } else {
      console.error(`❌ Tax entry ${entry.id} missing vault link`);
      failed++;
    }
  });
  console.log(`✅ ${taxEntries.length} tax calendar entries verified\n`);

  // Test 5: AI Insights-Data Links
  console.log('🤖 Test 5: AI Insights Relationships');
  data.aiInsights.forEach(insight => {
    if (insight.relatedIds.length > 0) {
      const hasValidLinks = insight.relatedIds.every(id => {
        return data.transactions.some(t => t.id === id) ||
               data.expenses.some(e => e.id === id) ||
               data.invoices.some(i => i.id === id);
      });
      if (hasValidLinks) {
        passed++;
      } else {
        console.error(`❌ Insight ${insight.id} has invalid related IDs`);
        failed++;
      }
    } else {
      passed++; // Insights without related IDs are valid
    }
  });
  console.log(`✅ ${data.aiInsights.length} AI insights verified\n`);

  // Test 6: Balance Calculations
  console.log('💰 Test 6: Bank Balance Calculations');
  const totalIncome = data.transactions
    .filter(t => t.type === 'Business Income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = data.transactions
    .filter(t => t.type === 'Personal Transfer')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const vaultBalance = data.vaultEntries
    .filter(v => v.status === 'LOCKED')
    .reduce((sum, v) => sum + v.taxAmount, 0);

  if (Math.abs(data.stats.totalIncome - totalIncome) < 1) {
    passed++;
    console.log(`✅ Income calculation correct: ₹${totalIncome.toLocaleString()}`);
  } else {
    failed++;
    console.error(`❌ Income mismatch: ${data.stats.totalIncome} vs ${totalIncome}`);
  }

  if (Math.abs(data.stats.vaultBalance - vaultBalance) < 1) {
    passed++;
    console.log(`✅ Vault balance correct: ₹${vaultBalance.toLocaleString()}`);
  } else {
    failed++;
    console.error(`❌ Vault mismatch: ${data.stats.vaultBalance} vs ${vaultBalance}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Data integrity verified.');
  } else {
    console.log('\n⚠️ Some tests failed. Check errors above.');
  }

  return { passed, failed, total: passed + failed };
}

export function printDataSummary(userId: string = 'saiyam') {
  console.log('📊 Paylockr Data Summary\n');
  
  const data = getUserData(userId);
  
  console.log('USER:', userId);
  console.log('─'.repeat(50));
  
  console.log('\n💰 FINANCIAL OVERVIEW');
  console.log(`Total Income:        ₹${data.stats.totalIncome.toLocaleString()}`);
  console.log(`Total Expenses:      ₹${data.stats.totalExpense.toLocaleString()}`);
  console.log(`Net Profit:          ₹${(data.stats.totalIncome - data.stats.totalExpense).toLocaleString()}`);
  console.log(`Vault Balance:       ₹${data.stats.vaultBalance.toLocaleString()}`);
  console.log(`Available Balance:   ₹${data.stats.availableBalance.toLocaleString()}`);
  
  console.log('\n📈 DATA COUNTS');
  console.log(`Transactions:        ${data.transactions.length}`);
  console.log(`  - Business Income: ${data.transactions.filter(t => t.type === 'Business Income').length}`);
  console.log(`  - Personal:        ${data.transactions.filter(t => t.type === 'Personal Transfer').length}`);
  console.log(`Invoices:            ${data.invoices.length}`);
  console.log(`  - Paid:            ${data.invoices.filter(i => i.status === 'PAID').length}`);
  console.log(`  - Pending:         ${data.invoices.filter(i => i.status !== 'PAID').length}`);
  console.log(`Expenses:            ${data.expenses.length}`);
  console.log(`  - Deductible:      ${data.expenses.filter(e => e.deductible).length}`);
  console.log(`Vault Entries:       ${data.vaultEntries.length}`);
  console.log(`Tax Calendar:        ${data.taxCalendar.length}`);
  console.log(`AI Insights:         ${data.aiInsights.length}`);
  console.log(`Bank Accounts:       ${data.bankAccounts.length}`);
  
  console.log('\n🎯 TOP INSIGHTS');
  data.aiInsights.slice(0, 3).forEach((insight, idx) => {
    console.log(`${idx + 1}. [${insight.priority}] ${insight.title}`);
    console.log(`   ${insight.message.substring(0, 80)}...`);
  });
  
  console.log('\n📅 UPCOMING TAX DEADLINES');
  data.taxCalendar
    .filter(t => t.status === 'UPCOMING' || t.status === 'DUE')
    .slice(0, 3)
    .forEach(deadline => {
      const daysUntil = Math.floor((deadline.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      console.log(`${deadline.description}: ₹${deadline.amount.toLocaleString()} (${daysUntil} days)`);
    });
  
  console.log('\n' + '─'.repeat(50));
}

export function demonstrateRelationships(userId: string = 'saiyam') {
  console.log('🔗 Demonstrating Data Relationships\n');
  
  const data = getUserData(userId);
  
  // Example 1: Follow a transaction through the system
  console.log('📍 Example 1: Following a Business Transaction');
  const businessTxn = data.transactions.find(t => t.type === 'Business Income');
  if (businessTxn) {
    console.log(`\n1. Transaction: ${businessTxn.id}`);
    console.log(`   Amount: ₹${businessTxn.amount.toLocaleString()}`);
    console.log(`   Source: ${businessTxn.source}`);
    
    const invoice = data.invoices.find(i => i.paidTransactionId === businessTxn.id);
    if (invoice) {
      console.log(`\n2. ↓ Links to Invoice: ${invoice.invoiceNumber}`);
      console.log(`   Client: ${invoice.clientName}`);
      console.log(`   Status: ${invoice.status}`);
    }
    
    const vault = data.vaultEntries.find(v => v.transactionId === businessTxn.id);
    if (vault) {
      console.log(`\n3. ↓ Creates Vault Entry: ${vault.id}`);
      console.log(`   Tax Amount: ₹${vault.taxAmount.toLocaleString()}`);
      console.log(`   Status: ${vault.status}`);
    }
    
    const taxEntry = data.taxCalendar.find(t => t.taxVaultId === vault?.id);
    if (taxEntry) {
      console.log(`\n4. ↓ Feeds Tax Calendar: ${taxEntry.description}`);
      console.log(`   Due: ${taxEntry.dueDate.toLocaleDateString()}`);
      console.log(`   Amount: ₹${taxEntry.amount.toLocaleString()}`);
    }
  }
  
  // Example 2: Follow an expense
  console.log('\n\n📍 Example 2: Following an Expense');
  const deductibleExpense = data.expenses.find(e => e.deductible);
  if (deductibleExpense) {
    console.log(`\n1. Expense: ${deductibleExpense.id}`);
    console.log(`   Category: ${deductibleExpense.category}`);
    console.log(`   Amount: ₹${deductibleExpense.amount.toLocaleString()}`);
    console.log(`   Deductible: ✅ YES`);
    
    const txn = data.transactions.find(t => t.expenseId === deductibleExpense.id);
    if (txn) {
      console.log(`\n2. ↓ Creates Transaction: ${txn.id}`);
      console.log(`   Payment Method: ${txn.paymentMethod}`);
      console.log(`   Status: ${txn.status}`);
    }
    
    console.log(`\n3. ↓ Reduces Tax Liability`);
    console.log(`   Deduction: ₹${deductibleExpense.amount.toLocaleString()}`);
    console.log(`   Tax Saved: ₹${Math.round(deductibleExpense.amount * 0.3).toLocaleString()} (approx)`);
  }
  
  console.log('\n' + '─'.repeat(50));
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testPaylockr = {
    runTests: runDataIntegrityTests,
    summary: printDataSummary,
    relationships: demonstrateRelationships
  };
  
  console.log('🎯 Paylockr Test Suite Loaded!');
  console.log('Run these commands in console:');
  console.log('  testPaylockr.runTests()        - Run integrity tests');
  console.log('  testPaylockr.summary()         - View data summary');
  console.log('  testPaylockr.relationships()   - See data relationships');
}
