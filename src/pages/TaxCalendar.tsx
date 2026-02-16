import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, AlertCircle, Bell, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { getUserData } from '../utils/multiUserUnifiedData';

export const TaxCalendar: React.FC<{ userId?: string }> = ({ userId = 'saiyam' }) => {
  const userData = getUserData(userId);
  const taxCalendar = userData.taxCalendar || [];
  
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const calculateDaysLeft = (eventDate: Date) => {
    const diff = eventDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Convert tax calendar to event format
  const allTaxEvents = taxCalendar.map(entry => ({
    date: entry.dueDate,
    title: entry.description,
    description: `${entry.type} - ₹${entry.amount.toLocaleString()} due`,
    type: entry.type === 'QUARTERLY' ? 'PAYMENT' : 'FILING',
    category: entry.type,
    amount: entry.amount,
    status: entry.status.toLowerCase(),
    quarter: entry.quarter
  }));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const getEventsForDay = (day: number) => {
    return allTaxEvents.filter(e => 
      e.date.getDate() === day && 
      e.date.getMonth() === currentMonth && 
      e.date.getFullYear() === currentYear &&
      (filterType === 'ALL' || e.category === filterType)
    );
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const filteredEvents = filterType === 'ALL' ? allTaxEvents : allTaxEvents.filter(e => e.category === filterType);
  const upcomingEvents = filteredEvents
    .filter(e => e.date >= today && e.status !== 'completed')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 8);
    
  const completedCount = allTaxEvents.filter(e => e.status === 'completed').length;
  const pendingCount = allTaxEvents.filter(e => e.status === 'pending').length;
  const upcomingCount = allTaxEvents.filter(e => e.status === 'upcoming').length;

  const categories = [
    { value: 'ALL', label: 'All', color: 'blue' },
    { value: 'QUARTERLY', label: 'Quarterly Tax', color: 'purple' },
    { value: 'ANNUAL', label: 'Annual ITR', color: 'green' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black">Tax Calendar FY 2024-25</h1>
              <p className="text-indigo-100 text-lg font-medium">Complete compliance calendar with {allTaxEvents.length}+ deadlines</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-black">{completedCount}</span>
          </div>
          <p className="text-green-100 font-semibold">Completed</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-black">{pendingCount}</span>
          </div>
          <p className="text-orange-100 font-semibold">Pending</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-black">{upcomingCount}</span>
          </div>
          <p className="text-blue-100 font-semibold">Upcoming</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Filter by Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilterType(cat.value)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                filterType === cat.value
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-3 hover:bg-white/20 rounded-xl transition text-white">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-3xl font-black text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button onClick={handleNextMonth} className="p-3 hover:bg-white/20 rounded-xl transition text-white">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-3 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center font-bold text-slate-600 dark:text-slate-400 py-3 text-lg">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDay(day);
              const hasEvents = events.length > 0;
              
              return (
                <div
                  key={day}
                  onClick={() => hasEvents && setSelectedEvent(events[0])}
                  className={`aspect-square border-2 rounded-2xl p-3 transition-all cursor-pointer ${
                    isToday(day)
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-600 shadow-xl scale-105'
                      : hasEvents
                      ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-orange-300 dark:border-orange-700 hover:shadow-lg hover:scale-105'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'
                  }`}
                >
                  <div className={`text-lg font-black mb-1 ${isToday(day) ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {day}
                  </div>
                  {hasEvents && (
                    <div className="space-y-1">
                      {events.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-lg font-bold truncate shadow-sm ${
                            event.type === 'PAYMENT' ? 'bg-red-500 text-white' :
                            event.type === 'FILING' ? 'bg-purple-500 text-white' :
                            event.type === 'DEADLINE' ? 'bg-orange-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border dark:border-slate-700 p-6">
          <h3 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            Upcoming Deadlines
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {upcomingEvents.map((event, idx) => {
              const daysLeft = calculateDaysLeft(event.date);
              return (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border dark:border-slate-700 hover:shadow-md transition">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    event.type === 'PAYMENT' ? 'bg-red-500 animate-pulse' :
                    event.type === 'FILING' ? 'bg-purple-500 animate-pulse' :
                    event.type === 'DEADLINE' ? 'bg-orange-500 animate-pulse' : 'bg-blue-500 animate-pulse'
                  }`} />
                  <div className="flex-1">
                    <p className="font-bold text-lg dark:text-white">{event.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{event.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold">
                        {event.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        daysLeft <= 7 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        daysLeft <= 30 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {daysLeft} days left
                      </span>
                    </div>
                  </div>
                  {event.amount > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">₹{event.amount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-300 dark:border-blue-800 p-6 shadow-lg">
          <h3 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            Quick Tips
          </h3>
          <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            {[
              { icon: '💰', text: 'Advance Tax: Pay quarterly (15th Jun, Sep, Dec, Mar)' },
              { icon: '📄', text: 'ITR Filing: July 31 (if tax paid), Aug 31 (regular)' },
              { icon: '📊', text: 'GST: File GSTR-3B by 20th, GSTR-1 by 13th monthly' },
              { icon: '💳', text: 'TDS: Deposit by 7th of next month' },
              { icon: '👥', text: 'PF/ESI: Deposit by 7th and 15th respectively' },
              { icon: '🎯', text: 'Investments: Complete 80C by March 31st' },
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl backdrop-blur-sm">
                <span className="text-2xl">{tip.icon}</span>
                <span className="font-medium">{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold dark:text-white">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{selectedEvent.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Date</span>
                <span className="font-bold dark:text-white">{selectedEvent.date.toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Category</span>
                <span className="font-bold dark:text-white">{selectedEvent.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Type</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedEvent.type === 'PAYMENT' ? 'bg-red-100 text-red-800' :
                  selectedEvent.type === 'FILING' ? 'bg-purple-100 text-purple-800' :
                  selectedEvent.type === 'DEADLINE' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>{selectedEvent.type}</span>
              </div>
              {selectedEvent.amount > 0 && (
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Amount</span>
                  <span className="font-bold text-red-600 dark:text-red-400">₹{selectedEvent.amount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
