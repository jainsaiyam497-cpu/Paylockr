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
    <div className="min-h-screen pb-20 animate-fade-in-up">
      {/* Main Vault Card - Hero Section */}
      <div className="bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-black dark:text-white mb-2">💼 SMART TAX VAULT</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-8">
            AUTOMATIC TAX SAVING SYSTEM FOR FREELANCERS
          </p>

          {/* Main Vault Display */}
          <div className="bg-white dark:bg-black border-l-8 border-yellow-400 p-8 mb-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Vault Balance */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={20} className="text-yellow-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">TAX VAULT BALANCE</p>
                </div>
                <div className="flex items-center gap-3">
                  {hideVaultBalance ? (
                    <>
                      <p className="text-4xl font-black text-black dark:text-white">••••••</p>
                      <button
                        onClick={() => setHideVaultBalance(false)}
                        className="text-gray-500 hover:text-white"
                      >
                        <EyeOff size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-black text-black dark:text-white">{formatCurrency(dashboard.vaultBalance)}</p>
                      <button
                        onClick={() => setHideVaultBalance(true)}
                        className="text-gray-500 hover:text-white"
                      >
                        <Eye size={20} />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-2">
                  PROTECTED & LOCKED
                </p>
              </div>

              {/* Available for Spending */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={20} className="text-green-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">AVAILABLE</p>
                </div>
                <p className="text-4xl font-black text-black dark:text-white">{formatCurrency(dashboard.availableForSpending)}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-2">
                  FOR SPENDING
                </p>
              </div>

              {/* Total Income */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} className="text-cyan-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">TOTAL INCOME</p>
                </div>
                <p className="text-4xl font-black text-black dark:text-white">{formatCurrency(dashboard.totalIncome)}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-2">
                  {dashboard.percentageInVault.toFixed(1)}% IN VAULT
                </p>
              </div>
            </div>
          </div>

          {/* Vault Status & Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vault Status */}
            <div className={`bg-white dark:bg-black p-6 border-l-4 shadow-lg ${
              dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.9
                ? 'border-green-500'
                : dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.5
                  ? 'border-yellow-400'
                  : 'border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                <Shield className={
                  dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.9
                    ? 'text-green-400'
                    : dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.5
                      ? 'text-yellow-400'
                      : 'text-red-400'
                } size={24} />
                <div>
                  <h3 className="font-black uppercase text-black dark:text-white mb-1">VAULT STATUS</h3>
                  <p className={
                    dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.9
                      ? 'text-green-400 font-bold'
                      : dashboard.vaultBalance >= (dashboard.monthlyReport?.estimatedTax || 0) * 0.5
                        ? 'text-yellow-400 font-bold'
                        : 'text-red-400 font-bold'
                  }>
                    {vaultStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Score */}
            <div className="bg-white dark:bg-black p-6 border-l-4 border-cyan-500 shadow-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-cyan-400" size={24} />
                <div className="flex-1">
                  <h3 className="font-black uppercase text-black dark:text-white mb-1">TAX COMPLIANCE SCORE</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-900 h-3 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full transition-all"
                        style={{ width: `${dashboard.confidenceScore}%` }}
                      />
                    </div>
                    <p className="text-lg font-black text-cyan-400">{dashboard.confidenceScore}%</p>
                  </div>
                  <p className="text-xs font-bold uppercase text-gray-500 mt-2">{complianceMessage}</p>
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
          <div className="bg-white dark:bg-black border-b-4 border-cyan-500 p-6">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-black uppercase text-black dark:text-white mb-2">
              INFLOW CLASSIFICATION ENGINE
            </h3>
            <p className="text-xs font-bold uppercase text-gray-500 mb-4">
              AUTOMATICALLY IDENTIFIES TAXABLE VS NON-TAXABLE INCOME. REFUNDS, TRANSFERS, AND GIFTS ARE EXCLUDED.
            </p>
            <div className="text-sm">
              <p className="font-bold uppercase text-gray-500 mb-2">CLASSIFIED INFLOWS:</p>
              <p className="text-2xl font-black text-cyan-400">{dashboard.classifiedCount}</p>
              <p className="text-xs text-gray-500 font-bold uppercase">
                {dashboard.unconfirmedCount} NEED CONFIRMATION
              </p>
            </div>
          </div>

          {/* Feature 2: Real-Time Tax Computation */}
          <div className="bg-white dark:bg-black border-b-4 border-yellow-400 p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-black uppercase text-black dark:text-white mb-2">
              REAL-TIME TAX COMPUTATION
            </h3>
            <p className="text-xs font-bold uppercase text-gray-500 mb-4">
              CALCULATES PROVISIONAL TAX INSTANTLY WHEN INCOME COMES IN. NO YEAR-END SURPRISES.
            </p>
            <div className="text-sm">
              <p className="font-bold uppercase text-gray-500 mb-2">ESTIMATED TAX:</p>
              <p className="text-2xl font-black text-red-400">
                {formatCurrency(dashboard.monthlyReport?.estimatedTax || 0)}
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase">
                BASED ON CURRENT INCOME
              </p>
            </div>
          </div>

          {/* Feature 3: Smart Vault Locking */}
          <div className="bg-white dark:bg-black border-b-4 border-green-500 p-6">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-lg font-black uppercase text-black dark:text-white mb-2">
              AUTOMATIC TAX LOCKING
            </h3>
            <p className="text-xs font-bold uppercase text-gray-500 mb-4">
              TAX AMOUNT AUTOMATICALLY LOCKS INTO VAULT. PROTECTED FROM ACCIDENTAL SPENDING.
            </p>
            <div className="text-sm">
              <p className="font-bold uppercase text-gray-500 mb-2">THIS MONTH ADDED:</p>
              <p className="text-2xl font-black text-green-400">
                {formatCurrency(dashboard.monthlyReport?.vaultAddition || 0)}
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase">
                FROM {dashboard.classifiedCount} TRANSACTIONS
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Report */}
        {dashboard.monthlyReport && (
          <div className="bg-white dark:bg-black border-l-8 border-cyan-500 p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-black uppercase text-black dark:text-white mb-6">📊 MONTHLY REPORT</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-black border-l-4 border-cyan-500 p-4 shadow-lg">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">TOTAL INCOME</p>
                <p className="text-xl font-black text-cyan-400">
                  {formatCurrency(dashboard.monthlyReport.totalIncome)}
                </p>
              </div>

              <div className="bg-white dark:bg-black border-l-4 border-yellow-400 p-4 shadow-lg">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">TAXABLE INCOME</p>
                <p className="text-xl font-black text-yellow-400">
                  {formatCurrency(dashboard.monthlyReport.taxableIncome)}
                </p>
              </div>

              <div className="bg-white dark:bg-black border-l-4 border-green-500 p-4 shadow-lg">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">NON-TAXABLE</p>
                <p className="text-xl font-black text-green-400">
                  {formatCurrency(dashboard.monthlyReport.nonTaxableIncome)}
                </p>
              </div>

              <div className="bg-white dark:bg-black border-l-4 border-red-500 p-4 shadow-lg">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">EST. TAX</p>
                <p className="text-xl font-black text-red-400">
                  {formatCurrency(dashboard.monthlyReport.estimatedTax)}
                </p>
              </div>

              <div className="bg-white dark:bg-black border-l-4 border-yellow-400 p-4 shadow-lg">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">VAULT ADDITION</p>
                <p className="text-xl font-black text-yellow-400">
                  {formatCurrency(dashboard.monthlyReport.vaultAddition)}
                </p>
              </div>

              <div className="bg-white dark:bg-black border-l-4 border-white dark:border-gray-200 p-4 shadow-lg">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">EXPENSES</p>
                <p className="text-xl font-black text-black dark:text-white">
                  {formatCurrency(dashboard.monthlyReport.expenses)}
                </p>
              </div>

              <div className="bg-white dark:bg-black border-l-4 border-green-500 p-4 md:col-span-2 shadow-lg">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">NET SPENDABLE</p>
                <p className="text-2xl font-black text-green-400">
                  {formatCurrency(dashboard.monthlyReport.netSpendable)}
                </p>
              </div>
            </div>

            {/* Flow Visualization */}
            <div className="bg-white dark:bg-black border-l-8 border-cyan-500 p-6 shadow-lg">
              <p className="font-black uppercase text-black dark:text-white mb-4">HOW YOUR MONEY FLOWS</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-cyan-500 flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div className="flex-1">
                    <p className="font-black uppercase text-black dark:text-white">INCOME RECEIVED</p>
                    <p className="text-xs font-bold uppercase text-gray-500">{formatCurrency(dashboard.monthlyReport.totalIncome)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-8">
                  <div className="border-l-2 border-gray-700 h-8" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-500 flex items-center justify-center text-2xl">
                    🔒
                  </div>
                  <div className="flex-1">
                    <p className="font-black uppercase text-black dark:text-white">LOCKED IN VAULT</p>
                    <p className="text-xs font-bold uppercase text-gray-500">{formatCurrency(dashboard.monthlyReport.vaultAddition)} (TAX)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-8">
                  <div className="border-l-2 border-gray-700 h-8" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <div className="flex-1">
                    <p className="font-black uppercase text-black dark:text-white">AVAILABLE FOR SPENDING</p>
                    <p className="text-xs font-bold uppercase text-gray-500">{formatCurrency(dashboard.monthlyReport.netSpendable)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unconfirmed Inflows Alert */}
        {dashboard.unconfirmedCount > 0 && (
          <div className="bg-white dark:bg-black border-l-8 border-yellow-400 p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-black uppercase text-black dark:text-white mb-2">
                  ⚠️ {dashboard.unconfirmedCount} INFLOWS NEED CLASSIFICATION
                </h3>
                <p className="text-xs font-bold uppercase text-gray-500 mb-4">
                  PLEASE CONFIRM WHETHER THESE ARE TAXABLE OR NON-TAXABLE INCOME. THIS ENSURES ACCURATE TAX CALCULATION.
                </p>
                <button className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase hover:bg-yellow-500 transition">
                  REVIEW & CONFIRM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Unlock Section */}
        {dashboard.emergencyUnlockRequests > 0 && (
          <div className="bg-white dark:bg-black border-l-8 border-red-500 p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-black uppercase text-black dark:text-white mb-2">
                  🚨 {dashboard.emergencyUnlockRequests} EMERGENCY UNLOCK REQUEST(S)
                </h3>
                <p className="text-xs font-bold uppercase text-gray-500 mb-4">
                  YOU HAVE REQUESTED ACCESS TO LOCKED VAULT MONEY. THIS WILL REDUCE YOUR TAX SAFETY. ARE YOU SURE?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUnlockModal(true)}
                    className="px-6 py-2 bg-red-500 text-white font-bold uppercase hover:bg-red-600 transition"
                  >
                    APPROVE UNLOCK
                  </button>
                  <button className="px-6 py-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-bold uppercase hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                    DENY REQUEST
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="bg-white dark:bg-black border-b-4 border-cyan-500 p-8">
          <h2 className="text-2xl font-black uppercase text-black dark:text-white mb-8">🎯 HOW SMART TAX VAULT WORKS</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-cyan-500 text-black flex items-center justify-center font-black flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-black dark:text-white mb-2">INCOME COMES IN</h3>
                <p className="text-xs font-bold uppercase text-gray-500">
                  YOU RECEIVE A PAYMENT FROM A CLIENT. IT LANDS IN YOUR BANK ACCOUNT.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-cyan-500 text-black flex items-center justify-center font-black flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-black dark:text-white mb-2">SMART CLASSIFICATION</h3>
                <p className="text-xs font-bold uppercase text-gray-500">
                  PAYLOCKR AUTOMATICALLY IDENTIFIES IF THIS IS TAXABLE INCOME OR NOT. IT CHECKS THE SENDER, PAYMENT METHOD, AND NOTES.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-cyan-500 text-black flex items-center justify-center font-black flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-black dark:text-white mb-2">TAX CALCULATED INSTANTLY</h3>
                <p className="text-xs font-bold uppercase text-gray-500">
                  SYSTEM CALCULATES HOW MUCH TAX YOU OWE ON THIS INCOME BASED ON CURRENT EARNINGS AND TAX SLABS.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-cyan-500 text-black flex items-center justify-center font-black flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-black dark:text-white mb-2">TAX AMOUNT LOCKED IN VAULT</h3>
                <p className="text-xs font-bold uppercase text-gray-500">
                  THE CALCULATED TAX AMOUNT IS AUTOMATICALLY LOCKED IN YOUR SMART TAX VAULT. YOU CAN SPEND THE REST.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-500 text-black flex items-center justify-center font-black flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-black text-lg uppercase text-black dark:text-white mb-2">TAX TIME IS STRESS-FREE</h3>
                <p className="text-xs font-bold uppercase text-gray-500">
                  WHEN IT'S TIME TO FILE TAXES, THE MONEY IS ALREADY SAVED. NO YEAR-END SHOCK. NO FINANCIAL STRESS.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white dark:bg-black border-l-8 border-cyan-500 shadow-lg">
            <p className="text-lg font-black uppercase text-black dark:text-white mb-2">💡 KEY BENEFIT</p>
            <p className="text-xs font-bold uppercase text-gray-500">
              "PAYLOCKR'S SMART TAX VAULT IS LIKE AN AUTOMATIC TDS SYSTEM FOR FREELANCERS — IT LOCKS TAX MONEY EVERY TIME INCOME COMES."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};