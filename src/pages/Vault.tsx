import React, { useState } from 'react';
import { Plus, Lock, FileText, Trash2, Download } from 'lucide-react';
import { VaultDocument } from '../types';

interface VaultProps {
  documents: VaultDocument[]; // Changed to documents prop
}

const VAULT_CATEGORIES = {
  BANK: { icon: '🏦', color: 'from-blue-400 to-blue-600', label: 'Bank Documents' },
  INSURANCE: { icon: '🛡️', color: 'from-green-400 to-green-600', label: 'Insurance' },
  INVESTMENT: { icon: '📈', color: 'from-purple-400 to-purple-600', label: 'Investments' },
  PROPERTY: { icon: '🏠', color: 'from-orange-400 to-orange-600', label: 'Property' },
  PERSONAL: { icon: '📋', color: 'from-pink-400 to-pink-600', label: 'Personal' },
  GOVERNMENT: { icon: '🏛️', color: 'from-gray-400 to-gray-600', label: 'Government' }
};

export const Vault: React.FC<VaultProps> = ({ documents }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, VaultDocument[]>);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-black border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 pl-16 md:pl-4">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-black uppercase text-white">DOCUMENT VAULT</h1>
          </div>
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Lock size={18} />
            <span className="font-bold uppercase text-xs">ENCRYPTED</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">ALL DOCUMENTS STORED SECURELY</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Document Button */}
        <div className="mb-8">
          <button className="w-full md:w-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase transition-all flex items-center gap-2 justify-center">
            <Plus size={20} />
            UPLOAD DOCUMENT
          </button>
        </div>

        {/* Vault Categories Grid - Glassmorphism Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(VAULT_CATEGORIES).map(([key, category]) => {
            const docs = groupedDocuments[key] || [];
            const isSelected = selectedCategory === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedCategory(isSelected ? null : key)}
                className={`group cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-blue-500 rounded-2xl' : ''
                }`}
              >
                {/* Glassmorphism Card */}
                <div
                  className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white shadow-lg backdrop-blur-md border border-white/20 hover:shadow-2xl transition-all overflow-hidden relative h-48`}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                    <div className="absolute inset-0 bg-white/20 transform group-hover:scale-150 transition-transform" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="text-2xl font-bold mb-1">{category.label}</h3>
                    <p className="text-white/80 mb-3 text-sm">
                      {docs.length} {docs.length === 1 ? 'document' : 'documents'}
                    </p>

                    {/* Document Count Badge */}
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 w-fit backdrop-blur-sm">
                      <FileText size={14} />
                      <span className="font-semibold text-sm">{docs.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Documents Detail View */}
        {selectedCategory && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {VAULT_CATEGORIES[selectedCategory as keyof typeof VAULT_CATEGORIES].label}
            </h2>

            {(!groupedDocuments[selectedCategory] || groupedDocuments[selectedCategory].length === 0) ? (
              <div className="text-center py-10 text-slate-500">
                <p>No documents in this category.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedDocuments[selectedCategory].map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {doc.type === 'PDF' && <FileText size={20} />}
                        {doc.type === 'IMAGE' && <span className="text-lg">🖼️</span>}
                        {doc.type === 'VIDEO' && <span className="text-lg">🎥</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{doc.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(doc.size)} • {doc.uploadedDate.toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div title="Encrypted">
                        <Lock size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                        <Download size={18} className="text-blue-600 dark:text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                        <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Security Info */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg border border-green-200 dark:border-green-900/30 p-6">
          <div className="flex items-start gap-4">
            <Lock className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All documents in your vault are encrypted with military-grade encryption.
                Only you can access them using your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};