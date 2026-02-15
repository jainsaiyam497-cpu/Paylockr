import React, { useRef, useEffect } from 'react';
import { 
  Bell, 
  HelpCircle,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  XCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp, 
  ArrowDownLeft
} from 'lucide-react';
import { Transaction, ViewState, TaxDeadline, TransactionType, TransactionStatus } from '../types';
import { Stats } from '../components/dashboard/Stats';
import { Chart } from '../components/dashboard/Chart';
import { QuickActions } from '../components/dashboard/QuickActions';

interface DashboardProps {
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
  currentUser: any;
  stats: any; // Received from App.tsx
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  transactions: propTransactions,
  setCurrentView, 
  isDarkMode,
  notifications,
  showNotifications,
  setShowNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  taxDeadlines,
  currentUser,
  stats
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Use passed transactions to ensure consistency
  const recentTransactions = propTransactions.slice(0, 5);

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

  // Use pre-calculated stats from App.tsx (Single Source of Truth)
  const totalIncome = stats?.totalIncome || 0;
  const estimatedTax = stats?.vaultBalance || 0; 
  const vaultBalance = stats?.vaultBalance || 0;
  const spendable = stats?.availableBalance || 0;

  // Use dynamic chart data from stats if available, else empty array
  const chartData = stats?.monthlyBreakdown || [];

  const getRelativeTime = (date: Date | string) => {
    const d = new Date(date);
    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
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

  const calculateTaxHealth = () => {
    const taxPercentage = totalIncome > 0 ? (estimatedTax / totalIncome) * 100 : 0;
    if (taxPercentage >= 10) return { status: 'Excellent', color: isDarkMode ? 'text-green-400' : 'text-green-600', icon: '🟢' };
    if (taxPercentage >= 5) return { status: 'Good', color: isDarkMode ? 'text-blue-400' : 'text-blue-600', icon: '🔵' };
    return { status: 'Needs Attention', color: isDarkMode ? 'text-amber-400' : 'text-amber-600', icon: '🟡' };
  };

  const taxHealth = calculateTaxHealth();
  const nextDeadline = taxDeadlines.find(d => d.status === 'Upcoming' || d.status === 'Due');

  return (
    <>
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentUser ? `Welcome back, ${currentUser.name ? currentUser.name.split(' ')[0] : 'Freelancer'}! 👋` : 'Dashboard'}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stats 
          totalIncome={totalIncome} 
          estimatedTax={estimatedTax} 
          vaultBalance={vaultBalance} 
          spendable={spendable} 
          isDarkMode={isDarkMode} 
        />

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Chart data={chartData} isDarkMode={isDarkMode} />
          <QuickActions setCurrentView={setCurrentView} vaultBalance={vaultBalance} isDarkMode={isDarkMode} />
        </div>

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
    </>
  );
};