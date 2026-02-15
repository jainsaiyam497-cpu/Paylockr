import React, { useState, useEffect } from 'react';
import { ViewState, Transaction, Notification, TaxSettings, TaxDeadline, Invoice, Expense, VaultEntry, BankAccount, VaultDocument } from './types';
import { INITIAL_NOTIFICATIONS, MOCK_TAX_DEADLINES } from './constants';
import { getUserData, getDashboardStats, ClassifiedIncome } from './utils/multiUserUnifiedData';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Auth
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';

// UI Components
import { Button } from './components/common/Button';

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

// Toast Component
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

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  
  // --- SINGLE SOURCE OF TRUTH STATE ---
  const [financialData, setFinancialData] = useState<{
    transactions: Transaction[];
    expenses: Expense[];
    invoices: Invoice[];
    vaultEntries: VaultEntry[];
    classifiedIncomes: ClassifiedIncome[];
    bankAccounts: BankAccount[];
    vaultDocuments: VaultDocument[];
    stats: any;
  } | null>(null);

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

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Auth & Data Loading Effect
  useEffect(() => {
    let mounted = true;

    const loadUserData = (user: any) => {
      if (!user) return;
      try {
        // --- LOAD UNIFIED DATA ONCE ---
        const userId = user.id || 'saiyam';
        const data = getUserData(userId);
        const stats = getDashboardStats(userId);
        
        setFinancialData({
          transactions: data.transactions,
          expenses: data.expenses,
          invoices: data.invoices,
          vaultEntries: data.vaultEntries,
          classifiedIncomes: data.classifiedIncomes,
          bankAccounts: data.bankAccounts,
          vaultDocuments: data.vaultDocuments,
          stats: stats
        });
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

        // Fallback for demo/mock
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
        // Only reset if we are not in fallback mode
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
      const user = JSON.parse(storedData);
      setSession({ user });
      
      // Load data immediately on login interaction
      const userId = user.id || 'saiyam';
      const data = getUserData(userId);
      const stats = getDashboardStats(userId);
      setFinancialData({
        transactions: data.transactions,
        expenses: data.expenses,
        invoices: data.invoices,
        vaultEntries: data.vaultEntries,
        classifiedIncomes: data.classifiedIncomes,
        bankAccounts: data.bankAccounts,
        vaultDocuments: data.vaultDocuments,
        stats: stats
      });

      setView('DASHBOARD');
      setToast({ msg: `Welcome back, ${user.name}!`, type: 'success' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('userData');
    setSession(null);
    setFinancialData(null); // Clear data
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

  // Safe access to data with fallbacks
  const transactions = financialData?.transactions || [];
  const expenses = financialData?.expenses || [];
  const invoices = financialData?.invoices || [];
  const vaultEntries = financialData?.vaultEntries || [];
  const classifiedIncomes = financialData?.classifiedIncomes || [];
  const bankAccounts = financialData?.bankAccounts || [];
  const vaultDocuments = financialData?.vaultDocuments || [];
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <Sidebar view={view} setView={setView} handleLogout={handleLogout} />

      <main className={`flex-1 ml-64 flex flex-col min-h-screen ${view === 'DASHBOARD' ? 'p-0' : 'p-8'}`}>
        {view !== 'DASHBOARD' && (
          <Header 
            view={view} 
            session={session} 
            notifications={notifications} 
            setView={setView} 
          />
        )}

        <div className="flex-1">
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
              stats={stats} // Pass unified stats
            />
          )}
          {view === 'SMART_TAX_VAULT' && (
            <SmartTaxVault 
              userId={userId}
              transactions={transactions}
              classifiedIncomes={classifiedIncomes}
              vaultEntries={vaultEntries}
            />
          )}
          {view === 'TRANSACTIONS' && <Transactions transactions={transactions} onAdd={addTransaction} />}
          {view === 'VAULT' && <Vault documents={vaultDocuments} />}
          {view === 'INSIGHTS' && <Insights transactions={transactions} />}
          {view === 'NOTIFICATIONS' && <Notifications notifications={notifications} />}
          {view === 'SETTINGS' && <Settings settings={settings} setSettings={setSettings} isDark={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />}
          {view === 'INVOICES' && <Invoices invoices={invoices} />}
          {view === 'EXPENSES' && <Expenses expenses={expenses} />}
          {view === 'BANK_ACCOUNTS' && <BankAccounts accounts={bankAccounts} />}
          {view === 'TAX_CALENDAR' && <TaxCalendar userId={userId} />}
          {view === 'TAX_MANAGEMENT' && <TaxManagement stats={stats} />}
          {view === 'HELP' && <Help />}
        </div>
        
        {view !== 'DASHBOARD' && <Footer />}
      </main>
    </div>
  );
}