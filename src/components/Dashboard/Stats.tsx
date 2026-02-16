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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className={`${isDarkMode ? 'bg-black border-b-4 border-yellow-400 hover:border-yellow-300' : 'bg-white border-b-4 border-yellow-400 hover:border-yellow-500'} p-6 transition-all group`}>
        <div className="flex items-center justify-between mb-4">
          <TrendingUp className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider bg-green-500 text-black px-3 py-1">
            +12.5%
          </span>
        </div>
        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>TOTAL INCOME</p>
        <p className={`text-3xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{totalIncome.toLocaleString('en-IN')}</p>
      </div>

      <div className={`${isDarkMode ? 'bg-black border-b-4 border-cyan-500 hover:border-cyan-400' : 'bg-white border-b-4 border-cyan-500 hover:border-cyan-600'} p-6 transition-all group`}>
        <div className="flex items-center justify-between mb-4">
          <Calculator className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider bg-gray-800 text-white px-3 py-1">
            ~10%
          </span>
        </div>
        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>ESTIMATED TAX</p>
        <p className={`text-3xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{estimatedTax.toLocaleString('en-IN')}</p>
      </div>

      <div className={`${isDarkMode ? 'bg-black border-b-4 border-green-500 hover:border-green-400' : 'bg-white border-b-4 border-green-500 hover:border-green-600'} p-6 transition-all group`}>
        <div className="flex items-center justify-between mb-4">
          <Lock className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider bg-green-500 text-black px-3 py-1">
            SECURED
          </span>
        </div>
        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>VAULT BALANCE</p>
        <p className={`text-3xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{vaultBalance.toLocaleString('en-IN')}</p>
      </div>

      <div className={`${isDarkMode ? 'bg-black border-b-4 border-yellow-400 hover:border-yellow-300' : 'bg-white border-b-4 border-yellow-400 hover:border-yellow-500'} p-6 transition-all group`}>
        <div className="flex items-center justify-between mb-4">
          <Wallet className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider bg-cyan-500 text-black px-3 py-1">
            AVAILABLE
          </span>
        </div>
        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>SPENDABLE</p>
        <p className={`text-3xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{spendable.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};