import React, { useState } from 'react';
import { Plus, Download, Send, Trash2, Eye, FileText } from 'lucide-react';
import { Invoice } from '../types';

interface InvoicesProps {
  invoices: Invoice[];
  onAdd?: (invoice: Invoice) => void;
  onDelete?: (invoiceId: string) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Invoices: React.FC<InvoicesProps> = ({ invoices, onAdd, onDelete, onShowToast }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

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
      <div className="bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-black dark:text-white">INVOICES</h1>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              CREATE
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-black border-b-4 border-cyan-500 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">TOTAL</p>
              <p className="text-2xl font-black text-black dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-black border-b-4 border-yellow-400 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">SENT</p>
              <p className="text-2xl font-black text-black dark:text-white">{stats.sent}</p>
            </div>
            <div className="bg-white dark:bg-black border-b-4 border-green-500 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">PAID</p>
              <p className="text-2xl font-black text-black dark:text-white">{stats.paid}</p>
            </div>
            <div className="bg-white dark:bg-black border-b-4 border-red-500 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">OVERDUE</p>
              <p className="text-2xl font-black text-black dark:text-white">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b-2 border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['ALL', 'DRAFT', 'SENT', 'VIEWED', 'PAID', 'OVERDUE'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 whitespace-nowrap font-bold uppercase text-xs transition-all ${
                filterStatus === status
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 border-2 border-gray-200 dark:border-gray-800'
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
              className="bg-white dark:bg-black border-l-4 border-cyan-500 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-black dark:text-white">{invoice.invoiceNumber}</h3>
                    <span className={`px-3 py-1 text-xs font-bold uppercase ${
                      invoice.status === 'PAID' ? 'bg-green-500 text-black' :
                      invoice.status === 'OVERDUE' ? 'bg-red-500 text-white' :
                      invoice.status === 'SENT' ? 'bg-cyan-500 text-black' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-black dark:text-white font-bold mb-2">{invoice.clientName}</p>
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
                    <p className="text-2xl font-black text-black dark:text-white">{formatCurrency(invoice.amount)}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase md:hidden">{invoice.clientEmail}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase hidden md:block mb-3">{invoice.clientEmail}</p>

                  <div className="flex gap-2 justify-end">
                    <button onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowPreviewModal(true);
                    }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 transition" title="View">
                      <Eye size={18} className="text-black dark:text-white" />
                    </button>
                    <button onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowSendModal(true);
                    }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 transition" title="Send">
                      <Send size={18} className="text-black dark:text-white" />
                    </button>
                    <button onClick={() => onShowToast?.('Invoice downloaded successfully!', 'success')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 transition" title="Download">
                      <Download size={18} className="text-black dark:text-white" />
                    </button>
                    <button onClick={() => { 
                      if(confirm('Delete this invoice?')) {
                        onDelete?.(invoice.id);
                        onShowToast?.('Invoice deleted!', 'success');
                      }
                    }} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 border-2 border-gray-200 dark:border-gray-800 transition" title="Delete">
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

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-black border-4 border-yellow-400 w-full max-w-2xl p-6 my-8">
            <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-6">CREATE PROFESSIONAL INVOICE</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newInvoice: Invoice = {
                id: Date.now().toString(),
                invoiceNumber: `INV-${Date.now()}`,
                clientName: formData.get('clientName') as string,
                clientEmail: formData.get('clientEmail') as string,
                amount: Number(formData.get('amount')),
                date: new Date(),
                dueDate: new Date(formData.get('dueDate') as string),
                status: 'DRAFT',
                items: []
              };
              onAdd && onAdd(newInvoice);
              setShowCreateModal(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Client Name *</label>
                  <input name="clientName" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Client Email *</label>
                  <input name="clientEmail" type="email" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Amount (₹) *</label>
                  <input name="amount" type="number" min="1" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Due Date *</label>
                  <input name="dueDate" type="date" required className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Description</label>
                  <textarea name="description" rows={3} className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-yellow-400 outline-none"></textarea>
                </div>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 mt-4">
                <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">💡 Invoice will be marked as TAXABLE income and added to transactions automatically</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 px-4 py-3 bg-yellow-400 text-black hover:bg-yellow-500 font-bold uppercase transition">CREATE INVOICE</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 font-bold uppercase transition">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showPreviewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-black border-4 border-yellow-400 w-full max-w-3xl p-8 my-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-black uppercase text-black dark:text-white mb-2">INVOICE</h1>
                <p className="text-sm font-bold text-gray-500">{selectedInvoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase text-gray-500">Date</p>
                <p className="text-sm font-black text-black dark:text-white">{selectedInvoice.date.toLocaleDateString('en-IN')}</p>
                <p className="text-xs font-bold uppercase text-gray-500 mt-2">Due Date</p>
                <p className="text-sm font-black text-black dark:text-white">{selectedInvoice.dueDate.toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">From</p>
                <p className="text-lg font-black text-black dark:text-white">PAYLOCKR</p>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Financial Services</p>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">support@paylockr.com</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Bill To</p>
                <p className="text-lg font-black text-black dark:text-white">{selectedInvoice.clientName}</p>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{selectedInvoice.clientEmail}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-gray-100 dark:bg-gray-900 p-4 mb-2">
                <div className="grid grid-cols-3 gap-4">
                  <p className="text-xs font-black uppercase text-gray-500">Description</p>
                  <p className="text-xs font-black uppercase text-gray-500 text-right">Quantity</p>
                  <p className="text-xs font-black uppercase text-gray-500 text-right">Amount</p>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-3 gap-4">
                  <p className="text-sm font-bold text-black dark:text-white">Professional Services</p>
                  <p className="text-sm font-bold text-black dark:text-white text-right">1</p>
                  <p className="text-sm font-bold text-black dark:text-white text-right">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Subtotal</p>
                  <p className="text-sm font-bold text-black dark:text-white">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Tax (0%)</p>
                  <p className="text-sm font-bold text-black dark:text-white">{formatCurrency(0)}</p>
                </div>
                <div className="flex justify-between py-3 bg-yellow-400 px-4 mt-2">
                  <p className="text-lg font-black uppercase text-black">Total</p>
                  <p className="text-lg font-black text-black">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 mb-6">
              <p className="text-xs font-bold uppercase text-gray-500 mb-2">Payment Instructions</p>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Please make payment within {daysUntilDue(selectedInvoice.dueDate)} days. Thank you for your business!</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => onShowToast?.('Invoice downloaded as PDF!', 'success')} className="flex-1 px-4 py-3 bg-cyan-500 text-black hover:bg-cyan-400 font-bold uppercase transition">DOWNLOAD PDF</button>
              <button onClick={() => { setShowPreviewModal(false); setShowSendModal(true); }} className="flex-1 px-4 py-3 bg-yellow-400 text-black hover:bg-yellow-500 font-bold uppercase transition">SEND INVOICE</button>
              <button onClick={() => setShowPreviewModal(false)} className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 font-bold uppercase transition">CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Invoice Modal */}
      {showSendModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border-4 border-cyan-500 w-full max-w-md p-6">
            <h3 className="text-xl font-black uppercase text-black dark:text-white mb-4">SEND INVOICE</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              setShowSendModal(false);
              onShowToast?.(`Invoice sent to ${email}!`, 'success');
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Invoice Number</label>
                  <input type="text" value={selectedInvoice.invoiceNumber} disabled className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-black dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Send To Email *</label>
                  <input name="email" type="email" required defaultValue={selectedInvoice.clientEmail} className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Message (Optional)</label>
                  <textarea name="message" rows={3} placeholder="Add a message..." className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-cyan-500 outline-none"></textarea>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 px-4 py-3 bg-cyan-500 text-black hover:bg-cyan-400 font-bold uppercase transition">SEND INVOICE</button>
                <button type="button" onClick={() => setShowSendModal(false)} className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 font-bold uppercase transition">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};