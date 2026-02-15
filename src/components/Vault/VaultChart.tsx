import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VaultChartProps {
  vaulted: number;
  target: number;
}

export const VaultChart: React.FC<VaultChartProps> = ({ vaulted, target }) => {
  const data = [
    { name: 'Vaulted', value: vaulted },
    { name: 'Remaining', value: Math.max(0, target - vaulted) }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold dark:text-white mb-2">₹{vaulted.toLocaleString()}</h2>
      <p className="text-slate-500 mb-6">Current Vault Balance</p>
      <div className="w-48 h-48">
         <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              <Cell fill="#0d9488" />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
         </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-4">Target: ₹{target.toLocaleString()}</p>
    </div>
  );
};