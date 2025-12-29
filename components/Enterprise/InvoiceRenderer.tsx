
import React from 'react';
import { Invoice, UserProfile } from '../../types';
import { format } from 'date-fns';
import { QrCode, Building2, CreditCard, Landmark, Scale, Fingerprint } from 'lucide-react';
import { getCurrencySymbol } from '../../constants';

interface InvoiceRendererProps {
  user: UserProfile;
  invoice: Invoice;
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({ user, invoice }) => {
  const currencySymbol = getCurrencySymbol(invoice.currency || user.defaultCurrency);
  const currencyCode = invoice.currency || user.defaultCurrency || 'INR';

  // Generate UPI QR Code URL
  const upiUrl = invoice.upiId 
    ? `upi://pay?pa=${invoice.upiId}&pn=${encodeURIComponent(invoice.accountHolder || user.name)}&am=${invoice.total}&cu=${currencyCode}`
    : '';
  
  const qrCodeUrl = upiUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`
    : '';

  return (
    <div className="bg-white p-[20mm] shadow-2xl min-h-[297mm] flex flex-col font-sans text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-start mb-20">
        <div>
           <h1 className="text-4xl font-black text-indigo-600 tracking-tighter uppercase mb-2">{user.company || 'INSTITUTE NAME'}</h1>
           {user.gstNumber && (
             <div className="flex items-center gap-1.5 mb-4 text-[11px] font-black text-slate-800 uppercase tracking-widest bg-slate-50 w-fit px-2 py-1 rounded border border-slate-100">
                <Fingerprint size={12} className="text-indigo-600" /> GSTIN: {user.gstNumber}
             </div>
           )}
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest space-y-1">
              <p>{user.address || 'Address not configured'}</p>
              <p>{user.email}</p>
              <p>{user.phone}</p>
           </div>
        </div>
        <div className="text-right">
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">Invoice</h2>
           <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{invoice.invoiceNumber}</p>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-2 gap-20 mb-20">
        <div>
           <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-2">Bill To</h3>
           <div className="space-y-1">
              <p className="text-xl font-black text-slate-900">{invoice.clientName || '[Client Name]'}</p>
              {invoice.clientGstNumber && (
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">GSTIN: {invoice.clientGstNumber}</p>
              )}
              <p className="text-sm font-bold text-slate-500">{invoice.clientEmail || '[Client Email]'}</p>
              <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{invoice.clientAddress || '[Client Address]'}</p>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-10">
           <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issued On</h3>
              <p className="font-black text-slate-900">{format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
           </div>
           <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Due Date</h3>
              <p className="font-black text-indigo-600">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-y-2 border-slate-900">
              <th className="py-4 text-[10px] font-black uppercase tracking-widest">Description</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-center w-24">HSN/SAC</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-center w-20">Qty</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-center w-24">Rate</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-center w-24">Tax %</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-6 pr-6">
                  <p className="font-black text-slate-900">{item.description || 'Consultancy Services'}</p>
                  {item.discountAmount > 0 && (
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                      Discount Applied: -{currencySymbol}{item.discountAmount.toLocaleString()}
                    </p>
                  )}
                </td>
                <td className="py-6 text-center font-black text-xs text-indigo-500">{item.hsnCode || '---'}</td>
                <td className="py-6 text-center font-bold text-slate-500">{item.quantity}</td>
                <td className="py-6 text-center font-bold text-slate-500">{currencySymbol}{item.rate.toLocaleString()}</td>
                <td className="py-6 text-center font-bold text-slate-400">{item.taxRate}%</td>
                <td className="py-6 text-right font-black text-slate-900">{currencySymbol}{item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Totals & Payment Info */}
      <div className="mt-10 pt-10 border-t-2 border-slate-900">
         <div className="flex justify-between items-start gap-12">
            {/* Left Side: Payment Info & Terms */}
            <div className="flex-1 space-y-6">
               {(invoice.bankName || invoice.upiId) && (
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-8 items-start">
                    <div className="flex-1 space-y-3">
                       <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-1">Payment Details</h4>
                       <div className="grid grid-cols-1 gap-2 text-xs">
                          {invoice.bankName && (
                            <p className="flex items-center gap-2 font-bold text-slate-700">
                              <span className="text-[9px] text-slate-400">BANK:</span> {invoice.bankName}
                            </p>
                          )}
                          {invoice.accountNumber && (
                            <p className="flex items-center gap-2 font-black text-slate-900">
                              <span className="text-[9px] text-slate-400">A/C:</span> {invoice.accountNumber}
                            </p>
                          )}
                          {invoice.upiId && (
                            <p className="flex items-center gap-2 font-black text-indigo-600 mt-1">
                              <span className="text-[9px] text-indigo-300">UPI:</span> {invoice.upiId}
                            </p>
                          )}
                       </div>
                    </div>
                    {qrCodeUrl && (
                      <div className="text-center space-y-2">
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                           <img src={qrCodeUrl} alt="Payment QR" className="w-24 h-24" />
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scan to Pay</p>
                      </div>
                    )}
                 </div>
               )}
               {invoice.terms && (
                 <div className="max-w-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Scale size={10} /> Notes & Terms
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic whitespace-pre-line">
                       {invoice.terms}
                    </p>
                 </div>
               )}
            </div>

            {/* Right Side: Totals */}
            <div className="w-64 space-y-4">
               <div className="flex justify-between text-sm font-bold text-slate-400">
                  <span>Gross Subtotal</span>
                  <span>{currencySymbol}{invoice.subtotal.toLocaleString()}</span>
               </div>
               {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-emerald-600 italic">
                    <span>Total Discount</span>
                    <span>- {currencySymbol}{invoice.discountAmount.toLocaleString()}</span>
                  </div>
               )}
               <div className="flex justify-between text-sm font-bold text-slate-400">
                  <span>Taxes (Aggregated)</span>
                  <span>{currencySymbol}{invoice.taxAmount.toLocaleString()}</span>
               </div>
               <div className="flex justify-between pt-4 border-t-2 border-slate-900">
                  <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
                  <span className="text-3xl font-black text-indigo-600">{currencySymbol}{invoice.total.toLocaleString()}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="mt-auto pt-10 flex justify-between items-center opacity-20 border-t border-slate-50">
         <p className="text-[8px] font-black uppercase tracking-[0.5em]">Digitally Generated via SMEGenie Enterprise</p>
         <p className="text-[10px] font-black uppercase tracking-tighter italic">Verified Ledger Account</p>
      </div>
    </div>
  );
};
