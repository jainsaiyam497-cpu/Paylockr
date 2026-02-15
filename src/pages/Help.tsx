import React from 'react';
import { HelpCircle, Mail, MessageCircle, FileQuestion } from 'lucide-react';

export const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How can we help you?</h1>
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search for help..." 
            className="w-full px-6 py-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white shadow-sm"
          />
          <button className="absolute right-2 top-2 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 hover:shadow-lg transition text-center cursor-pointer group">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
            <FileQuestion size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">FAQs</h3>
          <p className="text-sm text-slate-500">Browse common questions about PayLockr features.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 hover:shadow-lg transition text-center cursor-pointer group">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Live Chat</h3>
          <p className="text-sm text-slate-500">Chat with our support team in real-time.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 hover:shadow-lg transition text-center cursor-pointer group">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Email Support</h3>
          <p className="text-sm text-slate-500">Get a response within 24 hours.</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Popular Articles</h3>
        <ul className="space-y-3">
          {['How to link your bank account', 'Understanding Tax Vault logic', 'Exporting financial reports', 'Resetting your password'].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};