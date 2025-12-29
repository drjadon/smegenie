
import React, { useState } from 'react';
import { EmployerProfile } from '../types';
import { Plus, Trash2, Edit2, Check, X, Building2, School } from 'lucide-react';

interface EmployerFormProps {
  employers: EmployerProfile[];
  onSave: (employers: EmployerProfile[]) => void;
  canAddMultiple: boolean;
  isStudent?: boolean;
}

export const EmployerForm: React.FC<EmployerFormProps> = ({ employers, onSave, canAddMultiple, isStudent = false }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EmployerProfile>({
    id: '', managerName: '', managerEmail: '', managerPhone: '', companyName: ''
  });

  const startAdd = () => {
    if (!canAddMultiple && employers.length >= 1) {
      alert("Free plan is limited to one entry. Upgrade for multiple support!");
      return;
    }
    setFormData({ id: Math.random().toString(36).substr(2, 9), managerName: '', managerEmail: '', managerPhone: '', companyName: '' });
    setEditingId('new');
  };

  const startEdit = (emp: EmployerProfile) => {
    setFormData(emp);
    setEditingId(emp.id);
  };

  const handleSave = () => {
    if (!formData.managerName || !formData.companyName) return;
    let newEmployers = [...employers];
    if (editingId === 'new') {
      newEmployers.push(formData);
    } else {
      newEmployers = newEmployers.map(e => e.id === editingId ? formData : e);
    }
    onSave(newEmployers);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onSave(employers.filter(e => e.id !== id));
  };

  if (editingId) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">
          {editingId === 'new' ? `Add New ${isStudent ? 'Institute' : 'Employer'}` : `Edit ${isStudent ? 'Institute' : 'Employer'}`}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 ml-1">
              {isStudent ? 'Institution Name' : 'Company Name'}
            </label>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder={isStudent ? "St. Xavier's University" : "Google, ACME Corp, etc."}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 ml-1">
              {isStudent ? 'Principal / HOD Name' : "Manager's Name"}
            </label>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              placeholder={isStudent ? "Dr. Jane Smith" : "John Doe"}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 ml-1">
              {isStudent ? 'Department Email' : "Manager's Email"}
            </label>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
              value={formData.managerEmail}
              onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
              placeholder={isStudent ? "hod.cse@univ.edu" : "jane@company.com"}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5 ml-1">Official Phone (Optional)</label>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
              value={formData.managerPhone}
              onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
              placeholder="+1 234 567 890"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button onClick={() => setEditingId(null)} className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest"><X size={14} /> Cancel</button>
          <button onClick={handleSave} className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100"><Check size={14} /> Save Details</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Entities</h3>
        <button onClick={startAdd} className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="space-y-3">
        {employers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            {isStudent ? <School className="mx-auto text-slate-200 mb-2" size={48} /> : <Building2 className="mx-auto text-slate-200 mb-2" size={48} />}
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{isStudent ? 'No institutions saved' : 'No employers saved yet'}</p>
          </div>
        ) : (
          employers.map(emp => (
            <div key={emp.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-all group">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
                    {isStudent ? <School size={20} /> : <Building2 size={20} />}
                 </div>
                 <div>
                    <p className="font-black text-slate-900 text-sm tracking-tight">{emp.companyName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.managerName} • {emp.managerEmail}</p>
                 </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(emp)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(emp.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
