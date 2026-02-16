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
import { Stats } from '../components/Dashboard/Stats';
import { Chart } from '../components/Dashboard/Chart';
import { QuickActions } from '../components/Dashboard/QuickActions';

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
      <div className={`${isDarkMode ? 'bg-black border-b-2 border-gray-800' : 'bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pl-16 md:pl-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className={`text-2xl md:text-4xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'} truncate`}>
                {currentUser ? `${currentUser.name ? currentUser.name.split(' ')[0] : 'FREELANCER'}` : 'DASHBOARD'}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  TAX HEALTH:
                </span>
                <span className={`text-xs font-bold uppercase px-3 py-1 ${taxHealth.color === (isDarkMode ? 'text-green-400' : 'text-green-600') ? 'bg-green-500 text-black' : taxHealth.color === (isDarkMode ? 'text-blue-400' : 'text-blue-600') ? 'bg-cyan-500 text-black' : 'bg-yellow-400 text-black'}`}>
                  {taxHealth.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-3 border-2 ${isDarkMode ? 'border-gray-800 hover:border-yellow-400' : 'border-gray-300 hover:border-yellow-400'} transition-all`}
                >
                  <Bell className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black text-xs font-black flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className={`fixed md:absolute right-4 md:right-0 top-16 md:top-auto md:mt-2 w-[calc(100vw-2rem)] md:w-96 ${
                    isDarkMode ? 'bg-black border-yellow-400' : 'bg-white dark:bg-black border-yellow-400'
                  } border-4 max-h-[32rem] overflow-hidden flex flex-col z-[100]`}>
                    <div className={`p-4 border-b-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          NOTIFICATIONS
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-bold uppercase text-cyan-500 hover:text-cyan-400"
                          >
                            MARK ALL AS READ
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                          <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            NO NOTIFICATIONS YET
                          </p>
                        </div>
                      ) : (
                        notifications.map(notification => {
                          const handleNotificationClick = () => {
                            markNotificationAsRead(notification.id);
                            if (notification.title.includes('Money Credited') || notification.title.includes('Money Debited') || notification.title.includes('Tax Vaulted')) {
                              setCurrentView('TRANSACTIONS');
                            } else if (notification.title.includes('Tax Deadline') || notification.title.includes('GST Filing') || notification.title.includes('TDS')) {
                              setCurrentView('TAX_CALENDAR');
                            }
                          };
                          
                          return (
                          <div
                            key={notification.id}
                            className={`p-4 border-b-2 ${
                              isDarkMode ? 'border-gray-800' : 'border-gray-200'
                            } ${
                              !notification.read 
                                ? isDarkMode ? 'bg-gray-900' : 'bg-gray-100' 
                                : ''
                            } hover:${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors cursor-pointer`}
                            onClick={handleNotificationClick}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`font-black uppercase text-xs ${isDarkMode ? 'text-white' : 'text-black'} truncate`}>
                                    {notification.title}
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className={`flex-shrink-0 ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                                  {notification.message}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-500'} mt-2 font-bold`}>
                                  {getRelativeTime(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentView('HELP')}
                className={`p-3 border-2 font-bold uppercase text-xs ${isDarkMode ? 'border-gray-800 hover:border-cyan-500 text-white' : 'border-gray-300 hover:border-cyan-500 text-black'} transition-all flex items-center gap-2`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden md:inline">HELP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Stats 
          totalIncome={totalIncome} 
          estimatedTax={estimatedTax} 
          vaultBalance={vaultBalance} 
          spendable={spendable} 
          isDarkMode={isDarkMode} 
        />

        {nextDeadline && (
          <div className={`mb-8 p-6 border-l-8 ${isDarkMode ? 'bg-black border-yellow-400' : 'bg-white border-yellow-400'} shadow-lg`}>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <Calendar className={`w-12 h-12 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} flex-shrink-0`} />
              <div className="flex-1">
                <h3 className={`text-lg font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'} mb-2`}>
                  NEXT DEADLINE: {nextDeadline.quarter}
                </h3>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-4`}>
                  {new Date(nextDeadline.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>ESTIMATED</p>
                    <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{nextDeadline.estimatedAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>VAULT</p>
                    <p className={`text-2xl font-black ${vaultBalance >= nextDeadline.estimatedAmount ? (isDarkMode ? 'text-green-400' : 'text-green-500') : (isDarkMode ? 'text-red-400' : 'text-red-500')}`}>
                      ₹{vaultBalance.toLocaleString('en-IN')} {vaultBalance >= nextDeadline.estimatedAmount ? '✓' : '⚠'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('TAX_CALENDAR')}
                className="w-full md:w-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase transition-all"
              >
                VIEW CALENDAR
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Chart data={chartData} isDarkMode={isDarkMode} />
          <QuickActions setCurrentView={setCurrentView} vaultBalance={vaultBalance} isDarkMode={isDarkMode} />
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${isDarkMode ? 'bg-black border-l-4 border-green-500' : 'bg-white dark:bg-black border-l-4 border-green-500'} p-6`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>MONTHLY INCOME</p>
            <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{totalIncome.toLocaleString('en-IN')}</p>
            <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-green-400' : 'text-green-600'} mt-2`}>+15% FROM LAST MONTH</p>
          </div>
          <div className={`${isDarkMode ? 'bg-black border-l-4 border-red-500' : 'bg-white dark:bg-black border-l-4 border-red-500'} p-6`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>TAX LIABILITY</p>
            <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{estimatedTax.toLocaleString('en-IN')}</p>
            <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-2`}>{((estimatedTax/totalIncome)*100).toFixed(1)}% OF INCOME</p>
          </div>
          <div className={`${isDarkMode ? 'bg-black border-l-4 border-cyan-500' : 'bg-white dark:bg-black border-l-4 border-cyan-500'} p-6`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>SAVINGS RATE</p>
            <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{((vaultBalance/totalIncome)*100).toFixed(0)}%</p>
            <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} mt-2`}>EXCELLENT PROGRESS</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-black border-l-8 border-cyan-500' : 'bg-white dark:bg-black border-l-8 border-cyan-500'} p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                RECENT TRANSACTIONS
              </h3>
              <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-2`}>
                LATEST {recentTransactions.length}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('TRANSACTIONS')}
              className="text-cyan-500 hover:text-cyan-400 font-bold uppercase text-xs flex items-center gap-1 transition-colors"
            >
              VIEW ALL
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 border-l-8 ${
                  transaction.type === TransactionType.BUSINESS 
                    ? 'border-green-500' 
                    : 'border-red-500'
                } ${isDarkMode ? 'bg-black hover:bg-gray-900' : 'bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900'} transition-all cursor-pointer shadow-lg`}
                onClick={() => setCurrentView('TRANSACTIONS')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${
                    transaction.type === TransactionType.BUSINESS 
                      ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                      : isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                  } flex items-center justify-center`}>
                    {transaction.type === TransactionType.BUSINESS ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <ArrowDownLeft className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className={`font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {transaction.source}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase()}
                      </span>
                      <span className={`text-xs font-black uppercase px-2 py-0.5 ${
                        transaction.status === TransactionStatus.VAULTED
                          ? 'bg-green-500 text-black'
                          : transaction.status === TransactionStatus.PENDING
                          ? 'bg-yellow-400 text-black'
                          : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </p>
                  {transaction.estimatedTax > 0 && (
                    <p className={`text-xs font-black uppercase ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} mt-1`}>
                      TAX: ₹{transaction.estimatedTax.toLocaleString('en-IN')}
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