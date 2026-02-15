import React, { useState } from 'react';
import { Bell, Moon, Sun, Download, Trash2, Mail, MessageSquare } from 'lucide-react';
import { AppSettings } from '../../types';

interface AppTabProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const AppTab: React.FC<AppTabProps> = ({ isDark, toggleTheme }) => {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: { email: true, sms: false, inApp: true },
    autoImport: false,
    darkMode: isDark
  });

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold dark:text-white mb-6">Appearance</h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
               {isDark ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-amber-500" />}
             </div>
             <div>
               <p className="font-medium dark:text-white">Dark Mode</p>
               <p className="text-sm text-slate-500">Adjust the interface for low light.</p>
             </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDark ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold dark:text-white mb-6">Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-xl">
             <div className="flex items-center gap-3">
                <Mail className="text-slate-400" size={20} />
                <span className="dark:text-white">Email Notifications</span>
             </div>
             <input 
               type="checkbox" 
               checked={settings.notifications.email} 
               onChange={() => toggleNotification('email')}
               className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
             />
          </div>
          <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-xl">
             <div className="flex items-center gap-3">
                <MessageSquare className="text-slate-400" size={20} />
                <span className="dark:text-white">SMS Alerts</span>
             </div>
             <input 
               type="checkbox" 
               checked={settings.notifications.sms} 
               onChange={() => toggleNotification('sms')}
               className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
             />
          </div>
          <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-xl">
             <div className="flex items-center gap-3">
                <Bell className="text-slate-400" size={20} />
                <span className="dark:text-white">In-App Notifications</span>
             </div>
             <input 
               type="checkbox" 
               checked={settings.notifications.inApp} 
               onChange={() => toggleNotification('inApp')}
               className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
             />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold dark:text-white mb-6">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Auto-Import Transactions</p>
              <p className="text-sm text-slate-500">Automatically sync from connected banks.</p>
            </div>
             <button 
                onClick={() => setSettings(p => ({...p, autoImport: !p.autoImport}))}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoImport ? 'bg-green-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.autoImport ? 'left-7' : 'left-1'}`}></div>
              </button>
          </div>
          
          <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
             <Download size={18} /> Export Data (CSV/PDF)
          </button>
        </div>
      </div>

      <div className="pt-8 border-t dark:border-slate-800">
         <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
         <p className="text-slate-500 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
         <button className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2">
           <Trash2 size={18} /> Delete Account
         </button>
      </div>
    </div>
  );
};