import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Edit2, Trash2, TrendingUp, Landmark, Shield } from 'lucide-react';
import { BankAccount } from '../types';

interface BankAccountsProps {
  accounts: BankAccount[]; // Changed to accounts prop
}

export const BankAccounts: React.FC<BankAccountsProps> = ({ accounts }) => {
  const [showBalance, setShowBalance] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);

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
      <div className="bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Landmark className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-black uppercase text-black dark:text-white">BANK ACCOUNTS</h1>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase hover:bg-yellow-500 flex items-center gap-2 transition"
            >
              <Plus size={20} />
              ADD ACCOUNT
            </button>
          </div>

          {/* Total Balance */}
          <div className="bg-white dark:bg-black border-l-8 border-cyan-500 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">TOTAL BALANCE</p>
            <h2 className="text-4xl font-black text-black dark:text-white">{formatCurrency(totalBalance)}</h2>
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
            <div key={account.id} className="bg-white dark:bg-black border-l-4 border-cyan-500 p-6">
              <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-900">
                    <Landmark size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black dark:text-white">{account.bankName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-3 py-0.5 text-xs font-bold uppercase tracking-wide ${accountTypeColors[account.accountType]}`}>
                        {account.accountType}
                      </span>
                      <span className="text-sm text-gray-500 font-mono font-bold">{formatAccountNumber(account.accountNumber)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition" title="Edit">
                    <Edit2 size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 transition" title="Delete">
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t-2 border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">BALANCE</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-black dark:text-white">
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
                  <p className="font-bold text-black dark:text-white">{account.accountHolder}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">IFSC CODE</p>
                  <p className="font-mono font-bold text-black dark:text-white">{account.ifscCode}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">LAST UPDATED</p>
                  <p className="font-bold text-black dark:text-white">{account.lastUpdated.toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Account Actions */}
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => setShowStatementModal(true)}
                  className="flex-1 px-4 py-2 bg-cyan-500 text-black font-bold uppercase hover:bg-cyan-400 transition"
                >
                  VIEW STATEMENTS
                </button>
                <button 
                  onClick={() => setShow2FAModal(true)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-bold uppercase hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                >
                  DOWNLOAD STATEMENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border-4 border-yellow-400 w-full max-w-md p-6">
            <h3 className="text-xl font-black uppercase text-black dark:text-white mb-4">ADD BANK ACCOUNT</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Bank Name</label>
                <input type="text" className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Account Number</label>
                <input type="text" className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">IFSC Code</label>
                <input type="text" className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Account Type</label>
                <select className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none">
                  <option value="SAVINGS">SAVINGS</option>
                  <option value="CURRENT">CURRENT</option>
                  <option value="SALARY">SALARY</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowAddModal(false); setShow2FAModal(true); }} className="flex-1 px-4 py-3 bg-yellow-400 text-black hover:bg-yellow-500 font-bold uppercase transition">VERIFY & ADD</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 font-bold uppercase transition">CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border-4 border-red-500 w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-red-500" size={32} />
              <h3 className="text-xl font-black uppercase text-black dark:text-white">SECURITY VERIFICATION</h3>
            </div>
            <p className="text-xs font-bold uppercase text-gray-500 mb-4">ENTER YOUR 6-DIGIT OTP</p>
            <input type="text" maxLength={6} placeholder="000000" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white text-center text-2xl font-black tracking-widest focus:border-red-500 outline-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setShow2FAModal(false); alert('Verified successfully!'); }} className="flex-1 px-4 py-3 bg-red-500 text-white hover:bg-red-600 font-bold uppercase transition">VERIFY</button>
              <button onClick={() => setShow2FAModal(false)} className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 font-bold uppercase transition">CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Statement Modal */}
      {showStatementModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border-4 border-cyan-500 w-full max-w-2xl p-6">
            <h3 className="text-xl font-black uppercase text-black dark:text-white mb-4">ACCOUNT STATEMENTS</h3>
            <div className="space-y-3">
              {['January 2024', 'December 2023', 'November 2023'].map(month => (
                <div key={month} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border-l-4 border-cyan-500">
                  <span className="font-bold text-black dark:text-white">{month}</span>
                  <button className="px-4 py-2 bg-cyan-500 text-black font-bold uppercase hover:bg-cyan-400 transition">DOWNLOAD</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowStatementModal(false)} className="w-full mt-6 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 font-bold uppercase transition">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
};