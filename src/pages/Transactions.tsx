import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Search, Filter, Download, ArrowDownLeft, ArrowUpRight, Calendar as CalendarIcon, X, Plus, DollarSign, Ban, Upload, Scan } from 'lucide-react';
import { CATEGORIES } from '../utils/multiUserUnifiedData';
import { Transaction, TransactionType, TransactionStatus } from '../types';
import { Button } from '../components/common/Button';
import { TransactionModal } from '../components/Transactions/TransactionModal';
import { extractTransactionsFromImage } from '../services/geminiService';
import { importTransactions } from '../services/importStatementService';

type SortBy = 'DATE_NEW' | 'DATE_OLD' | 'AMOUNT_HIGH' | 'AMOUNT_LOW';
type FilterType = 'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'MISSING_INFO';
type TimePeriod = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'LAST_3M' | 'ALL_TIME' | 'CUSTOM';

interface TransactionsProps {
  transactions: Transaction[];
  onAdd: (t: Transaction) => void;
  onBulkAdd?: (txns: Transaction[]) => void;
  onUpdate?: (t: Transaction) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions = [], onAdd, onBulkAdd, onUpdate }) => {
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('DATE_NEW');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('THIS_MONTH');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 1000000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null);
  // Load imported transactions from localStorage on component mount
  const [importedTxns, setImportedTxns] = useState<import('../types').Transaction[]>(() => {
    try {
      const stored = localStorage.getItem('paylockr_imported_transactions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist imported transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('paylockr_imported_transactions', JSON.stringify(importedTxns));
  }, [importedTxns]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Returns true if date is missing/null/empty
  const isMissingDate = (t: Transaction) =>
    !t.date || t.date === '' || t.date === 'null';

  // Returns true if any key field is missing
  const isMissingInfo = (t: Transaction) =>
    isMissingDate(t) || !t.source || t.source === '' || !t.amount;

  // Helper to get date object safely — null-date returns epoch so we can detect it
  const getTxnDate = (t: Transaction): Date => {
    if (isMissingDate(t)) return new Date(0); // epoch sentinel for missing date
    return t.date instanceof Date ? t.date : new Date(t.date as string);
  };

  const filteredTransactions = useMemo(() => {
    // Merge prop transactions with locally-stored imported ones (dedup by id)
    const propIds = new Set(transactions.map(t => t.id));
    const localOnly = importedTxns.filter(t => !propIds.has(t.id));
    let filtered = [...localOnly, ...transactions];

    // Filter by Type / Special filters
    if (filterType === 'MISSING_INFO') {
      // Show only transactions with missing date, source, or amount
      filtered = filtered.filter(t => isMissingInfo(t));
    } else if (filterType !== 'ALL') {
      if (filterType === 'INCOME') filtered = filtered.filter(t => t.type === TransactionType.BUSINESS || t.type === TransactionType.REFUND);
      if (filterType === 'EXPENSE') filtered = filtered.filter(t => t.type === TransactionType.PERSONAL);
      if (filterType === 'TRANSFER') filtered = filtered.filter(t => t.category === 'TRANSFER');
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
      case 'ALL_TIME':
      default:
        startDate = new Date(0); // Epoch — show everything
        break;
    }

    // Date filter — null-date rows always pass through (shown in any time period)
    if (timePeriod !== 'ALL_TIME' && timePeriod !== 'CUSTOM') {
      filtered = filtered.filter(t => isMissingDate(t) || getTxnDate(t) >= startDate);
    }

    // Sorting — null-date rows always float to TOP on date sorts
    filtered.sort((a, b) => {
      const missingA = isMissingDate(a);
      const missingB = isMissingDate(b);

      if (sortBy === 'DATE_NEW' || sortBy === 'DATE_OLD') {
        // Missing dates always on top regardless of sort direction
        if (missingA && missingB) return 0;
        if (missingA) return -1;
        if (missingB) return 1;
      }

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
  }, [transactions, importedTxns, filterType, selectedCategories, amountRange, searchTerm, timePeriod, sortBy]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.BUSINESS || t.type === TransactionType.REFUND)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === TransactionType.PERSONAL)
      .reduce((sum, t) => sum + t.amount, 0);
    const taxable = filteredTransactions
      .filter(t => t.type === TransactionType.BUSINESS)
      .reduce((sum, t) => sum + (t.estimatedTax || 0), 0);
    return { income, expense, balance: income - expense, taxable };
  }, [filteredTransactions]);

  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};

    filteredTransactions.forEach(txn => {
      const dateKey = isMissingDate(txn)
        ? '⚠ DATE UNKNOWN'
        : getTxnDate(txn).toLocaleDateString('en-IN', {
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

  const handleImportStatement = async (file: File) => {
    setIsImporting(true);
    setImportStatus({ msg: 'Uploading to Gemini AI...', type: 'info' });
    try {
      const result = await extractTransactionsFromImage(file);
      if (!result.transactions || result.transactions.length === 0) {
        setImportStatus({ msg: 'No transactions found in the file. Please ensure it contains a transaction table.', type: 'error' });
        setIsImporting(false);
        return;
      }
      setImportStatus({ msg: `Processing ${result.transactions.length} transactions...`, type: 'info' });

      // Map all parsed transactions to Transaction objects
      const { transactions: mapped } = importTransactions(result.transactions, () => { });

      if (mapped.length === 0) {
        setImportStatus({ msg: 'No valid transactions could be extracted.', type: 'error' });
        setIsImporting(false);
        return;
      }

      // Store in local state for IMMEDIATE display (no waiting for App.tsx state propagation)
      setImportedTxns(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newTxns = [...mapped.filter(t => !existingIds.has(t.id)), ...prev];
        // Persist to localStorage immediately
        localStorage.setItem('paylockr_imported_transactions', JSON.stringify(newTxns));
        return newTxns;
      });

      // Use bulk add (single state update) if available, otherwise fall back to loop
      if (onBulkAdd) {
        onBulkAdd(mapped);
      } else {
        mapped.forEach(t => onAdd(t));
      }

      setImportStatus({
        msg: `✅ ${mapped.length} transactions imported! (confidence: ${Math.round(result.confidence * 100)}%)`,
        type: 'success',
      });
      // Show ALL_TIME so every imported transaction is visible regardless of date
      setTimePeriod('ALL_TIME');
    } catch (err: any) {
      console.error('[Import] Error:', err);
      setImportStatus({ msg: `❌ Import failed: ${err.message || 'Unknown error'}`, type: 'error' });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} onSave={onAdd} />}

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs font-bold uppercase text-black/70 mb-3">TOTAL BALANCE</h2>
          <p className="text-3xl sm:text-4xl font-black text-black mb-4">{formatCurrency(summary.balance)}</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded">
              <p className="text-[10px] font-bold uppercase text-black/70 mb-1">INCOME</p>
              <p className="text-lg sm:text-xl font-black text-green-700">↑ {formatCurrency(summary.income)}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded">
              <p className="text-[10px] font-bold uppercase text-black/70 mb-1">EXPENSE</p>
              <p className="text-lg sm:text-xl font-black text-red-700">↓ {formatCurrency(summary.expense)}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded">
              <p className="text-[10px] font-bold uppercase text-black/70 mb-1">TAX</p>
              <p className="text-lg sm:text-xl font-black text-orange-700">₹ {formatCurrency(summary.taxable)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-yellow-400 outline-none font-bold uppercase text-xs"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <div className="flex bg-gray-100 dark:bg-gray-900 p-0.5 flex-shrink-0">
                {(['ALL', 'INCOME', 'EXPENSE', 'MISSING_INFO'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1.5 text-[10px] font-bold uppercase transition-all whitespace-nowrap ${filterType === type
                      ? type === 'MISSING_INFO' ? 'bg-orange-400 text-black' : 'bg-yellow-400 text-black'
                      : 'text-black dark:text-white hover:text-yellow-400'
                      }`}
                  >
                    {type === 'MISSING_INFO' ? '⚠ MISSING' : type}
                  </button>
                ))}
              </div>

              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                className="px-2 py-1.5 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 text-[10px] text-black dark:text-white focus:outline-none font-bold uppercase flex-shrink-0"
              >
                <option value="TODAY">TODAY</option>
                <option value="THIS_WEEK">WEEK</option>
                <option value="THIS_MONTH">MONTH</option>
                <option value="LAST_3M">3 MONTHS</option>
                <option value="ALL_TIME">ALL TIME</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 text-xs font-bold uppercase flex items-center gap-1 transition-colors border-2 flex-shrink-0 ${showFilters
                  ? 'bg-cyan-500 border-cyan-500 text-black'
                  : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-black dark:text-white'
                  }`}
              >
                <Filter size={14} />
              </button>

              <Button onClick={() => setModalOpen(true)} className="whitespace-nowrap bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase flex-shrink-0 text-[10px] px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <Plus size={14} /> ADD
                </div>
              </Button>

              {/* Import from Statement button */}
              <Button
                onClick={() => { setShowImportModal(true); setImportStatus(null); }}
                className="whitespace-nowrap bg-cyan-500 hover:bg-cyan-600 text-black font-bold uppercase flex-shrink-0 text-[10px] px-2 py-1.5"
              >
                <div className="flex items-center gap-1">
                  <Scan size={14} /> IMPORT
                </div>
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t-2 border-gray-200 dark:border-gray-800 space-y-3 animate-fade-in">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">CATEGORIES</h3>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(CATEGORIES).map(([key, value]: any) => (
                    <button
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className={`px-2 py-1 text-[10px] font-bold uppercase border-2 transition-colors flex items-center gap-1 ${selectedCategories.includes(key)
                        ? 'bg-cyan-500 border-cyan-500 text-black'
                        : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-black dark:text-white'
                        }`}
                    >
                      <span className="text-xs">{value.icon}</span> {key}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">SORT BY</h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'NEW', value: 'DATE_NEW' },
                    { label: 'OLD', value: 'DATE_OLD' },
                    { label: 'HIGH', value: 'AMOUNT_HIGH' },
                    { label: 'LOW', value: 'AMOUNT_LOW' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value as SortBy)}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase border-2 transition-colors ${sortBy === opt.value
                        ? 'bg-white text-black border-white'
                        : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-black dark:text-white'
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

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
            <div key={dateKey}>
              <div className="flex items-center gap-2 mb-2 sticky top-20 z-10">
                <span className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                  {dateKey.toUpperCase()}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>

              <div className="space-y-2">
                {(dayTransactions as Transaction[]).map((txn) => {
                  const categoryInfo = getCategoryInfo(txn.category || 'OTHER');
                  const isExpense = txn.type === TransactionType.PERSONAL;

                  return (
                    <div
                      key={txn.id}
                      onClick={() => setSelectedTransaction(txn)}
                      className="bg-white dark:bg-black border-l-4 border-cyan-500 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-lg transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div
                            className="w-8 h-8 flex items-center justify-center text-sm flex-shrink-0"
                            style={{ backgroundColor: `${categoryInfo.color}20` }}
                          >
                            {categoryInfo.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-sm text-black dark:text-white truncate">
                              {txn.source}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1 mt-0.5">
                              <p className="text-[10px] text-gray-500 font-bold uppercase truncate">
                                {txn.category || 'UNCATEGORIZED'}
                              </p>
                              {txn.type === TransactionType.BUSINESS && (
                                <span className="text-[8px] bg-green-500 text-black px-1 py-0.5 font-black uppercase">
                                  💵
                                </span>
                              )}
                              {(txn.type === TransactionType.REFUND || (txn.type === TransactionType.PERSONAL && txn.amount > 0)) && (
                                <span className="text-[8px] bg-red-500 text-white px-1 py-0.5 font-black uppercase">
                                  🚫
                                </span>
                              )}
                              {isMissingDate(txn) && (
                                <span className="text-[8px] bg-orange-400 text-black px-1 py-0.5 font-black uppercase">
                                  ⚠ MISSING DATE
                                </span>
                              )}
                              {(!txn.source || txn.source === '') && (
                                <span className="text-[8px] bg-orange-400 text-black px-1 py-0.5 font-black uppercase">
                                  ⚠ NO SOURCE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-sm font-black ${isExpense ? 'text-black dark:text-white' : 'text-green-500 dark:text-green-400'
                              }`}
                          >
                            {isExpense ? '-' : '+'} {formatCurrency(txn.amount)}
                          </p>
                          {txn.status === TransactionStatus.VAULTED && (
                            <span className="text-[8px] bg-green-500 text-black px-1 py-0.5 font-black uppercase">
                              VAULT
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
            <h3 className="text-lg font-black uppercase text-black dark:text-white mb-2">NO TRANSACTIONS FOUND</h3>
            <p className="text-gray-500 font-bold uppercase text-xs">TRY ADJUSTING FILTERS</p>
          </div>
        )}
      </div>

      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="bg-white dark:bg-black border-4 border-yellow-400 w-full max-w-md p-6 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase text-black dark:text-white">TRANSACTION DETAILS</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-white p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto flex items-center justify-center mb-3`}
                  style={{ backgroundColor: `${getCategoryInfo(selectedTransaction.category || 'OTHER').color}20` }}
                >
                  <span className="text-3xl">{getCategoryInfo(selectedTransaction.category || 'OTHER').icon}</span>
                </div>
                <p className="text-3xl font-black text-black dark:text-white">
                  {selectedTransaction.type === TransactionType.PERSONAL ? '-' : '+'}
                  {formatCurrency(selectedTransaction.amount)}
                </p>
                <p className="text-gray-500 mt-1 font-bold uppercase text-xs">{selectedTransaction.source}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 space-y-3 text-sm border-l-4 border-cyan-500">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase text-xs">DATE</span>
                  <span className="font-black text-black dark:text-white">{getTxnDate(selectedTransaction).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase text-xs">CATEGORY</span>
                  <span className="font-black text-black dark:text-white">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase text-xs">STATUS</span>
                  <span className="font-black text-black dark:text-white uppercase">{selectedTransaction.status.toLowerCase()}</span>
                </div>

                {/* Tax Classification */}
                <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 font-bold uppercase text-xs mb-2">TAX CLASSIFICATION</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const updated = { ...selectedTransaction, type: TransactionType.BUSINESS, estimatedTax: selectedTransaction.amount * 0.1 };
                        onUpdate && onUpdate(updated);
                        setSelectedTransaction(updated);
                      }}
                      className={`flex-1 px-3 py-2 text-xs font-bold uppercase transition flex items-center justify-center gap-2 ${selectedTransaction.type === TransactionType.BUSINESS
                        ? 'bg-green-500 text-black'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-500 hover:text-black'
                        }`}
                    >
                      <DollarSign size={16} /> TAXABLE
                    </button>
                    <button
                      onClick={() => {
                        const updated = { ...selectedTransaction, type: TransactionType.REFUND, estimatedTax: 0 };
                        onUpdate && onUpdate(updated);
                        setSelectedTransaction(updated);
                      }}
                      className={`flex-1 px-3 py-2 text-xs font-bold uppercase transition flex items-center justify-center gap-2 ${selectedTransaction.type === TransactionType.REFUND || (selectedTransaction.type === TransactionType.PERSONAL && selectedTransaction.amount > 0)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white'
                        }`}
                    >
                      <Ban size={16} /> NON-TAXABLE
                    </button>
                  </div>
                </div>

                {selectedTransaction.estimatedTax > 0 && (
                  <div className="flex justify-between pt-2 border-t-2 border-gray-200 dark:border-gray-800">
                    <span className="text-gray-500 font-bold uppercase text-xs">ESTIMATED TAX</span>
                    <span className="font-black text-red-500 dark:text-red-400">{formatCurrency(selectedTransaction.estimatedTax)}</span>
                  </div>
                )}
                {selectedTransaction.referenceId && (
                  <div className="flex justify-between pt-2 border-t-2 border-gray-200 dark:border-gray-800">
                    <span className="text-gray-500 font-bold uppercase text-xs">REFERENCE ID</span>
                    <span className="font-black text-gray-600 dark:text-gray-300 font-mono">{selectedTransaction.referenceId}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (selectedTransaction.referenceId) {
                      alert('Receipt downloaded successfully!');
                    } else {
                      alert('Receipt not available - This transaction was not linked to a receipt or invoice.');
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-yellow-400 text-black hover:bg-yellow-500 font-black uppercase transition shadow-lg"
                >
                  DOWNLOAD RECEIPT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Statement Modal ─────────────────────────────────────────── */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !isImporting && setShowImportModal(false)}
        >
          <div
            className="bg-white dark:bg-black border-4 border-cyan-500 w-full max-w-md p-6 shadow-2xl animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black uppercase text-black dark:text-white">📸 Import Statement</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">AI-powered • Gemini Vision</p>
              </div>
              {!isImporting && (
                <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-black dark:hover:text-white">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Upload area */}
            <div
              className="border-2 border-dashed border-cyan-500 p-8 text-center cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-950 transition mb-4"
              onClick={() => !isImporting && fileInputRef.current?.click()}
            >
              {isImporting ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold uppercase text-cyan-600">Analyzing with Gemini...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={32} className="text-cyan-500" />
                  <p className="text-sm font-black uppercase text-black dark:text-white">Click to Upload</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">PDF · PNG · JPG · JPEG · WEBP</p>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImportStatement(file);
              }}
            />

            {/* Status message */}
            {importStatus && (
              <div className={`p-3 border-l-4 text-xs font-bold ${importStatus.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' :
                importStatus.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' :
                  'border-cyan-500 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                }`}>
                {importStatus.msg}
              </div>
            )}

            {/* Tips */}
            <div className="mt-4 space-y-1">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">What works best</p>
              <ul className="text-[9px] text-gray-500 font-bold space-y-0.5 ml-2">
                <li>• ALL Indian banks supported (HDFC, ICICI, SBI, Axis, Kotak, PNB, BOB, etc.)</li>
                <li>• PDF bank statements (multi-page supported)</li>
                <li>• Screenshots of transaction tables from mobile banking apps</li>
                <li>• Images with Date, Description, Amount columns visible</li>
                <li>• UPI, NEFT, IMPS, RTGS transactions auto-detected</li>
                <li>• Credits auto-classified as Business Income (taxable)</li>
                <li>• Debits auto-classified as Personal Expense</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};