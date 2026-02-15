import React from 'react';
import { Transaction } from '../types';
import { InsightsGenerator } from '../components/insights/InsightsGenerator';

interface InsightsProps {
  transactions: Transaction[];
}

export const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <InsightsGenerator transactions={transactions} />
    </div>
  );
};