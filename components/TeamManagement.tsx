
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  Briefcase, 
  CheckCircle,
  X,
  Plus,
  ShieldAlert,
  Crown,
  ShieldCheck,
  UserCheck,
  User
} from 'lucide-react';
import { TeamMember, PlanType, EnterpriseRole } from '../types';

interface TeamManagementProps {
  plan: PlanType;
  teamMembers: TeamMember[];
  onAddMember: (member: Partial<TeamMember>) => void;
  onRemoveMember: (id: string) => void;
  onUpdateMemberRole: (id: string, role: EnterpriseRole) => void;
  onNavigateToPlans: () => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ 
  plan, 
  teamMembers, 
  onAddMember, 
  onRemoveMember,
  onUpdateMemberRole,
  onNavigateToPlans 
}) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({ 
    type: 'MANAGED_FREE', 
    role: '',
    enterpriseRole: 'STAFF'
  });

  if (plan !== 'ENTERPRISE') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <Users size={64} className="text-slate-200 mb-6" />
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Team Management Suite</h2>
        <p className="text-slate-500 mb-8 font-medium">
          Managing staff, faculty, or employees is a core feature of the Enterprise plan. Complete your institute setup and unlock multi-user support.
        </p>
        <button 
          onClick={onNavigateToPlans}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
        >
          <Crown size={18} /> Upgrade to Enterprise
        </button>
      </div>
    );
  }

  const handleAddSubmit = () => {
    if (!newMember.name || !newMember.email) return;
    onAddMember(newMember);
    setShowAddMember(false);
    setNewMember({ type: 'MANAGED_FREE', role: '', enterpriseRole: 'STAFF' });
  };

  const getRoleBadgeColor = (role: EnterpriseRole) => {
    switch(role) {
      case 'OWNER': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'HR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MANAGER': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Organization Directory</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Delegated control for your institute staff
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddMember(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[11px] flex items-center gap-2 uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <UserPlus size={16} /> Add New Member
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">HR Admins</p>
           <p className="text-2xl font-black text-emerald-600">{teamMembers.filter(m => m.enterpriseRole === 'HR').length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Managers</p>
           <p className="text-2xl font-black text-blue-600">{teamMembers.filter(m => m.enterpriseRole === 'MANAGER').length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invited</p>
           <p className="text-2xl font-black text-slate-900">{teamMembers.filter(m => m.type === 'INVITED').length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Members</p>
           <p className="text-2xl font-black text-slate-900">{teamMembers.length}</p>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden">
             <div className="flex items-start justify-between mb-4">
               <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-200">
                 {member.avatar}
               </div>
               <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getRoleBadgeColor(member.enterpriseRole)}`}>
                 {member.enterpriseRole}
               </div>
             </div>

             <div className="space-y-1 mb-6">
                <h4 className="font-black text-slate-900 text-lg leading-tight">{member.name}</h4>
                <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                   <Briefcase size={12} className="text-slate-300" />
                   {member.role}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium truncate">
                   <Mail size={12} className="text-slate-200 shrink-0" />
                   {member.email}
                </div>
             </div>

             <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-1">
                   <select 
                     className="text-[9px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-1 rounded outline-none focus:ring-1 focus:ring-blue-500"
                     value={member.enterpriseRole}
                     onChange={(e) => onUpdateMemberRole(member.id, e.target.value as EnterpriseRole)}
                   >
                     <option value="STAFF">Staff</option>
                     <option value="MANAGER">Manager</option>
                     <option value="HR">HR Admin</option>
                   </select>
                </div>
                <button 
                  onClick={() => onRemoveMember(member.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
             </div>

             {/* Background Decoration */}
             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors -z-10"></div>
          </div>
        ))}

        {teamMembers.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <ShieldAlert size={40} />
             </div>
             <p className="text-slate-400 font-bold">No team members found. Start adding your staff!</p>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Onboard Member</h3>
              <button onClick={() => setShowAddMember(false)} className="text-slate-300 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  placeholder="e.g. Rahul Kapoor" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700" 
                  value={newMember.name || ''} 
                  onChange={e => setNewMember({...newMember, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input 
                  placeholder="e.g. rahul@institute.edu" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700" 
                  value={newMember.email || ''} 
                  onChange={e => setNewMember({...newMember, email: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Role / Rank</label>
                    <input 
                      placeholder="e.g. Professor" 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" 
                      value={newMember.role || ''} 
                      onChange={e => setNewMember({...newMember, role: e.target.value})} 
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Authority Level</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-black uppercase text-[10px]"
                      value={newMember.enterpriseRole}
                      onChange={e => setNewMember({...newMember, enterpriseRole: e.target.value as EnterpriseRole})}
                    >
                       <option value="STAFF">Employee (Staff)</option>
                       <option value="MANAGER">Manager</option>
                       <option value="HR">HR Admin</option>
                    </select>
                 </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Account Creation</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setNewMember({...newMember, type: 'MANAGED_FREE'})}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      newMember.type === 'MANAGED_FREE' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    Direct Add
                  </button>
                  <button 
                    onClick={() => setNewMember({...newMember, type: 'INVITED'})}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      newMember.type === 'INVITED' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddSubmit}
              disabled={!newMember.name || !newMember.email}
              className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              Confirm & Assign Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
