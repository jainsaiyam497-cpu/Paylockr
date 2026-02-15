import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up">
      {notifications.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800">
          <p className="text-slate-500">No notifications yet</p>
        </div>
      ) : (
        notifications.map(n => (
          <div key={n.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800 flex gap-4 hover:shadow-md transition-shadow">
            <div className={`p-2 rounded-full h-fit flex-shrink-0 ${
              n.type === 'success' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 
              n.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 
              'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              {n.type === 'success' ? <CheckCircle size={20} /> : 
               n.type === 'warning' ? <AlertTriangle size={20} /> : 
               <Info size={20} />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{n.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
              <p className="text-xs text-slate-400 mt-2">{n.timestamp}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};