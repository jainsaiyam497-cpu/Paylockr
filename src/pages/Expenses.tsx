import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../utils/multiUserUnifiedData';
import { Expense } from '../types';

interface Budget {
  [key: string]: number;
}

interface ExpensesProps {
  expenses: Expense[]; // Changed to expenses prop
}

export const Expenses: React.FC<ExpensesProps> = ({ expenses }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget>({
    FOOD: 5000,
    SHOPPING: 8000,
    TRAVEL: 3000,
    ENTERTAINMENT: 2000,
    UTILITIES: 3000,
    HEALTHCARE: 2000,
    EDUCATION: 5000
  });
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
  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Main Expense Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="mb-6">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">This Month's Spending</p>
              <h2 className="text-4xl font-bold">{formatCurrency(totalMonthlyExpense)}</h2>
              <p className="text-blue-100 text-sm mt-2">Total Budget: {formatCurrency(totalBudget)}</p>
            </div>

            {/* Budget Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium mb-2 text-blue-100">
                <span>Budget Usage</span>
                <span>{budgetPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-900/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetPercentage > 100
                      ? 'bg-red-400'
                      : budgetPercentage > 75
                        ? 'bg-amber-400'
                        : 'bg-green-400'
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-blue-100 font-medium">
              <span>Spent: {formatCurrency(totalMonthlyExpense)}</span>
              <span>
                Remaining:{' '}
                {totalMonthlyExpense > totalBudget
                  ? formatCurrency(0)
                  : formatCurrency(totalBudget - totalMonthlyExpense)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top 3 Expense Categories */}
        {topExpenses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Spending Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topExpenses.map(([category, data]) => {
                const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];
                return (
                  <div key={category} className="bg-white dark:bg-slate-900 rounded-xl p-5 border dark:border-slate-800 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{categoryInfo?.icon}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{category}</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {formatCurrency(data.total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">{data.percentage.toFixed(1)}%</p>
                        <p className="text-xs text-slate-400">{data.count} items</p>
                      </div>
                    </div>

                    {/* Mini Progress */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full`}
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Category Breakdown</h3>
            <button
              onClick={() => setShowBudgetEdit(!showBudgetEdit)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition text-sm"
            >
              {showBudgetEdit ? 'Done' : 'Edit Budgets'}
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
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${categoryInfo?.color}20` }}
                      >
                        {categoryInfo?.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{category}</h4>
                        <p className="text-sm text-slate-500">{data.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(data.total)}</p>
                      <p className="text-sm text-slate-500">{data.percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mb-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 font-medium">Budget: {formatCurrency(data.budget)}</span>
                      <span
                        className={`font-semibold ${
                          data.isOver ? 'text-red-500' : 'text-green-500'
                        }`}
                      >
                        {data.isOver
                          ? `Over by ${formatCurrency(data.total - data.budget)}`
                          : `${formatCurrency(data.remaining)} left`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          budgetPercentage > 100 ? 'bg-red-500' : 
                          budgetPercentage > 75 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget Edit Mode */}
                  {showBudgetEdit && (
                    <div className="mt-3 pt-3 border-t dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">Set Budget:</span>
                        <input
                          type="number"
                          value={budgets[category] || 0}
                          onChange={(e) =>
                            setBudgets({
                              ...budgets,
                              [category]: Number(e.target.value)
                            })
                          }
                          className="flex-1 px-3 py-2 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Expanded View */}
                  {selectedCategory === category && !showBudgetEdit && (
                    <div className="mt-4 pt-4 border-t dark:border-slate-800 animate-fade-in">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent {category} Transactions</h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {monthlyExpenses
                          .filter(e => e.category === category)
                          .slice(0, 5)
                          .map(exp => (
                            <div key={exp.id} className="flex justify-between text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                              <span className="text-slate-700 dark:text-slate-300">{exp.description}</span>
                              <span className="text-slate-900 dark:text-white font-medium">
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

        {/* Spending Insights */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Smart Insights</h3>
          <div className="space-y-3">
            {Object.entries(categorySummary)
              .filter(([, data]) => data.isOver)
              .map(([category, data]) => (
                <div key={category} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-300">
                      Over budget in {category.toLowerCase()}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400/80">
                      You've spent {formatCurrency(data.total - data.budget)} more than your{' '}
                      {formatCurrency(data.budget)} budget
                    </p>
                  </div>
                </div>
              ))}

            {topExpenses[0] && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="text-blue-500 flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-300">Highest spending category</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400/80">
                    {topExpenses[0][0]} accounts for {topExpenses[0][1].percentage.toFixed(1)}% of
                    your spending
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};