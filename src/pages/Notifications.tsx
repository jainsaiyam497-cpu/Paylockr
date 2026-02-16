import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X, Bell, Filter } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  const [filter, setFilter] = useState<'ALL' | 'success' | 'warning' | 'info'>('ALL');

  const filteredNotifications = filter === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;
  const successCount = notifications.filter(n => n.type === 'success').length;
  const warningCount = notifications.filter(n => n.type === 'warning').length;
  const infoCount = notifications.filter(n => n.type === 'info').length;

  const getRelativeTime = (date: Date | string) => {
    const d = new Date(date);
    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
    if (seconds < 60) return 'JUST NOW';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}M AGO`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}H AGO`;
    return `${Math.floor(seconds / 86400)}D AGO`;
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      <div className="bg-black border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-black uppercase text-white">NOTIFICATIONS</h1>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {unreadCount} UNREAD NOTIFICATIONS
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black border-l-4 border-white p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">TOTAL</p>
            <p className="text-2xl font-black text-white">{notifications.length}</p>
          </div>
          <div className="bg-black border-l-4 border-green-500 p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">SUCCESS</p>
            <p className="text-2xl font-black text-green-400">{successCount}</p>
          </div>
          <div className="bg-black border-l-4 border-yellow-400 p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">WARNINGS</p>
            <p className="text-2xl font-black text-yellow-400">{warningCount}</p>
          </div>
          <div className="bg-black border-l-4 border-cyan-500 p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">INFO</p>
            <p className="text-2xl font-black text-cyan-400">{infoCount}</p>
          </div>
        </div>

        <div className="bg-black border-2 border-gray-800 p-4 mb-8 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-white" />
            <span className="font-black uppercase text-white text-sm">FILTER BY TYPE</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'success', 'warning', 'info'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-4 py-2 font-bold uppercase text-xs transition ${
                  filter === type
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="bg-black border-l-8 border-cyan-500 p-12 text-center shadow-lg">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl font-black uppercase text-white mb-2">NO NOTIFICATIONS</p>
            <p className="text-xs font-bold uppercase text-gray-500">YOU'RE ALL CAUGHT UP!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(n => (
              <div 
                key={n.id} 
                className={`bg-black border-l-8 p-6 shadow-lg transition hover:bg-gray-900 ${
                  n.type === 'success' ? 'border-green-500' :
                  n.type === 'warning' ? 'border-yellow-400' :
                  'border-cyan-500'
                } ${!n.read ? 'ring-2 ring-yellow-400' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${
                    n.type === 'success' ? 'bg-green-500/20 text-green-400' :
                    n.type === 'warning' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {n.type === 'success' ? <CheckCircle size={24} /> :
                     n.type === 'warning' ? <AlertTriangle size={24} /> :
                     <Info size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-black uppercase text-white">{n.title}</h4>
                      {!n.read && (
                        <span className="text-xs font-black uppercase px-2 py-1 bg-yellow-400 text-black flex-shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold uppercase text-gray-500 mb-3">{n.message}</p>
                    <div className="flex items-center gap-4">
                      <p className="text-xs font-bold uppercase text-gray-600">
                        {getRelativeTime(n.timestamp)}
                      </p>
                      <span className={`text-xs font-black uppercase px-2 py-0.5 ${
                        n.type === 'success' ? 'bg-green-500 text-black' :
                        n.type === 'warning' ? 'bg-yellow-400 text-black' :
                        'bg-cyan-500 text-black'
                      }`}>
                        {n.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
