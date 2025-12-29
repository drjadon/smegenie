
import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  X,
  Send,
  Calendar,
  User,
  Tag,
  Sparkles,
  Target
} from 'lucide-react';
import { Announcement, UserProfile, AppScreen, PlanType } from '../../types';
import { format } from 'date-fns';

interface AnnouncementManagerProps {
  user: UserProfile;
  announcements: Announcement[];
  onSave: (ann: Announcement) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({ 
  user, announcements, onSave, onDelete 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    priority: 'LOW',
    targetPlans: ['FREE', 'PRO', 'ENTERPRISE']
  });

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const isOrgAdmin = user.plan === 'ENTERPRISE' && (user.enterpriseRole === 'OWNER' || user.enterpriseRole === 'HR');
  const canCreateAnnouncement = isSuperAdmin || isOrgAdmin;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    if (isSuperAdmin && !formData.targetPlans?.length) {
      alert("Please select at least one target plan.");
      return;
    }

    const newAnn: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      content: formData.content,
      authorId: user.id,
      authorName: user.name,
      targetType: isSuperAdmin ? 'GLOBAL' : 'ENTERPRISE',
      targetPlans: isSuperAdmin ? (formData.targetPlans as PlanType[]) : undefined,
      enterpriseId: isSuperAdmin ? undefined : (user.enterpriseId || user.id),
      priority: (formData.priority as any) || 'LOW',
      timestamp: Date.now()
    };

    onSave(newAnn);
    setShowAdd(false);
    setFormData({ title: '', content: '', priority: 'LOW', targetPlans: ['FREE', 'PRO', 'ENTERPRISE'] });
  };

  const toggleTargetPlan = (plan: PlanType) => {
    const current = formData.targetPlans || [];
    if (current.includes(plan)) {
      setFormData({ ...formData, targetPlans: current.filter(p => p !== plan) });
    } else {
      setFormData({ ...formData, targetPlans: [...current, plan] });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'URGENT': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
             <Megaphone size={32} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Broadcast Hub</h2>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Platform and Institutional updates</p>
           </div>
        </div>
        {canCreateAnnouncement && (
          <button 
            onClick={() => setShowAdd(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            <Plus size={18} /> New Broadcast
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
           {announcements.length === 0 ? (
             <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <Megaphone size={64} className="mx-auto text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active broadcasts</p>
             </div>
           ) : (
             announcements.map(ann => (
               <div key={ann.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-blue-400 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getPriorityColor(ann.priority)}`}>
                           {ann.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${ann.targetType === 'GLOBAL' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                           {ann.targetType === 'GLOBAL' ? 'Global Platform' : 'Institutional'}
                        </span>
                        {ann.targetPlans && ann.targetPlans.length < 3 && (
                          <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase border bg-amber-50 text-amber-600 border-amber-100 flex items-center gap-1">
                             <Target size={10} /> {ann.targetPlans.join(', ')}
                          </span>
                        )}
                     </div>
                     {canCreateAnnouncement && (ann.authorId === user.id || user.role === 'SUPER_ADMIN') && (
                       <button onClick={() => onDelete(ann.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                       </button>
                     )}
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-4">{ann.title}</h3>
                  <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed mb-8 whitespace-pre-line">
                     {ann.content}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                           <User size={12} className="text-blue-500" /> {ann.authorName}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                           <Calendar size={12} className="text-blue-500" /> {format(ann.timestamp, 'MMM dd, yyyy • hh:mm a')}
                        </div>
                     </div>
                     {ann.targetType === 'GLOBAL' && (
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                          <ShieldCheck size={10} /> Verified Admin Broadcast
                       </div>
                     )}
                  </div>
               </div>
             ))
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-blue-400">Feed Insights</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Total Messages</span>
                       <span className="text-lg font-black">{announcements.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Urgent Alerts</span>
                       <span className="text-lg font-black text-red-400">{announcements.filter(a => a.priority === 'URGENT').length}</span>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10 text-white"><Sparkles size={80} /></div>
           </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] p-10 max-w-xl w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Post Broadcast</h3>
                 <button onClick={() => setShowAdd(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Announcement Title</label>
                    <input 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" 
                      placeholder="e.g. Holiday on Friday"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Priority Level</label>
                       <div className="relative">
                          <select 
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 appearance-none"
                            value={formData.priority}
                            onChange={e => setFormData({...formData, priority: e.target.value as any})}
                          >
                             <option value="LOW">Low (FYI)</option>
                             <option value="MEDIUM">Medium</option>
                             <option value="HIGH">High (Important)</option>
                             <option value="URGENT">Urgent (Alert)</option>
                          </select>
                          <Tag className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                         {isSuperAdmin ? 'Target Tiers' : 'Targeting'}
                       </label>
                       {isSuperAdmin ? (
                         <div className="flex bg-slate-50 border border-slate-200 rounded-2xl p-1">
                            {(['FREE', 'PRO', 'ENTERPRISE'] as PlanType[]).map(plan => (
                              <button
                                key={plan}
                                type="button"
                                onClick={() => toggleTargetPlan(plan)}
                                className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${
                                  formData.targetPlans?.includes(plan) ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
                                }`}
                              >
                                {plan}
                              </button>
                            ))}
                         </div>
                       ) : (
                         <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                            <ShieldCheck size={20} className="text-blue-600" />
                            <div>
                               <p className="text-[9px] font-black text-blue-600 uppercase">Organization Wide</p>
                               <p className="text-[10px] font-bold text-slate-600">Your Institution Members</p>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Broadcast Content</label>
                    <textarea 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 min-h-[150px] leading-relaxed" 
                      placeholder="Enter the message you want to broadcast..."
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                 </div>

                 <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   <Send size={18} /> Post Broadcast
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
