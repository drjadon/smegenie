
import React from 'react';
import { User, Building2, FilePlus, ChevronRight, History, Crown, PenTool, Wallet, Zap, CalendarDays, Activity, Bell, Users as UsersIcon, Repeat, Receipt, CalendarCheck, ReceiptIndianRupee, Lock, FileSpreadsheet, CalendarHeart, Sparkles, BrainCircuit, Bot, Megaphone, School } from 'lucide-react';
import { UserProfile, PlanType, LeaveBalance, ExpenseClaim, AppScreen, Holiday, Announcement } from '../types';
import { MAX_ENTITLEMENTS, CARRY_FORWARD_TYPES, getCurrencySymbol } from '../constants';
import { format, isAfter, parseISO } from 'date-fns';

interface DashboardProps {
  user: UserProfile;
  employerCount: number;
  plan: PlanType;
  balance: LeaveBalance;
  onNavigate: (screen: AppScreen, params?: any) => void;
  history: any[];
  hasSignature: boolean;
  claims: ExpenseClaim[];
  holidays: Holiday[];
  announcements: Announcement[];
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, employerCount, plan, balance, onNavigate, history, hasSignature, claims, holidays, announcements 
}) => {
  const isPro = plan === 'PRO' || plan === 'ENTERPRISE';
  const isEnterprise = plan === 'ENTERPRISE';
  const isStudentOrIntern = user.employeeType === 'STUDENT' || user.employeeType === 'INTERN';
  const currencySymbol = getCurrencySymbol(user.defaultCurrency);

  const [pendingCount, setPendingCount] = React.useState(0);
  React.useEffect(() => {
    const saved = localStorage.getItem('leavegenie_team_requests');
    if (saved) {
      const requests = JSON.parse(saved);
      setPendingCount(requests.filter((r: any) => r.status === 'PENDING').length);
    }
  }, []);

  const pendingClaims = claims.filter(c => c.status === 'PENDING');
  const totalApprovedExpenses = claims.filter(c => c.status === 'APPROVED').reduce((acc, curr) => acc + curr.amount, 0);

  const upcomingHolidays = [...holidays]
    .filter(h => isAfter(parseISO(h.date), new Date()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);

  const latestAnnouncements = announcements.slice(0, 2);

  const handleActionClick = (target: AppScreen, restricted: boolean = false) => {
    if (restricted && !isPro) {
      onNavigate(AppScreen.PLANS);
      return;
    }
    onNavigate(target);
  };

  const renderBalanceCard = (id: string, label: string, current: number, max: number, color: string) => {
    const isAccumulated = CARRY_FORWARD_TYPES.includes(id);
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-5 border border-white/10 hover:bg-white/10 transition-all group">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-blue-300 font-black">{label}</p>
            {isAccumulated && (
              <span className="flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-tighter mt-0.5">
                <Repeat size={10} /> Accumulated
              </span>
            )}
          </div>
          <p className="text-xl md:text-2xl font-black">{current}d</p>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
          <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="text-[9px] text-white/40 mt-2 font-bold uppercase tracking-tighter">
          {isAccumulated ? `Max Limit: ${max} Days` : `Annual Limit: ${max} Days`}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Welcome, {user.name || 'Genie User'}!</h2>
            <p className="text-blue-300/80 text-lg font-medium">{user.designation || (isEnterprise ? 'Institute Administrator' : 'Complete your setup to begin')}</p>
            <div className="pt-4 flex items-center gap-2">
              <button 
                onClick={() => onNavigate(AppScreen.PLANS)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all uppercase tracking-widest border-2 ${
                  plan === 'FREE' ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-lg shadow-amber-400/20' 
                  : plan === 'PRO' ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/20'
                  : 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-200/50'
                } hover:scale-105 active:scale-95`}
              >
                {plan === 'FREE' ? <Zap size={14} fill="currentColor" /> : <Crown size={14} fill="currentColor" />}
                {plan} {plan === 'FREE' ? 'UPGRADE' : 'MEMBER'}
              </button>
            </div>
          </div>
          {!isEnterprise && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-1/2">
              {renderBalanceCard('cl', 'CL (Casual)', balance.cl, MAX_ENTITLEMENTS.cl, 'bg-emerald-400')}
              {renderBalanceCard('el', 'EL (Earned)', balance.el, MAX_ENTITLEMENTS.el, 'bg-blue-400')}
              {renderBalanceCard('hpl', isStudentOrIntern ? 'Attendance' : 'HPL (Medical)', balance.hpl, MAX_ENTITLEMENTS.hpl, 'bg-amber-400')}
            </div>
          )}
          {isEnterprise && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-1/2">
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                   <p className="text-[10px] uppercase tracking-widest text-blue-300 font-black mb-1">Total Team</p>
                   <p className="text-3xl font-black">Managed Network</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                   <p className="text-[10px] uppercase tracking-widest text-blue-300 font-black mb-1">Pending Tasks</p>
                   <p className="text-3xl font-black text-amber-400">{pendingCount + pendingClaims.length}</p>
                </div>
             </div>
          )}
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {latestAnnouncements.length > 0 && (
             <div className="bg-white rounded-[2.5rem] border border-blue-100 p-8 shadow-sm overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                         <Megaphone size={20} />
                      </div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Latest Broadcasts</h3>
                   </div>
                   <button onClick={() => onNavigate(AppScreen.ANNOUNCEMENTS)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Feed</button>
                </div>
                <div className="space-y-4">
                   {latestAnnouncements.map(ann => (
                     <div key={ann.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${ann.priority === 'URGENT' || ann.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-blue-400'}`} />
                        <div>
                           <p className="text-sm font-black text-slate-800">{ann.title}</p>
                           <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ann.content}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="absolute -top-10 -right-10 opacity-[0.03] text-blue-600 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
                   <Megaphone size={160} />
                </div>
             </div>
           )}

           <div className={`grid gap-4 md:gap-6 ${isEnterprise ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
            <button onClick={() => onNavigate(AppScreen.PROFILE)} className="flex flex-col gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-blue-500 transition-all group shadow-sm text-left">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">{isStudentOrIntern ? <School size={28} /> : <User size={28} />}</div>
              <span className="font-black text-slate-800 text-xs uppercase tracking-widest">{isEnterprise ? 'Institute' : isStudentOrIntern ? 'Academic Bio' : 'My Profile'}</span>
            </button>
            <button onClick={() => handleActionClick(AppScreen.AI_ASSISTANT, true)} className={`flex flex-col gap-4 p-6 bg-white rounded-[2rem] border transition-all group shadow-sm text-left relative ${!isPro ? 'opacity-60 border-slate-100 bg-slate-50/50' : 'border-slate-100 hover:border-indigo-500'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${isPro ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}><Bot size={28} /></div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-800 text-xs uppercase tracking-widest">SMEGenie AI Assistant</span>
                {!isPro && <Lock size={12} className="text-slate-400" />}
              </div>
            </button>
            {!isEnterprise && (
              <>
                <button onClick={() => onNavigate(AppScreen.PROFILE, { tab: 'EMPLOYERS' })} className="flex flex-col gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-500 transition-all group shadow-sm text-left">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Building2 size={28} /></div>
                  <span className="font-black text-slate-800 text-xs uppercase tracking-widest">{isStudentOrIntern ? `Institutes (${employerCount})` : `Jobs (${employerCount})`}</span>
                </button>
                <button onClick={() => onNavigate(AppScreen.PROFILE)} className={`flex flex-col gap-4 p-6 bg-white rounded-[2rem] border transition-all group shadow-sm text-left ${hasSignature ? 'border-green-100 bg-green-50/20' : 'border-slate-100 hover:border-emerald-500'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${hasSignature ? 'bg-green-100 text-green-600' : 'bg-emerald-50 text-emerald-600'}`}><PenTool size={28} /></div>
                  <span className="font-black text-slate-800 text-xs uppercase tracking-widest">{hasSignature ? 'Sign Ready' : 'Signature'}</span>
                </button>
              </>
            )}
            {isEnterprise && (
              <button onClick={() => onNavigate(AppScreen.TEAM)} className="flex flex-col gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-500 transition-all group shadow-sm text-left">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><UsersIcon size={28} /></div>
                <span className="font-black text-slate-800 text-xs uppercase tracking-widest">Staff Panel</span>
              </button>
            )}
          </div>
          {!isEnterprise ? (
            <button onClick={() => onNavigate(AppScreen.LEAVE_FORM)} className="w-full flex items-center justify-center gap-4 py-10 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] hover:-translate-y-1">
              <FilePlus size={32} /> {isStudentOrIntern ? 'New Application' : 'Request Leave'}
            </button>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm h-full flex flex-col justify-center">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><Activity size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Institute Overview</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Administrator Control Panel</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payouts</p>
                    <p className="text-2xl font-black text-slate-900">{currencySymbol}{totalApprovedExpenses.toLocaleString()}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Claims</p>
                    <p className="text-2xl font-black text-slate-900">{pendingClaims.length}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => onNavigate(AppScreen.EXPENSE_TRACKER)} className="py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-800 transition-all">Expense Ledger</button>
                  <button onClick={() => onNavigate(AppScreen.PAYMATE)} className="py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50 transition-all">Payroll Hub</button>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group cursor-pointer" onClick={() => onNavigate(AppScreen.AI_ASSISTANT)}>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><BrainCircuit size={20} /></div>
                   <h3 className="text-sm font-black uppercase tracking-widest">AI Wellness Check</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90">Your burnout risk is being analyzed. Click to see patterns.</p>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Sparkles size={120} /></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><CalendarHeart size={20} /></div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Next Holidays</h3>
              </div>
              {isEnterprise && <button onClick={() => onNavigate(AppScreen.HOLIDAY_MANAGER)} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Manage</button>}
            </div>
            <div className="space-y-3 relative z-10">
              {upcomingHolidays.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No upcoming holidays</p>
                </div>
              ) : upcomingHolidays.map(h => (
                <div key={h.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                   <div>
                      <p className="text-xs font-black text-slate-900">{h.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{format(parseISO(h.date), 'MMM dd, yyyy')}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
