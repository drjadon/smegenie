
import React, { useState } from 'react';
import { 
  Plus, 
  Receipt, 
  ChevronDown, 
  CreditCard, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { ExpenseClaim, UserProfile } from '../../types';
import { getCurrencySymbol } from '../../constants';
import { format } from 'date-fns';

interface MyClaimsProps {
  user: UserProfile;
  claims: ExpenseClaim[];
  onAddClaim: (claim: ExpenseClaim) => void;
}

export const MyClaims: React.FC<MyClaimsProps> = ({ user, claims, onAddClaim }) => {
  const [showForm, setShowForm] = useState(false);
  const [newClaim, setNewClaim] = useState<Partial<ExpenseClaim>>({ category: 'Travel', amount: 0, description: '', date: new Date().toISOString().split('T')[0] });
  
  const currencySymbol = getCurrencySymbol(user.defaultCurrency);
  const myClaims = claims.filter(c => c.userId === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim.amount) return;
    
    const claim: ExpenseClaim = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      category: (newClaim.category as any) || 'Other',
      amount: newClaim.amount,
      status: 'PENDING',
      date: newClaim.date || new Date().toISOString().split('T')[0],
      description: newClaim.description || ''
    };
    onAddClaim(claim);
    setShowForm(false);
    setNewClaim({ category: 'Travel', amount: 0, description: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... header remains unchanged ... */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
             <Receipt size={32} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reimbursement Ledger</h2>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your professional expenses</p>
           </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={18} /> Log New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClaims.map(claim => (
          <div key={claim.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-500 transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${
                claim.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                claim.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
              }`}>
                <Receipt size={28} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${
                claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                claim.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {claim.status}
              </span>
            </div>
            
            <p className="text-3xl font-black text-slate-900 mb-2">{currencySymbol}{claim.amount.toLocaleString()}</p>
            <p className="text-sm font-bold text-slate-600 mb-4">{claim.category}</p>
            {/* ... rest of the card ... */}
          </div>
        ))}
        {/* ... empty state ... */}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Submit Claim</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Attach your professional expense details</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... category field ... */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Amount ({currencySymbol})</label>
                <div className="relative">
                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="number" 
                        required
                        placeholder="0.00" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-lg text-slate-700" 
                        value={newClaim.amount || ''} 
                        onChange={e => setNewClaim({...newClaim, amount: Number(e.target.value)})} 
                    />
                </div>
              </div>
              {/* ... rest of form ... */}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancel</button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  Confirm Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
