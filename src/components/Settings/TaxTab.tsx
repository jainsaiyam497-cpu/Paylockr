import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { TaxSettings } from '../../types';
import { Button } from '../common/Button';

interface TaxTabProps {
  settings: TaxSettings;
  setSettings: (settings: TaxSettings) => void;
}

export const TaxTab: React.FC<TaxTabProps> = ({ settings, setSettings }) => {
  const currentYear = new Date().getFullYear();
  const fy = `FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b dark:border-slate-800">
        <div>
           <h3 className="text-lg font-bold dark:text-white">Tax Configuration</h3>
           <p className="text-slate-500 text-sm">Manage your tax regime and vault preferences for {fy}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded text-sm font-medium">
          {fy}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium dark:text-slate-300 mb-3">Tax Regime</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setSettings({...settings, regime: 'New'})}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                settings.regime === 'New' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold dark:text-white">New Regime</span>
                {settings.regime === 'New' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
              </div>
              <p className="text-sm text-slate-500">Lower tax rates but fewer exemptions. Standard deduction allowed.</p>
            </div>

            <div 
              onClick={() => setSettings({...settings, regime: 'Old'})}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                settings.regime === 'Old' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold dark:text-white">Old Regime</span>
                {settings.regime === 'Old' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
              </div>
              <p className="text-sm text-slate-500">Higher rates but allows Section 80C, 80D, HRA exemptions.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-slate-300">Target Vault Amount (₹)</label>
            <input 
              type="number" 
              value={settings.targetVaultAmount || 150000}
              onChange={(e) => setSettings({...settings, targetVaultAmount: parseInt(e.target.value) || 0})}
              className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <p className="text-xs text-slate-500">Your goal for total tax savings this year.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-slate-300">Annual Deduction 80C Limit</label>
             <input 
              type="number" 
              value={150000}
              disabled
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500">Fixed at ₹1,50,000 for Old Regime.</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Info size={18} className="text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold dark:text-white">Current Tax Slabs ({settings.regime} Regime)</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            {settings.regime === 'New' ? (
              <>
                <div className="flex justify-between p-2 border-b dark:border-slate-700"><span className="text-slate-600 dark:text-slate-400">0 - 3 Lakhs</span><span className="font-medium dark:text-white">Nil</span></div>
                <div className="flex justify-between p-2 border-b dark:border-slate-700"><span className="text-slate-600 dark:text-slate-400">3 - 7 Lakhs</span><span className="font-medium dark:text-white">5%</span></div>
                <div className="flex justify-between p-2 border-b dark:border-slate-700"><span className="text-slate-600 dark:text-slate-400">7 - 10 Lakhs</span><span className="font-medium dark:text-white">10%</span></div>
                <div className="flex justify-between p-2 border-b dark:border-slate-700"><span className="text-slate-600 dark:text-slate-400">10 - 12 Lakhs</span><span className="font-medium dark:text-white">15%</span></div>
                <div className="flex justify-between p-2"><span className="text-slate-600 dark:text-slate-400">Above 15 Lakhs</span><span className="font-medium dark:text-white">30%</span></div>
              </>
            ) : (
              <>
                 <div className="flex justify-between p-2 border-b dark:border-slate-700"><span className="text-slate-600 dark:text-slate-400">0 - 2.5 Lakhs</span><span className="font-medium dark:text-white">Nil</span></div>
                 <div className="flex justify-between p-2 border-b dark:border-slate-700"><span className="text-slate-600 dark:text-slate-400">2.5 - 5 Lakhs</span><span className="font-medium dark:text-white">5%</span></div>
                 <div className="flex justify-between p-2 border-b dark:border-slate-700"><span className="text-slate-600 dark:text-slate-400">5 - 10 Lakhs</span><span className="font-medium dark:text-white">20%</span></div>
                 <div className="flex justify-between p-2"><span className="text-slate-600 dark:text-slate-400">Above 10 Lakhs</span><span className="font-medium dark:text-white">30%</span></div>
              </>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Standard Deduction of ₹{settings.regime === 'New' ? '75,000' : '50,000'} is applicable.</p>
        </div>

        <Button>Save Configuration</Button>
      </div>
    </div>
  );
};