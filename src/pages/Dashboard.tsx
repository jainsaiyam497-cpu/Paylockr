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
  ArrowDownLeft,
  Mail
} from 'lucide-react';
import { Transaction, ViewState, TaxDeadline, TransactionType, TransactionStatus } from '../types';
import { Stats } from '../components/Dashboard/Stats';
import { Chart } from '../components/Dashboard/Chart';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { TaxBreakdown } from '../components/Dashboard/TaxBreakdown';
import { TaxSlabExplainer } from '../components/Dashboard/TaxSlabExplainer';
import { calculateTax, getTaxSlab } from '../utils/taxCalculator';
import { sendMonthlyReport } from '../services/emailService';

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
  const [incomeView, setIncomeView] = React.useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [emailSending, setEmailSending] = React.useState(false);
  
  // Use passed transactions to ensure consistency
  const recentTransactions = propTransactions.slice(0, 5);

  const handleSendReport = async () => {
    const email = prompt('📧 Enter your email address:');
    if (!email || !email.includes('@')) {
      alert('❌ Invalid email address');
      return;
    }
    
    setEmailSending(true);
    try {
      const result = await sendMonthlyReport(email, {
        income: cumulativeIncome,
        expenses: stats?.totalExpense || 0,
        taxSaved: vaultBalance,
        month: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      });
      if (result.success) {
        alert(`✅ Report sent to ${email}!`);
      } else {
        console.error('Email error:', result.error);
        alert(`❌ Failed: ${result.error || 'Check EmailJS template settings'}`);
      }
    } catch (error) {
      alert('❌ Email service not configured. Add EmailJS keys to .env.local');
    } finally {
      setEmailSending(false);
    }
  };

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
  const cumulativeIncome = stats?.totalIncome || 0;
  const avgMonthlyIncome = cumulativeIncome / 12; // Average over 12 months
  const vaultBalance = stats?.vaultBalance || 0;
  const spendable = stats?.availableBalance || 0;

  // Calculate based on view selection
  const displayIncome = incomeView === 'MONTHLY' ? avgMonthlyIncome : cumulativeIncome;
  const projectedAnnualIncome = avgMonthlyIncome * 12;
  
  const taxCalc = calculateTax(projectedAnnualIncome, 0, 'NEW');
  const taxSlab = getTaxSlab(projectedAnnualIncome, 'NEW');
  const estimatedTax = incomeView === 'MONTHLY' ? Math.round(taxCalc.totalTax / 12) : taxCalc.totalTax;

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
    const taxPercentage = avgMonthlyIncome > 0 ? (estimatedTax / avgMonthlyIncome) * 100 : 0;
    if (taxPercentage >= 10) return { status: 'Excellent', color: isDarkMode ? 'text-green-400' : 'text-green-600', icon: '🟢' };
    if (taxPercentage >= 5) return { status: 'Good', color: isDarkMode ? 'text-blue-400' : 'text-blue-600', icon: '🔵' };
    return { status: 'Needs Attention', color: isDarkMode ? 'text-amber-400' : 'text-amber-600', icon: '🟡' };
  };

  const taxHealth = calculateTaxHealth();
  const nextDeadline = taxDeadlines.find(d => d.status === 'Upcoming' || d.status === 'Due');

  return (
    <>
      <div className={`${isDarkMode ? 'bg-black border-b-2 border-gray-800' : 'bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-2 pl-16 md:pl-0">
            <div className="flex-1 min-w-0">
              <h1 className={`text-xl sm:text-2xl md:text-4xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'} truncate`}>
                {currentUser ? `${currentUser.name ? currentUser.name.split(' ')[0] : 'FREELANCER'}` : 'DASHBOARD'}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  TAX HEALTH:
                </span>
                <span className={`text-xs font-bold uppercase px-2 py-1 ${taxHealth.color === (isDarkMode ? 'text-green-400' : 'text-green-600') ? 'bg-green-500 text-black' : taxHealth.color === (isDarkMode ? 'text-blue-400' : 'text-blue-600') ? 'bg-cyan-500 text-black' : 'bg-yellow-400 text-black'}`}>
                  {taxHealth.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-3 border-2 ${isDarkMode ? 'border-gray-800 hover:border-yellow-400' : 'border-gray-300 hover:border-yellow-400'} transition-all`}
                  aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                >
                  <Bell className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} aria-hidden="true" />
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
                        <h2 className={`font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          NOTIFICATIONS
                        </h2>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-bold uppercase text-cyan-500 hover:text-cyan-400 py-2"
                            aria-label="Mark all as read"
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
                                  <h3 className={`font-black uppercase text-xs ${isDarkMode ? 'text-white' : 'text-black'} truncate`}>
                                    {notification.title}
                                  </h3>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className={`flex-shrink-0 p-2 ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                    aria-label="Delete notification"
                                  >
                                    <X className="w-4 h-4" aria-hidden="true" />
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
                aria-label="Get help"
              >
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
                <span className="hidden sm:inline">HELP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Income View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIncomeView('MONTHLY')}
              className={`px-4 py-2 font-bold uppercase text-xs transition-all ${
                incomeView === 'MONTHLY'
                  ? 'bg-yellow-400 text-black'
                  : isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
              aria-label="View monthly income"
            >
              Monthly
            </button>
            <button
              onClick={() => setIncomeView('YEARLY')}
              className={`px-4 py-2 font-bold uppercase text-xs transition-all ${
                incomeView === 'YEARLY'
                  ? 'bg-yellow-400 text-black'
                  : isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
              aria-label="View yearly income"
            >
              Yearly
            </button>
          </div>
          <button
            onClick={handleSendReport}
            disabled={emailSending}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold uppercase text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            {emailSending ? 'SENDING...' : 'EMAIL REPORT'}
          </button>
        </div>

        <Stats 
          totalIncome={displayIncome} 
          estimatedTax={estimatedTax} 
          vaultBalance={vaultBalance} 
          spendable={spendable} 
          isDarkMode={isDarkMode}
          effectiveTaxRate={taxCalc.effectiveRate}
          incomeView={incomeView}
          totalExpense={stats?.totalExpense || 0}
        />

        {nextDeadline && (
          <div className={`mb-8 p-6 border-l-8 ${isDarkMode ? 'bg-black border-yellow-400' : 'bg-white border-yellow-400'} shadow-lg`}>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <Calendar className={`w-12 h-12 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} flex-shrink-0`} />
              <div className="flex-1">
                <h2 className={`text-lg font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'} mb-2`}>
                  NEXT DEADLINE: {nextDeadline.quarter}
                </h2>
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
                aria-label="View tax calendar"
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

        {/* Tax Explanation Card */}
        <div className={`${isDarkMode ? 'bg-black border-l-8 border-cyan-500' : 'bg-white border-l-8 border-cyan-500'} p-6 mb-8 shadow-lg`}>
          <h2 className={`text-xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'} mb-4`}>
            💡 YOUR TAX BREAKDOWN EXPLAINED
          </h2>
          <div className="space-y-4">
            <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                Your average monthly income is <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} font-black`}>₹{Math.round(avgMonthlyIncome).toLocaleString('en-IN')}</span>. 
                Based on projected annual income of <span className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} font-black`}>₹{projectedAnnualIncome.toLocaleString('en-IN')}</span>, 
                you fall in the <span className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} font-black`}>{taxSlab.rate}% tax slab</span> ({taxSlab.label}).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 border-l-4 ${isDarkMode ? 'border-green-500 bg-gray-900' : 'border-green-500 bg-green-50'}`}>
                <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>AVG MONTHLY INCOME</p>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{Math.round(avgMonthlyIncome).toLocaleString('en-IN')}</p>
                <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-1`}>OVER 12 MONTHS</p>
              </div>
              
              <div className={`p-4 border-l-4 ${isDarkMode ? 'border-cyan-500 bg-gray-900' : 'border-cyan-500 bg-cyan-50'}`}>
                <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-2`}>PROJECTED ANNUAL</p>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{projectedAnnualIncome.toLocaleString('en-IN')}</p>
                <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-1`}>FOR TAX CALCULATION</p>
              </div>
            </div>

            <div className={`p-4 ${isDarkMode ? 'bg-gray-900 border-2 border-yellow-400' : 'bg-yellow-50 border-2 border-yellow-400'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>ANNUAL TAX CALCULATION</p>
                <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>NEW REGIME 2026</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projected Income</span>
                  <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{projectedAnnualIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Standard Deduction</span>
                  <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>- ₹75,000</span>
                </div>
                <div className={`pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} flex items-center justify-between`}>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taxable Income</span>
                  <span className={`text-xs font-black ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>₹{taxCalc.taxableIncome.toLocaleString('en-IN')}</span>
                </div>
                {taxCalc.breakdown?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.slab} @ {taxSlab.rate}%
                    </span>
                    <span className={`text-xs font-black ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      ₹{Math.round(item.tax).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className={`pt-2 border-t-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} flex items-center justify-between`}>
                  <span className={`text-sm font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>ANNUAL TAX LIABILITY</span>
                  <span className={`text-lg font-black ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    ₹{Math.round(taxCalc.totalTax).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-4 ${isDarkMode ? 'bg-cyan-900/20 border-2 border-cyan-500' : 'bg-cyan-50 border-2 border-cyan-500'}`}>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'} leading-relaxed mb-2`}>
                💰 <span className="font-black">VAULT STATUS:</span> We've automatically saved ₹{vaultBalance.toLocaleString('en-IN')} (10% of your income) in your tax vault.
              </p>
              <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • Your actual annual tax liability: ₹{Math.round(taxCalc.totalTax).toLocaleString('en-IN')}<br/>
                • Vault has: ₹{vaultBalance.toLocaleString('en-IN')}<br/>
                • {vaultBalance >= taxCalc.totalTax ? '✅ You have enough saved!' : '⚠️ Keep saving to meet your tax obligation'}
              </p>
            </div>
          </div>
        </div>



        <div className={`${isDarkMode ? 'bg-black border-l-8 border-cyan-500' : 'bg-white dark:bg-black border-l-8 border-cyan-500'} p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                RECENT TRANSACTIONS
              </h2>
              <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-2`}>
                LATEST {recentTransactions.length}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('TRANSACTIONS')}
              className="text-cyan-500 hover:text-cyan-400 font-bold uppercase text-xs flex items-center gap-1 transition-colors py-2"
              aria-label="View all transactions"
            >
              VIEW ALL
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
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