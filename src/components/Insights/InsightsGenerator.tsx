import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Transaction, TransactionType } from '../../types';
import { generateTaxInsights } from '../../services/geminiService';
import { Button } from '../common/Button';

interface InsightsGeneratorProps {
  transactions: Transaction[];
}

export const InsightsGenerator: React.FC<InsightsGeneratorProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const income = transactions.reduce((acc, t) => t.type === TransactionType.BUSINESS ? acc + t.amount : acc, 0);
    const result = await generateTaxInsights(transactions, income * 12);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/10 rounded-lg"><Sparkles size={24} /></div>
          <h2 className="text-2xl font-bold">AI Tax Assistant</h2>
        </div>
        <p className="text-indigo-100 mb-8">Analyze your recent transactions to find tax saving opportunities and compliance risks.</p>
        <Button 
          onClick={handleGenerate} 
          isLoading={loading}
          className="bg-white text-indigo-700 border-none hover:bg-indigo-50"
        >
          {insight ? 'Refresh Analysis' : 'Generate Insights'}
        </Button>
      </div>

      {insight && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 animate-fade-in">
          <h3 className="text-lg font-bold dark:text-white mb-4">Analysis Results</h3>
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
            {insight}
          </div>
        </div>
      )}
    </div>
  );
};