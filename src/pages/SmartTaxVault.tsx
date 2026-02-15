// PayLockr's Core Feature: Smart Tax Vault Dashboard
// Automatic tax saving system for freelancers

import React, { useState, useMemo } from 'react';
import {
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Shield,
  Eye,
  EyeOff,
  Plus,
  X
} from 'lucide-react';
import {
  getSmartTaxVaultDashboard,
  formatCurrency,
  getVaultStatus,
  getComplianceMessage
} from '../utils/smartTaxVault';

interface SmartTaxVaultProps {
  userId: string;
  transactions?: any[];
  classifiedIncomes?: any[];
  vaultEntries?: any[];
}

export const SmartTaxVault: React.FC<SmartTaxVaultProps> = ({
  userId,
  transactions = [],
  classifiedIncomes = [],
  vaultEntries = []
}) => {
  const [hideVaultBalance, setHideVaultBalance] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Get dashboard data
  const dashboard = useMemo(
    () => getSmartTaxVaultDashboard(userId, transactions, classifiedIncomes, vaultEntries),
    [userId, transactions, classifiedIncomes, vaultEntries]
  );

  const vaultStatus = getVaultStatus(dashboard.vaultBalance, dashboard.monthlyReport?.estimatedTax || 0);
  const complianceMessage = getComplianceMessage(dashboard.confidenceScore);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {/* Main Vault Card - Hero Section */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">💼 Smart Tax Vault</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Automatic tax saving system for freelancers. Your tax money stays protected here.
          </p>

          {/* Main Vault Display */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Vault Balance */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={20} className="text-blue-200" />
                  <p className="text-blue-100 text-sm font-medium">TAX VAULT BALANCE</p>
                </div>
                <div className="flex items-center gap-3">
                  {hideVaultBalance ? (
                    <>
                      <p className="text-4xl font-bold">••••••</p>
                      <button
                        onClick={() => setHideVaultBalance(false)}
                        className="text-blue-200 hover:text-white"
                      >
                        <EyeOff size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-bold">{formatCurrency(dashboard.vaultBalance)}</p>
                      <button
                        onClick={() => setHideVaultBalance(true)}
                        className="text-blue-200 hover:text-white"
                      >
                        <Eye size={20} />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Protected & locked for tax payment
                </p>
              </div>

              {/* Available for Spending */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={20} className="text-green-200" />
                  <p className="text-blue-100 text-sm font-medium">AVAILABLE FOR SPENDING</p>
                </div>
                <p className="text-4xl font-bold">{formatCurrency(dashboard.availableForSpending)}</p>
                <p className="text-blue-100 text-sm mt-2">
                  Income after tax reservation
                </p>
              </div>

              {/* Total Income */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} className="text-yellow-200" />
                  <p className="text-blue-100 text-sm font-medium">TOTAL INCOME</p>
                </div>
                <p className="text-4xl font-bold">{formatCurrency(dashboard.totalIncome)}</p>
                <p className="text-blue-100 text-sm mt-2">
                  {dashboard.percentageInVault.toFixed(1)}% in vault
                </p>
              </div>
            </div>
          </div>

          {/* Vault Status & Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vault Status */}
            <div className={`rounded-lg p-6 border-2 ${
              dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.9
                ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800'
                : dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.5
                  ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-800'
                  : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800'
            }`}>
              <div className="flex items-start gap-3">
                <Shield className={
                  dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.9
                    ? 'text-green-600 dark:text-green-400'
                    : dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.5
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                } size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Vault Status</h3>
                  <p className={
                    dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.9
                      ? 'text-green-700 dark:text-green-300'
                      : dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.5
                        ? 'text-yellow-700 dark:text-yellow-300'
                        : 'text-red-700 dark:text-red-300'
                  }>
                    {vaultStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Score */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-blue-600 dark:text-blue-400" size={24} />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Tax Compliance Score</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all"
                        style={{ width: `${dashboard.confidenceScore}%` }}
                      />
                    </div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{dashboard.confidenceScore}%</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{complianceMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Feature 1: Inflow Classification */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Inflow Classification Engine
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Automatically identifies taxable vs non-taxable income. Refunds, transfers, and gifts are excluded.
            </p>
            <div className="text-sm">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Classified Inflows:</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboard.classifiedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {dashboard.unconfirmedCount} need confirmation
              </p>
            </div>
          </div>

          {/* Feature 2: Real-Time Tax Computation */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Real-Time Tax Computation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Calculates provisional tax instantly when income comes in. No year-end surprises.
            </p>
            <div className="text-sm">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Estimated Tax:</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(dashboard.monthlyReport?.estimatedTax || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Based on current income
              </p>
            </div>
          </div>

          {/* Feature 3: Smart Vault Locking */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Automatic Tax Locking
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tax amount automatically locks into vault. Protected from accidental spending.
            </p>
            <div className="text-sm">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">This Month Added:</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(dashboard.monthlyReport?.vaultAddition || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                From {dashboard.classifiedCount} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Report */}
        {dashboard.monthlyReport && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📊 Monthly Report</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(dashboard.monthlyReport.totalIncome)}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxable Income</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(dashboard.monthlyReport.taxableIncome)}
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Non-Taxable</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(dashboard.monthlyReport.nonTaxableIncome)}
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Est. Tax</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(dashboard.monthlyReport.estimatedTax)}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vault Addition</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {formatCurrency(dashboard.monthlyReport.vaultAddition)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expenses</p>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
                  {formatCurrency(dashboard.monthlyReport.expenses)}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Spendable</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(dashboard.monthlyReport.netSpendable)}
                </p>
              </div>
            </div>

            {/* Flow Visualization */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6">
              <p className="font-semibold text-gray-900 dark:text-white mb-4">How Your Money Flows</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Income Received</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(dashboard.monthlyReport.totalIncome)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-8">
                  <div className="border-l-2 border-gray-300 dark:border-slate-700 h-8" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-2xl">
                    🔒
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Locked in Vault</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(dashboard.monthlyReport.vaultAddition)} (tax)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-8">
                  <div className="border-l-2 border-gray-300 dark:border-slate-700 h-8" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Available for Spending</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(dashboard.monthlyReport.netSpendable)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unconfirmed Inflows Alert */}
        {dashboard.unconfirmedCount > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  ⚠️ {dashboard.unconfirmedCount} Inflows Need Classification
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Please confirm whether these are taxable or non-taxable income. This ensures accurate tax calculation.
                </p>
                <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition">
                  Review & Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Unlock Section */}
        {dashboard.emergencyUnlockRequests > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  🚨 {dashboard.emergencyUnlockRequests} Emergency Unlock Request(s)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You have requested access to locked vault money. This will reduce your tax safety. Are you sure?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUnlockModal(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
                  >
                    Approve Unlock
                  </button>
                  <button className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 font-medium transition">
                    Deny Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">🎯 How Smart Tax Vault Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Income Comes In</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You receive a payment from a client. It lands in your bank account.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Smart Classification</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  PayLockr automatically identifies if this is taxable income or not. It checks the sender, payment method, and notes.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Tax Calculated Instantly</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  System calculates how much tax you owe on this income based on current earnings and tax slabs.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Tax Amount Locked in Vault</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  The calculated tax amount is automatically locked in your Smart Tax Vault. You can spend the rest.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Tax Time is Stress-Free</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  When it's time to file taxes, the money is already saved. No year-end shock. No financial stress.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">💡 Key Benefit</p>
            <p className="text-gray-700 dark:text-gray-300">
              "PayLockr's Smart Tax Vault is like an automatic TDS system for freelancers — it locks tax money every time income comes."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};