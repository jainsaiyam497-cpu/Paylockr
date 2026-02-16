import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, Download, Filter, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { getUserData } from '../utils/multiUserUnifiedData';

const CURRENT_FY = 2025;
const AVAILABLE_YEARS = [2025, 2024, 2023, 2022];

export const TaxCalendar: React.FC<{ userId?: string }> = ({ userId = 'saiyam' }) => {
  const [selectedYear, setSelectedYear] = useState(CURRENT_FY);
  const [view, setView] = useState<'timeline' | 'quarter'>('timeline');
  const [filter, setFilter] = useState<'ALL' | 'payment' | 'filing' | 'task'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const userData = getUserData(userId);
  const stats = userData.stats;

  const getYearMultiplier = (year: number) => {
    const diff = CURRENT_FY - year;
    return Math.pow(0.85, diff);
  };

  const yearMultiplier = getYearMultiplier(selectedYear);

  const yearData = useMemo(() => {
    const income = Math.round(stats.totalIncome * yearMultiplier);
    const expense = Math.round(stats.totalExpense * yearMultiplier);
    const deductions = Math.round(stats.deductibleExpenses * yearMultiplier);
    const netIncome = Math.round(stats.netTaxableIncome * yearMultiplier);
    const tax = Math.round(stats.projectedTaxLiability * yearMultiplier);
    
    return {
      grossIncome: income,
      totalDeductions: deductions,
      netIncome: netIncome,
      totalTax: tax,
      itrStatus: selectedYear === CURRENT_FY ? 'FILED' : 'FILED',
      quarters: [
        { q: 'Q1', income: Math.round(income * 0.21), expenses: Math.round(expense * 0.25), tax: Math.round(tax / 4), period: `APR-JUN ${selectedYear}` },
        { q: 'Q2', income: Math.round(income * 0.26), expenses: Math.round(expense * 0.26), tax: Math.round(tax / 4), period: `JUL-SEP ${selectedYear}` },
        { q: 'Q3', income: Math.round(income * 0.23), expenses: Math.round(expense * 0.24), tax: Math.round(tax / 4), period: `OCT-DEC ${selectedYear}` },
        { q: 'Q4', income: Math.round(income * 0.30), expenses: Math.round(expense * 0.25), tax: Math.round(tax / 4), period: `JAN-MAR ${selectedYear + 1}` }
      ]
    };
  }, [selectedYear, stats, yearMultiplier]);

  const taxEvents = useMemo(() => {
    const y = selectedYear;
    const tax = yearData.totalTax;
    return [
      { date: `${y}-04-01`, title: `FY ${y}-${(y+1)%100} BEGINS`, type: 'info', status: 'COMPLETED', amount: 0 },
      { date: `${y}-04-12`, title: `Q4 ${y-1}-${y%100} TAX PAYMENT`, type: 'payment', status: 'PAID', amount: Math.round(tax * 0.9 / 4), challan: `00617012007${y%100}` },
      { date: `${y}-06-14`, title: 'Q1 ADVANCE TAX PAYMENT', type: 'payment', status: 'PAID', amount: Math.round(tax / 4), challan: `00617042012${y%100}`, quarter: 'Q1' },
      { date: `${y}-06-30`, title: 'Q1 RECONCILIATION', type: 'task', status: 'COMPLETED', amount: 0 },
      { date: `${y}-09-13`, title: 'Q2 ADVANCE TAX PAYMENT', type: 'payment', status: 'PAID', amount: Math.round(tax / 4), challan: `00617092004${y%100}`, quarter: 'Q2' },
      { date: `${y}-09-30`, title: 'Q2 FINAL REVIEW', type: 'task', status: 'COMPLETED', amount: 0 },
      { date: `${y}-12-15`, title: 'Q3 ADVANCE TAX PAYMENT', type: 'payment', status: 'PAID', amount: Math.round(tax / 4), challan: `00617122007${y%100}`, quarter: 'Q3' },
      { date: `${y}-12-31`, title: 'YEAR-END TAX PLANNING', type: 'task', status: 'COMPLETED', amount: 0 },
      { date: `${y+1}-01-15`, title: 'Q4 ADVANCE TAX PAYMENT', type: 'payment', status: 'PAID', amount: Math.round(tax / 4), challan: `00618012003${(y+1)%100}`, quarter: 'Q4' },
      { date: `${y+1}-03-31`, title: `FY ${y}-${(y+1)%100} ENDS`, type: 'milestone', status: 'COMPLETED', amount: 0 },
      { date: `${y+1}-04-10`, title: 'ITR-4 FILED & ACCEPTED', type: 'filing', status: 'FILED', amount: 0, itr: `ITA/${y+1}/04/AAAPN5678A/001` }
    ];
  }, [selectedYear, yearData]);

  const filteredEvents = filter === 'ALL' ? taxEvents : taxEvents.filter(e => e.type === filter);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      <div className="bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 dark:text-yellow-400" />
              <div>
                <h1 className="text-xl md:text-3xl font-black uppercase text-black dark:text-white">TAX CALENDAR FY {selectedYear}-{(selectedYear+1)%100}</h1>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-500 mt-1">
                  APRIL 1, {selectedYear} - MARCH 31, {selectedYear+1}
                </p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {AVAILABLE_YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-2 md:px-4 md:py-2 font-bold uppercase text-[10px] md:text-xs whitespace-nowrap ${
                    selectedYear === year ? 'bg-yellow-400 text-black' : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-2 border-gray-300 dark:border-gray-800'
                  }`}
                >
                  FY {year}-{(year+1)%100}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-500 dark:text-green-400 mt-3">
            <CheckCircle size={16} className="md:w-5 md:h-5" />
            <span className="font-bold uppercase text-[10px] md:text-xs">ALL COMPLIANT ✓ | ITR FILED</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white dark:bg-black border-l-4 border-cyan-500 p-3 md:p-4 shadow-lg">
            <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mb-1">GROSS INCOME</p>
            <p className="text-sm md:text-xl font-black text-black dark:text-white">{formatCurrency(yearData.grossIncome)}</p>
          </div>
          <div className="bg-white dark:bg-black border-l-4 border-yellow-400 p-3 md:p-4 shadow-lg">
            <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mb-1">DEDUCTIONS</p>
            <p className="text-sm md:text-xl font-black text-black dark:text-white">{formatCurrency(yearData.totalDeductions)}</p>
          </div>
          <div className="bg-white dark:bg-black border-l-4 border-green-500 p-3 md:p-4 shadow-lg">
            <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mb-1">NET INCOME</p>
            <p className="text-sm md:text-xl font-black text-black dark:text-white">{formatCurrency(yearData.netIncome)}</p>
          </div>
          <div className="bg-white dark:bg-black border-l-4 border-red-500 p-3 md:p-4 shadow-lg">
            <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mb-1">TAX PAID</p>
            <p className="text-sm md:text-xl font-black text-black dark:text-white">{formatCurrency(yearData.totalTax)}</p>
          </div>
          <div className="bg-white dark:bg-black border-l-4 border-gray-800 dark:border-white p-3 md:p-4 shadow-lg col-span-2 md:col-span-1">
            <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mb-1">ITR STATUS</p>
            <p className="text-xs md:text-sm font-black text-green-500 dark:text-green-400">FILED ✓</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setView('timeline')}
              className={`flex-1 md:flex-none px-4 py-2 font-bold uppercase text-xs ${
                view === 'timeline' ? 'bg-yellow-400 text-black' : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-2 border-gray-300 dark:border-gray-800'
              }`}
            >
              TIMELINE
            </button>
            <button
              onClick={() => setView('quarter')}
              className={`flex-1 md:flex-none px-4 py-2 font-bold uppercase text-xs ${
                view === 'quarter' ? 'bg-yellow-400 text-black' : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-2 border-gray-300 dark:border-gray-800'
              }`}
            >
              QUARTERLY
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['ALL', 'payment', 'filing', 'task'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 md:px-4 py-2 font-bold uppercase text-xs whitespace-nowrap ${
                  filter === f ? 'bg-cyan-500 text-black' : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-2 border-gray-300 dark:border-gray-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {view === 'quarter' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {yearData.quarters.map((q, idx) => (
              <div key={q.q} className="bg-white dark:bg-black border-l-8 border-cyan-500 p-4 md:p-6 shadow-lg">
                <h3 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white mb-2">{q.q}</h3>
                <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mb-3 md:mb-4">{q.period}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500">INCOME</p>
                    <p className="text-base md:text-lg font-black text-green-600 dark:text-green-400">{formatCurrency(q.income)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500">EXPENSES</p>
                    <p className="text-base md:text-lg font-black text-red-600 dark:text-red-400">{formatCurrency(q.expenses)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500">TAX PAID</p>
                    <p className="text-base md:text-lg font-black text-yellow-600 dark:text-yellow-400">{formatCurrency(q.tax)}</p>
                  </div>
                </div>
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t-2 border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] md:text-xs font-black uppercase px-2 py-1 bg-green-500 text-black">PAID ✓</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'timeline' && (
          <div className="space-y-3 md:space-y-4">
            {filteredEvents.map((event, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedEvent(event)}
                className={`bg-white dark:bg-black border-l-4 md:border-l-8 p-4 md:p-6 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition ${
                  event.type === 'payment' ? 'border-yellow-400' :
                  event.type === 'filing' ? 'border-green-500' :
                  event.type === 'milestone' ? 'border-cyan-500' :
                  'border-gray-800 dark:border-white'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      {event.type === 'payment' && <FileText className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 dark:text-yellow-400" />}
                      {event.type === 'filing' && <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />}
                      {event.type === 'milestone' && <Calendar className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 dark:text-cyan-400" />}
                      {event.type === 'task' && <Clock className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" />}
                      <h3 className="text-sm md:text-xl font-black uppercase text-black dark:text-white">{event.title}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                      <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                      </p>
                      <span className={`text-[10px] md:text-xs font-black uppercase px-2 py-1 ${
                        event.status === 'PAID' || event.status === 'FILED' || event.status === 'COMPLETED' 
                          ? 'bg-green-500 text-black' 
                          : 'bg-yellow-400 text-black'
                      }`}>
                        {event.status}
                      </span>
                      {event.quarter && (
                        <span className="text-[10px] md:text-xs font-black uppercase px-2 py-1 bg-cyan-500 text-black">
                          {event.quarter}
                        </span>
                      )}
                    </div>
                    {event.challan && (
                      <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mt-2">
                        CHALLAN: {event.challan}
                      </p>
                    )}
                    {event.itr && (
                      <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600 dark:text-gray-500 mt-2">
                        ITR ACK: {event.itr}
                      </p>
                    )}
                  </div>
                  {event.amount > 0 && (
                    <div className="text-left md:text-right">
                      <p className="text-lg md:text-2xl font-black text-black dark:text-white">{formatCurrency(event.amount)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 md:mt-8 bg-white dark:bg-black border-l-4 md:border-l-8 border-green-500 p-4 md:p-6 shadow-lg">
          <h3 className="text-base md:text-xl font-black uppercase text-black dark:text-white mb-3 md:mb-4">COMPLIANCE CHECKLIST</h3>
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            {[
              'ALL 4 ADVANCE TAX PAYMENTS MADE ON TIME',
              'ITR-4 FILED WITHIN DEADLINE',
              'NO TDS COMPLICATIONS',
              'GST NOT APPLICABLE (< ₹40 LAKH)',
              'PROFESSIONAL TAX PAID',
              'ALL EXPENSE DOCUMENTATION MAINTAINED',
              'SECTION 80C/D DEDUCTIONS CLAIMED',
              'NO OUTSTANDING LIABILITIES'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-[10px] md:text-xs font-bold uppercase text-black dark:text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
