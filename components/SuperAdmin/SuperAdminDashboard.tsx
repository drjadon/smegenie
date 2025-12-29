
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  Settings, 
  Activity, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Globe, 
  DollarSign, 
  Download, 
  Crown, 
  Save, 
  Shield, 
  FileText, 
  UserPlus,
  Mail,
  Building2,
  Briefcase,
  AlertTriangle,
  RotateCcw,
  Megaphone,
  Calendar,
  Tag,
  ArrowRight,
  User,
  Send,
  X,
  Target,
  Zap,
  IndianRupee,
  Edit3,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { UserProfile, SubscriptionPlanConfig, PaymentGatewayConfig, PlanType, Announcement } from '../../types';
import { format } from 'date-fns';

interface SuperAdminDashboardProps {
  currentUser: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
  onSaveAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  globalAnnouncements: Announcement[];
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ 
  currentUser, onUserUpdate, onSaveAnnouncement, onDeleteAnnouncement, globalAnnouncements 
}) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'PLANS' | 'BROADCASTS' | 'PAYMENTS' | 'LOGS' | 'SETTINGS'>('USERS');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newBroadcast, setNewBroadcast] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    priority: 'MEDIUM',
    targetPlans: ['FREE', 'PRO', 'ENTERPRISE']
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('leavegenie_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [plans, setPlans] = useState<SubscriptionPlanConfig[]>(() => {
    const saved = localStorage.getItem('leavegenie_admin_plans');
    if (saved) return JSON.parse(saved);
    
    return [
      { id: 'FREE', name: 'Starter', price: 0, currency: 'INR', billingCycle: 'monthly', features: ['Professional PDF Export', 'Govt. Leave Templates', '3 History Records', 'Basic Resume Maker'] },
      { id: 'PRO', name: 'Professional', price: 499, currency: 'INR', billingCycle: 'monthly', features: ['AI Reason Polishing', 'Unlimited Records', '10+ Resume Templates', 'Digital Signature Support', 'Priority AI Assistant'] },
      { id: 'ENTERPRISE', name: 'Business', price: 49, currency: 'INR', billingCycle: 'monthly', features: ['Full PayMate Hub', 'Team Management', 'Institutional Ledger', 'Attendance Tracking', 'Custom Invoice Studio', 'Multi-user Admin Control'] },
    ];
  });

  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(() => {
    const saved = localStorage.getItem('leavegenie_admin_gateways');
    return saved ? JSON.parse(saved) : [
      { id: 'stripe', name: 'Stripe', enabled: true, apiKey: 'pk_live_...', secretKey: 'sk_live_...', isSandbox: false },
      { id: 'razorpay', name: 'Razorpay', enabled: false, apiKey: 'rzp_live_...', secretKey: 'secret_...', isSandbox: true },
      { id: 'payu', name: 'PayU', enabled: false, apiKey: 'payu_key_...', secretKey: 'payu_salt_...', isSandbox: true },
      { id: 'cashfree', name: 'Cashfree', enabled: false, apiKey: 'cf_app_id_...', secretKey: 'cf_secret_...', isSandbox: true },
    ];
  });

  const [logs, setLogs] = useState<{id: string, action: string, user: string, time: number}[]>(() => {
    const saved = localStorage.getItem('leavegenie_admin_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { 
    localStorage.setItem('leavegenie_accounts', JSON.stringify(users));
    const updatedSelf = users.find(u => u.id === currentUser.id);
    if (updatedSelf && JSON.stringify(updatedSelf) !== JSON.stringify(currentUser)) {
      onUserUpdate(updatedSelf);
    }
  }, [users]);

  useEffect(() => { localStorage.setItem('leavegenie_admin_plans', JSON.stringify(plans)); }, [plans]);
  useEffect(() => { localStorage.setItem('leavegenie_admin_gateways', JSON.stringify(gateways)); }, [gateways]);
  useEffect(() => { localStorage.setItem('leavegenie_admin_logs', JSON.stringify(logs)); }, [logs]);

  const addLog = (action: string, actor: string = currentUser.name || 'Admin') => {
    const newLog = { id: Math.random().toString(36).substr(2, 9), action, user: actor, time: Date.now() };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const handleUpdatePlanFeature = (planId: PlanType, index: number, value: string) => {
    const updatedPlans = plans.map(p => {
      if (p.id === planId) {
        const newFeatures = [...p.features];
        newFeatures[index] = value;
        return { ...p, features: newFeatures };
      }
      return p;
    });
    setPlans(updatedPlans);
  };

  const handleAddPlanFeature = (planId: PlanType) => {
    const updatedPlans = plans.map(p => {
      if (p.id === planId) {
        return { ...p, features: [...p.features, 'New Feature'] };
      }
      return p;
    });
    setPlans(updatedPlans);
  };

  const handleRemovePlanFeature = (planId: PlanType, index: number) => {
    const updatedPlans = plans.map(p => {
      if (p.id === planId) {
        return { ...p, features: p.features.filter((_, i) => i !== index) };
      }
      return p;
    });
    setPlans(updatedPlans);
  };

  const handleSaveNotification = () => {
    addLog('System configuration updated');
    alert("Subscription rules and features have been synchronized.");
  };

  const handleCreateUser = (newUser: Partial<UserProfile>) => {
    const user: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name || '',
      email: newUser.email || '',
      designation: newUser.designation || '',
      company: newUser.company || '',
      role: newUser.role || 'USER',
      plan: newUser.plan || 'FREE',
      joinedAt: Date.now(),
      status: 'ACTIVE',
      password: 'password123'
    };
    setUsers(prev => [...prev, user]);
    addLog(`Created new user: ${user.email}`);
    setShowAddModal(false);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addLog(`Modified user profile: ${updatedUser.email}`);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser.id) {
      alert("Cannot delete your own administrator account while logged in.");
      return;
    }
    const userToDelete = users.find(u => u.id === id);
    if (confirm(`Are you sure you want to permanently delete ${userToDelete?.email}? This action cannot be undone.`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      addLog(`Permanently deleted user: ${userToDelete?.email}`);
    }
  };

  const handleToggleUserStatus = (id: string) => {
    if (id === currentUser.id) return;
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        addLog(`${newStatus === 'ACTIVE' ? 'Restored' : 'Suspended'} user access: ${u.email}`);
        return { ...u, status: newStatus as any };
      }
      return u;
    }));
  };

  const handleAddBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroadcast.title || !newBroadcast.content || !newBroadcast.targetPlans?.length) {
      alert("Please enter a title, content, and select at least one target plan.");
      return;
    }

    const ann: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      title: newBroadcast.title,
      content: newBroadcast.content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      targetType: 'GLOBAL',
      targetPlans: newBroadcast.targetPlans as PlanType[],
      priority: (newBroadcast.priority as any) || 'MEDIUM',
      timestamp: Date.now()
    };

    onSaveAnnouncement(ann);
    addLog(`Published global broadcast: ${ann.title} (Targets: ${ann.targetPlans.join(', ')})`);
    setShowBroadcastModal(false);
    setNewBroadcast({ title: '', content: '', priority: 'MEDIUM', targetPlans: ['FREE', 'PRO', 'ENTERPRISE'] });
  };

  const toggleTargetPlan = (plan: PlanType) => {
    const current = newBroadcast.targetPlans || [];
    if (current.includes(plan)) {
      setNewBroadcast({ ...newBroadcast, targetPlans: current.filter(p => p !== plan) });
    } else {
      setNewBroadcast({ ...newBroadcast, targetPlans: [...current, plan] });
    }
  };

  const clearCache = () => {
    if (confirm("CRITICAL: This will reset the entire application database. Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    premium: users.filter(u => u.plan !== 'FREE').length,
    mrr: users.reduce((acc, u) => {
      const plan = plans.find(p => p.id === u.plan);
      return acc + (plan?.price || 0);
    }, 0)
  };

  const getGatewayIcon = (id: string) => {
    switch(id) {
        case 'stripe': return <CreditCard size={40} />;
        case 'razorpay': return <IndianRupee size={40} />;
        case 'payu': return <Zap size={40} />;
        case 'cashfree': return <Globe size={40} />;
        default: return <CreditCard size={40} />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200">
             <ShieldCheck size={32} />
          </div>
          <div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Master Control Panel</h1>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Integrity & System Operations</p>
          </div>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-slate-200 overflow-x-auto custom-scrollbar max-w-full">
           {(['USERS', 'PLANS', 'BROADCASTS', 'PAYMENTS', 'LOGS', 'SETTINGS'] as const).map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-800'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'USERS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: 'Platform Users', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                 { label: 'System Health', value: `${((stats.active/stats.total || 0) * 100).toFixed(0)}%`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                 { label: 'Paid Licenses', value: stats.premium, icon: Crown, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                 { label: 'Projected MRR', value: `₹${stats.mrr.toFixed(0)}`, icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <stat.icon size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                 </div>
               ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      placeholder="Search name, email, or company..." 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm transition-all focus:bg-white" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                      <UserPlus size={16} /> New User
                    </button>
                    <button onClick={() => addLog('CSV Data Export initiated')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800">
                      <Download size={16} /> Export
                    </button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Role</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-12">Control</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredUsers.map(u => (
                         <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 ${u.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'} rounded-2xl flex items-center justify-center font-black border border-slate-200 uppercase`}>
                                    {u.name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                     <p className="font-black text-slate-900 text-sm mb-0.5">{u.name || 'Anonymous User'}</p>
                                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[180px]">{u.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 u.plan === 'ENTERPRISE' ? 'bg-indigo-100 text-indigo-700' : u.plan === 'PRO' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                               }`}>
                                 {u.plan}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2">
                                  {u.role === 'SUPER_ADMIN' ? (
                                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                      <Shield size={10} fill="currentColor" /> Admin
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-black uppercase text-slate-400 px-2 py-1 bg-slate-50 rounded-lg">Member</span>
                                  )}
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${u.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-500'}`}>
                                  <div className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                  {u.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right pr-12">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => setEditingUser(u)} className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-xl shadow-sm transition-all">
                                   <Settings size={18} />
                                 </button>
                                 <button onClick={() => handleToggleUserStatus(u.id)} className={`p-2 rounded-xl transition-all shadow-sm border ${u.status === 'ACTIVE' ? 'text-red-400 bg-white border-red-50 hover:bg-red-50' : 'text-emerald-400 bg-white border-emerald-50 hover:bg-emerald-50'}`}>
                                   {u.status === 'ACTIVE' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                 </button>
                                 <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-100 rounded-xl shadow-sm transition-all">
                                   <Trash2 size={18} />
                                 </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'PLANS' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Subscription Strategy</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global prices (INR) and tier entitlements</p>
               </div>
               <button onClick={handleSaveNotification} className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                  <Save size={16} /> Synchronize Tiers
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map(p => (
                <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-500 transition-all flex flex-col">
                  <div className="relative z-10 space-y-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <input 
                             className="text-xl font-black text-slate-900 uppercase tracking-tighter w-full bg-transparent border-none p-0 outline-none"
                             value={p.name}
                             onChange={(e) => setPlans(plans.map(plan => plan.id === p.id ? {...plan, name: e.target.value} : plan))}
                           />
                           <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{p.id} TIER</p>
                        </div>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Crown size={18} fill="currentColor" /></div>
                      </div>
                      
                      <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><IndianRupee size={12} /> {p.id === 'ENTERPRISE' ? 'Rate Per User' : 'Monthly Fee'}</label>
                        <input 
                          type="number" 
                          className="text-4xl font-black text-slate-900 w-full bg-transparent border-none outline-none focus:ring-0 p-0" 
                          value={p.price} 
                          onChange={(e) => {
                            const newPrice = Number(e.target.value);
                            setPlans(plans.map(plan => plan.id === p.id ? {...plan, price: newPrice} : plan));
                          }}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier Features</p>
                           <button onClick={() => handleAddPlanFeature(p.id)} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><PlusCircle size={16} /></button>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                          {p.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 group/feature">
                               <input 
                                 className="flex-1 text-xs font-bold text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                 value={f}
                                 onChange={(e) => handleUpdatePlanFeature(p.id, i, e.target.value)}
                               />
                               <button onClick={() => handleRemovePlanFeature(p.id, i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover/feature:opacity-100 transition-all"><MinusCircle size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'BROADCASTS' && (
          <div className="space-y-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Megaphone size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-slate-900 uppercase">Global Broadcasts</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Public platform updates</p>
                   </div>
                </div>
                <button onClick={() => setShowBroadcastModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                   <Plus size={14} /> New Global Alert
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {globalAnnouncements.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                     <Megaphone size={48} className="mx-auto text-slate-200 mb-4" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No global announcements recorded</p>
                  </div>
                ) : globalAnnouncements.map(ann => (
                  <div key={ann.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${ann.priority === 'URGENT' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                              {ann.priority}
                           </span>
                           {ann.targetPlans && ann.targetPlans.length < 3 && (
                             <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase border bg-amber-50 text-amber-600 border-amber-100 flex items-center gap-1">
                                <Target size={10} /> {ann.targetPlans.join(', ')}
                             </span>
                           )}
                        </div>
                        <button onClick={() => onDeleteAnnouncement(ann.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                           <Trash2 size={16} />
                        </button>
                     </div>
                     <h3 className="text-lg font-black text-slate-900 mb-2">{ann.title}</h3>
                     <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">{ann.content}</p>
                     <div className="flex items-center gap-4 pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                        <Calendar size={12} /> {format(ann.timestamp, 'MMM dd, yyyy')}
                        <User size={12} className="ml-auto" /> Platform Admin
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'PAYMENTS' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {gateways.map(g => (
              <div key={g.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-10 items-start">
                 <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shrink-0">
                    {getGatewayIcon(g.id)}
                 </div>
                 <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{g.name} Config</h3>
                       <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${g.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>{g.enabled ? 'Live' : 'Inactive'}</span>
                          <button onClick={() => { setGateways(gateways.map(gate => gate.id === g.id ? {...gate, enabled: !gate.enabled} : gate)); addLog(`Toggled ${g.name} status`); }} className={`w-12 h-6 rounded-full transition-all relative ${g.enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${g.enabled ? 'left-7' : 'left-1'}`} />
                          </button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Endpoint / Public Key</label>
                       <input type="text" value={g.apiKey} onChange={(e) => setGateways(gateways.map(gate => gate.id === g.id ? {...gate, apiKey: e.target.value} : gate))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs text-slate-600" />
                    </div>
                 </div>
                 <button onClick={handleSaveNotification} className="w-full md:w-auto bg-slate-900 text-white p-6 rounded-[2rem] hover:bg-indigo-600 transition-all shadow-xl"><Save size={24} /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'LOGS' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><FileText className="text-slate-400" size={20} /> System Audit Trail</h3>
                <button onClick={() => setLogs([])} className="text-[10px] font-black uppercase text-red-500 hover:underline">Clear Trail</button>
             </div>
             <div className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <div className="p-20 text-center">
                     <RotateCcw className="mx-auto text-slate-200 mb-4" size={48} />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No administrative logs recorded</p>
                  </div>
                ) : logs.map(log => (
                   <div key={log.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50 transition-all gap-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-[10px] uppercase">ADMN</div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">{log.action}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Actor: {log.user}</p>
                         </div>
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">{new Date(log.time).toLocaleString()}</p>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm max-w-3xl mx-auto overflow-hidden">
             <div className="p-10 space-y-10">
                <div className="space-y-6">
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Global Security</h3>
                   <button onClick={clearCache} className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 group"><Trash2 size={16} className="group-hover:animate-bounce" /> Factory Reset Database</button>
                </div>
                <div className="space-y-6">
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">System Identity</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform Version</p>
                         <p className="font-bold text-slate-900">v4.2.0-Production</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Node Environment</p>
                         <p className="font-bold text-slate-900">Sandbox/Live</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] p-10 max-xl w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">New Global Alert</h3>
                 <button onClick={() => setShowBroadcastModal(false)} className="text-slate-300 hover:text-slate-900"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddBroadcast} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Announcement Title</label>
                    <input 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" 
                      placeholder="e.g. System Maintenance Update"
                      value={newBroadcast.title}
                      onChange={e => setNewBroadcast({...newBroadcast, title: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Priority Level</label>
                       <select 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 appearance-none"
                         value={newBroadcast.priority}
                         onChange={e => setNewBroadcast({...newBroadcast, priority: e.target.value as any})}
                       >
                          <option value="LOW">Low (FYI)</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High (Important)</option>
                          <option value="URGENT">Urgent (Platform Alert)</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Target Audience</label>
                       <div className="flex bg-slate-50 border border-slate-200 rounded-2xl p-1">
                          {(['FREE', 'PRO', 'ENTERPRISE'] as PlanType[]).map(plan => (
                            <button
                              key={plan}
                              type="button"
                              onClick={() => toggleTargetPlan(plan)}
                              className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${
                                newBroadcast.targetPlans?.includes(plan) ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
                              }`}
                            >
                              {plan}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Message Content</label>
                    <textarea 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 min-h-[150px] leading-relaxed" 
                      placeholder="Enter the message you want to broadcast globally..."
                      value={newBroadcast.content}
                      onChange={e => setNewBroadcast({...newBroadcast, content: e.target.value})}
                    />
                 </div>

                 <button 
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all"
                 >
                   <Send size={18} /> Publish to Tiers
                 </button>
              </form>
           </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] p-10 max-lg w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Adjust Authority</h3>
                 <button onClick={() => setEditingUser(null)} className="text-slate-300 hover:text-slate-900"><XCircle size={24} /></button>
              </div>
              <div className="space-y-6 mb-10">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                   </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Platform Privilege</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => setEditingUser({ ...editingUser, role: 'USER' })} className={`py-4 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${editingUser.role === 'USER' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>User</button>
                       <button onClick={() => setEditingUser({ ...editingUser, role: 'SUPER_ADMIN' })} className={`py-4 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${editingUser.role === 'SUPER_ADMIN' ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-400'}`}>System Admin</button>
                    </div>
                 </div>
              </div>
              <button onClick={() => handleUpdateUser(editingUser)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Confirm Administrative Update</button>
           </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Onboard User</h3>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-slate-900"><XCircle size={24} /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleCreateUser({ name: fd.get('name') as string, email: fd.get('email') as string, company: fd.get('company') as string, designation: fd.get('designation') as string, plan: fd.get('plan') as PlanType, role: fd.get('role') as any }); }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                    <input name="name" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan</label>
                    <select name="plan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm appearance-none">
                      <option value="FREE">Starter (Free)</option>
                      <option value="PRO">Professional (Paid)</option>
                      <option value="ENTERPRISE">Enterprise (SME)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                    <select name="role" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm appearance-none">
                      <option value="USER">Standard User</option>
                      <option value="SUPER_ADMIN">System Administrator</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">Onboard User Profile</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
