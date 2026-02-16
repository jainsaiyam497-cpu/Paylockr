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
        onClick={() => setCurrentView('SMART_TAX_VAULT')}
        className={`w-full ${isDarkMode ? 'bg-black border-b-4 border-green-500 hover:border-green-400' : 'bg-white border-b-4 border-green-500 hover:border-green-600'} p-5 text-left transition-all group`}
      >
        <div className="flex items-center gap-4">
          <Lock className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-1`}>TAX VAULT</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>
              ₹{vaultBalance.toLocaleString('en-IN')}
            </p>
          </div>
          <ChevronRight className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
        </div>
      </button>

      <button
        onClick={() => setCurrentView('INVOICES')}
        className="w-full bg-yellow-400 hover:bg-yellow-500 p-5 text-left transition-all hover:shadow-xl text-black group"
      >
        <div className="flex items-center gap-4">
          <FileText className="w-10 h-10" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider mb-1">CREATE INVOICE</p>
            <p className="text-xl font-black">NEW INVOICE</p>
          </div>
          <Plus className="w-6 h-6" />
        </div>
      </button>

      <button
        onClick={() => setCurrentView('EXPENSES')}
        className={`w-full ${isDarkMode ? 'bg-black border-b-4 border-cyan-500 hover:border-cyan-400' : 'bg-white border-b-4 border-cyan-500 hover:border-cyan-600'} p-5 text-left transition-all group`}
      >
        <div className="flex items-center gap-4">
          <Receipt className={`w-10 h-10 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
          <div className="flex-1">
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-1`}>TRACK EXPENSES</p>
            <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>ADD EXPENSE</p>
          </div>
          <ArrowRight className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
        </div>
      </button>

      <button
        onClick={() => setCurrentView('INSIGHTS')}
        className={`w-full ${isDarkMode ? 'bg-black border-b-4 border-yellow-400 hover:border-yellow-300' : 'bg-white border-b-4 border-yellow-400 hover:border-yellow-500'} p-5 text-left transition-all group`}
      >
        <div className="flex items-center gap-4">
          <Sparkles className={`w-10 h-10 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <div className="flex-1">
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-1`}>AI INSIGHTS</p>
            <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>GET TIPS</p>
          </div>
          <ArrowRight className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
        </div>
      </button>
    </div>
  );
};