import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Edit2, Trash2, TrendingUp, Landmark } from 'lucide-react';
import { BankAccount } from '../types';

interface BankAccountsProps {
  accounts: BankAccount[]; // Changed to accounts prop
}

export const BankAccounts: React.FC<BankAccountsProps> = ({ accounts }) => {
  const [showBalance, setShowBalance] = useState<Record<string, boolean>>({});

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatAccountNumber = (accountNumber: string) => {
    return `****${accountNumber.slice(-4)}`;
  };

  const accountTypeColors: Record<string, string> = {
    SAVINGS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    CURRENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    SALARY: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bank Accounts</h1>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition">
              <Plus size={20} />
              Add Account
            </button>
          </div>

          {/* Total Balance */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <p className="text-blue-100 mb-2 font-medium">Total Balance</p>
            <h2 className="text-4xl font-bold">{formatCurrency(totalBalance)}</h2>
            <p className="text-blue-100 text-sm mt-2 flex items-center gap-2">
              <TrendingUp size={16} /> Across {accounts.length} accounts
            </p>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Landmark size={24} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{account.bankName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-3 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${accountTypeColors[account.accountType]}`}>
                        {account.accountType}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{formatAccountNumber(account.accountNumber)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition" title="Edit">
                    <Edit2 size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t dark:border-slate-800">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Balance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {showBalance[account.id] ? formatCurrency(account.balance) : '••••••'}
                    </p>
                    <button
                      onClick={() =>
                        setShowBalance({
                          ...showBalance,
                          [account.id]: !showBalance[account.id]
                        })
                      }
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showBalance[account.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Account Holder</p>
                  <p className="font-medium text-gray-900 dark:text-white">{account.accountHolder}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">IFSC Code</p>
                  <p className="font-mono text-gray-900 dark:text-white">{account.ifscCode}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="text-gray-900 dark:text-white">{account.lastUpdated.toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Account Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 font-medium transition">
                  View Statements
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 font-medium transition">
                  Download Statement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};