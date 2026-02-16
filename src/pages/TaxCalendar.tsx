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
      <div className="bg-black border-l-8 border-yellow-400 p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <Calendar className="w-14 h-14 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-black uppercase text-white">TAX CALENDAR FY 2024-25</h1>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-2">{allTaxEvents.length}+ DEADLINES</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black border-b-4 border-green-500 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
            <span className="text-3xl font-black text-white">{completedCount}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">COMPLETED</p>
        </div>
        <div className="bg-black border-b-4 border-red-500 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-red-400" />
            <span className="text-3xl font-black text-white">{pendingCount}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">PENDING</p>
        </div>
        <div className="bg-black border-b-4 border-cyan-500 p-6">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 text-cyan-400" />
            <span className="text-3xl font-black text-white">{upcomingCount}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">UPCOMING</p>
        </div>
      </div>

      <div className="bg-black border-2 border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-white" />
          <span className="font-black uppercase text-white text-sm">FILTER CATEGORY</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilterType(cat.value)}
              className={`px-4 py-2 font-bold uppercase text-xs transition ${
                filterType === cat.value
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border dark:border-slate-700 overflow-hidden">
        <div className="bg-black border-b-4 border-cyan-500 p-6">
          <div className="flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-3 hover:bg-gray-900 transition text-white">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-3xl font-black uppercase text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button onClick={handleNextMonth} className="p-3 hover:bg-gray-900 transition text-white">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-3 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center font-black uppercase text-white py-3 text-lg">
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
                  className={`aspect-square border-2 p-3 transition-all cursor-pointer ${
                    isToday(day)
                      ? 'bg-cyan-500 text-black border-cyan-500 scale-105'
                      : hasEvents
                      ? 'bg-gray-900 border-yellow-400 hover:bg-gray-800 hover:scale-105'
                      : 'bg-black border-gray-800 hover:bg-gray-900 hover:scale-105'
                  }`}
                >
                  <div className={`text-lg font-black mb-1 ${isToday(day) ? 'text-black' : 'text-white'}`}>
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
        <div className="bg-black border-b-4 border-yellow-400 p-6">
          <h3 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
              <Clock className="w-6 h-6 text-black" />
            </div>
            UPCOMING DEADLINES
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {upcomingEvents.map((event, idx) => {
              const daysLeft = calculateDaysLeft(event.date);
              return (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-900 border-l-4 border-cyan-500 hover:bg-gray-800 transition">
                  <div className={`w-3 h-3 mt-2 flex-shrink-0 ${
                    event.type === 'PAYMENT' ? 'bg-red-500 animate-pulse' :
                    event.type === 'FILING' ? 'bg-yellow-400 animate-pulse' :
                    event.type === 'DEADLINE' ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-500 animate-pulse'
                  }`} />
                  <div className="flex-1">
                    <p className="font-black uppercase text-white">{event.title}</p>
                    <p className="text-xs font-bold uppercase text-gray-500">{event.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        {event.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                      </p>
                      <span className={`text-xs font-bold uppercase px-2 py-1 ${
                        daysLeft <= 7 ? 'bg-red-500 text-black' :
                        daysLeft <= 30 ? 'bg-yellow-400 text-black' :
                        'bg-cyan-500 text-black'
                      }`}>
                        {daysLeft} DAYS LEFT
                      </span>
                    </div>
                  </div>
                  {event.amount > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-black text-red-400">₹{event.amount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-black border-b-4 border-cyan-500 p-6">
          <h3 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-black" />
            </div>
            QUICK TIPS
          </h3>
          <ul className="space-y-4 text-sm">
            {[
              { icon: '💰', text: 'ADVANCE TAX: PAY QUARTERLY (15TH JUN, SEP, DEC, MAR)' },
              { icon: '📄', text: 'ITR FILING: JULY 31 (IF TAX PAID), AUG 31 (REGULAR)' },
              { icon: '📊', text: 'GST: FILE GSTR-3B BY 20TH, GSTR-1 BY 13TH MONTHLY' },
              { icon: '💳', text: 'TDS: DEPOSIT BY 7TH OF NEXT MONTH' },
              { icon: '👥', text: 'PF/ESI: DEPOSIT BY 7TH AND 15TH RESPECTIVELY' },
              { icon: '🎯', text: 'INVESTMENTS: COMPLETE 80C BY MARCH 31ST' },
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-gray-900 border-l-4 border-yellow-400">
                <span className="text-2xl">{tip.icon}</span>
                <span className="font-bold uppercase text-white">{tip.text}</span>
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
