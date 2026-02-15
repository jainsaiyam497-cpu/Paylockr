import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Settings as SettingsIcon, 
  Bell, 
  LogOut, 
  List,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Search,
  ArrowDownLeft,
  Info,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  UserCheck,
  Lock,
  Calculator,
  Shield,
  TrendingUp,
  Zap,
  Loader2,
  HelpCircle,
  XCircle,
  BarChart3,
  ChevronRight,
  Calendar,
  FileText,
  Receipt,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from './components/Button';
import { Transaction, TransactionType, TransactionStatus, ViewState, Notification, TaxSettings, TaxDeadline } from './src/types';
import { INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS, CHART_DATA, MOCK_TAX_DEADLINES } from './src/constants';
import { generateTaxInsights } from './services/geminiService';
import { supabase } from './services/supabaseClient';

// --- Toast Component ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-teal-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  return (
    <div className={`fixed bottom-6 right-6 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50`}>
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'error' && <AlertTriangle size={20} />}
      {type === 'info' && <Info size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80"><X size={16} /></button>
    </div>
  );
};

// --- Transaction Modal ---
const TransactionModal: React.FC<{
  onClose: () => void;
  onSave: (txn: Transaction) => void;
}> = ({ onClose, onSave }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.BUSINESS);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      const numAmount = parseFloat(amount);
      const estimatedTax = type === TransactionType.BUSINESS ? numAmount * 0.10 : 0;
      
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        source,
        amount: numAmount,
        type,
        status: estimatedTax > 0 ? TransactionStatus.VAULTED : TransactionStatus.IGNORED,
        estimatedTax
      };
      
      onSave(newTxn);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border dark:border-slate-800">
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">New Transaction</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Source</label>
            <input 
              required
              type="text" 
              value={source} 
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              placeholder="e.g. Freelance Client"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Amount (₹)</label>
            <input 
              required
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              {Object.values(TransactionType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button type="submit" isLoading={isProcessing} className="w-full mt-2">Add Transaction</Button>
        </form>
      </div>
    </div>
  );
};

// --- View Components ---

const DashboardPage = ({ 
  transactions, 
  setCurrentView, 
  isDarkMode,
  notifications,
  showNotifications,
  setShowNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  taxDeadlines
}: { 
  transactions: Transaction[];
  setCurrentView: (view: ViewState) => void;
  isDarkMode: boolean;
  notifications: any[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  taxDeadlines: TaxDeadline[];
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userDataStr) {
      try {
        setCurrentUser(JSON.parse(userDataStr));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.BUSINESS)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const estimatedTax = transactions
    .filter(t => t.status === TransactionStatus.VAULTED)
    .reduce((sum, t) => sum + t.estimatedTax, 0);
  
  const vaultBalance = estimatedTax;
  const spendable = totalIncome - estimatedTax;

  // Chart data (last 6 months)
  const chartData = [
    { month: 'Sep', income: 98000, tax: 9800 },
    { month: 'Oct', income: 156000, tax: 15600 },
    { month: 'Nov', income: 187000, tax: 18700 },
    { month: 'Dec', income: 143000, tax: 14300 },
    { month: 'Jan', income: 175000, tax: 17500 },
    { month: 'Feb', income: totalIncome, tax: estimatedTax }
  ];

  const recentTransactions = transactions.slice(0, 5);

  const getRelativeTime = (date: Date | string) => {
    const dateObj = new Date(date);
    const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  // Tax health calculation
  const calculateTaxHealth = () => {
    const taxPercentage = totalIncome > 0 ? (estimatedTax / totalIncome) * 100 : 0;
    if (taxPercentage >= 10) return { status: 'Excellent', color: isDarkMode ? 'text-green-400' : 'text-green-600', icon: '🟢' };
    if (taxPercentage >= 7) return { status: 'Good', color: isDarkMode ? 'text-blue-400' : 'text-blue-600', icon: '🔵' };
    if (taxPercentage >= 5) return { status: 'Fair', color: isDarkMode ? 'text-amber-400' : 'text-amber-600', icon: '🟡' };
    return { status: 'Low', color: isDarkMode ? 'text-red-400' : 'text-red-600', icon: '🔴' };
  };

  const taxHealth = calculateTaxHealth();

  // Next deadline
  const nextDeadline = taxDeadlines.find(d => d.status === 'Upcoming' || d.status === 'Due');

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}! 👋` : 'Dashboard'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Tax Health:
                </span>
                <span className={`text-sm font-semibold ${taxHealth.color}`}>
                  {taxHealth.icon} {taxHealth.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-lg ${
                    isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  } transition-colors`}
                >
                  <Bell className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-96 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  } border rounded-lg shadow-xl max-h-[32rem] overflow-hidden flex flex-col z-50`}>
                    <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                          <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b ${
                              isDarkMode ? 'border-slate-700' : 'border-gray-200'
                            } ${
                              !notification.read 
                                ? isDarkMode ? 'bg-slate-700/50' : 'bg-blue-50' 
                                : ''
                            } hover:${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} transition-colors cursor-pointer`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                    {notification.title}
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className={`flex-shrink-0 ${isDarkMode ? 'text-slate-500 hover:text-slate-400' : 'text-gray-400 hover:text-gray-600'}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mt-1`}>
                                  {notification.message}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mt-2`}>
                                  {getRelativeTime(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Help Button */}
              <button
                onClick={() => setCurrentView('HELP')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors flex items-center gap-2`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
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

        {/* Next Deadline Alert */}
        {nextDeadline && (
          <div className={`mb-8 p-6 rounded-xl border-2 ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-100'} flex items-center justify-center flex-shrink-0`}>
                <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Next Tax Deadline: {nextDeadline.quarter} Advance Tax
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>
                  Due on {new Date(nextDeadline.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Estimated Amount</p>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{nextDeadline.estimatedAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Vault Balance</p>
                    <p className={`text-lg font-bold ${vaultBalance >= nextDeadline.estimatedAmount ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                      ₹{vaultBalance.toLocaleString('en-IN')} {vaultBalance >= nextDeadline.estimatedAmount ? '✓' : '⚠'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('TAX_CALENDAR')}
                className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-700'} text-white transition-colors`}
              >
                View Calendar
              </button>
            </div>
          </div>
        )}

        {/* Charts and Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Income vs Tax Chart */}
          <div className={`lg:col-span-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Income vs Tax Trend
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mt-1`}>
                  Last 6 months performance
                </p>
              </div>
              <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#94a3b8' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#94a3b8' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDarkMode ? '#fff' : '#000'
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Income" />
                <Area type="monotone" dataKey="tax" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} name="Tax" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
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
        </div>

        {/* Recent Transactions */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Transactions
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mt-1`}>
                Latest {recentTransactions.length} transactions
              </p>
            </div>
            <button
              onClick={() => setCurrentView('TRANSACTIONS')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors cursor-pointer`}
                onClick={() => setCurrentView('TRANSACTIONS')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${
                    transaction.type === TransactionType.BUSINESS 
                      ? isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                      : isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                  } flex items-center justify-center`}>
                    {transaction.type === TransactionType.BUSINESS ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.source}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        transaction.status === TransactionStatus.VAULTED
                          ? isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'
                          : transaction.status === TransactionStatus.PENDING
                          ? isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'
                          : isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </p>
                  {transaction.estimatedTax > 0 && (
                    <p className={`text-xs ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mt-1`}>
                      Tax: ₹{transaction.estimatedTax.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionsView = ({ transactions, onAdd }: { transactions: Transaction[], onAdd: (t: Transaction) => void }) => {
  const [filter, setFilter] = useState<'ALL' | TransactionType>('ALL');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = transactions.filter(t => {
    const matchesType = filter === 'ALL' || t.type === filter;
    const matchesSearch = t.source.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} onSave={onAdd} />}
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          >
            <option value="ALL">All Types</option>
            {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Button onClick={() => setModalOpen(true)}><Plus size={18} className="mr-2" /> Add</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium dark:text-white">{t.source}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{t.type}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    t.status === 'Vaulted' ? 'bg-teal-100 text-teal-700' : 
                    t.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold dark:text-white">₹{t.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VaultView = ({ transactions }: { transactions: Transaction[] }) => {
  const vaulted = transactions.filter(t => t.status === TransactionStatus.VAULTED).reduce((sum, t) => sum + t.estimatedTax, 0);
  const target = 150000;
  
  const data = [
    { name: 'Vaulted', value: vaulted },
    { name: 'Remaining', value: target - vaulted }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold dark:text-white mb-2">₹{vaulted.toLocaleString()}</h2>
          <p className="text-slate-500 mb-6">Current Vault Balance</p>
          <div className="w-48 h-48">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="#0d9488" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
             </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4">Target: ₹{target.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800">
           <h3 className="text-lg font-bold dark:text-white mb-6">Quick Actions</h3>
           <div className="space-y-4">
             <Button className="w-full justify-between" size="lg">
               <span>Add Funds</span>
               <Plus size={18} />
             </Button>
             <Button variant="outline" className="w-full justify-between" size="lg">
               <span>Withdraw Funds</span>
               <ArrowDownLeft size={18} />
             </Button>
           </div>
           
           <h3 className="text-lg font-bold dark:text-white mt-8 mb-4">Vault History</h3>
           <div className="space-y-3">
             {transactions.filter(t => t.status === TransactionStatus.VAULTED).slice(0, 3).map(t => (
               <div key={t.id} className="flex justify-between text-sm">
                 <span className="text-slate-600 dark:text-slate-400">{t.source}</span>
                 <span className="text-teal-600 font-medium">+₹{t.estimatedTax}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const InsightsView = ({ transactions }: { transactions: Transaction[] }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const income = transactions.reduce((acc, t) => t.type === TransactionType.BUSINESS ? acc + t.amount : acc, 0);
    const result = await generateTaxInsights(transactions, income * 12);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/10 rounded-lg"><Sparkles size={24} /></div>
          <h2 className="text-2xl font-bold">AI Tax Assistant</h2>
        </div>
        <p className="text-indigo-100 mb-8">Analyze your recent transactions to find tax saving opportunities and compliance risks.</p>
        <Button onClick={handleGenerate} isLoading={loading} className="bg-white text-indigo-700 border-none hover:bg-indigo-50">
          {insight ? 'Refresh Analysis' : 'Generate Insights'}
        </Button>
      </div>

      {insight && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 animate-fade-in">
          <h3 className="text-lg font-bold dark:text-white mb-4">Analysis Results</h3>
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
            {insight}
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationsView = ({ notifications }: { notifications: Notification[] }) => (
  <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up">
    {notifications.map(n => (
      <div key={n.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800 flex gap-4">
        <div className={`p-2 rounded-full h-fit ${
          n.type === 'success' ? 'bg-teal-100 text-teal-600' : 
          n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
          'bg-blue-100 text-blue-600'
        }`}>
          {n.type === 'success' ? <CheckCircle size={18} /> : 
           n.type === 'warning' ? <AlertTriangle size={18} /> : 
           <Info size={18} />}
        </div>
        <div>
          <h4 className="font-bold dark:text-white">{n.title}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
          <p className="text-xs text-slate-400 mt-2">{n.timestamp}</p>
        </div>
      </div>
    ))}
  </div>
);

const SettingsView = ({ settings, setSettings, isDark, toggleTheme }: any) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 overflow-hidden animate-fade-in-up">
      <div className="flex border-b dark:border-slate-800">
        {['profile', 'tax', 'app'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-8">
        {activeTab === 'profile' && (
           <div className="space-y-4">
             <h3 className="text-lg font-bold dark:text-white">Profile Information</h3>
             <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">JD</div>
               <div>
                 <p className="font-bold dark:text-white">John Doe</p>
                 <p className="text-sm text-slate-500">Freelancer</p>
               </div>
             </div>
           </div>
        )}
        {activeTab === 'tax' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold dark:text-white">Tax Configuration</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-slate-300">Regime</label>
              <select 
                value={settings.regime}
                onChange={(e) => setSettings({...settings, regime: e.target.value})}
                className="w-full p-2 rounded border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="New">New Regime (Default)</option>
                <option value="Old">Old Regime</option>
              </select>
            </div>
          </div>
        )}
        {activeTab === 'app' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold dark:text-white">App Preferences</h3>
            <div className="flex items-center justify-between">
              <span className="dark:text-white">Dark Mode</span>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDark ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- LoginPage Component ---
const LoginPage = ({ onLogin, isDarkMode }: { onLogin: () => void; isDarkMode: boolean }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; confirmPassword?: string; general?: string}>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors: any = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!isLogin && name.trim().length < 2) {
      newErrors.general = 'Please enter your full name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo credentials
    if (email === 'demo@paylockr.com' && password === 'PayLockr@123') {
      sessionStorage.setItem('authToken', 'demo-token-12345');
      sessionStorage.setItem('userData', JSON.stringify({ 
        name: 'Demo User', 
        email: email,
        id: 'demo-user-001' 
      }));
      setIsLoading(false);
      onLogin();
      return;
    }

    // Accept any valid email/password for prototype
    if (validateEmail(email) && validatePassword(password)) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', `token-${Date.now()}`);
      storage.setItem('userData', JSON.stringify({ 
        name: isLogin ? email.split('@')[0] : name, 
        email: email,
        id: `user-${Date.now()}` 
      }));
      setIsLoading(false);
      onLogin();
    } else {
      setIsLoading(false);
      setErrors({ general: 'Invalid credentials. Try demo@paylockr.com / PayLockr@123' });
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@paylockr.com');
    setPassword('PayLockr@123');
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Left Side - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 ${isDarkMode ? 'bg-slate-800' : 'bg-blue-600'} p-12 flex-col justify-between`}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-blue-500' : 'bg-white'} flex items-center justify-center`}>
              <Lock className={`w-7 h-7 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <span className="text-3xl font-bold text-white">PayLockr</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Automate Your Tax<br />Savings Effortlessly
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Real-time tax calculation and automatic vaulting for freelancers and creators.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-blue-700'} flex items-center justify-center flex-shrink-0`}>
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Real-Time Tax Calculation</h3>
              <p className="text-blue-100">Instant tax estimation on every payment you receive</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-blue-700'} flex items-center justify-center flex-shrink-0`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Automatic Tax Vaulting</h3>
              <p className="text-blue-100">Money reserved safely so you never overspend</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-blue-700'} flex items-center justify-center flex-shrink-0`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Smart Insights</h3>
              <p className="text-blue-100">AI-powered recommendations for tax optimization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PayLockr</span>
          </div>

          <div className="mb-8">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {isLogin ? 'Sign in to continue to PayLockr' : 'Start managing your taxes smarter'}
            </p>
          </div>

          {errors.general && (
            <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} flex items-start gap-3`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email 
                    ? isDarkMode ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                    : isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className={`mt-1.5 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.email}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.password 
                      ? isDarkMode ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                      : isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className={`mt-1.5 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                      errors.confirmPassword 
                        ? isDarkMode ? 'border-red-500 bg-slate-800' : 'border-red-500 bg-white'
                        : isDarkMode 
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className={`mt-1.5 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.confirmPassword}</p>}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Remember me
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          <button
            onClick={fillDemoCredentials}
            className={`w-full mt-4 py-2.5 text-sm font-medium rounded-lg border-2 border-dashed ${
              isDarkMode 
                ? 'border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600' 
                : 'border-gray-300 text-gray-600 hover:text-gray-700 hover:border-gray-400'
            } transition-all flex items-center justify-center gap-2`}
          >
            <Zap className="w-4 h-4" />
            Use Demo Credentials
          </button>

          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settings, setSettings] = useState<TaxSettings>({ 
    regime: 'New', 
    deductions80C: true, 
    deductions80D: false, 
    annualDeductionAmount: 150000, 
    mode: 'Balanced',
    targetVaultAmount: 150000 
  });
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);

  // Theme effect
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Auth Effect
  useEffect(() => {
    let mounted = true;
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.warn("Session check error (Auth service unavailable):", error.message);
        } else if (data?.session) {
          setSession(data.session);
          if (view === 'LOGIN') setView('DASHBOARD');
          return;
        }

        // Check fallback if real session failed/doesn't exist
        const fallbackToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        if (fallbackToken) {
          const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData') || '{}');
          setSession({ user: userData.email ? userData : { email: 'demo@paylockr.com' } });
          if (view === 'LOGIN') setView('DASHBOARD');
        }
      } catch (err) {
        console.error("Critical Auth Error:", err);
      }
    };

    checkSession();

    // Listen for Auth Changes safely
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session) {
        setSession(session);
        if (view === 'LOGIN') setView('DASHBOARD');
        sessionStorage.removeItem('authToken'); 
      } else {
        // Only reset if we are not in fallback mode
        if (!sessionStorage.getItem('authToken') && !localStorage.getItem('authToken')) {
          setSession(null);
          setView('LOGIN');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [view]);

  const handleLogout = async () => {
    try {
       await supabase.auth.signOut();
    } catch (e) { console.error("Signout error", e); }
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    localStorage.removeItem('userData');
    setSession(null);
    setView('LOGIN');
    setToast({ msg: 'Logged out successfully', type: 'info' });
  };

  const addTransaction = (t: Transaction) => {
    setTransactions([t, ...transactions]);
    setToast({ msg: 'Transaction added', type: 'success' });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const showToast = (msg: string, type: 'success'|'error'|'info') => {
    setToast({ msg, type });
  };

  if (!session && view === 'LOGIN') {
    return (
      <>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <LoginPage 
          onLogin={() => {
            const userDataStr = sessionStorage.getItem('userData') || localStorage.getItem('userData');
            const userData = userDataStr ? JSON.parse(userDataStr) : { email: 'demo@paylockr.com' };
            setSession({ user: userData });
            setView('DASHBOARD');
          }} 
          isDarkMode={isDarkMode} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={28} />
          <span className="text-xl font-black dark:text-white tracking-tight">PayLockr</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {[
            { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'TRANSACTIONS', icon: List, label: 'Transactions' },
            { id: 'VAULT', icon: Wallet, label: 'Tax Vault' },
            { id: 'INSIGHTS', icon: Sparkles, label: 'AI Insights' },
            { id: 'NOTIFICATIONS', icon: Bell, label: 'Notifications' },
            { id: 'SETTINGS', icon: SettingsIcon, label: 'Settings' },
            { id: 'INVOICES', icon: FileText, label: 'Invoices' },
            { id: 'EXPENSES', icon: Receipt, label: 'Expenses' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                view === item.id 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg w-full transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ml-64 ${view === 'DASHBOARD' ? 'p-0' : 'p-8'}`}>
        {view !== 'DASHBOARD' && (
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold dark:text-white capitalize">{view.toLowerCase()}</h1>
              <p className="text-slate-500 text-sm">Welcome back, {session?.user?.email?.split('@')[0] || 'Freelancer'}.</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white relative"
                onClick={() => setView('NOTIFICATIONS')}
              >
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {session?.user?.email?.[0].toUpperCase() || 'F'}
              </div>
            </div>
          </header>
        )}

        {view === 'DASHBOARD' && (
          <DashboardPage 
            transactions={transactions}
            setCurrentView={setView}
            isDarkMode={isDarkMode}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            markNotificationAsRead={markNotificationAsRead}
            markAllAsRead={markAllAsRead}
            deleteNotification={deleteNotification}
            taxDeadlines={MOCK_TAX_DEADLINES}
          />
        )}
        {view === 'TRANSACTIONS' && <TransactionsView transactions={transactions} onAdd={addTransaction} />}
        {view === 'VAULT' && <VaultView transactions={transactions} />}
        {view === 'INSIGHTS' && <InsightsView transactions={transactions} />}
        {view === 'NOTIFICATIONS' && <NotificationsView notifications={notifications} />}
        {view === 'SETTINGS' && <SettingsView settings={settings} setSettings={setSettings} isDark={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />}
        {view === 'INVOICES' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white mb-2">Invoices</h2>
            <p className="text-slate-500 max-w-md">Create professional invoices and track payments effortlessly. This feature is coming soon.</p>
          </div>
        )}
        {view === 'EXPENSES' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white mb-2">Expenses</h2>
            <p className="text-slate-500 max-w-md">Track your business expenses and maximize your deductions. This feature is coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}