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
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-black border-l-8 border-yellow-400 p-8 md:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-black uppercase text-white mb-3">HOW CAN WE HELP YOU?</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">FIND ANSWERS TO COMMON QUESTIONS ABOUT PAYLOCKR</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="SEARCH FOR HELP TOPICS, FEATURES, OR QUESTIONS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-800 bg-gray-900 focus:bg-black focus:border-cyan-500 outline-none text-white placeholder:text-gray-500 font-bold uppercase text-xs"
            />
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black border-l-4 border-cyan-500 p-6 hover:bg-gray-900 hover:shadow-lg transition cursor-pointer group">
          <div className="w-12 h-12 bg-cyan-500 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-black uppercase text-white mb-2">LIVE CHAT</h3>
          <p className="text-xs font-bold uppercase text-gray-500 mb-3">CHAT WITH OUR SUPPORT TEAM</p>
          <span className="text-xs font-bold uppercase text-cyan-400">AVAILABLE 9 AM - 6 PM IST</span>
        </div>

        <div className="bg-black border-l-4 border-green-500 p-6 hover:bg-gray-900 hover:shadow-lg transition cursor-pointer group">
          <div className="w-12 h-12 bg-green-500 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Mail size={24} />
          </div>
          <h3 className="font-black uppercase text-white mb-2">EMAIL SUPPORT</h3>
          <p className="text-xs font-bold uppercase text-gray-500 mb-3">saiyam468@gmail.com</p>
          <span className="text-xs font-bold uppercase text-green-400">RESPONSE WITHIN 24 HOURS</span>
        </div>

        <div className="bg-black border-l-4 border-yellow-400 p-6 hover:bg-gray-900 hover:shadow-lg transition cursor-pointer group">
          <div className="w-12 h-12 bg-yellow-400 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Shield size={24} />
          </div>
          <h3 className="font-black uppercase text-white mb-2">PRIORITY SUPPORT</h3>
          <p className="text-xs font-bold uppercase text-gray-500 mb-3">FOR PREMIUM USERS</p>
          <span className="text-xs font-bold uppercase text-yellow-400">INSTANT ASSISTANCE</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-black border-l-4 border-cyan-500 p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <FileQuestion className="w-5 h-5 text-cyan-400" />
          <h3 className="font-black uppercase text-white">BROWSE BY TOPIC</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 font-bold uppercase text-xs transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-800'
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
      <div className="bg-black border-l-8 border-cyan-500 p-6 shadow-lg">
        <h3 className="text-2xl font-black uppercase text-white mb-6">FREQUENTLY ASKED QUESTIONS</h3>
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-gray-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-900 transition text-left"
              >
                <span className="font-black uppercase text-xs text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    expandedFAQ === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFAQ === index && (
                <div className="px-4 pb-4 text-xs font-bold uppercase text-gray-500 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <FileQuestion className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xs font-bold uppercase text-gray-500">NO FAQS FOUND MATCHING YOUR SEARCH</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-black border-l-8 border-yellow-400 p-6 shadow-lg">
        <h3 className="text-xl font-black uppercase text-white mb-4">QUICK LINKS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a
                key={idx}
                href={link.link}
                className="flex items-center gap-3 p-4 bg-gray-900 hover:bg-gray-800 transition group"
              >
                <div className={`w-10 h-10 bg-${link.color === 'blue' ? 'cyan' : link.color}-500 text-black flex items-center justify-center group-hover:scale-110 transition`}>
                  <Icon size={20} />
                </div>
                <span className="font-black uppercase text-xs text-white group-hover:text-cyan-400 transition">
                  {link.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="bg-black border-l-8 border-cyan-500 p-8 text-center shadow-lg">
        <h3 className="text-2xl font-black uppercase text-white mb-2">STILL NEED HELP?</h3>
        <p className="text-xs font-bold uppercase text-gray-500 mb-6">OUR SUPPORT TEAM IS HERE TO ASSIST YOU</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a 
            href="https://wa.me/919911566610?text=Hi%2C%20I%20need%20support%20with%20PayLockr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-yellow-400 text-black font-black uppercase hover:bg-yellow-500 transition"
          >
            CONTACT SUPPORT
          </a>
          <a 
            href="https://wa.me/919911566610?text=Hi%2C%20I%20want%20to%20schedule%20a%20call%20with%20PayLockr%20team"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-900 text-white font-black uppercase hover:bg-gray-800 transition"
          >
            SCHEDULE A CALL
          </a>
        </div>
      </div>
    </div>
  );
};
