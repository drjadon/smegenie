
import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  UserCircle, 
  Building2, 
  FilePlus2, 
  History, 
  PenTool, 
  Wallet, 
  Crown,
  LogOut,
  Activity,
  FileUser,
  Users,
  ShieldCheck,
  CalendarCheck,
  Repeat,
  ReceiptIndianRupee,
  ReceiptText,
  Lock,
  FileSpreadsheet,
  CalendarHeart,
  Bot,
  Megaphone
} from 'lucide-react';
import { AppScreen, PlanType, LeaveBalance, UserProfile, EnterpriseRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen, params?: any) => void;
  onLogout: () => void;
  plan: PlanType;
  balance: LeaveBalance;
  user: UserProfile;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, activeScreen, onNavigate, onLogout, plan, balance, user }) => {
  const isEnterprise = plan === 'ENTERPRISE';
  const isPro = plan === 'PRO';
  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const entRole = user.enterpriseRole || 'STAFF';
  
  const navItems = [
    { id: AppScreen.SUPER_ADMIN, label: 'Platform Admin', icon: ShieldCheck, isAdminOnly: true },
    { id: AppScreen.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppScreen.AI_ASSISTANT, label: 'AI Assistant', icon: Bot, isPremium: true },
    { id: AppScreen.ANNOUNCEMENTS, label: 'Announcements', icon: Megaphone, isPremium: false },
    { id: AppScreen.LEAVE_FORM, label: 'Apply Leave', icon: FilePlus2 },
    { id: AppScreen.MY_CLAIMS, label: 'My Claims', icon: ReceiptText, isPremium: true },
    { id: AppScreen.RESUME_MAKER, label: 'Resume Maker', icon: FileUser, isPremium: false },
    { id: AppScreen.HISTORY, label: 'History', icon: History },
    { id: AppScreen.PROFILE, label: isEnterprise && !isSuperAdmin ? 'Institute Profile' : 'My Profile', icon: UserCircle },
    { id: AppScreen.ATTENDANCE, label: 'Attendance', icon: CalendarCheck, isEnterprise: true, allowedRoles: ['OWNER', 'HR', 'MANAGER'] },
    { id: AppScreen.HOLIDAY_MANAGER, label: 'Holiday Calendar', icon: CalendarHeart, isEnterprise: true, allowedRoles: ['OWNER', 'HR'] },
    { id: AppScreen.EXPENSE_TRACKER, label: 'Institute Ledger', icon: ReceiptIndianRupee, isEnterprise: true, allowedRoles: ['OWNER', 'HR'] },
    { id: AppScreen.INVOICE_MAKER, label: 'Invoice Maker', icon: FileSpreadsheet, isEnterprise: true, allowedRoles: ['OWNER', 'HR'] },
    { id: AppScreen.TEAM, label: 'Team Management', icon: Users, isEnterprise: true, allowedRoles: ['OWNER', 'HR'] },
    { id: AppScreen.PAYMATE, label: 'Operations Hub', icon: Wallet, isEnterprise: true, allowedRoles: ['OWNER', 'HR', 'MANAGER'] },
    { id: AppScreen.PLANS, label: 'Upgrade', icon: Crown, isPremium: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.isAdminOnly && !isSuperAdmin) return false;
    if (isSuperAdmin && item.isEnterprise) return false;
    if (item.id === AppScreen.MY_CLAIMS && (plan === 'FREE' || plan === 'ENTERPRISE')) return false;

    if (isEnterprise && !isSuperAdmin) {
      // Unconditionally hide 'Apply Leave' and 'Resume Maker' for Enterprise plan
      if (item.id === AppScreen.LEAVE_FORM || item.id === AppScreen.RESUME_MAKER) {
        return false;
      }

      // Guard based on Enterprise sub-roles for organization features
      if (item.isEnterprise && item.allowedRoles && !item.allowedRoles.includes(entRole)) {
         return false;
      }

      // Hide standard individual tools for management staff to keep dashboard clean
      const isStaff = entRole === 'STAFF';
      if (!isStaff) {
         if (item.id === AppScreen.HISTORY) {
           return false;
         }
      }
    }
    return true;
  });

  const handleNavClick = (screenId: AppScreen, itemIsPremium: boolean, itemIsEnterprise: boolean) => {
    if (itemIsEnterprise && plan !== 'ENTERPRISE') {
      onNavigate(AppScreen.PLANS);
      return;
    }
    if (itemIsPremium && plan === 'FREE') {
      onNavigate(AppScreen.PLANS);
      return;
    }
    onNavigate(screenId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-50">
        <div className="p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">SMEGenie</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Smart Business Pro</p>
            </div>
          </div>

          <nav className="space-y-1 mb-8">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              const isLocked = (item.isEnterprise && plan !== 'ENTERPRISE') || (item.isPremium && plan === 'FREE');
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, !!item.isPremium, !!item.isEnterprise)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                  } ${isLocked ? 'opacity-70 grayscale-[0.5]' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                    <span className="text-sm tracking-tight">{item.label}</span>
                  </div>
                  {isLocked ? (
                    <Lock size={12} className="text-slate-300" />
                  ) : ((item.isPremium && plan === 'FREE') || (item.isEnterprise && plan !== 'ENTERPRISE')) ? (
                    <Crown size={12} className="text-amber-400" fill="currentColor" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {!isSuperAdmin && (!isEnterprise || entRole === 'STAFF') && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Ledger</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Casual (CL)</span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{balance.cl}d</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">Earned (EL)</span>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{balance.el}d</span>
                  </div>
                  <span className="text-[7px] font-black text-emerald-600 uppercase flex items-center gap-0.5"><Repeat size={8} /> Accumulated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Medical</span>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">{balance.hpl}d</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-900 rounded-[2rem] p-5 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{isEnterprise ? `${entRole} Account` : 'Individual'}</p>
              <div className="flex items-center gap-2 mb-3">
                 <p className="text-lg font-bold">{isSuperAdmin ? 'ADMIN' : plan}</p>
                 {plan !== 'FREE' && <Crown size={14} className="text-amber-400" fill="currentColor" />}
              </div>
              <p className="text-[10px] font-medium text-slate-400 truncate mb-4">{user.email}</p>
              {!isSuperAdmin && (
                <button 
                  onClick={() => onNavigate(AppScreen.PLANS)}
                  className="w-full bg-blue-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-colors"
                >
                  {plan === 'FREE' ? 'Upgrade' : 'Manage Pro'}
                </button>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/30 transition-all"></div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-4 mt-4 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <h1 className="text-lg font-black text-slate-900">{title}</h1>
          </div>
          <button onClick={onLogout} className="text-slate-400 p-2">
             <LogOut size={20} />
          </button>
        </header>

        <div className="hidden md:flex w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-6 items-center justify-between sticky top-0 z-40">
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
           <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isSuperAdmin ? 'PLATFORM ADMIN' : entRole}</p>
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-600 italic">{user.name || user.email}</span>
                </div>
              </div>
           </div>
        </div>

        <main className="flex-1 p-6 md:p-10 lg:p-12 pb-24 md:pb-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex items-center justify-around z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {filteredNavItems.filter(i => {
          const mobileWhistlist = [AppScreen.DASHBOARD, AppScreen.ANNOUNCEMENTS, AppScreen.AI_ASSISTANT, AppScreen.PROFILE, AppScreen.SUPER_ADMIN, AppScreen.HOLIDAY_MANAGER];
          if (!isEnterprise || entRole === 'STAFF') {
            mobileWhistlist.push(AppScreen.HISTORY, AppScreen.MY_CLAIMS);
          }
          return mobileWhistlist.includes(i.id);
        }).map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          const isLocked = (item.isEnterprise && plan !== 'ENTERPRISE') || (item.isPremium && plan === 'FREE');

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, !!item.isPremium, !!item.isEnterprise)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all ${
                isActive ? 'text-blue-600' : isLocked ? 'text-slate-200' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                 <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                 {isLocked && <Lock className="absolute -top-1 -right-1 text-slate-400" size={10} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
