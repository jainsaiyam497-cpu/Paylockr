import React, { useState } from 'react';
import { Calendar, Calculator, TrendingUp, Info } from 'lucide-react';

interface TaxManagementProps {
  stats: any; // Receive calculated stats from App.tsx
}

export const TaxManagement: React.FC<TaxManagementProps> = ({ stats }) => {
  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'CALENDAR' | 'PLANNING'>('CALCULATOR');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Derive tax data from real stats or fallback safely
  const grossIncome = stats?.totalIncome || 0;
  // Estimate taxable income (simplified logic for UI display based on stats)
  const taxableIncome = Math.max(0, grossIncome - 75000); // Standard deduction
  const estimatedTax = stats?.vaultBalance || 0; // Using vault balance as proxy for tax liability in this view
  const totalDeductions = 150000; // Mock deduction limit for now, or derive if available

  // Dynamic Slab Calculation based on real gross income
  const calculateSlabAmount = (income: number, min: number, max: number, rate: number) => {
    if (income <= min) return 0;
    const taxableAtThisSlab = Math.min(income, max) - min;
    return taxableAtThisSlab * rate;
  };

  const taxSlabs = [
    { range: '0 - 3L', rate: '0%', amount: 0 },
    { range: '3L - 7L', rate: '5%', amount: calculateSlabAmount(grossIncome, 300000, 700000, 0.05) },
    { range: '7L - 10L', rate: '10%', amount: calculateSlabAmount(grossIncome, 700000, 1000000, 0.10) },
    { range: '10L - 12L', rate: '15%', amount: calculateSlabAmount(grossIncome, 1000000, 1200000, 0.15) },
    { range: '12L - 15L', rate: '20%', amount: calculateSlabAmount(grossIncome, 1200000, 1500000, 0.20) },
    { range: '15L+', rate: '30%', amount: Math.max(0, grossIncome - 1500000) * 0.30 }
  ];

  const importantDates = [
    { date: '31 Jul', title: 'ITR Filing Deadline (if paying tax)', status: 'MISSED', daysLeft: -137 },
    { date: '15 Sep', title: 'Advance Tax Q3', status: 'DONE', daysLeft: -163 },
    { date: '15 Dec', title: 'Advance Tax Q4', status: 'UPCOMING', daysLeft: 10 },
    { date: '31 Jan', title: 'ITR Filing Deadline (Regular)', status: 'UPCOMING', daysLeft: 49 },
    { date: '31 Mar', title: 'Financial Year End', status: 'UPCOMING', daysLeft: 76 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tax Management</h1>

          {/* Tax Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border dark:border-blue-800/30">
              <p className="text-sm text-gray-600 dark:text-blue-300">Gross Income</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(grossIncome)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border dark:border-green-800/30">
              <p className="text-sm text-gray-600 dark:text-green-300">Est. Deductions</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalDeductions)}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border dark:border-orange-800/30">
              <p className="text-sm text-gray-600 dark:text-orange-300">Taxable Income</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(taxableIncome)}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border dark:border-red-800/30">
              <p className="text-sm text-gray-600 dark:text-red-300">Tax Liability (Est)</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(estimatedTax)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b dark:border-slate-800">
        <div className="flex gap-4">
          {['CALCULATOR', 'CALENDAR', 'PLANNING'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab === 'CALCULATOR' && '📊 Calculator'}
              {tab === 'CALENDAR' && '📅 Calendar'}
              {tab === 'PLANNING' && '🎯 Planning'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tax Calculator */}
        {activeTab === 'CALCULATOR' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tax Calculation (New Regime Estimate)</h3>

              {/* Tax Slabs */}
              <div className="space-y-3 mb-8">
                {taxSlabs.map((slab, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{slab.range}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tax Rate: {slab.rate}</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(Math.round(slab.amount))}</p>
                  </div>
                ))}
              </div>

              {/* Total Tax */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <p className="text-blue-100 mb-2">Total Estimated Tax</p>
                <p className="text-4xl font-bold">{formatCurrency(estimatedTax)}</p>
                <p className="text-blue-100 mt-2 text-sm">Effective Tax Rate: {grossIncome > 0 ? ((estimatedTax / grossIncome) * 100).toFixed(2) : 0}%</p>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Standard Deductions</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">Standard Deduction (Salaried)</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(75000)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tax Calendar */}
        {activeTab === 'CALENDAR' && (
          <div className="space-y-4 animate-fade-in">
            {importantDates.map((item, idx) => {
              const statusColors: Record<string, string> = {
                MISSED: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
                DONE: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
                UPCOMING: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              };

              return (
                <div key={idx} className={`rounded-xl border p-6 ${statusColors[item.status]}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <Calendar size={24} className="opacity-80" />
                        <p className="text-2xl font-bold">{item.date}</p>
                      </div>
                      <h4 className="text-lg font-semibold mt-2">{item.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full font-semibold text-sm border bg-white/50 dark:bg-black/20`}>
                        {item.status}
                      </span>
                      {item.daysLeft > 0 && (
                        <p className="text-sm font-medium mt-2 opacity-80">{item.daysLeft} days left</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tax Planning */}
        {activeTab === 'PLANNING' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Tax Optimization Suggestions</h3>
                  <p className="text-gray-600 dark:text-gray-300">Invest ₹50,000 in ELSS to save ₹15,000 in taxes</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Investment Recommendations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">ELSS (Equity Linked Saving Scheme)</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Eligible under Section 80C</p>
                    </div>
                    <Info size={20} className="text-blue-500" />
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">Save upto ₹45,000 tax</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};