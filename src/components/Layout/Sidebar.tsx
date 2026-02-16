import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Settings as SettingsIcon, 
  Bell, 
  LogOut, 
  List,
  Sparkles,
  ShieldCheck,
  Calendar,
  FileText,
  Receipt,
  Landmark,
  Lock
} from 'lucide-react';
import { ViewState } from '../../types';

interface SidebarProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, handleLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white dark:bg-black border-r-4 border-yellow-400 flex flex-col fixed h-full transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0 z-40' : '-translate-x-full md:translate-x-0 z-40'
      }`}>
        <div className="p-6 pl-16 md:pl-6 flex items-center gap-3 border-b-2 border-gray-200 dark:border-gray-800">
          <ShieldCheck className="text-yellow-500 dark:text-yellow-400" size={28} />
          <span className="text-xl font-black uppercase text-black dark:text-white tracking-tight">PAYLOCKR</span>
        </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {[
          { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'SMART_TAX_VAULT', icon: Wallet, label: 'Smart Tax Vault' },
          { id: 'TRANSACTIONS', icon: List, label: 'Transactions' },
          { id: 'INVOICES', icon: FileText, label: 'Invoices' },
          { id: 'EXPENSES', icon: Receipt, label: 'Expenses' },
          { id: 'VAULT', icon: Lock, label: 'Document Vault' },
          { id: 'TAX_CALENDAR', icon: Calendar, label: 'Tax Calendar' },
          { id: 'BANK_ACCOUNTS', icon: Landmark, label: 'Bank Accounts' },
          { id: 'INSIGHTS', icon: Sparkles, label: 'AI Insights' },
          { id: 'NOTIFICATIONS', icon: Bell, label: 'Notifications' },
          { id: 'SETTINGS', icon: SettingsIcon, label: 'Settings' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setView(item.id as ViewState);
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold uppercase text-xs transition-all ${
              view === item.id 
                ? 'bg-yellow-400 text-black' 
                : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t-2 border-gray-200 dark:border-gray-800">
        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 dark:text-red-400 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors font-bold uppercase text-xs">
          <LogOut size={20} /> LOGOUT
        </button>
      </div>
    </aside>
    </>
  );
};