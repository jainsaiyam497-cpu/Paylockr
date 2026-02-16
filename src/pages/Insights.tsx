import React, { useState } from 'react';
import { Transaction } from '../types';
import { generateTaxInsights } from '../services/geminiService';
import { Sparkles, TrendingUp, AlertCircle, Loader2, DollarSign, PieChart, Target, Shield, Zap, TrendingDown } from 'lucide-react';
import { Button } from '../components/common/Button';

interface InsightsProps {
  transactions: Transaction[];
}

export const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalIncome = transactions.filter(t => t.type === 'Business Income').reduce((sum, t) => sum + t.amount, 0);
  const totalTax = transactions.reduce((sum, t) => sum + (t.estimatedTax || 0), 0);
  const avgTransaction = totalIncome / (transactions.filter(t => t.type === 'Business Income').length || 1);
  const taxRate = totalIncome > 0 ? ((totalTax / totalIncome) * 100) : 0;

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateTaxInsights(transactions, totalIncome);
      setInsights(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black">AI Tax Insights</h1>
          </div>
          <p className="text-indigo-100 text-lg font-medium">Powered by Google Gemini • Get personalized tax recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Total Income</p>
          <p className="text-3xl font-black">₹{totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <PieChart className="w-8 h-8 opacity-80" />
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-orange-100 text-sm font-medium mb-1">Estimated Tax</p>
          <p className="text-3xl font-black">₹{totalTax.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 opacity-80" />
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Tax Rate</p>
          <p className="text-3xl font-black">{taxRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 opacity-80" />
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-purple-100 text-sm font-medium mb-1">Avg Transaction</p>
          <p className="text-3xl font-black">₹{Math.round(avgTransaction).toLocaleString()}</p>
        </div>
      </div>

      {!insights && !error && (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold dark:text-white mb-3">Ready for AI-Powered Analysis?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto text-lg">
            Our AI will analyze your {transactions.length} transactions and provide personalized tax-saving recommendations
          </p>
          <Button
            onClick={handleGenerateInsights}
            isLoading={isLoading}
            disabled={transactions.length === 0}
            size="lg"
            className="mx-auto shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate AI Insights
          </Button>
          {transactions.length === 0 && (
            <p className="text-sm text-slate-400 mt-4">Add some transactions first to get insights</p>
          )}
        </div>
      )}

      {isLoading && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-16 rounded-2xl shadow-lg border border-indigo-200 dark:border-indigo-800 text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
          <p className="text-xl text-slate-700 dark:text-slate-300 font-bold mb-2">Analyzing your financial data...</p>
          <p className="text-slate-500 dark:text-slate-400">AI is processing {transactions.length} transactions</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 p-8 rounded-2xl shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">Unable to Generate Insights</h3>
              <p className="text-red-700 dark:text-red-400 mb-6">{error}</p>
              <Button variant="outline" onClick={handleGenerateInsights}>
                <Sparkles className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {insights && !isLoading && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold dark:text-white">Your Personalized Tax Insights</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">Generated by AI</p>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
              <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed text-lg">
                {insights}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleGenerateInsights} isLoading={isLoading} size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Regenerate Insights
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border dark:border-slate-700">
        <h3 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          Quick Tax-Saving Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { tip: 'Keep 30% of business income aside for taxes if earning &gt; ₹10 lakh annually', color: 'blue' },
            { tip: 'Maximize Section 80C deductions up to ₹1.5 lakh (PPF, ELSS, etc.)', color: 'purple' },
            { tip: 'Pay advance tax quarterly to avoid interest penalties', color: 'orange' },
            { tip: 'Maintain proper invoices and receipts for all business expenses', color: 'green' },
          ].map((item, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-xl border border-${item.color}-200 dark:border-${item.color}-800`}>
              <div className={`w-2 h-2 bg-${item.color}-600 rounded-full mt-2 flex-shrink-0`} />
              <p className="text-slate-700 dark:text-slate-300">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;