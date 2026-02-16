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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-black border-4 border-yellow-400 w-full max-w-md shadow-2xl">
        <div className="p-6 border-b-2 border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase text-white">NEW TRANSACTION</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">SOURCE</label>
            <input 
              required
              type="text" 
              value={source} 
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 bg-gray-900 text-white focus:border-cyan-500 outline-none font-bold"
              placeholder="E.G. FREELANCE CLIENT"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">AMOUNT (₹)</label>
            <input 
              required
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 bg-gray-900 text-white focus:border-cyan-500 outline-none font-bold"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">TYPE</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full px-4 py-3 border-2 border-gray-800 bg-gray-900 text-white focus:border-cyan-500 outline-none font-bold uppercase"
            >
              {Object.values(TransactionType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button 
            type="submit" 
            isLoading={isProcessing}
            className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase"
          >
            ADD TRANSACTION
          </Button>
        </form>
      </div>
    </div>
  );
};