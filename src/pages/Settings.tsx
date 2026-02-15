import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Lock, Bell, Download, LogOut, User, Wallet, FileText, Moon, Sun, TrendingUp, Calculator, Info, CheckCircle, Target, ArrowRight, Shield, PiggyBank, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { TaxSettings } from '../types';

interface SettingsProps {
  settings: TaxSettings;
  setSettings: (settings: TaxSettings) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, setSettings, isDark, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [simulatedIncome, setSimulatedIncome] = useState(1200000);
  
  // Simulation States
  const [simulated80C, setSimulated80C] = useState(settings.deductions80C);
  const [simulated80D, setSimulated80D] = useState(settings.deductions80D);
  const [simulatedNPS, setSimulatedNPS] = useState(false);

  // Update simulation defaults when settings change
  useEffect(() => {
    setSimulated80C(settings.deductions80C);
    setSimulated80D(settings.deductions80D);
  }, [settings]);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'financial', label: 'Financial', icon: Wallet },
    { id: 'planning', label: 'Tax Planning', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Privacy', icon: FileText },
  ];

  // Simplified tax calculator for the chart simulation
  const getTaxLiability = (income: number, deductions: number, regime: 'Old' | 'New') => {
    let taxable = income;
    let tax = 0;

    if (regime === 'New') {
        taxable = Math.max(0, taxable - 75000); // Standard Deduction
        
        // New Regime Slabs (FY 24-25 Proposed)
        if (taxable <= 300000) return 0;
        
        // Rebate 87A check
        if (taxable <= 700000) return 0;

        // Simplified calculation for simulation
        if (taxable > 1500000) tax = (taxable - 1500000) * 0.30 + 150000;
        else if (taxable > 1200000) tax = (taxable - 1200000) * 0.20 + 90000;
        else if (taxable > 1000000) tax = (taxable - 1000000) * 0.15 + 60000;
        else if (taxable > 700000) tax = (taxable - 700000) * 0.10 + 30000;
        else if (taxable > 300000) tax = (taxable - 300000) * 0.05;
        
    } else {
        taxable = Math.max(0, taxable - 50000); // Standard Deduction
        taxable = Math.max(0, taxable - deductions);

        // Old Regime Slabs
        if (taxable <= 250000) return 0;
        
        // Rebate 87A check
        if (taxable <= 500000) return 0;

        if (taxable > 1000000) tax = 112500 + (taxable - 1000000) * 0.30;
        else if (taxable > 500000) tax = 12500 + (taxable - 500000) * 0.20;
        else tax = (taxable - 250000) * 0.05;
    }
    
    return Math.round(tax * 1.04); // 4% Cess
  };

  const simulatedDeductions = (simulated80C ? 150000 : 0) + (simulated80D ? 25000 : 0) + (simulatedNPS ? 50000 : 0);
  const potentialMaxDeductions = 150000 + 25000 + 50000; 

  const taxNoSavings = getTaxLiability(simulatedIncome, 0, settings.regime);
  const taxSimulated = getTaxLiability(simulatedIncome, simulatedDeductions, settings.regime);
  const taxOptimized = getTaxLiability(simulatedIncome, potentialMaxDeductions, settings.regime);

  const savingsSimulated = taxNoSavings - taxSimulated;
  const savingsOptimized = taxNoSavings - taxOptimized;

  const chartData = [
    {
      name: 'No Planning',
      'Tax Liability': taxNoSavings,
      'Savings': 0,
    },
    {
      name: 'Your Plan',
      'Tax Liability': taxSimulated,
      'Savings': savingsSimulated,
    },
    {
      name: 'Max Potential',
      'Tax Liability': taxOptimized,
      'Savings': savingsOptimized,
    }
  ];

  const formatCurrency = (val: number) => `₹${(val/1000).toFixed(0)}k`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="text-blue-600 dark:text-blue-400" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sticky top-24">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-medium transition flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                      : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              
              <div className="my-4 border-t border-gray-200 dark:border-slate-800" />
              
              <button
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition flex items-center gap-3"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-8 shadow-sm">
              {activeTab === 'account' && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
                    
                    <div className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input type="text" defaultValue="Saiyam Jain" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input type="email" defaultValue="saiyam@paylockr.app" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <input type="tel" defaultValue="+91-9876543210" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">PAN Number</label>
                        <input type="text" defaultValue="ABCDE1234F" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-gray-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
                    <div className="flex items-center justify-between max-w-xl p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {isDark ? <Moon className="text-blue-400" size={20} /> : <Sun className="text-amber-500" size={20} />}
                        <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDark ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                  
                  <div className="space-y-6 max-w-xl">
                    <div className="p-6 border border-gray-200 dark:border-slate-700 rounded-xl">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <input type="password" placeholder="Current Password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg dark:text-white" />
                        <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg dark:text-white" />
                        <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg dark:text-white" />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Update Password</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                      </div>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/10">Enable</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Financial Year</label>
                      <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg dark:text-white">
                        <option>FY 2024-25</option>
                        <option>FY 2023-24</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tax Regime</label>
                      <select 
                        value={settings.regime}
                        onChange={(e) => setSettings({...settings, regime: e.target.value as any})}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg dark:text-white"
                      >
                        <option value="New">New Regime (Default)</option>
                        <option value="Old">Old Regime (With Exemptions)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                      <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg dark:text-white" disabled>
                        <option>Indian Rupee (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Type</label>
                      <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg dark:text-white">
                        <option>Freelancer / Individual</option>
                        <option>Sole Proprietorship</option>
                        <option>Private Limited</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Wallet className="text-blue-600 dark:text-blue-400" size={24} />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Target Vault Amount</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your goal for tax savings this year.</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <input 
                        type="number" 
                        value={settings.targetVaultAmount}
                        onChange={(e) => setSettings({...settings, targetVaultAmount: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-2.5 border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 rounded-lg text-lg font-bold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'planning' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tax Planning Simulator</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Visualize your tax liability and see how savings impact your bottom line.</p>
                    </div>
                    <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-sm font-semibold">
                      {settings.regime} Regime
                    </div>
                  </div>

                  {/* Simulator Controls */}
                  <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                      <Calculator size={18} /> Projected Annual Income
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                      <div className="flex-1 w-full">
                        <input 
                          type="range" 
                          min="500000" 
                          max="5000000" 
                          step="50000"
                          value={simulatedIncome}
                          onChange={(e) => setSimulatedIncome(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>₹5L</span>
                          <span>₹25L</span>
                          <span>₹50L</span>
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">₹</span>
                        <input 
                          type="number" 
                          value={simulatedIncome}
                          onChange={(e) => setSimulatedIncome(Number(e.target.value))}
                          className="w-36 pl-8 pr-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg text-right font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Investments & Deductions</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition ${simulated80C ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                          onClick={() => setSimulated80C(!simulated80C)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <PiggyBank size={20} className={simulated80C ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${simulated80C ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                              {simulated80C && <CheckCircle size={12} />}
                            </div>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">Section 80C</p>
                          <p className="text-xs text-gray-500 mt-1">ELSS, PF, LIC (Max ₹1.5L)</p>
                        </div>

                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition ${simulated80D ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                          onClick={() => setSimulated80D(!simulated80D)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Shield size={20} className={simulated80D ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${simulated80D ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
                              {simulated80D && <CheckCircle size={12} />}
                            </div>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">Section 80D</p>
                          <p className="text-xs text-gray-500 mt-1">Health Insurance (Max ₹25k)</p>
                        </div>

                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition ${simulatedNPS ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                          onClick={() => setSimulatedNPS(!simulatedNPS)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <BookOpen size={20} className={simulatedNPS ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${simulatedNPS ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'}`}>
                              {simulatedNPS && <CheckCircle size={12} />}
                            </div>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">NPS (80CCD)</p>
                          <p className="text-xs text-gray-500 mt-1">National Pension (Max ₹50k)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stacked Chart Section */}
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Liability vs. Savings Analysis</h3>
                      <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500"></span>
                          <span className="text-gray-600 dark:text-gray-400">Tax Payable</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="text-gray-600 dark:text-gray-400">Savings</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          barSize={50}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e5e7eb'} />
                          <XAxis 
                            dataKey="name" 
                            stroke={isDark ? '#94a3b8' : '#6b7280'} 
                            tick={{ fill: isDark ? '#94a3b8' : '#6b7280' }}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke={isDark ? '#94a3b8' : '#6b7280'} 
                            tickFormatter={formatCurrency}
                            tick={{ fill: isDark ? '#94a3b8' : '#6b7280' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: isDark ? '#1e293b' : '#ffffff',
                              borderColor: isDark ? '#334155' : '#e5e7eb',
                              color: isDark ? '#ffffff' : '#000000',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ fill: 'transparent' }}
                            formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name]}
                          />
                          {/* Stacked Bars */}
                          <Bar dataKey="Tax Liability" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                          <Bar dataKey="Savings" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Infographic / Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                       <div className="p-4 rounded-xl border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
                          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Base Liability</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{taxNoSavings.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500 mt-1">If no deductions applied</p>
                       </div>

                       <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Your Plan Savings</p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{savingsSimulated.toLocaleString('en-IN')}</p>
                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                              {taxNoSavings > 0 ? ((savingsSimulated / taxNoSavings) * 100).toFixed(1) : 0}% Saved
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Based on selected deductions</p>
                       </div>

                       <div className="p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                          <div className="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target size={48} className="text-emerald-600" />
                          </div>
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Potential Savings</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{savingsOptimized.toLocaleString('en-IN')}</p>
                          <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                            <span>Maximize deductions</span>
                            <ArrowRight size={12} />
                          </div>
                       </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-3">
                      <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p className="font-medium text-slate-900 dark:text-white mb-1">Did you know?</p>
                        <p>Under the {settings.regime} Regime, maximizing your Section 80C ({settings.regime === 'Old' ? '₹1.5L limit' : 'Not applicable'}) and 80D limits can significantly reduce your tax burden. Use the simulator above to see how income changes affect your tax slab.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Tax Deadlines', desc: 'Get alerts 7 days before due dates' },
                      { title: 'Invoice Reminders', desc: 'When invoices are overdue' },
                      { title: 'Payment Received', desc: 'Instant alerts for incoming payments' },
                      { title: 'Weekly Summary', desc: 'Weekly email report of finances' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data & Privacy</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-6 border border-gray-200 dark:border-slate-700 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <Download className="text-blue-600 dark:text-blue-400" size={24} />
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">Export Financial Data</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Download all your transactions and reports.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition">CSV Format</button>
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition">PDF Report</button>
                      </div>
                    </div>

                    <div className="p-6 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl">
                      <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-4">Permanently remove your account and all associated data. This action cannot be undone.</p>
                      <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">Delete My Account</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};