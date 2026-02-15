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
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white capitalize">{view.toLowerCase().replace('_', ' ')}</h1>
        <p className="text-slate-500 text-sm">Welcome back, {userName}.</p>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white relative"
          onClick={() => setView('NOTIFICATIONS')}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          )}
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {userInitial}
        </div>
      </div>
    </header>
  );
};