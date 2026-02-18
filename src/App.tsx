import React, { useState, useEffect } from 'react';
import { ViewState, Transaction, Notification, TaxSettings, TaxDeadline, Invoice, Expense, VaultEntry, BankAccount, VaultDocument, TaxCalendarEntry, AIInsight, ClassifiedIncome } from './types';
import { MOCK_TAX_DEADLINES, generateNotifications } from './constants';
import { getUserData, getDashboardStats } from './utils/multiUserUnifiedData';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

// Layout
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';

// Auth
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';

// UI Components
import { Button } from './components/common/Button';
import { ThemeToggle } from './components/common/ThemeToggle';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Vault } from './pages/Vault';
import { Insights } from './pages/Insights';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Invoices } from './pages/Invoices';
import { Expenses } from './pages/Expenses';
import { BankAccounts } from './pages/BankAccounts';
import { TaxManagement } from './pages/TaxManagement';
import { Help } from './pages/Help';
import { SmartTaxVault } from './pages/SmartTaxVault';
import { TaxCalendar } from './pages/TaxCalendar';
import { supabase } from './services/supabaseClient';

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
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

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  
  const [financialData, setFinancialData] = useState<{
    transactions: Transaction[];
    expenses: Expense[];
    invoices: Invoice[];
    vaultEntries: VaultEntry[];
    classifiedIncomes: ClassifiedIncome[];
    bankAccounts: BankAccount[];
    vaultDocuments: VaultDocument[];
    taxCalendar: TaxCalendarEntry[];
    aiInsights: AIInsight[];
    stats: any;
  } | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settings, setSettings] = useState<TaxSettings>({ 
    regime: 'New', 
    deductions80C: true, 
    deductions80D: false, 
    annualDeductionAmount: 150000, 
    mode: 'Balanced',
    targetVaultAmount: 150000 
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    let mounted = true;

    const loadUserData = (user: any) => {
      if (!user) return;
      try {
        const userId = user.id || 'saiyam';
        const userData = getUserData(userId);
        const dashStats = getDashboardStats(userId);
        
        setFinancialData({
          transactions: userData.transactions,
          expenses: userData.expenses,
          invoices: userData.invoices,
          vaultEntries: userData.vaultEntries,
          classifiedIncomes: userData.classifiedIncomes,
          bankAccounts: userData.bankAccounts,
          vaultDocuments: userData.vaultDocuments,
          taxCalendar: userData.taxCalendar || [],
          aiInsights: userData.aiInsights || [],
          stats: dashStats
        });
        
        setNotifications(generateNotifications(userData.transactions));
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    };

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (data?.session) {
          setSession(data.session);
          loadUserData(data.session.user);
          if (view === 'LOGIN') setView('DASHBOARD');
          return;
        }

        const fallbackUserStr = sessionStorage.getItem('userData');
        if (fallbackUserStr) {
          const user = JSON.parse(fallbackUserStr);
          setSession({ user });
          loadUserData(user);
          if (view === 'LOGIN') setView('DASHBOARD');
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session) {
        setSession(session);
        loadUserData(session.user);
        if (view === 'LOGIN') setView('DASHBOARD');
      } else {
        if (!sessionStorage.getItem('userData')) {
          setSession(null);
          setFinancialData(null);
          setView('LOGIN');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); 

  const handleLoginSuccess = () => {
    const storedData = sessionStorage.getItem('userData');
    if (storedData) {
      try {
        const user = JSON.parse(storedData);
        setSession({ user });
        
        const userId = user.id || 'saiyam';
        const userData = getUserData(userId);
        const dashStats = getDashboardStats(userId);
        
        setFinancialData({
          transactions: userData.transactions,
          expenses: userData.expenses,
          invoices: userData.invoices,
          vaultEntries: userData.vaultEntries,
          classifiedIncomes: userData.classifiedIncomes,
          bankAccounts: userData.bankAccounts,
          vaultDocuments: userData.vaultDocuments,
          taxCalendar: userData.taxCalendar || [],
          aiInsights: userData.aiInsights || [],
          stats: dashStats
        });
        
        setNotifications(generateNotifications(userData.transactions));

        setView('DASHBOARD');
        setToast({ msg: `Welcome back, ${user.name}!`, type: 'success' });
      } catch (err) {
        console.error("Failed to parse user data:", err);
        sessionStorage.removeItem('userData');
        setToast({ msg: 'Session expired. Please login again.', type: 'error' });
        setView('LOGIN');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('userData');
    setSession(null);
    setFinancialData(null);
    setView('LOGIN');
    setToast({ msg: 'Logged out successfully', type: 'info' });
  };

  const addTransaction = (t: Transaction) => {
    if (!financialData) return;
    setFinancialData(prev => prev ? ({
      ...prev,
      transactions: [t, ...prev.transactions]
    }) : null);
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

  const transactions = financialData?.transactions || [];
  const expenses = financialData?.expenses || [];
  const invoices = financialData?.invoices || [];
  const vaultEntries = financialData?.vaultEntries || [];
  const classifiedIncomes = financialData?.classifiedIncomes || [];
  const bankAccounts = financialData?.bankAccounts || [];
  const vaultDocuments = financialData?.vaultDocuments || [];
  const taxCalendar = financialData?.taxCalendar || [];
  const aiInsights = financialData?.aiInsights || [];
  const stats = financialData?.stats || {};

  if (!session) {
    return (
      <>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        {view === 'SIGNUP' ? (
          <SignUp 
            onSignUp={handleLoginSuccess}
            onNavigateToLogin={() => setView('LOGIN')}
            isDarkMode={isDarkMode}
          />
        ) : (
          <Login 
            onLogin={handleLoginSuccess}
            onNavigateToSignup={() => setView('SIGNUP')}
            isDarkMode={isDarkMode} 
          />
        )}
      </>
    );
  }

  const userId = session.user.id || 'saiyam';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-950' : 'bg-gray-100'}`}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      <Sidebar view={view} setView={setView} handleLogout={handleLogout} />

      <main className="md:ml-64 min-h-screen">
        {view !== 'DASHBOARD' && (
          <div className="p-4 md:p-8">
            <Header 
              view={view} 
              session={session} 
              notifications={notifications} 
              setView={setView} 
            />
          </div>
        )}

        <div className={view === 'DASHBOARD' ? '' : 'px-4 md:px-8 pb-8'}>
          {view === 'DASHBOARD' && (
            <Dashboard 
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
              currentUser={session?.user}
              stats={stats}
            />
          )}
          {view === 'SMART_TAX_VAULT' && (
            <SmartTaxVault 
              userId={userId}
              transactions={transactions}
              classifiedIncomes={classifiedIncomes}
              vaultEntries={vaultEntries}
              setCurrentView={setView}
              stats={stats}
            />
          )}
          {view === 'TRANSACTIONS' && <Transactions transactions={transactions} onAdd={addTransaction} onUpdate={(updated) => {
            setFinancialData(prev => prev ? ({
              ...prev,
              transactions: prev.transactions.map(t => t.id === updated.id ? updated : t)
            }) : null);
            setToast({ msg: 'Transaction updated', type: 'success' });
          }} />}
          {view === 'VAULT' && <Vault documents={vaultDocuments} onAdd={(doc) => {
            setFinancialData(prev => prev ? ({...prev, vaultDocuments: [doc, ...prev.vaultDocuments]}) : null);
            setToast({ msg: 'Document uploaded successfully', type: 'success' });
          }} onDelete={(docId) => {
            setFinancialData(prev => prev ? ({...prev, vaultDocuments: prev.vaultDocuments.filter(d => d.id !== docId)}) : null);
            setToast({ msg: 'Document deleted successfully', type: 'success' });
          }} />}
          {view === 'INSIGHTS' && <Insights transactions={transactions} expenses={expenses} totalIncome={stats?.totalIncome} vaultBalance={stats?.vaultBalance} taxLiability={stats?.projectedTaxLiability} />}
          {view === 'NOTIFICATIONS' && <Notifications notifications={notifications} />}
          {view === 'SETTINGS' && <Settings settings={settings} setSettings={setSettings} isDark={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} onLogout={handleLogout} />}
          {view === 'INVOICES' && <Invoices invoices={invoices} onShowToast={(msg, type) => setToast({ msg, type })} onDelete={(invId) => {
            setFinancialData(prev => prev ? ({...prev, invoices: prev.invoices.filter(i => i.id !== invId)}) : null);
          }} onAdd={(inv) => {
            setFinancialData(prev => prev ? ({...prev, invoices: [inv, ...prev.invoices]}) : null);
            const transaction = {
              id: `txn-${inv.id}`,
              amount: inv.amount,
              type: 'Business Income' as any,
              source: inv.clientName,
              category: 'FREELANCE',
              date: inv.date,
              status: 'PENDING' as any,
              estimatedTax: inv.amount * 0.1,
              description: `Invoice ${inv.invoiceNumber}`,
              referenceId: inv.invoiceNumber
            };
            addTransaction(transaction);
            setToast({ msg: 'Invoice created and added to transactions', type: 'success' });
          }} />}
          {view === 'EXPENSES' && <Expenses expenses={expenses} onAdd={(exp) => {
            setFinancialData(prev => {
              if (!prev) return null;
              const updatedExpenses = [exp, ...prev.expenses];
              // Recalculate stats with new expense
              const userId = session.user.id || 'saiyam';
              const dashStats = getDashboardStats(userId);
              return {...prev, expenses: updatedExpenses, stats: {...dashStats, totalExpense: dashStats.totalExpense + exp.amount}};
            });
            setToast({ msg: `Expense added: ₹${exp.amount}`, type: 'success' });
          }} />}
          {view === 'BANK_ACCOUNTS' && <BankAccounts accounts={bankAccounts} onDelete={(accId) => {
            setFinancialData(prev => prev ? ({...prev, bankAccounts: prev.bankAccounts.filter(a => a.id !== accId)}) : null);
            setToast({ msg: 'Account deleted successfully', type: 'success' });
          }} onUpdate={(acc) => {
            setFinancialData(prev => prev ? ({...prev, bankAccounts: prev.bankAccounts.map(a => a.id === acc.id ? acc : a)}) : null);
            setToast({ msg: 'Account updated successfully', type: 'success' });
          }} />}
          {view === 'TAX_CALENDAR' && <TaxCalendar userId={userId} />}
          {view === 'TAX_MANAGEMENT' && <TaxManagement stats={stats} />}
          {view === 'HELP' && <Help />}
        </div>
        
        {view !== 'DASHBOARD' && (
          <div className="px-4 md:px-8">
            <Footer />
          </div>
        )}
      </main>
    </div>
  );
}
