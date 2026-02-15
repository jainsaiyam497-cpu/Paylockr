import React from 'react';
import { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Source</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800">
          {transactions.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <td className="px-6 py-4 text-sm text-slate-500">
                {typeof t.date === 'string' ? t.date : t.date.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-medium dark:text-white">{t.source}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{t.type}</span></td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  t.status === 'Vaulted' ? 'bg-teal-100 text-teal-700' : 
                  t.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                  'bg-slate-100 text-slate-500'
                }`}>
                  {t.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-bold dark:text-white">₹{t.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};