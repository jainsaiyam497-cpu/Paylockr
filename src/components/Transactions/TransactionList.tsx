import React from 'react';
import { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-black border-2 border-gray-800 overflow-hidden shadow-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-900 text-gray-500 text-xs uppercase font-black">
          <tr>
            <th className="px-6 py-4">DATE</th>
            <th className="px-6 py-4">SOURCE</th>
            <th className="px-6 py-4">TYPE</th>
            <th className="px-6 py-4">STATUS</th>
            <th className="px-6 py-4 text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {transactions.map(t => (
            <tr key={t.id} className="hover:bg-gray-900 transition">
              <td className="px-6 py-4 text-sm text-gray-500 font-bold">
                {typeof t.date === 'string' ? t.date : t.date.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-black text-white">{t.source}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-900 border-2 border-gray-800 text-xs text-white font-bold uppercase">{t.type}</span></td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-black uppercase ${
                  t.status === 'Vaulted' ? 'bg-green-500 text-black' : 
                  t.status === 'Pending' ? 'bg-yellow-400 text-black' : 
                  'bg-gray-800 text-white'
                }`}>
                  {t.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-black text-white">₹{t.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};