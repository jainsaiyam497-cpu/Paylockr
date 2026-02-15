import React from 'react';
import { TrendingUp, Calculator, Lock, Wallet } from 'lucide-react';

interface StatsProps {
  totalIncome: number;
  estimatedTax: number;
  vaultBalance: number;
  spendable: number;
  isDarkMode: boolean;
}

export const Stats: React.FC<StatsProps> = ({ totalIncome, estimatedTax, vaultBalance, spendable, isDarkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} flex items-center justify-center`}>
            <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'}`}>
            +12.5%
          </span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Total Income</p>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalIncome.toLocaleString('en-IN')}</p>
      </div>

      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} flex items-center justify-center`}>
            <Calculator className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>
            ~10%
          </span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Estimated Tax</p>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{estimatedTax.toLocaleString('en-IN')}</p>
      </div>

      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} flex items-center justify-center`}>
            <Lock className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'}`}>
            Secured
          </span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Vault Balance</p>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{vaultBalance.toLocaleString('en-IN')}</p>
      </div>

      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'} flex items-center justify-center`}>
            <Wallet className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
            Available
          </span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Spendable</p>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{spendable.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};