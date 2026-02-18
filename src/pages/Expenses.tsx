import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertCircle, Receipt, Camera, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../utils/multiUserUnifiedData';
import { Expense } from '../types';
import { extractExpenseData } from '../services/ocrService';

interface Budget {
  [key: string]: number;
}

interface ExpensesProps {
  expenses: Expense[];
  onAdd?: (expense: Expense) => void;
}

export const Expenses: React.FC<ExpensesProps> = ({ expenses, onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setScanning(true);
    try {
      const expenseData = await extractExpenseData(file);
      
      if (!expenseData.amount || expenseData.amount === 0) {
        alert('❌ Could not extract amount from receipt. Please add manually.');
        setScanning(false);
        e.target.value = '';
        return;
      }
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount: expenseData.amount,
        category: expenseData.category,
        description: expenseData.description,
        date: new Date(expenseData.date),
        merchant: expenseData.description
      };
      onAdd && onAdd(newExpense);
      alert(`✅ Receipt scanned! Added ${expenseData.category} expense of ₹${expenseData.amount}`);
    } catch (error) {
      alert('❌ Failed to scan receipt. Try again.');
    } finally {
      setScanning(false);
      e.target.value = '';
    }
  };
  const [budgets, setBudgets] = useState<Budget>({
    FOOD: 10000,
    SHOPPING: 15000,
    TRAVEL: 8000,
    ENTERTAINMENT: 5000,
    UTILITIES: 6000,
    HEALTHCARE: 4000,
    EDUCATION: 10000
  });
  const [monthlyBudget, setMonthlyBudget] = useState(58000);
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);

  // Calculate monthly expenses
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => e.date >= monthStart);
  }, [expenses]);

  // Calculate summary by category
  const categorySummary = useMemo(() => {
    const summary: Record<
      string,
      {
        total: number;
        count: number;
        percentage: number;
        budget: number;
        remaining: number;
        isOver: boolean;
      }
    > = {};

    let totalExpense = 0;

    monthlyExpenses.forEach(exp => {
      if (!summary[exp.category]) {
        summary[exp.category] = {
          total: 0,
          count: 0,
          percentage: 0,
          budget: budgets[exp.category] || 0,
          remaining: 0,
          isOver: false
        };
      }
      summary[exp.category].total += exp.amount;
      summary[exp.category].count += 1;
      totalExpense += exp.amount;
    });

    Object.keys(summary).forEach(category => {
      const budget = budgets[category] || 0;
      summary[category].percentage = totalExpense > 0 ? (summary[category].total / totalExpense) * 100 : 0;
      summary[category].remaining = Math.max(0, budget - summary[category].total);
      summary[category].isOver = summary[category].total > budget;
    });

    return summary;
  }, [monthlyExpenses, budgets]);

  const totalMonthlyExpense = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = monthlyBudget;
  const budgetPercentage = totalBudget > 0 ? (totalMonthlyExpense / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const topExpenses = Object.entries(categorySummary)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          
          {/* Main Expense Card */}
          <div className="bg-white dark:bg-black border-l-4 sm:border-l-8 border-yellow-400 p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-black dark:text-white">EXPENSES</h2>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase transition flex items-center gap-2 justify-center"
                >
                  <span className="text-xl">+</span> ADD EXPENSE
                </button>
                <label className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-green-500 hover:bg-green-600 text-black font-bold uppercase transition flex items-center gap-2 justify-center cursor-pointer">
                  {scanning ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> SCANNING...</>
                  ) : (
                    <><Camera className="w-4 h-4" /> SCAN RECEIPT</>
                  )}
                  <input type="file" accept="image/*" onChange={handleScanReceipt} className="hidden" disabled={scanning} />
                </label>
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition flex items-center gap-2 justify-center"
                >
                  EDIT BUDGET
                </button>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">THIS MONTH'S SPENDING</p>
              <h2 className="text-4xl font-black text-black dark:text-white">{formatCurrency(totalMonthlyExpense)}</h2>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-2">BUDGET: {formatCurrency(totalBudget)}</p>
            </div>

            {/* Budget Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold uppercase mb-2 text-gray-500">
                <span>BUDGET USAGE</span>
                <span>{budgetPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-900 h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    budgetPercentage > 100
                      ? 'bg-red-500'
                      : budgetPercentage > 75
                        ? 'bg-yellow-400'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-bold uppercase">
              <span>SPENT: {formatCurrency(totalMonthlyExpense)}</span>
              <span>
                LEFT:{' '}
                {totalBudget > 0 && totalMonthlyExpense <= totalBudget
                  ? formatCurrency(totalBudget - totalMonthlyExpense)
                  : formatCurrency(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top 3 Expense Categories */}
        {topExpenses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-black uppercase text-black dark:text-white mb-4">TOP SPENDING</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topExpenses.map(([category, data]) => {
                const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];
                return (
                  <div key={category} className="bg-white dark:bg-black border-b-4 border-cyan-500 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{categoryInfo?.icon}</span>
                          <span className="font-black uppercase text-black dark:text-white">{category}</span>
                        </div>
                        <p className="text-2xl font-black text-black dark:text-white">
                          {formatCurrency(data.total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-bold">{data.percentage.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500 font-bold uppercase">{data.count} ITEMS</p>
                      </div>
                    </div>

                    {/* Mini Progress */}
                    <div className="w-full bg-gray-200 dark:bg-gray-900 h-1.5 overflow-hidden">
                      <div
                        className={`h-full`}
                        style={{
                          width: `${Math.min((data.total / (data.budget || 1)) * 100, 100)}%`,
                          backgroundColor: categoryInfo?.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black uppercase text-black dark:text-white">CATEGORY BREAKDOWN</h3>
            <button
              onClick={() => setShowBudgetEdit(!showBudgetEdit)}
              className="px-4 py-2 bg-yellow-400 text-black font-bold uppercase text-xs hover:bg-yellow-500 transition"
            >
              {showBudgetEdit ? 'SAVE' : 'SET LIMITS'}
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(categorySummary).map(([category, data]) => {
              const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];
              const budgetPercentage = data.budget > 0 ? (data.total / data.budget) * 100 : 0;

              return (
                <div
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className="bg-white dark:bg-black border-l-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer"
                  style={{ borderColor: categoryInfo?.color }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${categoryInfo?.color}20` }}
                      >
                        {categoryInfo?.icon}
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-black dark:text-white">{category}</h4>
                        <p className="text-xs font-bold uppercase text-gray-500">{data.count} TRANSACTIONS</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-black dark:text-white">{formatCurrency(data.total)}</p>
                      <p className="text-xs font-bold uppercase text-gray-500">{data.percentage.toFixed(1)}% OF TOTAL</p>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mb-2 bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500 font-bold uppercase">BUDGET: {formatCurrency(data.budget)}</span>
                      <span
                        className={`font-bold uppercase ${
                          data.isOver ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'
                        }`}
                      >
                        {data.isOver
                          ? `OVER BY ${formatCurrency(data.total - data.budget)}`
                          : `${formatCurrency(data.remaining)} LEFT`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          budgetPercentage > 100 ? 'bg-red-500' : 
                          budgetPercentage > 75 ? 'bg-yellow-400' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget Edit Mode */}
                  {showBudgetEdit && (
                    <div className="mt-3 pt-3 border-t-2 border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase text-gray-500">SET BUDGET:</span>
                        <input
                          type="number"
                          value={budgets[category] || 0}
                          onChange={(e) =>
                            setBudgets({
                              ...budgets,
                              [category]: Number(e.target.value)
                            })
                          }
                          className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-black dark:text-white focus:border-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Expanded View */}
                  {selectedCategory === category && !showBudgetEdit && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-800 animate-fade-in">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">RECENT {category} TRANSACTIONS</h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {monthlyExpenses
                          .filter(e => e.category === category)
                          .slice(0, 5)
                          .map(exp => (
                            <div key={exp.id} className="flex justify-between text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                              <span className="text-gray-400 font-bold">{exp.description}</span>
                              <span className="text-black dark:text-white font-black">
                                {formatCurrency(exp.amount)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border-4 border-yellow-400 w-full max-w-md p-6">
            <h3 className="text-xl font-black uppercase text-black dark:text-white mb-4">ADD NEW EXPENSE</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newExpense: Expense = {
                id: Date.now().toString(),
                amount: Number(formData.get('amount')),
                category: formData.get('category') as string,
                description: formData.get('description') as string,
                date: new Date(formData.get('date') as string),
                merchant: formData.get('merchant') as string
              };
              onAdd && onAdd(newExpense);
              setShowAddModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Amount</label>
                  <input name="amount" type="number" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Category</label>
                  <select name="category" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none">
                    {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Description</label>
                  <input name="description" type="text" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Merchant</label>
                  <input name="merchant" type="text" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Date</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 px-4 py-3 bg-yellow-400 text-black hover:bg-yellow-500 font-bold uppercase transition">ADD</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 font-bold uppercase transition">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border-4 border-cyan-500 w-full max-w-md p-6">
            <h3 className="text-xl font-black uppercase text-black dark:text-white mb-4">EDIT MONTHLY BUDGET</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Total Monthly Budget</label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-cyan-500 outline-none font-bold text-lg"
                />
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-3">
                <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">💡 Set your total monthly expense budget</p>
              </div>
            </div>
            <button onClick={() => setShowBudgetModal(false)} className="w-full mt-6 px-4 py-3 bg-cyan-500 text-black hover:bg-cyan-400 font-bold uppercase transition">SAVE BUDGET</button>
          </div>
        </div>
      )}
    </div>
  );
};