import React, { useState } from 'react';
import { Plus, ArrowDownLeft } from 'lucide-react';
import { Transaction, TransactionStatus } from '../../types';
import { Button } from '../common/Button';

interface VaultActionsProps {
  transactions: Transaction[];
}

export const VaultActions: React.FC<VaultActionsProps> = ({ transactions }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800">
       <h3 className="text-lg font-bold dark:text-white mb-6">Quick Actions</h3>
       <div className="space-y-4">
         <Button className="w-full justify-between" size="lg">
           <span>Add Funds</span>
           <Plus size={18} />
         </Button>
         <Button variant="outline" className="w-full justify-between" size="lg">
           <span>Withdraw Funds</span>
           <ArrowDownLeft size={18} />
         </Button>
       </div>
       
       <h3 className="text-lg font-bold dark:text-white mt-8 mb-4">Vault History</h3>
       <div className="space-y-3">
         {transactions.filter(t => t.status === TransactionStatus.VAULTED).slice(0, 3).map(t => (
           <div key={t.id} className="flex justify-between text-sm">
             <span className="text-slate-600 dark:text-slate-400">{t.source}</span>
             <span className="text-teal-600 font-medium">+₹{t.estimatedTax}</span>
           </div>
         ))}
       </div>
    </div>
  );
};