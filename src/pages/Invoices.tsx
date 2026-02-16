import React, { useState } from 'react';
import { Plus, Download, Send, Trash2, Eye, FileText } from 'lucide-react';
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
    <div className="min-h-screen pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="bg-black border-b-2 border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-black uppercase text-white">INVOICES</h1>
            </div>
            <button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase transition-all flex items-center gap-2">
              <Plus size={20} />
              CREATE
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black border-b-4 border-cyan-500 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">TOTAL</p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
            <div className="bg-black border-b-4 border-yellow-400 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">SENT</p>
              <p className="text-2xl font-black text-white">{stats.sent}</p>
            </div>
            <div className="bg-black border-b-4 border-green-500 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">PAID</p>
              <p className="text-2xl font-black text-white">{stats.paid}</p>
            </div>
            <div className="bg-black border-b-4 border-red-500 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">OVERDUE</p>
              <p className="text-2xl font-black text-white">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b-2 border-gray-800">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['ALL', 'DRAFT', 'SENT', 'VIEWED', 'PAID', 'OVERDUE'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 whitespace-nowrap font-bold uppercase text-xs transition-all ${
                filterStatus === status
                  ? 'bg-yellow-400 text-black'
                  : 'bg-black text-white hover:bg-gray-900 border-2 border-gray-800'
              }`}
            >
              {status === 'ALL' ? 'ALL' : status}
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
              className="bg-black border-l-4 border-cyan-500 p-4 hover:bg-gray-900 transition"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-white">{invoice.invoiceNumber}</h3>
                    <span className={`px-3 py-1 text-xs font-bold uppercase ${
                      invoice.status === 'PAID' ? 'bg-green-500 text-black' :
                      invoice.status === 'OVERDUE' ? 'bg-red-500 text-white' :
                      invoice.status === 'SENT' ? 'bg-cyan-500 text-black' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-white font-bold mb-2">{invoice.clientName}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-bold uppercase">
                    <span>DATE: {invoice.date.toLocaleDateString('en-IN')}</span>
                    <span>DUE: {invoice.dueDate.toLocaleDateString('en-IN')}</span>
                    {invoice.status !== 'PAID' && (
                      <span className={daysUntilDue(invoice.dueDate) < 0 ? 'text-red-400 font-bold' : ''}>
                        {daysUntilDue(invoice.dueDate) < 0
                          ? `OVERDUE ${Math.abs(daysUntilDue(invoice.dueDate))}D`
                          : `${daysUntilDue(invoice.dueDate)}D LEFT`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-4 mb-3 md:mb-0">
                    <p className="text-2xl font-black text-white">{formatCurrency(invoice.amount)}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase md:hidden">{invoice.clientEmail}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase hidden md:block mb-3">{invoice.clientEmail}</p>

                  <div className="flex gap-2 justify-end">
                    <button className="p-2 hover:bg-gray-800 border-2 border-gray-800 transition" title="View">
                      <Eye size={18} className="text-white" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 border-2 border-gray-800 transition" title="Send">
                      <Send size={18} className="text-white" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 border-2 border-gray-800 transition" title="Download">
                      <Download size={18} className="text-white" />
                    </button>
                    <button className="p-2 hover:bg-red-900 border-2 border-gray-800 transition" title="Delete">
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bold uppercase">NO INVOICES FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
};