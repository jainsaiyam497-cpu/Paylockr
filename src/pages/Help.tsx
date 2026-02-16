import React, { useState } from 'react';
import { HelpCircle, Mail, MessageCircle, FileQuestion, ChevronDown, Search, BookOpen, Wallet, TrendingUp, Calendar, Shield, CreditCard, FileText, Video, ExternalLink } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Topics', icon: BookOpen, color: 'blue' },
    { id: 'VAULT', label: 'Tax Vault', icon: Wallet, color: 'purple' },
    { id: 'TRANSACTIONS', label: 'Transactions', icon: CreditCard, color: 'green' },
    { id: 'TAX', label: 'Tax Filing', icon: FileText, color: 'orange' },
    { id: 'INSIGHTS', label: 'AI Insights', icon: TrendingUp, color: 'indigo' },
    { id: 'CALENDAR', label: 'Tax Calendar', icon: Calendar, color: 'pink' },
  ];

  const faqs: FAQItem[] = [
    {
      category: 'VAULT',
      question: 'What is Smart Tax Vault and how does it work?',
      answer: 'Smart Tax Vault automatically calculates and sets aside a percentage of your business income for taxes. When you receive a payment, PayLockr estimates the tax liability and moves that amount to your vault, ensuring you always have funds ready for tax payments.'
    },
    {
      category: 'VAULT',
      question: 'How is my tax percentage calculated?',
      answer: 'PayLockr uses your income slab, transaction history, and tax regime (Old/New) to calculate your effective tax rate. The AI analyzes your earning patterns and suggests an optimal percentage to vault, typically ranging from 10-30% based on your annual income.'
    },
    {
      category: 'VAULT',
      question: 'Can I manually adjust my vault percentage?',
      answer: 'Yes! Go to Settings → Tax Settings to adjust your vault percentage. You can choose between Conservative (30%), Balanced (20%), or Liquidity (10%) modes, or set a custom percentage based on your needs.'
    },
    {
      category: 'TRANSACTIONS',
      question: 'How do I categorize my transactions?',
      answer: 'PayLockr automatically categorizes transactions based on merchant names and patterns. You can manually edit categories by clicking on any transaction and selecting from options like Freelance Income, Client Payment, Software Subscriptions, etc.'
    },
    {
      category: 'TRANSACTIONS',
      question: 'What types of income are tracked?',
      answer: 'PayLockr tracks Business Income (freelance, consulting), Personal Transfers (gifts, family), Refunds, and Loans. Only Business Income is considered for tax calculations.'
    },
    {
      category: 'TRANSACTIONS',
      question: 'Can I import transactions from my bank?',
      answer: 'Currently, you can manually add transactions or upload CSV files. Bank integration via UPI and net banking is coming soon in the next update.'
    },
    {
      category: 'TAX',
      question: 'When should I file my ITR?',
      answer: 'For individuals: July 31 (if advance tax paid) or August 31 (regular deadline). For businesses with audit requirements: September 30. Check the Tax Calendar for all important deadlines.'
    },
    {
      category: 'TAX',
      question: 'What is Advance Tax and when do I pay it?',
      answer: 'Advance Tax is paid quarterly if your tax liability exceeds ₹10,000. Payment dates: June 15 (15%), September 15 (45%), December 15 (75%), and March 15 (100%). PayLockr tracks these deadlines in the Tax Calendar.'
    },
    {
      category: 'TAX',
      question: 'Should I choose Old or New Tax Regime?',
      answer: 'New Regime: Lower rates but no deductions. Old Regime: Higher rates but allows 80C, 80D deductions. Use PayLockr\'s AI Insights to analyze which regime saves you more based on your income and investments.'
    },
    {
      category: 'INSIGHTS',
      question: 'How does AI Tax Insights work?',
      answer: 'AI Insights uses Google Gemini to analyze your transaction patterns, income sources, and spending. It identifies tax-saving opportunities, warns about slab jumps, and recommends optimal tax percentages to vault.'
    },
    {
      category: 'INSIGHTS',
      question: 'Is my financial data secure with AI analysis?',
      answer: 'Yes! Your data is processed securely. We only send anonymized transaction summaries to the AI, never your personal details or bank information. All data is encrypted in transit and at rest.'
    },
    {
      category: 'CALENDAR',
      question: 'What deadlines are tracked in Tax Calendar?',
      answer: 'Tax Calendar tracks Income Tax (ITR, Advance Tax), GST (GSTR-1, GSTR-3B), TDS deposits, Professional Tax, PF/ESI, and investment deadlines (80C, 80D). Get reminders for 40+ compliance dates.'
    },
    {
      category: 'CALENDAR',
      question: 'Can I get notifications for upcoming deadlines?',
      answer: 'Yes! Enable notifications in Settings to receive alerts 7 days, 3 days, and 1 day before each deadline. You can customize which types of deadlines you want to be notified about.'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const quickLinks = [
    { title: 'Getting Started Guide', icon: BookOpen, color: 'blue', link: 'https://github.com/SaiyamJain468/Paylockr#getting-started-' },
    { title: 'Video Tutorials', icon: Video, color: 'red', link: 'https://www.youtube.com/results?search_query=paylockr+tutorial' },
    { title: 'Tax Filing Checklist', icon: FileText, color: 'green', link: 'https://www.incometax.gov.in/iec/foportal/' },
    { title: 'API Documentation', icon: ExternalLink, color: 'purple', link: 'https://github.com/SaiyamJain468/Paylockr' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 rounded-2xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black mb-3">How can we help you?</h1>
          <p className="text-indigo-100 text-lg mb-6">Find answers to common questions about PayLockr</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for help topics, features, or questions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md focus:bg-white/20 focus:border-white/40 outline-none text-white placeholder:text-white/60 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition cursor-pointer group">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-lg dark:text-white mb-2">Live Chat</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Chat with our support team</p>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Available 9 AM - 6 PM IST</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition cursor-pointer group">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-lg dark:text-white mb-2">Email Support</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">saiyam468@gmail.com</p>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">Response within 24 hours</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition cursor-pointer group">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Shield size={24} />
          </div>
          <h3 className="font-bold text-lg dark:text-white mb-2">Priority Support</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">For premium users</p>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Instant assistance</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileQuestion className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-bold text-lg dark:text-white">Browse by Topic</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 p-6">
        <h3 className="text-2xl font-bold dark:text-white mb-6">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="border dark:border-slate-700 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition text-left"
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    expandedFAQ === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFAQ === index && (
                <div className="px-4 pb-4 text-slate-600 dark:text-slate-400 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <FileQuestion className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No FAQs found matching your search</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 p-6">
        <h3 className="text-xl font-bold dark:text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a
                key={idx}
                href={link.link}
                className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl hover:shadow-md transition group"
              >
                <div className={`w-10 h-10 bg-${link.color}-100 dark:bg-${link.color}-900/30 text-${link.color}-600 dark:text-${link.color}-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition`}>
                  <Icon size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {link.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
        <p className="text-blue-100 mb-6">Our support team is here to assist you</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a 
            href="https://wa.me/919911566610?text=Hi%2C%20I%20need%20support%20with%20PayLockr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
          >
            Contact Support
          </a>
          <a 
            href="https://wa.me/919911566610?text=Hi%2C%20I%20want%20to%20schedule%20a%20call%20with%20PayLockr%20team"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition"
          >
            Schedule a Call
          </a>
        </div>
      </div>
    </div>
  );
};
