import React, { useState } from 'react';
import { Plus, Lock, FileText, Trash2, Download, Shield, Eye, Search } from 'lucide-react';
import { VaultDocument } from '../types';

interface VaultProps {
  documents: VaultDocument[];
}

const VAULT_CATEGORIES = {
  BANK: { icon: '🏦', color: 'cyan', label: 'Bank Documents' },
  INSURANCE: { icon: '🛡️', color: 'green', label: 'Insurance' },
  INVESTMENT: { icon: '📈', color: 'yellow', label: 'Investments' },
  PROPERTY: { icon: '🏠', color: 'red', label: 'Property' },
  PERSONAL: { icon: '📋', color: 'white', label: 'Personal' },
  GOVERNMENT: { icon: '🏛️', color: 'gray', label: 'Government' }
};

const DUMMY_DOCS: VaultDocument[] = [
  { id: '1', title: 'PAN Card - ABCDE1234F', category: 'GOVERNMENT', type: 'PDF', size: 245000, uploadedDate: new Date('2024-01-15'), encrypted: true },
  { id: '2', title: 'Aadhaar Card - xxxx-xxxx-8765', category: 'GOVERNMENT', type: 'PDF', size: 189000, uploadedDate: new Date('2024-01-15'), encrypted: true },
  { id: '3', title: 'HDFC Bank Statement - Jan 2024', category: 'BANK', type: 'PDF', size: 512000, uploadedDate: new Date('2024-02-01'), encrypted: true },
  { id: '4', title: 'ICICI Credit Card Statement', category: 'BANK', type: 'PDF', size: 387000, uploadedDate: new Date('2024-02-05'), encrypted: true },
  { id: '5', title: 'LIC Policy - 123456789', category: 'INSURANCE', type: 'PDF', size: 678000, uploadedDate: new Date('2024-01-20'), encrypted: true },
  { id: '6', title: 'Health Insurance - Star Health', category: 'INSURANCE', type: 'PDF', size: 445000, uploadedDate: new Date('2024-01-25'), encrypted: true },
  { id: '7', title: 'Zerodha Holdings Report', category: 'INVESTMENT', type: 'PDF', size: 298000, uploadedDate: new Date('2024-02-10'), encrypted: true },
  { id: '8', title: 'Mutual Fund Statement - SIP', category: 'INVESTMENT', type: 'PDF', size: 356000, uploadedDate: new Date('2024-02-12'), encrypted: true },
  { id: '9', title: 'Property Tax Receipt 2024', category: 'PROPERTY', type: 'PDF', size: 167000, uploadedDate: new Date('2024-01-30'), encrypted: true },
  { id: '10', title: 'Rent Agreement - Bangalore', category: 'PROPERTY', type: 'PDF', size: 892000, uploadedDate: new Date('2024-01-10'), encrypted: true },
  { id: '11', title: 'Passport - K1234567', category: 'PERSONAL', type: 'PDF', size: 423000, uploadedDate: new Date('2024-01-05'), encrypted: true },
  { id: '12', title: 'Driving License - KA0120230012345', category: 'PERSONAL', type: 'PDF', size: 234000, uploadedDate: new Date('2024-01-08'), encrypted: true },
];

export const Vault: React.FC<VaultProps> = ({ documents }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const allDocs = [...documents, ...DUMMY_DOCS];

  const groupedDocuments = allDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, VaultDocument[]>);

  const totalSize = allDocs.reduce((sum, doc) => sum + doc.size, 0);
  const totalDocs = allDocs.length;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      <div className="bg-black border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-black uppercase text-white">DOCUMENT VAULT</h1>
          </div>
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Shield size={18} />
            <span className="font-bold uppercase text-xs">256-BIT AES ENCRYPTED</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">MILITARY-GRADE SECURITY FOR YOUR DOCUMENTS</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black border-l-4 border-cyan-500 p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">TOTAL DOCUMENTS</p>
            <p className="text-2xl font-black text-white">{totalDocs}</p>
          </div>
          <div className="bg-black border-l-4 border-yellow-400 p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">STORAGE USED</p>
            <p className="text-2xl font-black text-white">{formatFileSize(totalSize)}</p>
          </div>
          <div className="bg-black border-l-4 border-green-500 p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">ENCRYPTED</p>
            <p className="text-2xl font-black text-green-400">{totalDocs}</p>
          </div>
          <div className="bg-black border-l-4 border-white p-4 shadow-lg">
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">LAST BACKUP</p>
            <p className="text-sm font-black text-white">2 HOURS AGO</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="SEARCH DOCUMENTS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-800 bg-black text-white placeholder-gray-500 focus:border-cyan-500 outline-none font-bold uppercase text-xs"
            />
          </div>
          <button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase transition-all flex items-center gap-2">
            <Plus size={20} />
            UPLOAD
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(VAULT_CATEGORIES).map(([key, category]) => {
            const docs = groupedDocuments[key] || [];
            const isSelected = selectedCategory === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedCategory(isSelected ? null : key)}
                className={`bg-black border-l-8 p-6 cursor-pointer hover:bg-gray-900 transition-all shadow-lg ${
                  isSelected ? 'ring-2 ring-yellow-400' : ''
                } ${
                  category.color === 'cyan' ? 'border-cyan-500' :
                  category.color === 'green' ? 'border-green-500' :
                  category.color === 'yellow' ? 'border-yellow-400' :
                  category.color === 'red' ? 'border-red-500' :
                  category.color === 'white' ? 'border-white' :
                  'border-gray-500'
                }`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-black uppercase text-white mb-2">{category.label}</h3>
                <p className="text-xs font-bold uppercase text-gray-500 mb-3">
                  {docs.length} {docs.length === 1 ? 'DOCUMENT' : 'DOCUMENTS'}
                </p>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 w-fit">
                  <FileText size={14} className="text-cyan-400" />
                  <span className="font-black text-white text-sm">{docs.length}</span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="bg-black border-l-8 border-cyan-500 p-6 shadow-lg animate-fade-in">
            <h2 className="text-2xl font-black uppercase text-white mb-6">
              {VAULT_CATEGORIES[selectedCategory as keyof typeof VAULT_CATEGORIES].label}
            </h2>

            {(!groupedDocuments[selectedCategory] || groupedDocuments[selectedCategory].length === 0) ? (
              <div className="text-center py-10 text-gray-500">
                <p className="font-bold uppercase">NO DOCUMENTS IN THIS CATEGORY</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedDocuments[selectedCategory].map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition border-l-4 border-cyan-500">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black uppercase text-white truncate">{doc.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs font-bold uppercase text-gray-500">
                            {formatFileSize(doc.size)}
                          </p>
                          <p className="text-xs font-bold uppercase text-gray-500">
                            {doc.uploadedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                          </p>
                          <span className="text-xs font-black uppercase px-2 py-0.5 bg-green-500 text-black">
                            ENCRYPTED
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-cyan-500/20 transition">
                        <Eye size={18} className="text-cyan-400" />
                      </button>
                      <button className="p-2 hover:bg-cyan-500/20 transition">
                        <Download size={18} className="text-cyan-400" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 transition">
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-black border-l-8 border-green-500 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <Shield className="text-green-400 flex-shrink-0 mt-1" size={32} />
            <div>
              <h3 className="font-black uppercase text-white mb-2 text-xl">BANK-LEVEL SECURITY</h3>
              <ul className="text-xs font-bold uppercase text-gray-500 space-y-2">
                <li>• 256-BIT AES ENCRYPTION FOR ALL DOCUMENTS</li>
                <li>• AUTOMATIC DAILY BACKUPS TO SECURE CLOUD</li>
                <li>• TWO-FACTOR AUTHENTICATION ENABLED</li>
                <li>• ZERO-KNOWLEDGE ARCHITECTURE - ONLY YOU CAN ACCESS</li>
                <li>• COMPLIANT WITH IT ACT 2000 & GDPR STANDARDS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
