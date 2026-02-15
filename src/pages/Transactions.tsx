import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, Filter, Download, ArrowDownLeft, ArrowUpRight, Calendar as CalendarIcon, X, Plus } from 'lucide-react';
import { CATEGORIES } from '../utils/multiUserUnifiedData';
import { Transaction, TransactionType, TransactionStatus } from '../types';
import { Button } from '../components/common/Button';
import { TransactionModal } from '../components/transactions/TransactionModal';

type SortBy = 'DATE_NEW' | 'DATE_OLD' | 'AMOUNT_HIGH' | 'AMOUNT_LOW';
type FilterType = 'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER';
type TimePeriod = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'LAST_3M' | 'CUSTOM';

interface TransactionsProps {
  transactions: Transaction[]; 
  onAdd: (t: Transaction) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions = [], onAdd }) => {
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('DATE_NEW');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('THIS_MONTH');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 1000000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Helper to get date object safely
  const getTxnDate = (t: Transaction) => {
    return t.date instanceof Date ? t.date : new Date(t.date);
  };

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by Type
    if (filterType !== 'ALL') {
      if (filterType === 'INCOME') filtered = filtered.filter(t => t.type === TransactionType.BUSINESS || t.type === TransactionType.REFUND);
      if (filterType === 'EXPENSE') filtered = filtered.filter(t => t.type === TransactionType.PERSONAL);
    }

    // Filter by Category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(t => t.category && selectedCategories.includes(t.category));
    }

    // Filter by Amount
    filtered = filtered.filter(t => t.amount >= amountRange[0] && t.amount <= amountRange[1]);

    // Filter by Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.source.toLowerCase().includes(term) ||
        (t.notes || '').toLowerCase().includes(term) ||
        (t.description || '').toLowerCase().includes(term)
      );
    }

    // Filter by Date
    const now = new Date();
    let startDate = new Date();

    switch (timePeriod) {
      case 'TODAY':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'THIS_WEEK':
        startDate.setDate(now.getDate() - now.getDay());
        break;
      case 'THIS_MONTH':
        startDate.setDate(1);
        break;
      case 'LAST_3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      default:
        startDate = new Date(0); // All time if custom isn't set
        break;
    }

    filtered = filtered.filter(t => getTxnDate(t) >= startDate);

    // Sorting
    filtered.sort((a, b) => {
      const dateA = getTxnDate(a).getTime();
      const dateB = getTxnDate(b).getTime();
      switch (sortBy) {
        case 'DATE_NEW': return dateB - dateA;
        case 'DATE_OLD': return dateA - dateB;
        case 'AMOUNT_HIGH': return b.amount - a.amount;
        case 'AMOUNT_LOW': return a.amount - b.amount;
        default: return 0;
      }
    });

    return filtered;
  }, [transactions, filterType, selectedCategories, amountRange, searchTerm, timePeriod, sortBy]);

  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};

    filteredTransactions.forEach(txn => {
      const date = getTxnDate(txn);
      const dateKey = date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(txn);
    });

    return grouped;
  }, [filteredTransactions]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryInfo = (category: string) => {
    const catData = CATEGORIES[category] || CATEGORIES[category.toUpperCase()] || { icon: '•', color: '#666' };
    return catData;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} onSave={onAdd} />}
      
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by merchant, client or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                {(['ALL', 'INCOME', 'EXPENSE'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {type === 'ALL' ? 'All' : type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="TODAY">Today</option>
                <option value="THIS_WEEK">This Week</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="LAST_3M">Last 3 Months</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border ${
                  showFilters
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 text-blue-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Filter size={16} />
              </button>
              
              <Button onClick={() => setModalOpen(true)} className="whitespace-nowrap">
                <div className="flex items-center">
                  <div className="mr-2"><Plus size={18} /></div> Add
                </div>
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORIES).map(([key, value]: any) => (
                    <button
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        selectedCategories.includes(key)
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>{value.icon}</span> {key}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sort By</h3>
                <div className="flex gap-2">
                  {[
                    { label: 'Newest', value: 'DATE_NEW' },
                    { label: 'Oldest', value: 'DATE_OLD' },
                    { label: 'Highest Amount', value: 'AMOUNT_HIGH' },
                    { label: 'Lowest Amount', value: 'AMOUNT_LOW' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value as SortBy)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        sortBy === opt.value
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
            <div key={dateKey}>
              <div className="flex items-center gap-3 mb-3 sticky top-20 z-10">
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md">
                  {dateKey}
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="space-y-3">
                {dayTransactions.map((txn) => {
                  const categoryInfo = getCategoryInfo(txn.category || 'OTHER');
                  const isExpense = txn.type === TransactionType.PERSONAL;

                  return (
                    <div
                      key={txn.id}
                      onClick={() => setSelectedTransaction(txn)}
                      className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800 hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${categoryInfo.color}20` }}
                          >
                            {categoryInfo.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                              {txn.source}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {txn.category || 'Uncategorized'} • {txn.description || 'No description'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              isExpense ? 'text-slate-900 dark:text-white' : 'text-green-600'
                            }`}
                          >
                            {isExpense ? '-' : '+'} {formatCurrency(txn.amount)}
                          </p>
                          {txn.status === TransactionStatus.VAULTED && (
                            <span className="text-[10px] bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded font-medium">
                              Vaulted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 grayscale opacity-50">📭</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3`}
                     style={{ backgroundColor: `${getCategoryInfo(selectedTransaction.category || 'OTHER').color}20` }}
                >
                   <span className="text-3xl">{getCategoryInfo(selectedTransaction.category || 'OTHER').icon}</span>
                </div>
                <p className="text-3xl font-bold dark:text-white">
                  {selectedTransaction.type === TransactionType.PERSONAL ? '-' : '+'}
                  {formatCurrency(selectedTransaction.amount)}
                </p>
                <p className="text-slate-500 mt-1">{selectedTransaction.source}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium dark:text-white">{getTxnDate(selectedTransaction).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-medium dark:text-white">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium dark:text-white capitalize">{selectedTransaction.status.toLowerCase()}</span>
                </div>
                {selectedTransaction.estimatedTax > 0 && (
                  <div className="flex justify-between pt-2 border-t dark:border-slate-700">
                    <span className="text-slate-500">Estimated Tax</span>
                    <span className="font-medium text-red-500">{formatCurrency(selectedTransaction.estimatedTax)}</span>
                  </div>
                )}
                {selectedTransaction.referenceId && (
                  <div className="flex justify-between pt-2 border-t dark:border-slate-700">
                    <span className="text-slate-500">Reference ID</span>
                    <span className="font-medium dark:text-slate-300 font-mono">{selectedTransaction.referenceId}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition shadow-lg shadow-blue-500/20">
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};