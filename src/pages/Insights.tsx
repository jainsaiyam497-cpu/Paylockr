import React, { useState } from 'react';
import { Transaction, Expense } from '../types';
import { generateTaxInsights, analyzeExpenses, getTaxSavingTips, calculateFinancialHealth } from '../services/geminiService';
import { Sparkles, TrendingUp, AlertCircle, Loader2, DollarSign, PieChart, Target, Shield, Zap, TrendingDown } from 'lucide-react';
import { Button } from '../components/common/Button';

interface InsightsProps {
  transactions: Transaction[];
  expenses?: Expense[];
  totalIncome?: number;
  vaultBalance?: number;
  taxLiability?: number;
}

export const Insights: React.FC<InsightsProps> = ({ transactions, expenses = [], totalIncome: propIncome, vaultBalance = 0, taxLiability = 0 }) => {
  const [insights, setInsights] = useState<string>('');
  const [expenseAnalysis, setExpenseAnalysis] = useState<string>('');
  const [taxTips, setTaxTips] = useState<string>('');
  const [healthScore, setHealthScore] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalIncome = propIncome || transactions.filter(t => t.type === 'Business Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTax = transactions.reduce((sum, t) => sum + (t.estimatedTax || 0), 0);
  const avgTransaction = totalIncome / (transactions.filter(t => t.type === 'Business Income').length || 1);
  const taxRate = totalIncome > 0 ? ((totalTax / totalIncome) * 100) : 0;

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setLoadingType('insights');
    setError(null);
    try {
      const result = await generateTaxInsights(transactions, totalIncome);
      setInsights(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate insights');
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const handleExpenseAnalysis = async () => {
    setIsLoading(true);
    setLoadingType('expenses');
    try {
      const result = await analyzeExpenses(expenses, totalIncome);
      setExpenseAnalysis(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const handleTaxTips = async () => {
    setIsLoading(true);
    setLoadingType('tips');
    try {
      const result = await getTaxSavingTips(totalIncome, taxRate);
      setTaxTips(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const handleHealthCheck = async () => {
    setIsLoading(true);
    setLoadingType('health');
    try {
      const result = await calculateFinancialHealth({
        income: totalIncome / 12,
        expenses: totalExpense / 12,
        vaultBalance,
        taxLiability
      });
      setHealthScore(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-black border-l-8 border-yellow-400 p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl font-black uppercase text-black dark:text-white">AI TAX INSIGHTS</h1>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">POWERED BY GOOGLE GEMINI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-black border-l-4 border-green-500 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-green-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">TOTAL INCOME</p>
          <p className="text-3xl font-black text-black dark:text-white">{formatIndianCurrency(totalIncome)}</p>
        </div>

        <div className="bg-white dark:bg-black border-l-4 border-red-500 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <PieChart className="w-8 h-8 text-red-400" />
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">ESTIMATED TAX</p>
          <p className="text-3xl font-black text-black dark:text-white">{formatIndianCurrency(totalTax)}</p>
        </div>

        <div className="bg-white dark:bg-black border-l-4 border-cyan-500 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-cyan-400" />
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">TAX RATE</p>
          <p className="text-3xl font-black text-black dark:text-white">{taxRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white dark:bg-black border-l-4 border-yellow-400 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-yellow-400" />
            <DollarSign className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">AVG TRANSACTION</p>
          <p className="text-3xl font-black text-black dark:text-white">{formatIndianCurrency(Math.round(avgTransaction))}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border-l-8 border-yellow-400 p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-yellow-400 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-black" />
        </div>
        <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-3">AI-POWERED FINANCIAL ANALYSIS</h3>
        <p className="text-xs font-bold uppercase text-gray-500 mb-8 max-w-lg mx-auto">
          GET PERSONALIZED INSIGHTS FROM {transactions.length} TRANSACTIONS
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Button onClick={handleGenerateInsights} isLoading={isLoading && loadingType === 'insights'} disabled={transactions.length === 0}>
            <Sparkles className="w-4 h-4 mr-2" />
            TAX INSIGHTS
          </Button>
          <Button onClick={handleExpenseAnalysis} isLoading={isLoading && loadingType === 'expenses'} disabled={expenses.length === 0} variant="outline">
            <PieChart className="w-4 h-4 mr-2" />
            EXPENSES
          </Button>
          <Button onClick={handleTaxTips} isLoading={isLoading && loadingType === 'tips'} variant="outline">
            <Target className="w-4 h-4 mr-2" />
            TAX TIPS
          </Button>
          <Button onClick={handleHealthCheck} isLoading={isLoading && loadingType === 'health'} variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            HEALTH CHECK
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white dark:bg-black border-l-8 border-cyan-500 p-16 text-center shadow-lg">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
          <p className="text-xl font-black uppercase text-black dark:text-white mb-2">ANALYZING YOUR FINANCIAL DATA...</p>
          <p className="text-xs font-bold uppercase text-gray-500">AI IS PROCESSING {transactions.length} TRANSACTIONS</p>
        </div>
      )}

      {error && (
        <div className="bg-white dark:bg-black border-l-8 border-red-500 p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black uppercase text-black dark:text-white mb-2">UNABLE TO GENERATE INSIGHTS</h3>
              <p className="text-xs font-bold uppercase text-gray-500 mb-6">{error}</p>
              <Button variant="outline" onClick={handleGenerateInsights}>
                <Sparkles className="w-4 h-4 mr-2" />
                TRY AGAIN
              </Button>
            </div>
          </div>
        </div>
      )}

      {(insights || expenseAnalysis || taxTips || healthScore) && !isLoading && (
        <div className="space-y-6">
          {insights && (
            <div className="bg-white dark:bg-black border-l-8 border-cyan-500 p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-black dark:text-white">TAX INSIGHTS</h3>
                  <p className="text-xs font-bold uppercase text-gray-500">AI ANALYSIS</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 border-l-4 border-cyan-500">
                <p className="text-black dark:text-white whitespace-pre-line leading-relaxed font-bold">{insights}</p>
              </div>
            </div>
          )}
          
          {expenseAnalysis && (
            <div className="bg-white dark:bg-black border-l-8 border-yellow-400 p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-yellow-400 flex items-center justify-center">
                  <PieChart className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-black dark:text-white">EXPENSE ANALYSIS</h3>
                  <p className="text-xs font-bold uppercase text-gray-500">OPTIMIZATION TIPS</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 border-l-4 border-yellow-400">
                <p className="text-black dark:text-white whitespace-pre-line leading-relaxed font-bold">{expenseAnalysis}</p>
              </div>
            </div>
          )}
          
          {taxTips && (
            <div className="bg-white dark:bg-black border-l-8 border-green-500 p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-500 flex items-center justify-center">
                  <Target className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-black dark:text-white">TAX-SAVING STRATEGIES</h3>
                  <p className="text-xs font-bold uppercase text-gray-500">PERSONALIZED TIPS</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 border-l-4 border-green-500">
                <p className="text-black dark:text-white whitespace-pre-line leading-relaxed font-bold">{taxTips}</p>
              </div>
            </div>
          )}
          
          {healthScore && (
            <div className="bg-white dark:bg-black border-l-8 border-red-500 p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-500 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-black dark:text-white">FINANCIAL HEALTH</h3>
                  <p className="text-xs font-bold uppercase text-gray-500">OVERALL SCORE</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 border-l-4 border-red-500">
                <p className="text-black dark:text-white whitespace-pre-line leading-relaxed text-xl font-black">{healthScore}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleGenerateInsights} isLoading={isLoading && loadingType === 'insights'}>
              <Sparkles className="w-4 h-4 mr-2" />
              REFRESH
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-black border-l-8 border-green-500 p-8 shadow-lg">
        <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-black" />
          </div>
          QUICK TAX-SAVING TIPS
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { tip: 'KEEP 30% OF BUSINESS INCOME ASIDE FOR TAXES IF EARNING > ₹10 LAKH ANNUALLY', color: 'cyan' },
            { tip: 'MAXIMIZE SECTION 80C DEDUCTIONS UP TO ₹1.5 LAKH (PPF, ELSS, ETC.)', color: 'yellow' },
            { tip: 'PAY ADVANCE TAX QUARTERLY TO AVOID INTEREST PENALTIES', color: 'green' },
            { tip: 'MAINTAIN PROPER INVOICES AND RECEIPTS FOR ALL BUSINESS EXPENSES', color: 'red' },
          ].map((item, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 border-l-4 border-${item.color}-500`}>
              <div className={`w-2 h-2 bg-${item.color}-500 mt-2 flex-shrink-0`} />
              <p className="text-black dark:text-white font-bold uppercase text-xs">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;