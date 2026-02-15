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
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col fixed h-full z-20 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="text-blue-600" size={28} />
        <span className="text-xl font-black dark:text-white tracking-tight">PayLockr</span>
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
  );
};