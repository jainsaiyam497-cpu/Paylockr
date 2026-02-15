import React from 'react';
import { Bell } from 'lucide-react';
import { ViewState, Notification } from '../../types';

interface HeaderProps {
  view: ViewState;
  session: any;
  notifications: Notification[];
  setView: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ view, session, notifications, setView }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const userInitial = session?.user?.email?.[0].toUpperCase() || 'F';
  const userName = session?.user?.email?.split('@')[0] || 'Freelancer';

  return (
    <header className="mb-6 md:mb-8 pl-16 md:pl-0">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {view.toLowerCase().replace(/_/g, ' ')}
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">Welcome back, {userName}.</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <button 
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white relative rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setView('NOTIFICATIONS')}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base shadow-sm">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
};