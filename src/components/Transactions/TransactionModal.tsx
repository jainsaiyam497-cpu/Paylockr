import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus } from '../../types';
import { Button } from '../common/Button';

interface TransactionModalProps {
  onClose: () => void;
  onSave: (txn: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ onClose, onSave }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.BUSINESS);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      const numAmount = parseFloat(amount);
      const estimatedTax = type === TransactionType.BUSINESS ? numAmount * 0.10 : 0;
      
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        source,
        amount: numAmount,
        type,
        status: estimatedTax > 0 ? TransactionStatus.VAULTED : TransactionStatus.IGNORED,
        estimatedTax
      };
      
      onSave(newTxn);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border dark:border-slate-800">
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">New Transaction</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Source</label>
            <input 
              required
              type="text" 
              value={source} 
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              placeholder="e.g. Freelance Client"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Amount (₹)</label>
            <input 
              required
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              {Object.values(TransactionType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button 
            type="submit" 
            isLoading={isProcessing}
            className="w-full mt-2"
          >
            Add Transaction
          </Button>
        </form>
      </div>
    </div>
  );
};