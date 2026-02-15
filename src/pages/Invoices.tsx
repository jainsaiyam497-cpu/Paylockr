import React, { useState } from 'react';
import { Plus, Download, Send, Trash2, Eye } from 'lucide-react';
import { Invoice } from '../types';

interface InvoicesProps {
  invoices: Invoice[]; // Changed to invoices prop
}

export const Invoices: React.FC<InvoicesProps> = ({ invoices }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredInvoices = filterStatus === 'ALL' 
    ? invoices 
    : invoices.filter(inv => inv.status === filterStatus);

  const stats = {
    total: invoices.length,
    sent: invoices.filter(i => i.status === 'SENT').length,
    paid: invoices.filter(i => i.status === 'PAID').length,
    overdue: invoices.filter(i => i.status === 'OVERDUE').length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      VIEWED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      CANCELLED: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const daysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const days = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition">
              <Plus size={20} />
              Create Invoice
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border dark:border-blue-800/30">
              <p className="text-sm text-gray-600 dark:text-blue-300">Total Invoices</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border dark:border-orange-800/30">
              <p className="text-sm text-gray-600 dark:text-orange-300">Sent</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.sent}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border dark:border-green-800/30">
              <p className="text-sm text-gray-600 dark:text-green-300">Paid</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.paid}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border dark:border-red-800/30">
              <p className="text-sm text-gray-600 dark:text-red-300">Overdue</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['ALL', 'DRAFT', 'SENT', 'VIEWED', 'PAID', 'OVERDUE'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border dark:border-slate-700'
              }`}
            >
              {status === 'ALL' ? 'All Invoices' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredInvoices.map(invoice => (
            <div
              key={invoice.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{invoice.invoiceNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{invoice.clientName}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Date: {invoice.date.toLocaleDateString('en-IN')}</span>
                    <span>Due: {invoice.dueDate.toLocaleDateString('en-IN')}</span>
                    {invoice.status !== 'PAID' && (
                      <span className={daysUntilDue(invoice.dueDate) < 0 ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                        {daysUntilDue(invoice.dueDate) < 0
                          ? `Overdue by ${Math.abs(daysUntilDue(invoice.dueDate))} days`
                          : `${daysUntilDue(invoice.dueDate)} days left`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(invoice.amount)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">{invoice.clientEmail}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition" title="View">
                      <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition" title="Send">
                      <Send size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition" title="Download">
                      <Download size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                      <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
};