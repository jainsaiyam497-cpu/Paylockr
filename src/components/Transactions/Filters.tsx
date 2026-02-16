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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="SEARCH TRANSACTIONS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-800 bg-black text-white placeholder-gray-500 focus:border-cyan-500 outline-none font-bold uppercase text-xs"
        />
      </div>
      <div className="flex gap-2">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2.5 border-2 border-gray-800 bg-black text-white font-bold uppercase text-xs focus:border-cyan-500 outline-none"
        >
          <option value="ALL">ALL TYPES</option>
          {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <Button onClick={onAdd} className="bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase">
          <Plus size={18} className="mr-2" /> ADD
        </Button>
      </div>
    </div>
  );
};