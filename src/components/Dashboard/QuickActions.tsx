import React from 'react';
import { Lock, FileText, Receipt, Sparkles, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import { ViewState } from '../../types';

interface QuickActionsProps {
  setCurrentView: (view: ViewState) => void;
  vaultBalance: number;
  isDarkMode: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ setCurrentView, vaultBalance, isDarkMode }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('VAULT')}
        className={`w-full ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-xl p-5 text-left transition-all shadow-sm`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} flex items-center justify-center flex-shrink-0`}>
            <Lock className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Tax Vault</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ₹{vaultBalance.toLocaleString('en-IN')}
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
        </div>
      </button>

      <button
        onClick={() => setCurrentView('INVOICES')}
        className={`w-full ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl p-5 text-left transition-all shadow-sm text-white`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-blue-100 text-sm mb-1">Create Invoice</p>
            <p className="text-lg font-semibold">New Invoice</p>
          </div>
          <Plus className="w-5 h-5" />
        </div>
      </button>

      <button
        onClick={() => setCurrentView('EXPENSES')}
        className={`w-full ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-xl p-5 text-left transition-all shadow-sm`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} flex items-center justify-center flex-shrink-0`}>
            <Receipt className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Track Expenses</p>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Expense</p>
          </div>
          <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
        </div>
      </button>

      <button
        onClick={() => setCurrentView('INSIGHTS')}
        className={`w-full ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-xl p-5 text-left transition-all shadow-sm`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'} flex items-center justify-center flex-shrink-0`}>
            <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>AI Insights</p>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Get Tips</p>
          </div>
          <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
        </div>
      </button>
    </div>
  );
};