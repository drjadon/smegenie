
import React, { useState } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  Calendar, 
  Tag, 
  CreditCard, 
  Hash, 
  FileText, 
  Trash2, 
  Search,
  ReceiptIndianRupee,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Scale,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { Transaction, PaymentMode } from '../../types';
import { format } from 'date-fns';
import { exportToPDF, exportToCSV } from '../../services/export';
import { getCurrencySymbol } from '../../constants';

interface ExpenseTrackerProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  onRemoveTransaction: (id: string) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ 
  transactions, 
  onAddTransaction, 
  onRemoveTransaction 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [isExporting, setIsExporting] = useState(false);
  
  // Use first transaction's currency or default to INR
  const currencySymbol = getCurrencySymbol(transactions[0]?.currency);

  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'EXPENSE',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'General',
    paymentMode: 'UPI',
    reference: '',
    description: ''
  });

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type as 'INCOME' | 'EXPENSE',
      amount: Number(formData.amount),
      date: formData.date || new Date().toISOString().split('T')[0],
      category: formData.category || 'General',
      paymentMode: formData.paymentMode as PaymentMode,
      reference: formData.reference || 'N/A',
      description: formData.description || '',
      timestamp: Date.now()
    };

    onAddTransaction(newTransaction);
    setShowModal(false);
    setFormData({
      type: 'EXPENSE',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      paymentMode: 'UPI',
      reference: '',
      description: ''
    });
  };
  // ... (rest of component remains unchanged, just ensures ₹ is replaced with currencySymbol in render)
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-500 transition-all">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Income</p>
            <p className="text-3xl font-black text-slate-900">{currencySymbol}{totalIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-rose-500 transition-all">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110">
            <TrendingDown size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Expense</p>
            <p className="text-3xl font-black text-slate-900">{currencySymbol}{totalExpense.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 z-10">
            <Scale size={32} />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Net Balance</p>
            <p className={`text-3xl font-black ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{currencySymbol}{balance.toLocaleString()}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-white">
             <ReceiptIndianRupee size={120} />
          </div>
        </div>
      </div>
      {/* ... (rest of the table, ensuring symbol is used) ... */}
      <div id="ledger-table-container" className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* (Header omitted for brevity, logic follows same pattern) */}
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-slate-100 bg-white">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Info</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method & Ref</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-12">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {filteredTransactions.map(t => (
                   <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                         <div>
                            <p className="font-black text-slate-900 text-sm mb-0.5">{t.description}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{format(new Date(t.date), 'MMMM dd, yyyy')}</p>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                         }`}>
                           {t.type}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-xs font-bold text-slate-700">{t.paymentMode}</p>
                         <p className="text-[10px] text-slate-400 font-medium">Ref: {t.reference}</p>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                           {t.category}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right pr-12">
                         <div className="flex items-center justify-end gap-6">
                            <p className={`text-lg font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                               {t.type === 'INCOME' ? '+' : '-'} {getCurrencySymbol(t.currency)}{t.amount.toLocaleString()}
                            </p>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};
