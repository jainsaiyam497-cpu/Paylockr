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
    SAVINGS: 'bg-green-500 text-black',
    CURRENT: 'bg-cyan-500 text-black',
    SALARY: 'bg-yellow-400 text-black'
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-black border-b-2 border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Landmark className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-black uppercase text-white">BANK ACCOUNTS</h1>
            </div>
            <button className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase hover:bg-yellow-500 flex items-center gap-2 transition">
              <Plus size={20} />
              ADD ACCOUNT
            </button>
          </div>

          {/* Total Balance */}
          <div className="bg-black border-l-8 border-cyan-500 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">TOTAL BALANCE</p>
            <h2 className="text-4xl font-black text-white">{formatCurrency(totalBalance)}</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-2 flex items-center gap-2">
              <TrendingUp size={16} /> ACROSS {accounts.length} ACCOUNTS
            </p>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-black border-l-4 border-cyan-500 p-6">
              <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-900">
                    <Landmark size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-white">{account.bankName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-3 py-0.5 text-xs font-bold uppercase tracking-wide ${accountTypeColors[account.accountType]}`}>
                        {account.accountType}
                      </span>
                      <span className="text-sm text-gray-500 font-mono font-bold">{formatAccountNumber(account.accountNumber)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button className="p-2 hover:bg-gray-900 transition" title="Edit">
                    <Edit2 size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-red-900 transition" title="Delete">
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t-2 border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">BALANCE</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-white">
                      {showBalance[account.id] ? formatCurrency(account.balance) : '••••••'}
                    </p>
                    <button
                      onClick={() =>
                        setShowBalance({
                          ...showBalance,
                          [account.id]: !showBalance[account.id]
                        })
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      {showBalance[account.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">ACCOUNT HOLDER</p>
                  <p className="font-bold text-white">{account.accountHolder}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">IFSC CODE</p>
                  <p className="font-mono font-bold text-white">{account.ifscCode}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">LAST UPDATED</p>
                  <p className="font-bold text-white">{account.lastUpdated.toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Account Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-cyan-500 text-black font-bold uppercase hover:bg-cyan-400 transition">
                  VIEW STATEMENTS
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-900 text-white font-bold uppercase hover:bg-gray-800 transition">
                  DOWNLOAD STATEMENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};