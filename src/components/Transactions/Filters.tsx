import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { TransactionType } from '../../types';
import { Button } from '../common/Button';

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filter: 'ALL' | TransactionType;
  setFilter: (value: 'ALL' | TransactionType) => void;
  onAdd: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ search, setSearch, filter, setFilter, onAdd }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2.5 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white"
        >
          <option value="ALL">All Types</option>
          {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <Button onClick={onAdd}>
          <Plus size={18} className="mr-2" /> Add
        </Button>
      </div>
    </div>
  );
};