
import React from 'react';
import { Payslip, UserProfile } from '../../types';
import { format } from 'date-fns';
import { ShieldCheck, Landmark, Fingerprint, Receipt } from 'lucide-react';
import { getCurrencySymbol } from '../../constants';

interface PayslipRendererProps {
  user: UserProfile;
  payslip: Payslip;
}

export const PayslipRenderer: React.FC<PayslipRendererProps> = ({ user, payslip }) => {
  const currencySymbol = getCurrencySymbol(payslip.currency || user.defaultCurrency);

  return (
    <div className="bg-white p-[15mm] md:p-[20mm] shadow-2xl min-h-[297mm] flex flex-col font-sans text-slate-900 border border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-slate-900">
        <div>
           <h1 className="text-3xl font-black text-indigo-600 tracking-tighter uppercase mb-1">{user.company}</h1>
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              <p>{user.address}</p>
              <p>{user.email} • {user.phone}</p>
              {user.gstNumber && <p className="text-slate-600 mt-1">GSTIN: {user.gstNumber}</p>}
           </div>
        </div>
        <div className="text-right">
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">Payslip</h2>
           <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{payslip.month} {payslip.year}</p>
        </div>
      </div>

      {/* Employee Details Area */}
      <div className="grid grid-cols-2 gap-10 mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-100">
        <div className="space-y-4">
           <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Employee Name</h3>
              <p className="text-lg font-black text-slate-900 uppercase">{payslip.memberName}</p>
           </div>
           <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Employee ID</h3>
              <p className="text-sm font-bold text-slate-700">EMP-{payslip.memberId.substr(0, 6).toUpperCase()}</p>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Working Days</h3>
              <p className="text-sm font-black text-slate-900">{payslip.workingDays}</p>
           </div>
           <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid Days</h3>
              <p className="text-sm font-black text-indigo-600">{payslip.paidDays}</p>
           </div>
           <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">LOP Days</h3>
              <p className="text-sm font-black text-rose-500">{payslip.lopDays}</p>
           </div>
           <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Name</h3>
              <p className="text-sm font-bold text-slate-700">{user.defaultBankName || 'N/A'}</p>
           </div>
        </div>
      </div>

      {/* Earnings & Deductions Tables */}
      <div className="flex-1 flex gap-px bg-slate-200 border-2 border-slate-900 rounded-xl overflow-hidden mb-12">
         {/* Earnings */}
         <div className="flex-1 bg-white">
            <div className="p-4 bg-slate-900 text-white text-center font-black text-[10px] uppercase tracking-widest">
               Earnings
            </div>
            <div className="p-6 space-y-4 min-h-[300px]">
               {payslip.earnings.map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-600">
                     <span>{e.label}</span>
                     <span className="text-slate-900">{currencySymbol}{e.amount.toLocaleString()}</span>
                  </div>
               ))}
            </div>
            <div className="p-4 border-t-2 border-slate-900 flex justify-between items-center font-black text-sm bg-slate-50">
               <span className="uppercase tracking-widest text-[10px]">Gross Earnings</span>
               <span>{currencySymbol}{payslip.grossPay.toLocaleString()}</span>
            </div>
         </div>

         {/* Deductions */}
         <div className="flex-1 bg-white border-l-2 border-slate-900">
            <div className="p-4 bg-slate-900 text-white text-center font-black text-[10px] uppercase tracking-widest">
               Deductions
            </div>
            <div className="p-6 space-y-4 min-h-[300px]">
               {payslip.deductions.map((d, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-600">
                     <span>{d.label}</span>
                     <span className="text-rose-600">{currencySymbol}{d.amount.toLocaleString()}</span>
                  </div>
               ))}
            </div>
            <div className="p-4 border-t-2 border-slate-900 flex justify-between items-center font-black text-sm bg-slate-50">
               <span className="uppercase tracking-widest text-[10px]">Total Deductions</span>
               <span>{currencySymbol}{payslip.totalDeductions.toLocaleString()}</span>
            </div>
         </div>
      </div>

      {/* Net Pay Highlight */}
      <div className="mb-12">
         <div className="bg-indigo-600 p-8 rounded-3xl text-white flex justify-between items-center shadow-xl">
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-80">Take Home Pay (Net)</h4>
               <p className="text-xs font-bold italic opacity-90">Official Statement of Payout</p>
            </div>
            <div className="text-right">
               <p className="text-5xl font-black tracking-tighter">{currencySymbol}{payslip.netPay.toLocaleString()}</p>
            </div>
         </div>
      </div>

      {/* Footer / Confirmation */}
      <div className="mt-auto grid grid-cols-2 gap-20 pt-12 border-t border-slate-100">
         <div>
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">System Verification</h4>
            <div className="flex items-center gap-3 text-emerald-600">
               <ShieldCheck size={32} />
               <div>
                  <p className="text-xs font-black uppercase tracking-widest">Digitally Verified</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified Ledger Payout Account</p>
               </div>
            </div>
         </div>
         <div className="text-right flex flex-col items-end">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-10">Authorized Signatory</h4>
            <div className="w-48 h-px bg-slate-900" />
            <p className="text-[10px] font-black text-slate-900 uppercase mt-2 tracking-widest">{user.name}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Organization Administrator</p>
         </div>
      </div>

      <div className="text-center mt-12 opacity-20 text-[8px] font-black uppercase tracking-[0.6em]">
         Generated via SMEGenie Smart Enterprise Ledger
      </div>
    </div>
  );
};
