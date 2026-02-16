import React from 'react';
import { BarChart3 } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartDataPoint } from '../../types';

interface ChartProps {
  data: ChartDataPoint[];
  isDarkMode: boolean;
}

export const Chart: React.FC<ChartProps> = ({ data, isDarkMode }) => {
  return (
    <div className={`lg:col-span-2 ${isDarkMode ? 'bg-black border-b-4 border-cyan-500' : 'bg-white border-b-4 border-cyan-500'} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
            INCOME VS TAX TREND
          </h3>
          <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-2`}>
            LAST 6 MONTHS
          </p>
        </div>
        <BarChart3 className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1F2937' : '#D1D5DB'} />
          <XAxis dataKey="name" stroke={isDarkMode ? '#6B7280' : '#6B7280'} style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
          <YAxis stroke={isDarkMode ? '#6B7280' : '#6B7280'} style={{ fontSize: '11px', fontWeight: 'bold' }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
              border: `3px solid ${isDarkMode ? '#FBBF24' : '#06B6D4'}`,
              borderRadius: '0',
              color: isDarkMode ? '#fff' : '#000',
              fontWeight: 'bold'
            }}
          />
          <Area type="monotone" dataKey="income" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.2} strokeWidth={3} name="Income" />
          <Area type="monotone" dataKey="tax" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} strokeWidth={3} name="Tax" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};