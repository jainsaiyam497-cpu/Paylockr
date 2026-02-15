import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const TaxCalendar: React.FC<{ userId?: string }> = ({ userId }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const allTaxEvents = [
    // APRIL 2024
    { date: '1 April', fullDate: new Date(2024, 3, 1), title: '📅 Financial Year Starts', description: 'FY 2024-25 begins', type: 'REMINDER', color: 'bg-blue-100 border-blue-200' },
    { date: '15 April', fullDate: new Date(2024, 3, 15), title: '💳 TDS Payment', description: 'Deposit TDS deducted in March', type: 'PAYMENT', color: 'bg-green-100 border-green-200', section: 'Section 200' },

    // MAY 2024
    { date: '31 May', fullDate: new Date(2024, 4, 31), title: '📄 Form 16 Issue', description: 'Employer issues Form 16', type: 'DEADLINE', color: 'bg-purple-100 border-purple-200', section: 'Section 203A' },

    // JUNE 2024
    { date: '15 June', fullDate: new Date(2024, 5, 15), title: '💰 Advance Tax Q1', description: 'First quarterly advance tax payment', type: 'PAYMENT', color: 'bg-red-100 border-red-200', section: 'Section 208' },
    { date: '30 June', fullDate: new Date(2024, 5, 30), title: '📋 Investment Proof', description: 'Submit Section 80C investment proof', type: 'REMINDER', color: 'bg-yellow-100 border-yellow-200', section: 'Section 80C' },

    // JULY 2024
    { date: '31 July', fullDate: new Date(2024, 6, 31), title: '🎯 ITR Filing (Early)', description: 'File ITR if tax is paid', type: 'FILING', color: 'bg-orange-100 border-orange-200', section: 'Section 139(1)' },

    // AUGUST 2024
    { date: '31 August', fullDate: new Date(2024, 7, 31), title: '📑 ITR Filing (Regular)', description: 'Standard ITR filing deadline', type: 'FILING', color: 'bg-indigo-100 border-indigo-200', section: 'Section 139(1)' },

    // SEPTEMBER 2024
    { date: '15 September', fullDate: new Date(2024, 8, 15), title: '💰 Advance Tax Q2', description: 'Second quarterly advance tax', type: 'PAYMENT', color: 'bg-red-100 border-red-200', section: 'Section 208' },
    { date: '30 September', fullDate: new Date(2024, 8, 30), title: '✅ Audit Report', description: 'File statutory audit report', type: 'FILING', color: 'bg-teal-100 border-teal-200', section: 'Section 44AB' },

    // DECEMBER 2024
    { date: '15 December', fullDate: new Date(2024, 11, 15), title: '💰 Advance Tax Q3', description: 'Third quarterly advance tax', type: 'PAYMENT', color: 'bg-red-100 border-red-200', section: 'Section 208' },
    { date: '31 December', fullDate: new Date(2024, 11, 31), title: '📋 Belated ITR', description: 'Belated ITR filing deadline', type: 'DEADLINE', color: 'bg-gray-100 border-gray-200', section: 'Section 139(4)' },

    // MARCH 2025
    { date: '15 March', fullDate: new Date(2025, 2, 15), title: '💰 Advance Tax Q4', description: 'Fourth quarterly advance tax', type: 'PAYMENT', color: 'bg-red-100 border-red-200', section: 'Section 208' },
    { date: '31 March', fullDate: new Date(2025, 2, 31), title: '📅 Financial Year Ends', description: 'FY 2024-25 ends', type: 'REMINDER', color: 'bg-blue-100 border-blue-200' },
    { date: '31 March', fullDate: new Date(2025, 2, 31), title: '✏️ Revised ITR', description: 'Revised ITR filing deadline', type: 'FILING', color: 'bg-indigo-100 border-indigo-200', section: 'Section 139(5)' },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthEvents = allTaxEvents.filter(e => e.fullDate.getMonth() === currentMonth && e.fullDate.getFullYear() === currentYear);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 pl-16 md:pl-4">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-blue-600 dark:text-blue-400" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📅 Tax Calendar FY 2024-25</h1>
              <p className="text-gray-600 dark:text-gray-400">Important dates & deadlines</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition text-slate-700 dark:text-slate-300">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition text-slate-700 dark:text-slate-300">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">📆 Tax Events in {monthNames[currentMonth]}</h2>

          {monthEvents.length > 0 ? (
            <div className="space-y-6">
              {monthEvents.map((event, idx) => (
                <div key={idx} className={`rounded-lg border-l-4 p-6 bg-white dark:bg-slate-800/50 shadow-sm ${event.color.replace('bg-', 'border-l-')}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{event.description}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                      event.type === 'PAYMENT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      event.type === 'FILING' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      event.type === 'DEADLINE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {event.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">DATE</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{event.date}</p>
                    </div>
                    {event.section && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">SECTION</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{event.section}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">No tax deadlines in {monthNames[currentMonth]}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Deadlines in: April, June, July, August, September, December, March</p>
            </div>
          )}
        </div>

        {/* All Events List */}
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📋 All Tax Deadlines FY 2024-25</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allTaxEvents.map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  event.type === 'PAYMENT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  event.type === 'FILING' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                  event.type === 'DEADLINE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💡 Key Dates</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✅ <strong>Advance Tax:</strong> Pay quarterly (June 15, Sep 15, Dec 15, Mar 15)</li>
            <li>📄 <strong>ITR Filing:</strong> July 31 if tax paid, Aug 31 regular deadline</li>
<li>🔍 <strong>Audit:</strong> Required if turnover &gt; ₹10 lakh, due Sep 30</li>
            <li>💳 <strong>TDS:</strong> Deposit by 7th of next month if deducted</li>
            <li>📊 <strong>GST:</strong> File GSTR-3B monthly by 20th</li>
          </ul>
        </div>
      </div>
    </div>
  );
};